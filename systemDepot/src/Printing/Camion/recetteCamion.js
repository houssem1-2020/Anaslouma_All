import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';

function RecetteCamionTemp() {
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const Cam_ID = camData.Cam_ID;
    let [totale, setTotale] = useState('0,000')
    let [totaleDep, setTotaleDep] = useState('0,000')
    let [printBtnState, setPrintBtnState] = useState(false)
    let [loaderState, setLS] = useState(true)

    useEffect(() => {
        axios.post(`${GConf.ApiCamionLink}/rt/imprimer`, {
            tag: GConf.SystemTag,
            camId : Cam_ID,
          })
          .then(function (response) {
              setTotale(response.data[0].Totale)
              setTotaleDep(response.data[0].TotDepense)
              setLS(false)
          }).catch((error) => {
              if(error.request) {
                setTotale('0,000')
                setTotaleDep('0,000')
                setLS(false)
              }
          });
    }, [])

    const FactureHeader = () =>{
        return(<>
             <div className='row mb-2 p-1'>
                <div className='col-2 fw-bold'>N</div>
                <div className='col-2 fw-bold'>| Des</div>
                <div className='col-2 fw-bold'>| Qté</div>
                <div className='col-2 fw-bold'>| PU</div>
                <div className='col-2 fw-bold'>| Pt</div>
            </div>
        </>)
    }

    


    return ( <>
           <div className="container mb-4">
                <h2 className='text-start mb-1'>Recette Le : {new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </h2> 
                <h3 className='text-start mt-1'>Camion :  </h3> 
                <br />
                <br />
                ############################################<br />
                TOTALE VENTE : 
                <br />
                {totale}
                <br />
                <br />
                ############################################<br />
                TOTALE DEPENSE : 
                <br />
                {totaleDep}
                <br />
                <br />
            </div>
            <br />
            <br />
            ############################################
            <div><b>Net : {totale - totaleDep}</b></div>
            ############################################
           
    </> );
}

export default RecetteCamionTemp;