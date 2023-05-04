import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import {  useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Icon } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import FrameForPrint from '../../Dashboard/Assets/frameForPrint';
import usePrintFunction from '../../Dashboard/Assets/Hooks/printFunction';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';


function StockFondsData() {
    /*#########################[Const]##################################*/
    let {fid} = useParams()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID;
    let [articleL, setArticleL] = useState([])
    let [fondData, setFondDat] = useState([])
    let [loading , setLoading] = useState(false)
    
    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/camion/fond`, {
            tag: GConf.SystemTag,
            fondID: fid
          })
          .then(function (response) {
                setArticleL(JSON.parse(response.data[0].Articles))
                setFondDat(response.data[0])
                setLoading(true) 
            })    
    }, [])

    /*#########################[Function]##################################*/
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseInt(value) * facteur_p).toFixed(3) 
    }

    

    /*#########################[Card]##################################*/
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div>Totale hors tax: {loading ? CalculateTVA(fondData.Totale) : SKLT.BarreSkl }</div>
                    <div>TVA: {loading ? (fondData.Totale - CalculateTVA(fondData.Totale)).toFixed(3) : SKLT.BarreSkl }</div>
                    <div>Timbre: 0.600 DT</div>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? (parseFloat(fondData.Totale) + 0.600).toFixed(3) : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }

    return ( <>
            <BackCard data={InputLinks.backCard.skFondD}/>
            <br />
        
            <div className='container-fluid'>
                <h2 className='text-center'>Bon de Fond </h2>
                <br />
                <br />
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">No</th>
                            <th scope="col">Designiation</th>
                            <th scope="col">Qté [K][P]</th>
                            <th scope="col">P.Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ?  
                            <>
                            {articleL.map( (artData, index) => 
                                <tr key={index}>
                                    <th scope="row">{index +1 }</th>
                                    <td>{artData.Name}</td>
                                    <td><b><span className='text-danger'>[{artData.QteAjoute}]</span > <span className='text-success'>[{artData.QteAjoute * artData.Groupage }] </span></b></td>
                                    <td>{(artData.Prix_vente * artData.QteAjoute).toFixed(3)}</td>
                                </tr>
                            )}
                            </>
                            : SKLT.FactureList }
                            
                        </tbody>
                    </table>
                </div>
                <br />
                <br />
                <Bounce bottom>
                        <div className="sticky-top" style={{top:'70px'}}>
                            <TotaleCard />
                        </div>
                </Bounce>
            </div>
        </> );

}

export default StockFondsData;