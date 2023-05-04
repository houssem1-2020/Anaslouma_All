import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import { ToWords } from 'to-words';
import { toast } from 'react-toastify';
import { Button, Dropdown, Icon, Input, Loader } from 'semantic-ui-react';
import axios from 'axios';

function CommandeGroupListeCmd() {
    /*########################[Const]########################*/
    let {compte,start,end} = useParams()
 
    let Today = new Date().toISOString().split('T')[0]
    let [statData, setStatData] = useState([]);  
    let [compteData, setCompteData] = useState([]);  
    
    /*########################[UseEffect]########################*/
    useEffect(() => {
            axios.post(`${GConf.ApiLink}/commande/stat`,{
                tag:GConf.SystemTag,
                CID : compte,
                targetDate : {start:start, end:end}
            }).then(function (response) {
                    setStatData(response.data)
                }).catch((error) => {
                if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Les camion n'ont pas été chargeé </div></>, GConf.TostInternetGonf)   
                }
            });
            axios.post(`${GConf.ApiLink}/commande/comptes`, {
                tag: GConf.SystemTag,
              })
              .then(function (response) {
                console.log(response.data)
                console.log(parseInt(compte))
                const searchObject = response.data.find((data) => data.CID == parseInt(compte));
                if (searchObject) {
                    setCompteData(searchObject);
                    console.log(searchObject)
                    
                }else{
                    console.log('Introuvable')
                }

              }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les regions </div></>, GConf.TostInternetGonf)   
                }
              });
            
    }, [])

    /*########################[Functions]########################*/
        const CalculateTotale = () =>{
            let sum = 0;
            for (const key in statData) {
                sum += parseFloat(statData[key].Totale);
            }
            return sum.toFixed(3);
        }
        const CalculateRetourTotale = () =>{
            let sum = 0;
            for (const key in statData) {
                sum += parseFloat(statData[key].Retour);
            }
            return sum.toFixed(3);
        }
        const CalculateByCateg = (genre) =>{
            let found = statData.filter(element => element.State === genre)
            return found.length
        }
        const GetTopFacture = (UpDown) =>{
            let found = statData.sort((a, b) => b.Totale - a.Totale);
            return(<>
                {
                    UpDown ? 
                    found.slice(0, 10).map((data,index) => <span key={index}>{data.Name} : {parseFloat(data.Totale).toFixed(3) } <br /></span>)
                    : 
                    found.slice(-10).map((data,index) => <span key={index}>{data.Name} : {parseFloat(data.Totale).toFixed(3) }<br /></span>)
                }
            </>)
        }
        const GetTopArticle = (UpDown) =>{
            let rended = []
            for (var i = 0; i < statData.length; i++) {
                let item = JSON.parse(statData[i].Articles);
                for (var k = 0; k < item.length; k++) {
                    rended.push(item[k])
                }
            }
            
            var result = [];
            rended.reduce(function(res, value) {
            if (!res[value.A_Code]) {
                res[value.A_Code] = { A_Code: value.A_Code, Name: value.Name, Qte: 0 };
                result.push(res[value.A_Code])
                }
                res[value.A_Code].Qte += parseInt(value.Qte);
                return res;
            }, {});
            
            let found = result.sort((a, b) => b.Qte - a.Qte);
            return(<>
                {
                    UpDown ? 
                    found.slice(0,10).map((data,index) => <span key={index}>{data.Name} : {data.Qte} <br /></span>)
                    : 
                    found.slice(-10).map((data,index) => <span key={index}>{data.Name} : {data.Qte} <br /></span>)
                }
            </>)
}

    /*########################[Card]########################*/
 
    return ( <>
            <div className='container'>
                    <div>Compte : {compteData.Name}</div>
                    <h2> De : {start} --- Vers :  {end}</h2>
                    <div className='row'>
                        <div className='col-4 mb-2'>
                            <div className='card card-body border-div text-center border border-dark h-100'><h1>{statData.length}</h1> Totale Facture</div>
                        </div>
                        <div className='col-8 mb-2'>
                            <div className='card card-body border-div text-center border border-dark h-100'><h1>{CalculateTotale()}</h1> Montant Totale </div>
                        </div>
                        {/* <div className='col-4 mb-2'>
                            <div className='card card-body border-div text-center border border-dark h-100 text-warning'><h1>{CalculateByCateg('W')}</h1> EN attent</div>
                        </div> */}
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-center border border-dark h-100 text-danger'><h1>{CalculateRetourTotale()}</h1> Retour</div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-center border border-dark h-100 text-success'><h1>{(CalculateTotale() - CalculateRetourTotale()).toFixed(3)}</h1> Nette</div>
                        </div>

                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start border border-dark h-100'>
                                <h5>Top 10 Fcatures : </h5>
                                {GetTopFacture(true)}
                            </div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start border border-dark h-100'>
                                <h5>Moins 10 Fcatures : </h5>
                                {GetTopFacture(false)}
                            </div>
                        </div>

                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start border border-dark h-100'>
                                <h5>Top 10 Article : </h5>
                                {GetTopArticle(true)}
                            </div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start border border-dark h-100'>
                                <h5>Moins 10 Article : </h5>
                                {GetTopArticle(false)}
                            </div>
                        </div>

                    </div>
            </div>
    </> );
}

export default CommandeGroupListeCmd;