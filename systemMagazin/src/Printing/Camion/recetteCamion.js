import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';

function RecetteCamionTemp() {
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID; 
    let [totale, setTotale] = useState('0,000')
    let [totaleDep, setTotaleDep] = useState([])
    let [bonsList, setBons] = useState([])

    let [printBtnState, setPrintBtnState] = useState(false)
    let [loaderState, setLS] = useState(true)

    useEffect(() => {
        // axios.post(`${GConf.ApiCaisseLink}/rt/imprimer`, {
        //     tag: caisseData.PID,
        //     camId : CaisseID,
        //   })
        //   .then(function (response) {
        //     console.log(caisseData)
        //       setTotale(response.data[0].Totale)
        //       setTotaleDep(response.data[0].TotDepense)
        //       setLS(false)
        //   }).catch((error) => {
        //       if(error.request) {
        //         setTotale('0,000')
        //         setTotaleDep('0,000')
        //         setLS(false)
        //       }
        //   });
        axios.post(`${GConf.ApiCaisseLink}/rt/imprimer/temp`, {
            forPID : caisseData.PID,
            camId : CaisseID,
          })
          .then(function (response) {
              setTotale(response.data[0].Totale)
              setTotaleDep(response.data[0].TotDepense)
              setBons(response.data[0].TotBons)
              setLS(false)
          }).catch((error) => {
              if(error.request) {
                setTotale('0,000')
                setTotaleDep('0,000')
                setLS(false)
              }
          });

    }, [])

    const MakeBonsSomme = () =>{
        let tot = 0
        bonsList.map((data) =>{
            tot = tot + (data.qte * data.valeur)
        })
        return tot 
    }
    
    const TotaleBons = () =>{
        const BonsListeCard = (props) =>{
            return(<>
                    <li>{props.inKey} : {parseFloat(props.data.valeur).toFixed(3)} * <b>{props.data.qte}</b> =  <b>{(props.data.qte * parseFloat(props.data.valeur)).toFixed(3)}</b></li>
                </>)
        }

        return(<>
                <ul>    
                    {bonsList.map((data, index) => <BonsListeCard key={index} inKey={index+1} data={data} />)}  
                </ul>
                <h5 className='mt-0'> = {MakeBonsSomme().toFixed(3)}</h5>
            </>)
    }

    const MakeDepSomme = () =>{
        let tot = 0
        totaleDep.map((data) =>{
            tot = tot + data.Valeur
        })
        return tot 
    }
    
    const TotaleDep = () =>{
        const DepListeCard = (props) =>{
            return(<>
                    <li> {parseFloat(props.data.Valeur).toFixed(3)}  :   <b> {props.data.Description	}</b></li>
                </>)
        }

        return(<>
                <ul>    
                    {totaleDep.map((data, index) => <DepListeCard key={index} inKey={index+1} data={data} />)}  
                </ul>
                <h5 className='mt-0'> = {MakeDepSomme().toFixed(3)}</h5>
            </>)
    }
    


    return ( <>
           <div className="container mb-2">
                <h2 className='text-start mb-1'>Recette Le : {new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </h2> 
                <h3 className='text-start mt-1'>Caisse : {caisseData.CA_Name} </h3> 
                <br />
                <br />
                ############################################<br />
                TOTALE VENTE : 
                <br />
                {parseFloat(totale).toFixed(3)}
                <br />
                <br />
                ############################################<br />
                TOTALE DEPENSE : 
                <br />
                <TotaleDep />
                ############################################<br />
                LISTE DES BONS : 
                <br />
                <TotaleBons />
                <br />
            </div>
            ############################################
            <div><b>Net : {((parseFloat(totale) - MakeDepSomme()) - MakeBonsSomme()).toFixed(3)}</b></div>
            <div><b>Manque :  </b></div>
            ############################################
           
    </> );
}

export default RecetteCamionTemp;