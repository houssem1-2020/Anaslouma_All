import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import TunMap from '../../AssetsM/tunMap';
import BreadCrumb from '../Assets/breadCrumb'
import { Button, Divider, Icon, Input, Statistic, Form, Loader, Select, TextArea } from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Tab } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { _ } from "gridjs-react";
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import { toast } from 'react-toastify';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import { useNavigate} from 'react-router-dom';

const EditFSCard = ({fournisseurData, setFSData, EditClient,delegList,GetDelegList,loaderState}) =>{
    return(<>
            <div className='p-1'>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Matricule Fiscale:</h5>
                            <Input icon='key' iconPosition='left' placeholder='Matricule Fiscale' className='w-100 border-0 shadow-sm rounded mb-1' disabled={true} value={fournisseurData.Four_Code_Fiscale}  onChange={(e) => setFSData({...fournisseurData, Four_Code_Fiscale: e.target.value })}/>
                        </div>
                        <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom Et Prenon :</h5>
                            <Input icon='user' iconPosition='left' placeholder='Nom Et Prenon ' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Four_Name} onChange={(e) => setFSData({...fournisseurData, Four_Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Telephone :</h5>
                            <Input icon='phone' iconPosition='left' placeholder='Telephone ' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Four_Phone} onChange={(e) => setFSData({...fournisseurData, Four_Phone: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Nom Sociale:</h5>
                            <Input icon='home' iconPosition='left' placeholder='Nom Sociale' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Four_Social_Name}  onChange={(e) => setFSData({...fournisseurData, Four_Social_Name: e.target.value })}/>
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Geolocation</h5>
                            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={fournisseurData.Four_Gouv} onChange={(e, { value }) => GetDelegList(value)} />
                            <Select placeholder='Selectionnez Delegation ' fluid value={fournisseurData.Four_Deleg} options={delegList} onChange={(e, { value }) => setFSData({...fournisseurData, Four_Deleg: value })} />
                        </div>
                        {/* <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Map:</h5>
                            <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' value={fournisseurData.Gouv} onChange={(e, data) => setFSData({...fournisseurData, Gouv: data.value })} />  
                           
                        </div> */}
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Adresse:</h5>
                            <Form>
                                <TextArea  rows="3" placeholder='designer votre article' className='w-100 shadow-sm rounded mb-3' value={fournisseurData.Four_Adress} onChange={(e) => setFSData({...fournisseurData, Four_Adress: e.target.value })}/>
                            </Form> 
                        </div>
                        <div className='text-end mb-5'>
                            <Button  onClick={EditClient}  className='text-end rounded-pill bg-system-btn ' positive>  <Icon name='save outline' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </Button>
                        </div>
                    </div>
    </>)
}
const FindInDirectory = ({inDirArticle, setInDirA,FindInDirectoryFunc, loaderState, OnKeyPressFunc,fromDirectory}) =>{
    
    return(<>
        <div className='row'>
            <div className='col-6'>
                <div className='card card-body border'>
                    <h5>Recherche Dans La Base Abyedh </h5>
                    <Input className='mb-4' placeholder='UID' onKeyPress={event => OnKeyPressFunc(event)} value={inDirArticle} onChange={(e) => setInDirA(e.target.value)} />
                    <div className='text-end'>
                        <Button  className='bg-system-btn rounded-pill' fluid onClick={() => FindInDirectoryFunc()}>   <Icon name='search' /> Recherche <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                    </div>
                </div>  
            </div>
            <div className='col-6'>
                <h5 className='text-secondary mt-1 mb-0'>Nom: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Phone: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Gouv: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Deleg: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Adresse: {fromDirectory.Name}</h5>
            </div>
            <div className='col-12 text-end'>
                <Button  className='bg-success text-white rounded-pill' onClick={() => FindInDirectoryFunc()}>   <Icon name='check' /> Verifieé <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
            </div>
        </div>
    </>)
}

function FournisseurInfo() {
        /* ############################### Const ################################*/
            const {FSID} = useParams()
            const [fournisseurData, setFSData] = useState([])
            const [position, setPosition] = useState([36.17720,9.12337])
            const [commande, setCommande] = useState([])
            const [factures, setFactures] = useState([])
            const [factureCamion, setFactureCamion] = useState([])
            const [loading , setLoading] = useState(false)
            const [inDirArticle, setInDirA] = useState();
            const [fromDirectory, setFromDir] = useState([]);
            const [loaderState, setLS] = useState(false)
            const [delegList ,setDelegList] = useState([]) 
            const panes = [
                {
                    menuItem: { key: 'reciept', icon: 'file text', content: 'Factures' }, 
                    render: () =><><TableGrid tableData={factures} columns={GConf.TableHead.clientFacture} /> </> ,
                },
                {
                    menuItem: { key: 'suivie', icon: 'map pin', content: 'Commandes' }, 
                    render: () =><><TableGrid tableData={commande} columns={GConf.TableHead.fournisseurCommande} /></>,
                },
                {
                    menuItem: { key: 'fffff', icon: 'check circle', content: 'Credit' }, 
                    render: () =><Tab.Pane className='border-div mb-4' attached={false}><FindInDirectory inDirArticle={inDirArticle}  setInDirA={setInDirA} FindInDirectoryFunc={FindInDirectoryFunc} loaderState={loaderState} OnKeyPressFunc={OnKeyPressFunc} fromDirectory={fromDirectory}/> </Tab.Pane> ,
                },
                {
                    menuItem: { key: 'edit', icon: 'edit', content: 'Modifier' }, 
                    render: () => <><Tab.Pane className='border-div' attached={false}><EditFSCard fournisseurData={fournisseurData} setFSData={setFSData} EditClient={EditClient} delegList={delegList} GetDelegList={GetDelegList}  loaderState={loaderState}/></Tab.Pane><br /></>,
                },
                {
                        menuItem: { key: 'delete', icon: 'trash alternate', content: 'Supprimer' }, 
                        render: () => <><Tab.Pane className='border-div' attached={false}><DeleteFS /></Tab.Pane><br /></>,
                },
            ]
            L.Icon.Default.mergeOptions(GConf.LeafleftIcon );
            const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
            const navigate = useNavigate();
            const NavigateFunction = (link) => {  navigate(link) }
          /* ############################### UseEffect ################################*/
            useEffect(() => {
                //client Info
                axios.post(`${GConf.ApiLink}/fournisseur/info`, {
                    tag: GConf.PID,
                    fourId : FSID
                }).then(function (response) {
                
                    if(!response.data[0].PK) {
                        toast.error('Fournisseur Introuvable !', GConf.TostSuucessGonf)
                        setTimeout(() => {  window.location.href = "/S/fs"; }, 2000)
                        
                    } else {
                        console.log(response.data)
                        setFSData(response.data[0])
                        //setPosition([response.data[0].Four_Lat,response.data[0].Four_Lng])
                        let factureTable = []
                        response.data[0].Facture.map( (getData) => factureTable.push([ getData.F_ID, getData.Name,  new Date(getData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Cam_Name, getData.Tota,
                        _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/fs/info/facture/${response.data[0].Articles_Genre}/${getData.F_ID}`)}><Icon  name='angle right' /></Button>)
            
                        ],))
                        setFactures(factureTable)

                        let commandeTable = []
                        response.data[0].commandeData.map( (getData) => commandeTable.push([ getData.A_Code, getData.Name,  getData.Qte,  getData.Qte,
                        _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/sk/info/${getData.A_Code}`)}><Icon  name='angle right' /></Button>)
            
                        ],))
                        setCommande(commandeTable)

                        setLoading(true)
                        
                    }
        
                }).catch((error) => {
                    if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les info du client  </div></>, GConf.TostInternetGonf)   
                    setFSData([])
                    setPosition([0,0])
                    setLoading(true)
                    }
                });
        
            }, [])
     
     
        /* ############################### Functions ################################*/
            const GetDelegList = (value) =>{
                setFSData({...fournisseurData, Four_Gouv: value })
                const found = TunMap.Deleg.filter(element => element.tag === value)
                setDelegList(found)
            }
            const EditClient = () =>{
                if (!fournisseurData.Code_Fiscale) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
                else if (!fournisseurData.Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
                else if (!fournisseurData.Phone) {toast.error("Phone Invalide !", GConf.TostErrorGonf)}
                else if (!fournisseurData.Social_Name) {toast.error("Nom Sociale  Invalide !", GConf.TostErrorGonf)}
                else if (!fournisseurData.Gouv) {toast.error("Gouvernorat Invalide !", GConf.TostErrorGonf)}
                else if (!fournisseurData.Adress) {toast.error("Adresee Invalide !", GConf.TostErrorGonf)}
                else{
                    setLS(true)
                    axios.post(`${GConf.ApiLink}/fournisseur/modifier`, {
                        PID : GConf.PID,
                        fournisseurData : fournisseurData,
                    }).then(function (response) {
                        if(response.data.affectedRows) {
                            toast.success("Client Modifier !", GConf.TostSuucessGonf)
                            SaveNotification('clientEdit',GConf.PID, fournisseurData)
                            setLS(false)
                        }
                        else{
                            toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                            setLS(false)
                                }
                        }).catch((error) => {
                            if(error.request) {
                            toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier le client  </div></>, GConf.TostInternetGonf) 
                            setLS(false)  
                            }
                        });
                            
                }
            }
            const DeleteFSFunc = () =>{
                    setLS(true)
                    axios.post(`${GConf.ApiLink}/fournisseur/supprimer`, {
                        PID : GConf.PID,
                        clientId : FSID,
                    }).then(function (response) {
                        if(response.data.affectedRows) {
                            toast.success("Client Supprimer !", GConf.TostSuucessGonf)
                            setLS(false)
                            setTimeout(() => {  window.location.href = "/S/fs"; }, 500)
                        }
                        else{
                            toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                            setLS(false)
                                }
                        }).catch((error) => {
                            if(error.request) {
                            toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de supprimer le client  </div></>, GConf.TostInternetGonf) 
                            setLS(false)  
                            }
                        });
            }
            const FindInDirectoryFunc = () =>{
                if (!inDirArticle) {toast.error("Entrer Un Code A Barre  !", GConf.TostErrorGonf)}
                else{
                    setLS(true)
                    axios.post(`${GConf.ApiLink}/fournisseur/checkAbyedhDb`, {
                        PID : inDirArticle,
                    }).then(function (response) {
                        if(response.data.length  != 0) {
                            toast.success("Fournisseur Existe !", GConf.TostSuucessGonf)
                            setLS(false)
                            setFSData({ ...fournisseurData, Releted_PID: response.data.PID, Code_Fiscale: response.data.Matricule_F , Gouv: response.data.Gouv,   Name: response.data.Name, Phone : response.data.Phone , Adress : response.data.Adress })
                        }
                        else{
                            toast.error('Pas De Fournisseur ', GConf.TostSuucessGonf)
                            setLS(false)
                        }
                    }).catch((error) => {
                        if(error.request) {
                            toast.error(<><div><h5>Probleme de Connextion</h5> </div></>, GConf.TostInternetGonf)   
                            setLS(false)
                        }
                        });
                    
                }
            }
            const OnKeyPressFunc = (e) => {
                if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
                    e.preventDefault();
                }   
            }
         /* ############################### Card ################################*/
            const FournisseurCard = () =>{
                return (<>
                    <div className="sticky-top" style={{top:'70px'}}>
                        <div className='card card-body shadow-sm mb-2 border-div'>
                            <div className="upper">
                                <div className="mcbg main-big-card"></div>
                            </div>
                            <div className="img-card-container text-center">
                                <div className="card-container">
                                    <img src="https://system.anaslouma.tn/Assets/images/fourniss.png" className="rounded-circle" width="80" />                    
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                    <h4 className='mt-2'>{loading ? fournisseurData.Four_Name : SKLT.BarreSkl } </h4> 
                                    <h6 className="text-secondary">  {loading ? <><span className="bi bi-geo-alt-fill"></span> { fournisseurData.Four_Adress } </>: SKLT.BarreSkl} </h6>
                                    <h6 className="text-secondary"> {loading ? <><span className="bi bi-geo-fill"></span> { fournisseurData.Four_Gouv } </>: SKLT.BarreSkl } </h6>
                                    <Divider horizontal className='text-secondary mt-4'>Matricule.F</Divider>
                                    <div className='row text-center'>
                                        <div className='col-12'>    
                                            {loading ?  
                                                <Statistic color='red' size='tiny'>
                                                    <Statistic.Value>
                                                        {fournisseurData.Four_Code_Fiscale} 
                                                    </Statistic.Value>
                                                </Statistic>
                                            : SKLT.BarreSkl }  
                                            
                                        </div>
                                    </div>
                                    <Divider horizontal className='text-secondary mt-4'>Telephone</Divider>
                                    <div className='row text-center'>
                                        <div className='col-12 mb-3'> 
                                            {loading ?  
                                                <Statistic color='green' size='tiny'>
                                                    <Statistic.Value>
                                                        {fournisseurData.Four_Phone} 
                                                    </Statistic.Value>
                                                </Statistic>
                                            : SKLT.BarreSkl }   
                                        </div>
                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </>);
            }
            const PositionCard = () =>{
                return (<>
                            <div className='p-1'>
                                    <h5>Location</h5>
                                    <MapContainer center={position} zoom={9} scrollWheelZoom={false} className="map-height">
                                        <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={position}>
                                            <Popup>
                                                
                                            </Popup>
                                        </Marker>
                                    </MapContainer> 
                            </div>
                </>);
            }
            const DeleteFS= () =>{
                return(<><h3 className="text-secondary">Voulez-Vous Vraimment Supprimer Ce Camion ?</h3> 
                <div className='row'>
                        <div className='col-9'>
                            <h5 className="text-danger text-left"><b>Lorsque Vous Supprimer Un Client : </b></h5>
                            <ul className="text-info text-left">
                            <li>le Client  ne sera pas visible dans la branche 'Clients'</li>
                            <li>Tous les factures relier a ce client peut s'endomager   </li>
                            <li>vous ne pouver pas passer ni factures ni commandes avec ce clients autremment   </li>
                            </ul>
                        </div>
                        <div className='col-lg-3 d-none d-lg-block align-self-center'>
                            <div className='text-center'>
                                    <img src='https://assets.ansl.tn/Images/usful/delete.svg' width='80%'  height='80px' /> 
                            </div> 
                        </div>
                    </div>
                <div className='text-end'>
                    <button type="submit" name="add" className="btn btn-danger rounded-pill"  onClick={DeleteFSFunc}><span className="bi bi-check"></span> Oui, Supprimer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </button>
                </div></>)
            }
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.FournisseurAdd} />
            <br />
            <div className="row">
                    <div className="col-12 col-lg-4">
                        <FournisseurCard /> 
                    </div>
                    <div className="col-12 col-lg-8 ">
                        <Tab  menu={{secondary: true, pointing: true ,className: "wrapped"}} panes={panes} />
                    </div>
            </div>
    </> );
}

export default FournisseurInfo;