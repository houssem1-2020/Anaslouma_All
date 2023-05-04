import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import { Button, Divider, Dropdown, Icon, Input, Loader, Statistic } from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Tab } from 'semantic-ui-react';
import axios from 'axios';
import { _ } from "gridjs-react";
import { useParams } from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import { toast } from 'react-toastify';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import { useNavigate} from 'react-router-dom';

const EditCamionCard = ({camionD, setCamionD, EditCamion, GenrateKey, loaderState}) =>{
    return(<>

            <div className='p-1  mb-2'>
            <h5 className='mb-1'>Nom:</h5>
                 <Input icon='truck' iconPosition='left' placeholder='Nom' className='w-100 border-0 shadow-sm rounded mb-1' value={camionD.CA_Name} onChange={(e) => setCamionD({...camionD, CA_Name: e.target.value })} />
            </div>
            <div className='p-1 mb-2'>
                <h5 className='mb-1'> Fond:</h5>
                <Input icon='user' iconPosition='left' placeholder='Chauffeur' className='w-100 border-0 shadow-sm rounded mb-1' value={camionD.Caisse_Fond} onChange={(e) => setCamionD({...camionD, Caisse_Fond: e.target.value })}/>
            </div>
            <div className='row mb-3'>
                    <div className='col-12 col-lg-6'>
                        <h5 className='mb-1'>Identifiant:</h5>
                        <Input icon='linkify' iconPosition='left' placeholder='identifiant'  className='w-100 border-0 shadow-sm rounded mb-3' value={camionD.Identifiant} onChange={(e) => setCamionD({...camionD, Identifiant: e.target.value })} />
                    </div>
                    <div className='col-9 col-lg-5'>
                        <h5 className='mb-1'>Mot De Pass: </h5>
                        <Input icon='eye' iconPosition='left' placeholder='Nom' className='w-100 border-0 shadow-sm rounded mb-3' value={camionD.Password} onChange={(e) => setCamionD({...camionD, Password: e.target.value })}/>
                    </div>
                    <div className='col-3 col-lg-1 align-self-center'>
                        <Button onClick={GenrateKey} className="rounded-pill " icon='random'></Button>
                    </div>
            </div> 
            <div className='text-end mb-5'>
                <Button  onClick={EditCamion}  className='text-end rounded-pill bg-system-btn' positive>  <Icon name='edit' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
            </div>

    </>)
}

