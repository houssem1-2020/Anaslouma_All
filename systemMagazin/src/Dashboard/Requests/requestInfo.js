import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bounce } from 'react-reveal';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Icon, List } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import SKLT from '../../AssetsM/usedSlk';
import { toast } from 'react-toastify';
import usePrintFunction from '../Assets/Hooks/printFunction';
import FrameForPrint from '../Assets/frameForPrint';


function RequestInfo() {
    /*#########################[Const]##################################*/
    const {CID} = useParams()
    const [articleL, setArticleL] = useState([])
    const [commandeData, setCommandeD] = useState([])
    const [facturerData, setFacturerD] = useState([])
    const [loading , setLoading] = useState(false)
    const [btnState, setBtnState] = useState(false)
    const [printLink, setPrintLink] = useState(`/Pr/commande/${CID}`)

    /*#########################[useEffect]##################################*/ 
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/commande/info`, {
            PID : GConf.PID,
            CID: CID
          })
          .then(function (response) {
                if (!response.data[0]) {
                    toast.error('Commande Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/S/rq"; }, 2000)
                } else {
                    setArticleL(JSON.parse(response.data[0].Articles))
                    setCommandeD(response.data[0])
                    setLoading(true)  
                    setFacturerD({client: response.data[0].Client, de:'Sidi Bourouis', vers: response.data[0].Adress, jour: response.data[0].Date_Volu, totale: response.data[0].Totale , articles:JSON.parse(response.data[0].Articles)})    
                    if(response.data[0].State != 'W' && response.data[0].State != 'S'){setBtnState(true)}
                    if(response.data[0].State == 'W' ){UpdateState('S') }
                    
                }  
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger la commande   </div></>, GConf.TostInternetGonf)   
              setLoading(true)
              setBtnState(true)
              setArticleL([])
              setCommandeD([])
            }
          });
    }, [])

    /*#########################[Functions]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId) }
    const UpdateState = (stateBtn) =>{
        axios.post(`${GConf.ApiLink}/commande/controle`, {
            PID : GConf.PID,
            RID: CID,
            state: stateBtn
          })
          .then(function (response) {
            setCommandeD({ ...commandeData, State: stateBtn}) 
            if(stateBtn != 'S'){setBtnState(true)}            
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier L'etat du commande  </div></>, GConf.TostInternetGonf)   
              setBtnState(true)
            }
          });
    }
    const FacturerCommande = () =>{
        axios.post(`${GConf.ApiLink}/facture/ajouter`, {
            PID : GConf.PID,
            factD: facturerData,
        })
        .then(function (response) { 
            if(response.status = 200) {
                UpdateState('A')
                toast.success("Factureé !", GConf.TostSuucessGonf)
                setBtnState(true)
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
            }           
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Facturer la commande  </div></>, GConf.TostInternetGonf)   
              setBtnState(true)
            }
          });
        
    }
    
    /*#########################[Card]##################################*/
    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'W': return <StateCard color='warning' text='En Attent' />;  
            case 'S': return <StateCard color='info' text='Vu' />;  
            case 'A': return <StateCard color='success' text='Acepteé' /> ;
            case 'R': return <StateCard color='danger' text='Refuseé' />;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    };
    const CommentaireCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 mt-3 border-div'>
                    <h5>Commentaires </h5>
                    <span>{loading ? commandeData.Commentaire : SKLT.BarreSkl }</span>  
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                        <div className='col-6'>
                            <Button disabled={btnState} className='rounded-pill'  fluid onClick={ () => UpdateState('R')}><Icon name='edit outline' /> Anuulée</Button>
                        </div>
                        <div className='col-6'>
                            <Button as='a' href={`/S/rq/facturer/${CID}`} animated disabled={btnState} className='rounded-pill bg-system-btn'  fluid>
                                <Button.Content visible><Icon name='edit outline' /> Facturer </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow right' />
                                </Button.Content>
                            </Button>
                            {/* <Button disabled={btnState} className='rounded-pill bg-system-btn '  fluid onClick={FacturerCommande}><Icon name='edit outline' /> Facturer </Button> */}
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('framed')}><Icon name='edit outline' /> Imprimer</Button>
                        </div>
                    </div>
                </div>
        </>)
    }
    const CommandeHeader = () =>{
        return(<>
                <h2 className='text-center mb-4'>Commande </h2> 
                <br />
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>CODE COMMANDE : </b> {CID}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {loading ? <NavLink  exact='true' to={`/S/cl/info/${commandeData.R_ID}`}> {commandeData.Name } </NavLink> : SKLT.BarreSkl } </div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Passé Le  : </b> {loading ?  new Date(commandeData.Passed_Day).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) : SKLT.BarreSkl } </div>
                        <div className='text-secondary'><b>Voulu Le : </b> {loading ? new Date(commandeData.Wanted_Day).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )  : SKLT.BarreSkl } </div>
                    </div>
                </div>
        </>)
    }
    
    return ( <> 
        <BreadCrumb links={GConf.BreadCrumb.RequestInfo} />
        <br />
        <div className="row">
            <div className="col-12 col-lg-8">
                <h2 className='text-end'><StateCard status={commandeData.State} /></h2>
                <CommandeHeader />
                <br />
                <br />
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">No</th>
                            <th scope="col">Designiation</th>
                            <th scope="col">Qté</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {loading ?  
                            <>
                            {articleL.map( (artData) => 
                                <tr key={artData.id}>
                                    <th scope="row">{artData.id}</th>
                                    <td>{artData.Name}</td>
                                    <td>{artData.Qte}</td>
                                     
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
            
            <div className="col-12 col-lg-4">
            <Bounce bottom>
                <div className="sticky-top" style={{top:'70px'}}>
                    <BtnsCard />
                    <CommentaireCard />
                </div>
            </Bounce>
            </div>
        </div>
        <FrameForPrint frameId='framed' src={printLink} />
    </> );
}

export default RequestInfo;