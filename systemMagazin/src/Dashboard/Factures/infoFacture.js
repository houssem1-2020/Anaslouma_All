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

function FactureInfo() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    const [articleL, setArticleL] = useState([])
    const [factureData, setFactData] = useState([])
    const [client, setClient] = useState('Passager')
    const [loading , setLoading] = useState(false)
    const [stockState , setStockState] = useState(false)
    const [toUpdatedList, setTUpList] = useState([])
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/facture/select`, {
            PID : GConf.PID,
            fid: FID
          })
          .then(function (response) {
                if(!response.data[0]) {
                    toast.error('Facture Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/S/ft"; }, 2000)
                    
                } else {
                    setArticleL(JSON.parse(response.data[0].Articles))
                    setClient(response.data[0].CL_Name)
                    let UsedTableNow = []
                    JSON.parse(response.data[0].Articles).map( (article) => {UsedTableNow.push([article.A_Code, article.Qte ])} )
                    setTUpList(UsedTableNow)
                    setFactData(response.data[0])
                    setLoading(true)
                    if(response.data[0].SDF == 'true'){setStockState(true)}
                }    
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture de son source   </div></>, GConf.TostInternetGonf)   
              const FactureTarged = Offline.facture.find((facture) => facture.F_ID == FID);
              setLoading(true)
              setArticleL(JSON.parse(FactureTarged.Articles))
              setStockState(true)
              setFactData(FactureTarged)
              setStockState(true)
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
    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'Payee': return <StateCard color='success' text='Payeé' />;  
            case 'Credit': return <StateCard color='danger' text='Credit' /> ;
            case 'Waitting': return <StateCard color='warning' text='En Attend' /> ;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    }
    const FactureHeader = () =>{
        return(<>
                <h2 className='text-center'>Facture Client </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>FACTURE ID : </b> {factureData.FACT_ID}</div>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {FID}</div>
                        <div className='text-secondary'><b>CLIENT: {factureData.CL_Name} </b> 
                        <Popup
                                content={<>
                                <div className='row'>
                                    <div className='col-6'>   
                                        <div className='text-secondary'><b><span className='bi bi-telephone text-danger'></span> : {factureData.Phone}</b></div>      
                                    </div>
                                    <div className='col-6'>
                                        <div className='text-secondary'><b><span className='bi bi-geo-alt-fill text-danger'></span> : {factureData.Gouv}</b></div>   
                                        <div className='text-secondary'><b><span className='bi bi-geo-alt text-danger'></span> : {factureData.Deleg}</b></div>   
                                        
                                    </div>
                                    <div className='col-12'>
                                        <div className='text-secondary'><b><span className='bi bi-pin-map text-danger'></span> : {factureData.Adress}</b></div>
                                    </div>
                                    
                                </div>
                                </> }
                                wide='very'
                                hoverable
                                key={factureData.Name }
                                header={<h3><span className='bi bi-person-fill'></span> {factureData.CL_Name} </h3> }
                                trigger={loading ? <NavLink  exact='true' to={`/S/cl/info/${factureData.CL_ID}`}> {factureData.Name } </NavLink>  : SKLT.BarreSkl }
                            />
                            </div>
                    </div>
                    <div className='col-6'>
                        <div className='text-danger'><b>Date : </b> {new Date(factureData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                        <div className='text-secondary'><b>Temps: </b> {factureData.T_Time} </div>
                        <div className='text-secondary'><b>Caisse: </b> {factureData.CA_Name} </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? (parseFloat(factureData.Final_Value) + 0.600).toFixed(3) : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    
                    <div className='col-12'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='edit outline' /> Imprimer</Button>
                    </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-6'>
                            <Button  className='rounded-pill bg-danger text-white'  fluid><Icon name='edit outline' /> Supprimer</Button>
                        </div>
                        <div className='col-6'>
                            <Button  className='rounded-pill  btn-regler'  fluid disabled={stockState} onClick={RetouAuStock}><Icon name='edit outline' /> R. Stock</Button>
                        </div>
                    </div>

                </div>
        </>)
    }

    return ( <> 
        <BreadCrumb links={GConf.BreadCrumb.factureInfo} />
        <br />
        <div className="row">
            <div className="col-12 col-lg-8">
                <h2 className='text-end'><StateCard status={factureData.Pay_State} /></h2>
                <FactureHeader />
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Designiation</th>
                        <th scope="col">Qté</th>
                        <th scope="col">PUHT</th>
                        <th scope="col">TVA</th>
                        <th scope="col">PUTTC</th>
                        <th scope="col">Prix Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {loading ?  
                        <>
                        {articleL.map( (artData, index) => 
                            <tr key={index +1 }>
                                <th scope="row">{index +1 }</th>
                                <td>{artData.Name}</td>
                                <td>{artData.Qte}</td>
                                <td>{CalculateTVA(artData.Prix)}</td>
                                <td>{GConf.DefaultTva} %</td>
                                <td>{artData.Prix.toFixed(3)}</td>
                                <td>{artData.PU}</td>
                            </tr>
                        )}
                        
                        </>
                        : SKLT.FactureList }                        
                        
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-lg-4">
            <Bounce bottom>
                <div className="sticky-top" style={{top:'70px'}}>
                    <TotaleCard />
                    <Input icon='user' size="small" iconPosition='left' placeholder='Client  '  fluid className='mb-1' value={client}  onChange={(e) => setClient(e.target.value)} />
                    <BtnsCard />
                </div>
            </Bounce>
            </div>
        </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/facture/info/${FID}/${client}`} />
    </> );
}

export default FactureInfo;