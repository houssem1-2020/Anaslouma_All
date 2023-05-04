import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { NavLink, useParams } from 'react-router-dom';
import { Button,  Icon, Popup} from 'semantic-ui-react';
import SKLT from '../../AssetsM/usedSlk';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import { toast } from 'react-toastify';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import { Input } from 'semantic-ui-react';

function TicketDePrixPage() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    const [articleL, setArticleL] = useState([])
    const [loading , setLoading] = useState(false)
    
    const [factureData, setFactData] = useState([])
    const [client, setClient] = useState('Passager')
    
    const [stockState , setStockState] = useState(false)
    const [toUpdatedList, setTUpList] = useState([])
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/ticket/prix`, {
            PID : GConf.PID,
          })
          .then(function (response) {
                setArticleL(response.data)
                setLoading(true)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture de son source   </div></>, GConf.TostInternetGonf)   
              const FactureTarged = Offline.facture.find((facture) => facture.F_ID == FID);
              setLoading(true)
              
            }
          });
    }, [])

    /*#########################[Function]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const RetouAuStock = () =>{
        axios.post(`${GConf.ApiLink}/stock/be`, {
            PID : GConf.PID,
            artList: articleL,
          })
          .then(function (response) {      
            if(response.data.affectedRows) {
                // axios.post(`${GConf.ApiLink}/facture/us`, { PID : GConf.PID,  fid: FID })
                toast.success("Stock Modifier !", GConf.TostSuucessGonf)
                setStockState(true)
                setFactData({ ...factureData, SDF: 'true'})
            }
            else{
                toast.error('Erreur Indéfine ', GConf.TostSuucessGonf)
            }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Operation Annuleé  </div></>, GConf.TostInternetGonf)   
            }
          });

    }
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }

    /*#########################[Card]##################################*/
    const AjouterCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Ajouter </h5>
                    ajouter un <br />
                    ajouiter une fimille ou imprimer direct 
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    
                    <div className='col-12 mb-2'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printTicketPrix')}><Icon name='edit outline' /> Imprimer Normale</Button>
                    </div>
                    <div className='col-12 mb-2'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printTicketPrixMoyenne')}><Icon name='edit outline' /> Imprimer Moyenne</Button>
                    </div>
                    <div className='col-12'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printTicketPrixLarge')}><Icon name='edit outline' /> Imprimer Large</Button>
                    </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button  className='rounded-pill bg-danger text-white'  fluid><Icon name='edit outline' /> Vider La Liste</Button>
                        </div>
                        <div className='col-6 d-none'>
                            <Button  className='rounded-pill  btn-regler'  fluid disabled={stockState} onClick={RetouAuStock}><Icon name='edit outline' /> R. Stock</Button>
                        </div>
                    </div>

                </div>
        </>)
    }

    return ( <>
            <div className='container'>
                <h5>Ticket de Prix </h5> 
                <br />
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className="row border-top border-start mb-3">
                                
                                {loading ?  
                                <>
                                {articleL.map( (artData, index) => 
                                    <div className="col-12 col-lg-4 border-end border-bottom p-2">
                                        <h1 className='text-center text-blod'><b>{artData.Prix_vente.toFixed(3)}</b></h1>
                                        <h6 className="text-danger text-center"><b>{artData.Name}</b></h6>
                                        <div className="text-end small">{artData.Code}</div>
                                    </div>
                                )}
                                
                                </>
                                : SKLT.FactureList }                        
                                
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                    <Bounce bottom>
                        <div className="sticky-top" style={{top:'70px'}}>
                            <BtnsCard />
                            <AjouterCard />
                        </div>
                    </Bounce>
                    </div>
                </div>
                <FrameForPrint frameId='printTicketPrix' src={`/Pr/Tools/print/prix/normale`} />                
                <FrameForPrint frameId='printTicketPrixLarge' src={`/Pr/Tools/print/prix/large`} />                
                <FrameForPrint frameId='printTicketPrixMoyenne' src={`/Pr/Tools/print/prix/moyenne`} />                
            </div>
    </> );
}

export default TicketDePrixPage;