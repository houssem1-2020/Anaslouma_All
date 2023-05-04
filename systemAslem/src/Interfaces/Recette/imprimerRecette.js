import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Icon, Loader } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import FrameForPrint from '../../Dashboard/Assets/frameForPrint';
import usePrintFunction from '../../Dashboard/Assets/Hooks/printFunction';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { toast } from 'react-toastify';

function ImprimerRecette() {
    //IMPRIMER / if stock NON regler non

    /*#########################[Const]##################################*/
    const Today = new Date()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID; 
    let [totale, setTotale] = useState('0,000')
    let [totaleDep, setTotaleDep] = useState('0,000')
    let [printBtnState, setPrintBtnState] = useState(false)
    let [loaderState, setLS] = useState(true)

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //check if stock if fixed 
        axios.post(`${GConf.ApiCamionLink}/sk/reglemment/check`, {
            tag: GConf.SystemTag,
            camId : camId,
            jour : Today.toISOString().split('T')[0]
          })
          .then(function (response) {
            if(response.data.length == 0) {
                setPrintBtnState(true)
            }
        }).catch((error) => {
            if(error.request) {
                setPrintBtnState(true)
            }
        });

        axios.post(`${GConf.ApiCamionLink}/rt/imprimer`, {
          tag: GConf.SystemTag,
          camId : camId,
        })
        .then(function (response) {
            setTotale(response.data[0].Totale)
            setTotaleDep(response.data[0].TotDepense)
            setLS(false)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible d'afficher les resultat correct </div></>, GConf.TostInternetGonf) 
              setTotale('0,000')
              setTotaleDep('0,000')
              setLS(false)
            }
        });
      }, [])

    /*#########################[Function]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}

    /*#########################[Card]##################################*/
    const TotaleVente = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 text-center'>
                    <h5 className='text-start mb-2'>Ventes</h5>
                    <h1>{totale}</h1>
                </div>
            </>)
    }
    const TotaleDepenses = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 text-center'>
                    <h5 className='text-start mb-2'>Depenses</h5>
                    <h1>{totaleDep}</h1>
                    <small className='text-end'><NavLink to='/I/L/rt/depenses' exact='true'>Voire Tous</NavLink></small>
                </div>
            </>)
    }
    const NetteCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 text-center'>
                    <h5 className='text-start mb-2'>Nette</h5>
                    <h1><CountUp end={parseFloat(totale - totaleDep).toFixed(3)} decimals={3} decimal="," duration={2} /> </h1>
                    <Button className='bg-danger text-white' disabled={printBtnState} fluid onClick={(e) => PrintFunction('printRecette')}>
                        <Icon name='print' /> Imprimer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/>
                    </Button>
                </div>
            </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.rtImpr}/>
        <br />
        <div className='container-fluid'>
            <TotaleVente /> 
            <TotaleDepenses />
            <NetteCard />
        </div>
        <FrameForPrint frameId='printRecette' src={`/Pr/CamSys/recette`} />
    </> );
}

export default ImprimerRecette;