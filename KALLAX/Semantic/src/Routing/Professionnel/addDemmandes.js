import React, { useEffect, useRef, useState } from 'react';

import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import { Form } from 'semantic-ui-react';
import { TextArea } from 'semantic-ui-react';
import { Loader } from 'semantic-ui-react';
import franceMap from '../../AssetsM/franceMap';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Map } from 'leaflet';
import { Button } from 'semantic-ui-react';
import { Modal } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { NavLink, useParams } from 'react-router-dom/dist';
import { useNavigate} from 'react-router-dom';

const MapEventsHandler = ({ onLocationSelected }) => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelected({ lat, lng });
      },
    });
  
    return null;
};

function AddDemmandes() {
    /* ############### Const #################*/
    let {tag, code} = useParams()
    let [loading, setLOD] = useState(true); 
    const [rendyVousD, setRdvData] = useState({ Wanted_Time :'' , Services : []})
    const [loaderState, setLS] = useState(false)
    const [gouv ,setGouv] = useState('')
    const [deleg ,setDeleg] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [targetPosition, setTragetPosition] = useState([36.17720,9.12337])
    const [searchForArticle, setSearchForArticle] = useState('')
    const [delegList ,setDelegList] = useState([])
    const [disabledSaveBtn, setDisabledBtn] = useState(false)
    const [openD, setOpenD] = useState(false)
    const navigate = useNavigate();
    const stayOptions = [
        { key: '1', value: 'installation', text: 'installation'  },
        { key: '2', value: 'entretien', text: 'entretien'  },
        { key: '7', value: 'Non spécifié', text: 'Non spécifié'  },
    ]
    
    // const TostErrorGonf = {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //     icon: "🚫"
    // }
    // const TostInternetGonf = {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //     icon: "🚫"
    // }
    // const TostSuucessGonf = {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //     icon: "🚫"
    // }
    // const LeafleftIcon = {
    //     iconUrl: require("leaflet/dist/images/position.gif"),
    //     iconRetinaUrl: require("leaflet/dist/images/position.gif"),
    //     iconSize: [10,10],
    //     shadowSize: [0,0],
    //     shadowUrl: '',
    //     shadowSize:   [0,0],
    //     iconAnchor:   [0,0],
    //     shadowAnchor: [0,0],
    //     popupAnchor:  [0,0]
    // }
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    
    /* ############### Functions #################*/
    const saveFunction = () =>{
        if (!rendyVousD.Genre) {toast.error("Genre Invalide !",GConf.TostErrorGonf)}
        else if (!gouv) {toast.error("Gouv Invalide !",GConf.TostErrorGonf)}
        else if (!deleg) {toast.error("Deleg Invalide !",GConf.TostErrorGonf)}
        else if (!targetPosition[0]) {toast.error("Lat Invalide !",GConf.TostErrorGonf)}
        else if (!targetPosition[1]) {toast.error("Lng Invalide !",GConf.TostErrorGonf)}
        else if (!rendyVousD.Comment) {toast.error("Comment Invalide !",GConf.TostErrorGonf)}
         
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/list/commande/add`, {
                UID : GConf.UserData.UData.UID ,
                PID : code,
                Localisation : {Gouv : gouv, Deleg : deleg, Lat: targetPosition[0], Lng: targetPosition[1]} ,
                commandeD : rendyVousD,
            }).then(function (response) {
                toast.success(<><div><h5> Commande Enregistreé Avec Success </h5>  </div></>,GConf.TostInternetGonf)
                //setLS(false)
                //setDisabledBtn(true)
            }).catch((error) => {
                if(error.request) {
                toast.error(<><div><h5> Erreur de connexion </h5> Esseyeez autre temps </div></>,GConf.TostInternetGonf)   
                setLS(false)
                }
            });
        } 
    }
    const GetDelegList = (value) =>{
        setGouv(value)
        const found =franceMap.Region.filter(element => element.tag === value)
        setDelegList(found)
        
    }
    const handleLocationSelected = (location) => {
        setTragetPosition([location.lat , location.lng])
        rendyVousD.targetPosition = {Lat: location.lat , Lng : location.lng}
    };
    
    /* ############### Cards #################*/
    const TopCard = () =>{
        return(<>

                <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex:900}}>
                        <div className='row'>
                            <div className='col-8 text-start'>
                                    <NavLink exact='true' to={`/Article/${tag}/${code}`}>
                                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                                    </NavLink>
                            </div>
                            <div className='col-4 align-self-center text-end'>   
                                {
                                    localStorage.getItem('UserIsLogged') ? 
                                    <NavLink to='/User/L'>
                                        <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' />
                                    </NavLink>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                </div>
                {/* <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex:900}}>
                    <NavLink exact='true' to={`/Article/${tag}/${code}`}>
                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                    </NavLink>
                </div> */}
        </>)
    }
    const BottomCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-4   ' style={{borderRadius:'30px 30px 0 0', backgroundColor:'#0d401b'}}>
                    <div className='row'>
                        <div className="col-lg-6 col-12 text-left align-self-center text-white ">
                            <div className="p-3">
                                <h6 className="this-font d-none">
                                    <b className='text-danger'> KALLAX SAS  </b> est une application de mise ene relations pour  <small className="text-warning"> VITRIER , CHAUFFAAGES , PLOMBIER </small> ...
                                     
                                </h6>
                                <br />
                                <h6><span className="bi bi-telephone-fill"></span> +21697913914, +33 6 56 70 89 08</h6>
                                <h6><span className="bi bi-geo-alt-fill"></span>  5, rue oberlin Schiltigheim 67300</h6>
                                <a href="https://www.facebook.com/profile.php?id=100074777238055s" className="text-white"><span className="bi bi-facebook "></span> KALLAX SERVICES </a>
                            </div>   
                        </div>
                        <div className="col-lg-6 col-12 align-self-center d-none">
                            <div className="p-3">
                                <iframe width="100%" height="200" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" className="rounded" 
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=7.755644917488099%2C48.60693300840386%2C7.7597540616989145%2C48.60889095107752&amp;layer=mapnik"
                                    >
                                </iframe>
 
                                <a className="btn btn-block btn-danger btn-sm" target="c_blank" href="https://www.google.com/maps/@48.607935,7.757951,602m/data=!3m1!1e3"> <span className="fa fa-map"></span> Voir Sur Google Map <span className="fa fa-angle-double-right float-right"></span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </>)
    }
    
    return ( <>
        <TopCard />
        <br />
        <br />
        <br />
        <br />
        <div className='container '>
            <div className='card card-body shadow-sm border-div'>
                <h5 className='mb-0 mt-3' > <span className='bi bi-person-x-fill'></span> Travaille Demmandeé  </h5>
                <small>  Sélectionnez le Service souhaitée </small>
                <Select style={{zIndex : 889 }} fluid placeholder=' ' options={stayOptions} onChange={ (e, { value }) => setRdvData({...rendyVousD, Genre : value})} />

                <h5 className='mb-2 mt-3' > <span className='bi bi-calendar2'></span> Votre Location Gepgraphique  </h5>
                <Select style={{zIndex : 888 }} fluid placeholder='Selectionez Departemment' className='mb-2 shadow-sm' options={franceMap.Depart} value={gouv} onChange={(e, { value }) => GetDelegList(value)} />
                <Select style={{zIndex : 887 }} fluid placeholder='Selectionez Region ' className='shadow-sm' value={deleg} options={delegList} onChange={(e, { value }) => setDeleg(value)} />
                <br />
                <MapContainer  center={myPosition} zoom={15} scrollWheelZoom={false} className="map-height-small cursor-map-crosshair border-div"  >
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEventsHandler onLocationSelected={handleLocationSelected} />
                    <Marker position={targetPosition}>
                        <Popup>
                            
                        </Popup>
                    </Marker>
                </MapContainer>

                <h5 className='mb-2 mt-3' > <span className='bi bi-calendar2'></span>    Termine Le </h5>
                <small>date limite </small>  
                <Input className='mb-3' type='date' fluid alue={rendyVousD.Wanted_Day}  defaultValue={new Date().toISOString().split('T')[0]} onChange={(e) => setRdvData({...rendyVousD, Wanted_Day: e.target.value })}  />                     


                <h5 className='mb-0 mt-3' > <span className='bi bi-person-x-fill'></span>  Commentaires   </h5>
                <Form className='mb-3'>
                    <TextArea placeholder='Commentaires' className='font-droid'  rows={3} value={rendyVousD.Comment} onChange={ (e,value) => setRdvData({...rendyVousD, Comment:e.target.value})} />
                </Form>

                <div className='text-center mt-4 mb-3'>
                    <Button className='rounded-pill bg-warning text-white' fluid onClick={saveFunction}  disabled={false}  size='large' icon  > <Icon name='save' />   Enregistrer     </Button>
                </div>
            </div> 
            <br />
            <br /> 
        </div>
        <BottomCard />
    </> );
}

export default AddDemmandes;