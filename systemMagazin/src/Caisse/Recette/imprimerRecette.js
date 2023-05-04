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
import SKLT from '../../AssetsM/usedSlk';

function ImprimerRecette() {
    //IMPRIMER / if stock NON regler non

    /*#########################[Const]##################################*/
    const Today = new Date()
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID; 
    let [totale, setTotale] = useState('0,000')
    let [totaleDep, setTotaleDep] = useState('0,000')
    let [bonsList, setBons] = useState([])
    let [printBtnState, setPrintBtnState] = useState(false)
    let [loaderState, setLS] = useState(true)
    const [loading , setLoading] = useState(false)
    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //check if stock if fixed 
        // axios.post(`${GConf.ApiCaisseLink}/sk/reglemment/check`, {
        //     forPID : camData.PID,
        //     camId : camId,
        //     jour : Today.toISOString().split('T')[0]
        //   })
        //   .then(function (response) {
        //     if(response.data.length == 0) {
        //         setPrintBtnState(true)
        //     }
        // }).catch((error) => {
        //     if(error.request) {
        //         setPrintBtnState(true)
        //     }
        // });

        axios.post(`${GConf.ApiCaisseLink}/rt/imprimer`, {
          forPID : caisseData.PID,
          camId : CaisseID,
        })
        .then(function (response) {
            setTotale(response.data[0].Totale)
            setTotaleDep(response.data[0].TotDepense)
            setBons(response.data[0].TotBons)
            setLS(false)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible d'afficher les resultat correct </div></>, GConf.TostInternetGonf) 
              setTotale('0,000')
              setTotaleDep('0,000')
              setLS(false)
              setLoading(true)
            }
        });
      }, [])

    /*#########################[Function]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const MakeBonsSomme = () =>{
        let tot = 0
        bonsList.map((data) =>{
            tot = tot + (data.qte * data.valeur)
        })
        return tot 
     }
    /*#########################[Card]##################################*/
    const TotaleVente = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 text-center   ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    <h5 className='text-start mb-0'>Totale Ventes [X]</h5>
                    <h2 className='mb'>{totale}</h2>
                </div>
            </>)
    }
    const TotaleDepenses = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 text-center   ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    
                    <div className='row'>
                        <div className='col-6 text-start'><h5 className='text-start mb-0'>Depenses</h5></div>
                        <div className='col-6 text-end'><small className='text-end'><NavLink to='/C/L/rt/depenses' exact='true'>Voire Tous</NavLink></small></div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col-6 border-end'><h2 className='mb-0'>{totaleDep}</h2><small>sans bons</small></div>
                        <div className='col-6 '><h2 className='mb-0'>{(parseFloat(totaleDep) + MakeBonsSomme()).toFixed(3)  }</h2><small>avec bons</small></div>
                    </div> 
                    
                    
                </div>
            </>)
    }
    const BonsListeCard = (props) =>{
        return(<>
                <div className={`card p-2 shadow-sm mb-3 rounded-pill  ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}>
                    <div className='row'>
                        <div className='col-1 align-self-center text-start'>
                            {props.inKey}
                        </div>
                        <div className='col-4 align-self-center text-center'>
                            {parseFloat(props.data.valeur).toFixed(3)}
                        </div>
                        <div className='col-3 align-self-center'>
                            <b>{props.data.qte}</b>
                        </div>
                        <div className='col-4 align-self-center'>
                            <b>{(props.data.qte * parseFloat(props.data.valeur)).toFixed(3)}</b>
                        </div>
                    </div>
                </div>
            </>)
    }

    const TotaleBons = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 text-center   ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    <h5 className='text-start mb-2'>Bons</h5>
                    {loading ?  
                            <>
                                {bonsList.map((data, index) => <BonsListeCard key={index} inKey={index+1} data={data} />)}
                            </>
                    : SKLT.CardList }
                    <h2 className='text-end me-5'> = {MakeBonsSomme().toFixed(3)}</h2>
                    {/* <small className='text-end'><NavLink to='/C/L/rt/depenses' exact='true'>Voire Tous</NavLink></small> */}
                </div>
            </>)
    }
    const NetteCard = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 text-center   ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    <h5 className='text-start mb-2'>Nette</h5>
                    <div className='row mb-3'>
                        <div className='col-6 border-end'><h2><CountUp end={parseFloat(totale - totaleDep).toFixed(3)} decimals={3} decimal="," duration={2} /> </h2><small>sans Bons</small></div>
                        <div className='col-6'><h2><CountUp end={parseFloat((totale - totaleDep) - MakeBonsSomme()).toFixed(3)} decimals={3} decimal="," duration={2} /> </h2><small>avec Bons</small></div>
                    </div> 
                    
                    <Button className='bg-danger text-white' disabled={printBtnState} fluid onClick={(e) => PrintFunction('printRecette')}>
                        <Icon name='print' /> Imprimer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/>
                    </Button>
                </div>
            </>)
    }

    return ( <>
    <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
        <BackCard data={InputLinks.backCard.rtImpr}/>
        <br />
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-lg-5 mb-3'>
                    <TotaleVente />
                    <TotaleDepenses />
                    <NetteCard />
                </div>
                <div className='col-12 col-lg-7 mb-3'><TotaleBons /></div>
            </div> 
        </div>
    </div>
    <FrameForPrint frameId='printRecette' src={`/Pr/caisse/recette`} />
    </> );
}

export default ImprimerRecette;