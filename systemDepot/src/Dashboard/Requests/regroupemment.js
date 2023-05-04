import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button, Dropdown, Icon, Input, Loader } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';

const SelectCamion = ({camionList, selectedCam, setSelectedCam}) =>{
    return (<>
                <h5>Compte  </h5>
                <Dropdown
                    search
                    fluid
                    selection
                    wrapSelection={false}
                    options={camionList}
                    placeholder='Selectionnez Client'
                    className='mb-1'
                    onChange={(e, { value }) => setSelectedCam(value)}
                    value={selectedCam}
                />   
    </>)
}

function RegrouperCommandes() {

    let Today = new Date().toISOString().split('T')[0]
    let [targetDate, setDate] = useState({start:Today, end:Today});
    let [camionList, setCamionList] = useState([]); 
    let [statData, setStatData] = useState([]); 
    let [selectedCam, setSelectedCam] = useState(); 
    let [loaderState, setLS] = useState(false)

    /* ############################### UseEffect ########################*/
    useEffect(() => {
            //camionList
            axios.post(`${GConf.ApiLink}/commande/comptes`,{tag:GConf.SystemTag})
            .then(function (response) {
                let ClientLN = []
                response.data.map( (dta) => {ClientLN.push({value : dta.CID, text : <>{dta.Name} </>, key: dta.PK})})
                setCamionList(ClientLN)
            }).catch((error) => {
            if(error.request) {
                toast.error(<><div><h5>Probleme de Connextion</h5> Les camion n'ont pas été chargeé </div></>, GConf.TostInternetGonf)   
            }
            });
    }, [])

    /**/ 
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const CalculerStat = () =>{
            setLS(true)
            axios.post(`${GConf.ApiLink}/commande/stat`,{
                tag:GConf.SystemTag,
                CID : selectedCam,
                targetDate : targetDate
            }).then(function (response) {
                    setStatData(response.data)
                    setLS(false)
                }).catch((error) => {
                if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Les camion n'ont pas été chargeé </div></>, GConf.TostInternetGonf)   
                }
            });
    }
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

    /* card */
    const SelectTargetCommandeCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4'>
                <h5 className='mt-0 mb-1'> Selectionnez Commandes</h5>  
            </div>
        </>)   
    } 
    const SelectCamionCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4'>
                <h5 className='mt-0 mb-1'> Selectionnez Camion</h5>  
            </div>
        </>)   
    } 
    const PrintCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4'>
                <h5 className='mt-0 mb-1'> Imprimer</h5>  
                <Button size='small' className='rounded-pill bg-system-btn mb-2' icon fluid><Icon name='print' /> Imprimer</Button>
                <Button size='small' className='rounded-pill print-btn mb-2' icon fluid><Icon name='print' /> Bl</Button>
                <Button size='small' className='rounded-pill print-btn mb-2' icon fluid><Icon name='print' /> BS</Button>
            </div>
        </>)   
    } 
    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.RequestInfo} />
        <br />
        <div className='container'>
            <div className='row'>
                <div className='col-4'>
                    <div className='card card-body border-div'>
                        <div className='mb-2'>
                            <SelectCamion setSelectedCam={setSelectedCam} camionList={camionList} selectedCam={selectedCam} />
                            <h5>de ... vers : </h5>
                            <Input size='large' className='mb-1' fluid type='date' value={targetDate.start} onChange={(e) => setDate({...targetDate, start: e.target.value })}/>
                            <Input size='large' fluid type='date' value={targetDate.end} onChange={(e) => setDate({...targetDate, end: e.target.value })}/>
                        </div>
                        <div className='mb-2'>
                        </div>
                        <div className='mb-2'>
                            <div className='row'>
                                <div className='col-12 mb-2'><Button   className='rounded-pill  bg-system-btn'  fluid onClick={() => CalculerStat()}><Icon name='chart bar' /> Statistique <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button></div>
                                <div className='col-12 mb-2'><Button  className='rounded-pill btn-imprimer' disabled={!true}  fluid onClick={(e) => PrintFunction('commandeGroup')}><Icon name='print' /> Imprimer </Button></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-8'>
                    <div className='row'>
                        <div className='col-4 mb-2'>
                            <div className='card card-body border-div text-center h-100'><h1>{statData.length}</h1> Totale Facture</div>
                        </div>
                        <div className='col-8 mb-2'>
                            <div className='card card-body border-div text-center h-100'><h1>{CalculateTotale()}</h1> Montant Totale </div>
                        </div>
                        {/* <div className='col-4 mb-2'>
                            <div className='card card-body border-div text-center h-100 text-warning'><h1>{CalculateByCateg('W')}</h1> EN attent</div>
                        </div> */}
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-center h-100 text-danger'><h1>{CalculateRetourTotale()}</h1> Retour</div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-center h-100 text-success'><h1>{(CalculateTotale() - CalculateRetourTotale()).toFixed(3)}</h1> Nette</div>
                        </div>

                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start h-100'>
                                <h5>Top 10 Fcatures : </h5>
                                {GetTopFacture(true)}
                            </div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start h-100'>
                                <h5>Moins 10 Fcatures : </h5>
                                {GetTopFacture(false)}
                            </div>
                        </div>

                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start h-100'>
                                <h5>Top 10 Article : </h5>
                                {GetTopArticle(true)}
                            </div>
                        </div>
                        <div className='col-6 mb-2'>
                            <div className='card card-body border-div text-start h-100'>
                                <h5>Moins 10 Article : </h5>
                                {GetTopArticle(false)}
                            </div>
                        </div>

                    </div> 
                </div>
            </div> 
            
        </div>
        <FrameForPrint frameId='commandeGroup' src={`/Pr/commande/liste/${selectedCam}/${targetDate.start}/${targetDate.end}`} />
    </> );
}

export default RegrouperCommandes;