import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bounce } from 'react-reveal';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Icon, Input, List, Loader, Popup } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import SKLT from '../../AssetsM/usedSlk';
import { toast } from 'react-toastify';
import usePrintFunction from '../Assets/Hooks/printFunction';
import FrameForPrint from '../Assets/frameForPrint';
import useGetArticles from '../Assets/Hooks/fetchArticles';

const RetouCard = ({retour, setRetour, RetourFunction , commandeData, OnKeyPressFunc,loader}) =>{
    return (<>
            <div className='card card-body shadow-sm mb-2'>
                <h5>Retour</h5>
                Enregistré : {commandeData.Retour}
                <Input icon='retweet' size="small" iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)}  placeholder='Chauffeur '  fluid className='mb-1' value={retour}  onChange={(e) => setRetour(e.target.value)} />
                <div className='row mb-1 mt-3'>
                    <div className='col-12'>
                        <Button  className='rounded-pill btn-imprimer' size='small' fluid onClick={ (e) => RetourFunction('PrintBonL') }><Icon name='print' /> Retour <Loader inverted active={loader} inline size='tiny' className='ms-2'/></Button>
                    </div>
                </div>
            </div>
    </>)
}


function RequestInfo() {
    /*#########################[Const]##################################*/
    const {CID} = useParams()
    const [articleL, setArticleL] = useState([])
    const [commandeData, setCommandeD] = useState([])
    const [facturerData, setFacturerD] = useState([])
    const [retour, setRetour] = useState(0)
    const [loading , setLoading] = useState(false)
    const [loader , setLoader] = useState(false)
    const [btnState, setBtnState] = useState(false)
    const [printLink, setPrintLink] = useState(`/Pr/commande/${CID}`)
    const [codes , articleList, tableData] = useGetArticles()
    /*#########################[useEffect]##################################*/ 
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/commande/info`, {
            tag: GConf.SystemTag,
            cid: CID
          })
          .then(function (response) {
                if (!response.data[0]) {
                    toast.error('Commande Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/S/rq"; }, 2000)
                } else {
                    setArticleL(JSON.parse(response.data[0].Articles))
                    setCommandeD(response.data[0])
                    setLoading(true)  
                
                    setFacturerD({client: response.data[0].Client, de:'Sidi Bourouis', vers: '', jour: response.data[0].Date_Volu , totale: response.data[0].Totale , articles:JSON.parse(response.data[0].Articles)})    
                    if(response.data[0].State != 'W'){setBtnState(true)}  
                    
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
        setBtnState(true)
        axios.post(`${GConf.ApiLink}/commande/controle`, {
            tag: GConf.SystemTag,
            cid: CID,
            state: stateBtn
          })
          .then(function (response) {
                setCommandeD({ ...commandeData, State: stateBtn}) 
                        
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier L'etat du commande  </div></>, GConf.TostInternetGonf)   
              setBtnState(false)
            }
          });
    }
    const FacturerCommande = () =>{
        setBtnState(true)
        axios.post(`${GConf.ApiLink}/facture/ajouter`, {
            tag: GConf.SystemTag,
            factD: facturerData,
        })
        .then(function (response) { 
            if(response.status = 200) {
                UpdateState('A')
                toast.success("Enregistreé !", GConf.TostSuucessGonf)
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                setBtnState(false)
            }           
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Facturer la commande  </div></>, GConf.TostInternetGonf)   
            }
          });
        
    }
    const GetArticleImage = (code) => {
        const searchObject = articleList.find((article) => article.A_Code == code);
        if (searchObject) {
            return `https://assets.ansl.tn/Images/Articles/${searchObject.Photo_Path}`  
        }else{
            return `https://assets.ansl.tn/Images/Articles/default_img.jpg`  
        }
    }
    const RetourFunction = () =>{
        setLoader(true)
        axios.post(`${GConf.ApiLink}/commande/editr`, {
            tag: GConf.SystemTag,
            Com_Id: CID,
            retourV : retour
          }).then(function (response) {
            toast.success("Enregistreé !", GConf.TostSuucessGonf)
            setLoader(false)
                        
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier L'etat du commande  </div></>, GConf.TostInternetGonf)   
              setBtnState(false)
            }
          });
    }
    /*#########################[Card]##################################*/
    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'W': return <StateCard color='warning' text='En Attent' />;  
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
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div>Totale hors tax: </div>
                    <div>TVA: </div>
                    <div>Timbre: 1.000 DT</div>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? commandeData.Totale : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }

    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                        <div className='col-6'>
                            <Button disabled={btnState} className='rounded-pill'  fluid onClick={ () => UpdateState('R')}><Icon name='edit outline' /> Anuulée</Button>
                        </div>
                        <div className='col-6'>
                            <Button disabled={btnState} className='rounded-pill bg-system-btn '  fluid onClick={FacturerCommande}><Icon name='edit outline' /> Facturer </Button>
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
                        <div className='text-secondary'><b>CLIENT: </b> {loading ? <NavLink  exact='true' to={`/S/cl/info/${commandeData.CL_ID}`}> {commandeData.Name } </NavLink> : SKLT.BarreSkl } </div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Passé Le  : </b> {loading ?  new Date(commandeData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) : SKLT.BarreSkl } </div>
                        <div className='text-secondary'><b>Voulu Le : </b> {loading ? new Date(commandeData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )  : SKLT.BarreSkl } </div>
                    </div>
                </div>
        </>)
    }
    const CommentsCard = () =>{
        return(<>
           <div className='card card-body shadow-sm mb-2'>
                <h5 className='mb-3 text-secondary '><span className='bi bi-chat-left-dots-fill'></span> Commentaires : </h5>
                {loading ? commandeData.Comments : SKLT.BarreSkl }
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
                            <th scope="col">PUHT</th>
                            <th scope="col">TVA</th>
                            <th scope="col">PUTTC</th>
                            <th scope="col">Prix Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ?  
                            <>
                            {articleL.map( (artData) => 
                                <tr key={artData.id}>
                                    <th scope="row">{artData.id}</th>
                                    <td><Popup position='left center' content={<img src={GetArticleImage(artData.A_Code)} className='img-responsive' width='120px' />} trigger={<b role="button">{artData.Name}</b>} /></td>
                                    <td>{artData.Qte}</td>
                                    <td>{artData.Prix.toFixed(3)}</td>
                                    <td>0%</td>
                                    <td>{artData.Prix.toFixed(3)}</td>
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
            
            <div className="col-12 col-lg-4">
            <Bounce bottom>
                <div className="sticky-top" style={{top:'70px'}}>
                    <TotaleCard />
                    <BtnsCard />
                    <CommentsCard />
                    <RetouCard retour={retour} setRetour={setRetour} commandeData={commandeData} RetourFunction={RetourFunction} loader={loader} OnKeyPressFunc={'OnKeyPressFunc'} />
                </div>
            </Bounce>
            </div>
        </div>
        <FrameForPrint frameId='framed' src={printLink} />
    </> );
}

export default RequestInfo;