function CamionInfo() {
    /* ############################### Const ################################*/
    const Today = new Date().toISOString().split('T')[0]
    const {CID} = useParams()
    const [position, setPosition] = useState([36.17720,9.12337])
    const [stocktable, setStockTable] = useState([]);
    const [camionData, setCamionD] = useState([]);
    const [camionFondRecett, setCamionFR] = useState('0.000');
    const [factureCamion, setFactureCamion] = useState([]); 
    const [fondListCamion, setFonfListCamion] = useState([]); 
    const [rechercheDay, setRechercheDay] = useState({start:Today, end:Today}); 
    const [loading , setLoading] = useState(false)
    const [loaderState, setLS] = useState(false)
    const panes = [
        {
            menuItem: { key: 'fond', icon: 'file text', content: 'Facture' }, 
            render: () => <><CamionFactures /><br /></>,
        },
        {
            menuItem: { key: 'comd', icon: 'calendar check', content: 'Recherche Recette' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}> <CaisseRecetteRecherche /> </Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'editClient', icon: 'edit outline', content: 'Modifier' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}><EditCamionCard camionD={camionData}  setCamionD={setCamionD} GenrateKey={GenrateKey} EditCamion={EditCamion} loaderState={loaderState} /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'delete', icon: 'trash alternate', content: 'Supprimer' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}><DeleteCamion /></Tab.Pane><br /></>,
        },
        
    ]
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    const navigate = useNavigate();
    const NavigateFunction = (link) => {  navigate(link) }

    /* ############################### UseEffect ################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/caisse/info`, {
            PID : GConf.PID,
            camId : CID
        })
        .then(function (response) {
             
            if(response.data[0].Data.length === 0) {
                toast.error('Camion Introuvable !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/ca"; }, 2000)
                
            } else {
                console.log(response.data)
                setLoading(true)
                setCamionD(response.data[0].Data)
                setCamionFR(response.data[0].Recette)
                
                let factureTable = []
                response.data[0].Facture.map( (getData) => factureTable.push([ getData.T_ID, getData.CL_Name,  new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Final_Value,
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/ft/info/${getData.T_ID}`)}><Icon  name='angle right' /></Button>)
                // _(<h6><a href={`facture/${CID}/${getData.F_ID}`} ><Button className='rounded-pill bg-system-btn' size='mini'><Icon  name='angle right' /></Button></a></h6>)
                ],))
                setFactureCamion(factureTable)

                
                
            }

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les information du camion </div></>, GConf.TostInternetGonf)   
              setCamionFR({Fond: 0, Recette : 0})
              setCamionD([])
              setPosition([0,0])
              setLoading(true)
              setStockTable([])
              setFactureCamion([])
              setFonfListCamion([])
            }
          });

    }, [])


    /* ############################### Function ################################*/ 
    const GenrateKey = () =>{
        let ID = Math.random().toString(36).slice(2, 8);
        let PWD =  Math.floor(Math.random() * 1000000);
        setCamionD({...camionData, Identifiant: ID , Password:PWD})
    }
    const DeleteStockZero = () => {
        axios.post(`${GConf.ApiLink}/camion/info/ztockzero/delete`, {
            PID : GConf.PID,
            camId: CID,
          })
        .then(function (response) {
            if(response.status === 200){
                toast.success("Stock à zero supprimer !", GConf.TostSuucessGonf)
                SaveNotification('camionSupprimerArticleZero',GConf.PID, camionData)
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Operation anuuleé </div></>, GConf.TostInternetGonf)   
            }
          });
    }
    const EditCamion = () =>{
        if (!camionData.CA_Name) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!camionData.Caisse_Fond) {toast.error("Fond Invalide !", GConf.TostErrorGonf)}
        else if (!camionData.Identifiant) {toast.error("Identifiant Invalide !", GConf.TostErrorGonf)}
        else if (!camionData.Password) {toast.error("Mot De Passe Invalide !", GConf.TostErrorGonf)}
        else{
                setLS(true)
                axios.post(`${GConf.ApiLink}/caisses/modifier`, {
                    tag : GConf.PID,
                    caisseD : camionData,
                }).then(function (response) {
                    if(response.data.affectedRows) {
                        toast.success("Caisse Modifier !", GConf.TostSuucessGonf)
                        setLS(false)
                    }
                    else {
                            toast.error('Erreur Lors de la modification', GConf.TostSuucessGonf)
                            setLS(false)
                        }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5>  </div></>, GConf.TostInternetGonf)   
                    }
                  });
                    
            }
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const SearchRecette = () =>{
        axios.post(`${GConf.ApiLink}/caisse/searchrecette`, {
            PID : GConf.PID,
            camId : CID,
            targetDay : rechercheDay
        })
        .then(function (response) {
             
            console.log(response.data)                
            let factureRechTable = []
            response.data.map( (getData) => factureRechTable.push([ getData.T_ID, getData.CL_Name,  new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Final_Value,
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/ft/info/${getData.T_ID}`)}><Icon  name='angle right' /></Button>)
            ],))
            setFonfListCamion(factureRechTable)

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5>  </div></>, GConf.TostInternetGonf)   
            }
          });
    }
    const MakeTotRechette = (targetList) =>{
        let tot = 0
        targetList.map((data) => {
            tot = tot + data[3]
        })
        return tot.toFixed(3)
    }
    /* ############################### Card ################################*/
    const SDCF = (props)=>{
        return(<>
           <div className='text-center'><span className={`bi bi-${props.state == "true" ? 'check-circle-fill text-success': 'x-circle-fill text-danger'}`}></span> </div>
        </>)
      }
    const ArticleCard = (props) =>{
        return (<>

            <div className="sticky-top" style={{top:'70px'}}>
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <div className="upper">
                        <div className="mcbg main-big-card"></div>
                    </div>
                    <div className="img-card-container text-center">
                        <div className="card-container">
                            <img src="https://familia.anaslouma.tn/Assets/images/caisse.png" className="rounded-circle" width="80" />                    
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                            <h4 className='mt-2'>{loading ? props.dataC.CA_Name : SKLT.BarreSkl } </h4> 
                            {/* <h6 className="text-secondary">  {loading ? <><span className="bi bi-truck"></span> { props.dataC.Cam_ID } </>: SKLT.BarreSkl} </h6> */}
                            <h6 className="text-secondary"> {loading ? <><span className="bi bi-person-heart"></span> { props.dataC.C_ID } </>: SKLT.BarreSkl } </h6>
                            <Divider horizontal className='text-secondary mt-4'>Fond</Divider>
                            <div className='row text-center'>
                                <div className='col-12'>    
                                    {loading ?  
                                        <Statistic color='red' size='tiny'>
                                            <Statistic.Value>
                                                {parseFloat(props.dataC.Caisse_Fond).toFixed(3)} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }  
                                    
                                </div>
                            </div>
                            <Divider horizontal className='text-secondary mt-4'>Recette</Divider>
                            <div className='row text-center'>
                                <div className='col-12 mb-3'> 
                                    {loading ?  
                                        <Statistic color='green' size='tiny'>
                                            <Statistic.Value>
                                                {camionFondRecett} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }   
                                </div>
                                
                        </div>
                    </div>
                </div>
                {/* <div className='card card-body shadow-sm  border-div mb-4'>
                        <h5>Location</h5>
                          <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="map-height">
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                                <Popup>
                                    
                                </Popup>
                            </Marker>
                        </MapContainer>
                        
                </div> */}
            </div>
        </>);
    }
    const FastControl = () =>{
        return(<>
                <h5 className='text-danger'>Stock</h5>
                <div className='mb-2 row'>
                    <div className='col-10 col-lg-11 align-self-center'><b>&#8226; Imprimer Le Stock du camion </b></div>
                    <div className='col-2 col-lg-1 align-self-center'><Button  className='rounded-circle bg-system-btn' icon onClick={(e) => PrintFunction('PrintStock')}> <Icon name='print' /> </Button></div>
                </div>
                <div className='mb-2 row'>
                    <div className='col-10 col-lg-11 align-self-center'><b>&#8226; Imprimer Le Stock à 0 </b></div>
                    <div className='col-2 col-lg-1 align-self-center'><Button  className='rounded-circle btn-imprimer' icon onClick={(e) => PrintFunction('PrintStockZero')}> <Icon name='print' /> </Button></div>
                </div>
                <div className='mb-2 row'>
                    <div className='col-10 col-lg-11 align-self-center'><b>&#8226; Supprimer Les Articles à 0</b></div>
                    <div className='col-2 col-lg-1 align-self-center'><Button  className='rounded-circle btn-danger' icon onClick={DeleteStockZero}>  <Icon name='trash alternate' /></Button></div>
                </div>
                <hr />
                <h5 className='text-danger'>Vente</h5>
                <div className='mb-2 row'>
                    <div className='col-12 col-lg-7'><b> &#8226; Imprimer Les Article Vendu Le : </b></div>
                    <div className='col-10 col-lg-4'><Input size='mini' fluid type='date' value={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value , end: e.target.value})}/></div>
                    <div className='col-2 col-lg-1'><Button  className='rounded-circle bg-system-btn' icon onClick={(e) => PrintFunction('ventes')}>  <Icon name='print' /></Button></div>
                </div>
                <div className='mb-2 row'>
                    <div className='col-12 col-lg-7'><b>&#8226; Imprimer La Facture Du :</b></div>
                    <div className='col-10 col-lg-4'><Input size='mini' fluid type='date' value={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value , end: e.target.value})}/></div>
                    <div className='col-2 col-lg-1'><Button  className='rounded-circle btn-imprimer' icon onClick={(e) => PrintFunction('VPDay')}>  <Icon name='print' /></Button></div>
                </div> 
                <div className='mb-2 row'>
                    <div className='col-12 col-lg-5 align-self-center'><b>&#8226; Imprimer Les Recette entre :</b></div>
                    <div className='col-5 col-lg-3'><Input size='mini' fluid  type='date' value={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value })}/></div>
                    <div className='col-5 col-lg-3'><Input size='mini' fluid  type='date' value={rechercheDay.end} onChange={(e) => setRechercheDay({...rechercheDay, end: e.target.value })}/></div>
                    <div className='col-2 col-lg-1'><Button  className='rounded-circle btn-imprimer' icon onClick={(e) => PrintFunction('VEPeriode')}>  <Icon name='print' /></Button></div>
                </div>
                <hr />
                <h5 className='text-danger'>Fond</h5>
                <div className='mb-2 row'>
                    <div className='col-12 col-lg-5 align-self-center'><b>&#8226; Imprimer Les Fond entre :</b></div>
                    <div className='col-5 col-lg-3'><Input size='mini' fluid  type='date' value={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value })} /></div>
                    <div className='col-5 col-lg-3'><Input size='mini' fluid  type='date' value={rechercheDay.end} onChange={(e) => setRechercheDay({...rechercheDay, end: e.target.value })} /></div>
                    <div className='col-2 col-lg-1'><Button  className='rounded-circle btn-imprimer' icon onClick={(e) => PrintFunction('Printfonds')}>  <Icon name='print' /></Button></div>
                </div> 
                
        </>)
    }
    const CaisseRecetteRecherche = () =>{
        return(<>
                <h5 className='text-danger'>Recherche Recette entre : </h5>
                <div className='mb-2 row'>
                    <div className='col-5 col-lg-4'><Input size='mini' fluid  type='date' defaultValue={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value })} /></div>
                    <div className='col-5 col-lg-4'><Input size='mini' fluid  type='date' defaultValue={rechercheDay.end} onChange={(e) => setRechercheDay({...rechercheDay, end: e.target.value })} /></div>
                    <div className='col-2 col-lg-4'><Button fluid className='btn-imprimer' size='mini' icon onClick={(e) => SearchRecette()}>  <Icon name='print' /></Button></div>
                </div> 
                Tottale Vente : {MakeTotRechette(fondListCamion)}
                <TableGrid tableData={fondListCamion} columns={GConf.TableHead.camionFacture} />
        </>)
    }
    const CamionFonds = () =>{
        return(<>
            <TableGrid tableData={fondListCamion} columns={GConf.TableHead.camionFond} />
        </>)
    }
    const CamionFactures = () =>{
        return(<>
                <TableGrid tableData={factureCamion} columns={GConf.TableHead.camionFacture} />
        </>)
    }
    const CamionCommandes = () =>{
        return(<>
            <div className='mb-2'>
                <Input size='large' fluid type='date' value={rechercheDay.start} onChange={(e) => setRechercheDay({...rechercheDay, start: e.target.value , end: e.target.value})}/>
            </div>
            <div className='mb-2'>
               <h5>Totale & Resumer</h5> 
               <br /> 
                
            </div>
            <div className='mb-2'>
                <div className='row'>
                    <div className='col-12 col-lg-3'><Button  className='rounded-pill btn-imprimer' disabled={!true}  fluid onClick={(e) => PrintFunction('commandeGroupRes')}><Icon name='print' /> Resumeé</Button></div>
                    <div className='col-12 col-lg-3'><Button  className='rounded-pill btn-imprimer' disabled={!true}  fluid onClick={(e) => PrintFunction('commandeGroupF')}><Icon name='print' /> Factures</Button></div>
                    <div className='col-12 col-lg-3'><Button  className='rounded-pill btn-imprimer' disabled={!true}  fluid onClick={(e) => PrintFunction('commandeGroupBS')}><Icon name='print' /> B. Sortie</Button></div>
                    <div className='col-12 col-lg-3'><Button  className='rounded-pill btn-imprimer' disabled={!true}  fluid onClick={(e) => PrintFunction('commandeGroupBL')}><Icon name='print' /> B. Livraison</Button></div>
                </div>
            </div>
        </>)
    }
    const DeleteCamion = () =>{
        return(<>
        <h3 className="text-secondary">Voulez-Vous Vraimment Supprimer Ce Camion ?</h3> 
            <h5 className="text-danger text-left"><b>Lorsque Vous Supprimer Le Camion : </b></h5>
            <ul className="text-info text-left">
            <li>L'article ne sera pas visible dans la branche 'Stock'</li>
            <li>Tous les article avec son code a barre se suppriment </li>
            <li>L'article Soit visible seulemment dans les facture  </li>
            </ul>
            <div className='text-end'>
                <button type="submit" name="add" className="btn btn-danger rounded-pill" ><span className="bi bi-check"></span> Oui, Supprimer</button>
            </div>
        </>)
    }

    return ( <> 
         <BreadCrumb links={GConf.BreadCrumb.CamionInfo} />
         <br />
        <div className="row">
                <div className="col-12 col-lg-4">
                    <ArticleCard  dataC={camionData} camionFondRecett={camionFondRecett}/> 
                </div>
                <div className="col-12 col-lg-8">
                     <Tab menu={{ secondary: true, pointing: true ,className: "wrapped"}} panes={panes} />
                </div>
        </div>
        {/* <FrameForPrint frameId='PrintStock' src={`/Pr/Camion/info/stock/${CID}`} />
        <FrameForPrint frameId='PrintStockZero' src={`/Pr/Camion/info/stock-z/${CID}`} />
        <FrameForPrint frameId='ventes' src={`/Pr/Camion/info/vente/articles/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='VPDay' src={`/Pr/Camion/info/vente/factures/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='VEPeriode' src={`/Pr/Camion/info/vente/recette/${CID}/${rechercheDay.start}/${rechercheDay.end}`} />
        <FrameForPrint frameId='Printfonds' src={`/Pr/Camion/info/fond/${CID}/${rechercheDay.start}/${rechercheDay.end}`} />
        <FrameForPrint frameId='resumerFactures' src={`/Pr/Camion/info/vente/articles/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='commandeGroupBL' src={`/Pr/Camion/commandes/BL/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='commandeGroupBS' src={`/Pr/Camion/commandes/BS/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='commandeGroupF' src={`/Pr/Camion/commandes/Facture/${CID}/${rechercheDay.start}`} />
        <FrameForPrint frameId='commandeGroupRes' src={`/Pr/Camion/commandes/Resumer/${CID}/${rechercheDay.start}`} /> */}
     </> );
}

export default CamionInfo;