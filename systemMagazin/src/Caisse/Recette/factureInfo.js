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


function FactureInfo() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID; 
    let [articleL, setArticleL] = useState([])
    let [factureData, setFactData] = useState([])
    let [editState, setEditState] = useState(true)
    let [loading , setLoading] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Camion_Offline`));
    

    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCaisseLink}/rt/factures/select`, {
            forPID : caisseData.PID,
            fid: FID,
            caisseId: CaisseID
          })
          .then(function (response) {
                if(!response.data[0]) {
                    toast.error('Facture Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/I/mf"; }, 2000)
                    
                } else {
                    setArticleL(JSON.parse(response.data[0].Articles))
                    let UsedTableNow = []
                    JSON.parse(response.data[0].Articles).map( (article) => {UsedTableNow.push([article.A_Code, article.Qte ])} )
                    setFactData(response.data[0])
                    setLoading(true)
                    if(response.data[0].Cre_Date){setEditState(false)}
                }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture de son source   </div></>, GConf.TostInternetGonf)   
              const FactureTarged = Offline.facture.find((facture) => facture.F_ID == FID);
              setLoading(true)
              setArticleL(JSON.parse(FactureTarged.Articles))
              setFactData(FactureTarged)
              setEditState(true)
            }
          });
    }, [])

    /*#########################[Function]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}

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
          <span>
            {statusCard()}
          </span>
        );
    }
    
    const TotaleCard = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    <h5>Nette & Totale </h5>
                    <div>Nette A Payer : {loading ? factureData.Final_Value.toFixed(3) : SKLT.BarreSkl }</div>
                    <div>Etat de la Facture : {loading ? <StateCard status={factureData.Pay_State} /> : SKLT.BarreSkl }</div>
                    <div>Mode De Paymment : {loading ? factureData.Paye_Bons == '' ? 'Espéce' : 'Par Bons' : SKLT.BarreSkl }</div>
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    <div className='col-12 mb-2'>
                            <Button as='a' href={`/I/L/mf/modifier/${FID}`} animated disabled={editState} className='rounded-pill bg-system-btn'  fluid>
                                <Button.Content visible><Icon name='edit outline' /> Modifier </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow right' />
                                </Button.Content>
                            </Button>
                    </div>
                    <div className='col-12 mb-2'>
                        <Button  className='rounded-pill bg-danger text-white'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='trash' /> Demande d'annulation </Button>
                    </div>
                    <div className='col-12 mb-2'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='print' /> Imprimer</Button>
                    </div>
                    </div>
                </div>
        </>)
    }
    const FactureHeader = () =>{
        return(<>
                <h2 className='text-center'>Facture Client </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>FACTURE ID : </b> {factureData.T_ID}</div>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {FID}</div>
                        <div className='text-secondary'><b>CLIENT: {factureData.CL_Name} </b> 
                        {/* {loading ? <NavLink  exact='true' to={`/S/cl/info/${factureData.CL_ID}`}> {factureData.Name } </NavLink>  : SKLT.BarreSkl } */}
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

    return ( <>
    <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2 text-white' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
        <BackCard data={InputLinks.backCard.mfInfo}/>
        <br />
        <br />
        <div className='container'>
            <div className='row'>
                <div className='col-12 col-lg-7'>
                    <FactureHeader />
                    <br />
                    <br />
                    <div className="table-responsive">
                        <table   className={`table ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2 text-white' : '' }`}>
                            <thead>
                                <tr>
                                <th scope="col">No</th>
                                <th scope="col">Designiation</th>
                                <th scope="col">Qté</th>
                                <th scope="col">Prix</th>
                                <th scope="col">P. Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ?  
                                <>
                                {articleL.map( (artData, index) => 
                                    <tr key={index}>
                                        <th scope="row">{index + 1 }</th>
                                        <td>{artData.Name}</td>
                                        <td>{artData.Qte}</td>
                                        <td>{parseFloat(artData.Prix).toFixed(3)}</td>
                                        <td>{artData.PU}</td>
                                    </tr>
                                )}
                                </>
                                : SKLT.FactureList }
                                
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <br />
                </div>
                <div className='col-12 col-lg-5'>
                    <Bounce bottom>
                            <div className="sticky-top" style={{top:'70px'}}>
                                <TotaleCard />
                                <BtnsCard />
                            </div>
                    </Bounce>
                </div>
            </div>
        </div>
    </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/caisse/facture/${FID}`} />
    </> );
}

export default FactureInfo;