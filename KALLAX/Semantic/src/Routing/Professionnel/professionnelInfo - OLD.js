import React, { useEffect,  useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Checkbox, Icon, Input, Menu } from 'semantic-ui-react';
import { Modal } from 'semantic-ui-react';
import { Rating } from 'semantic-ui-react';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import 'swiper/css/pagination';
import { Form } from 'semantic-ui-react';
import { TextArea } from 'semantic-ui-react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate} from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';
import { Tab } from 'semantic-ui-react';
//import { io } from "socket.io-client"


const MapEventsHandler = ({ onLocationSelected }) => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelected({ lat, lng });
      },
    });
  
    return null;
};

const AddComment = ({rateValue,setRateValue,SaveRating, RatingCard}) =>{
    return(<>    
            <div className='text-center mb-4'>
                <h5 className='text-start text-secondary mb-1'>Ajoutez votre avis :</h5>
                <br />
                <Rating icon='star' onRate={(e,{ rating}) => setRateValue({ ...rateValue, rating: rating})} defaultRating={0} maxRating={5} size='huge' />
                <br />
                <br />
                <Form>
                    <TextArea placeholder='Commentaires Ici  ' className='font-droid' style={{ minHeight: 60, width:'85%' }} value={rateValue.comment} onChange={(e) => setRateValue({ ...rateValue, comment: e.target.value})} />
                </Form>
                <br />
                <Button fluid className='rounded-pill system-color text-white' size='large' content='Ajouter Avis' onClick={() => SaveRating()} />
            </div>
    </>)
}
const ActionCard = ({rating,setRating,saveFunction, rendyVousD, setRdvData, myPosition, setMyPosition, targetPosition, setTragetPosition}) => {
    const [targetIndex,setTargetIndex] = useState(0)
    let [activeIndex, setActiveIndex] = useState(0)
    let [activePIndex, setActivePIndex] = useState(0)
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    const handleLocationSelected = (location) => {
        setTragetPosition([location.lat , location.lng])
        rendyVousD.targetPosition = {Lat: location.lat , Lng : location.lng}
    };

    return(<>
        <div className='card card-body border-div mb-2 shadow-sm'>
            <h5>Sous Service  ? </h5> 
                <div className="mt-1 p-1 mb-4 d-inline"   style={{width:'100%', overflowX: 'auto', overflowY : 'hidden', whiteSpace:'nowrap'}}>
                    <Menu secondary >
                        {GConf.profSousTag['refection-charpentes'].map( (carouselData,index)=> 
                            <Menu.Item key={index} active={activeIndex == index} className='rounded-pill mb-2' onClick={ () => setActiveIndex(index)}>
                                <b> {carouselData.text} </b>
                            </Menu.Item>

                            // <span className='card p-2 rounded-pill text-center'  key={index} data={carouselData} index={index} >{carouselData.text}</span> 
                        )}
                    </Menu>
                </div>
            
            
         
            <h5 className='mb-0 mt-2'>Le montant moyenne que vouz pouvez payer ? </h5> 
            
            <div className='row'>
                        <div className='col-10'><h3 className='mb-2 mt-2 text-danger'>{rating} Euro</h3></div>
                        <div className='col-2 align-self-center'><Input type='number' size='mini' fluid value={rating} onChange={(e) => setRating(e.target.value)}/>
            </div>
            </div>
            <Input
                type='range'
                min={3}
                max={500}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            
         
            <h5>Urgence  ? </h5> 
             <div className='row'>
                <div className='col-4'>
                    <div className={`card p-2 rounded-pill text-center ${targetIndex == 1 ? 'bg-success text-white':'text-success'}`} onClick={() => setTargetIndex(1)}>normale</div>
                </div>
                <div className='col-4'>
                    <div className={`card p-2 rounded-pill text-center ${targetIndex == 2 ? 'bg-danger text-white':'text-danger'}`} onClick={() => setTargetIndex(2)}>Urgent</div>
                </div>
                <div className='col-4'>
                    <div className={`card p-2 rounded-pill text-center ${targetIndex == 3 ? 'bg-warning text-white':'text-warning'}`} onClick={() => setTargetIndex(3)}>non urgent</div>
                </div>
             </div>
            
         
            <h5>Paymment  ? </h5> 
             <div className='row'>
                <div className='col-6'>
                    <div className={`card p-2 rounded-pill text-center ${activePIndex == 1 ? 'bg-secondary text-white':'text-secondary'}`} onClick={() => setActivePIndex(1)}>Sur Place </div>
                </div>
                <div className='col-6'>
                    <div className={`card p-2 rounded-pill text-center ${activePIndex == 2 ? 'bg-secondary text-white':'text-secondary'}`} onClick={() => setActivePIndex(2)}>En Ligne</div>
                </div>
             </div>
            
        </div>
        <div className='card card-body border-div mb-2 shadow-sm'>
            <h5>Confirmation ? </h5> 
            C'est Votre position ? 
            <MapContainer  center={myPosition} zoom={15} scrollWheelZoom={false} className="map-height-demmande cursor-map-crosshair border-div mb-2"  >
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
            <Checkbox label='Accepter les conditions ' />
            <div className='text-center mt-4 mb-3'>
                <Button className='rounded-pill bg-primary text-white' fluid onClick={saveFunction}  disabled={false}  size='large' icon  > <Icon name='save' />   Enregistrer     </Button>
            </div>
            
        </div>
    </>)
}

function ArticleInfo() {
    /*#########################[Const]##################################*/
    const {tag, subTag, code} = useParams()
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    const navigate = useNavigate();
    //const socket = io.connect(GConf.soketLink)
    const [proffData, setProffData] = useState({Horaires: '[]' , Lat:7.755644917488099, Lng:48.60693300840386 }); 
    const [suivieListe, setSuivieListe] = useState([])
    const [loading, setLOD] = useState(true); 
    const [openD, setOpenD] = useState(false)
    const [rateValue,setRateValue] =useState({comment:'', rating:0})
    const [rating ,setRating] = useState(5)
    const [rendyVousD, setRdvData] = useState({Genre : subTag , Comment:'b',  Wanted_Time :'' , Services : []})
    const [loaderState, setLS] = useState(false)
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [targetPosition, setTragetPosition] = useState([36.17720,9.12337])
    const panes = [
        {
          menuItem: { key: 'action', icon: 'mouse pointer', content: 'Action' },
          render: () => <ActionCard rendyVousD={rendyVousD} setRdvData={setRdvData} rating={rating} setRating={setRating} saveFunction={saveFunction} myPosition={myPosition} setMyPosition={setMyPosition} targetPosition={targetPosition} setTragetPosition={setTragetPosition} />,
        },
        {
            menuItem: { key: 'info', icon: 'grid layout', content: 'Info' },
            render: () => <ProffSpesificData />,
          },
        {
          menuItem: { key: 'avis', icon: 'star', content: 'Avis' },
          render: () => <div className='card card-body mb-4 shadow-sm border-div '>
                            {GConf.UserData.UData.UID ? 
                                <AddComment rateValue={rateValue} setRateValue={setRateValue} SaveRating={SaveRating} RatingCard={RatingCard} />  
                                : <UserNotLogged /> 
                            }
                        </div>,
        },
        {
            menuItem: { key: 'suivie', icon: 'hand pointer', content: 'Suivie' },
            render: () => <SuivieCard />,
        },
    ]


    /* ############### UseEffect #################*/
    useEffect(() => {
        window.scrollTo(0, 0);
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                setTragetPosition([position.coords.latitude, position.coords.longitude])
                setMyPosition([position.coords.latitude, position.coords.longitude])
                 
            },
            function(error) {
                toast.error("Selectionnez un Position", GConf.TostErrorGonf)
            }
        );

        axios.post(`${GConf.ApiLink}/list/info`, {
            genre: tag,
            PID: code,
            UID : GConf.UserData.Logged ? GConf.UserData.UData.UID : false
        })
        .then(function (response) {
            if (response.data) {
                setProffData(response.data.ProfileInfo)
                setSuivieListe(response.data.DemmandeListe)
                setLOD(false)
                 
            } else {
                setLOD(false)
                toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
            }
        })

    }, [])


    /* ############### Functions #################*/
        const SaveRating = () =>{
            if (!rateValue.rating || rateValue.rating == 0 ) { toast.error("Sélectionnez la note", GConf.TostErrorGonf)} 
            else if (!rateValue.comment) { toast.error("Entrez un commentaire ", GConf.TostErrorGonf)}
            else {
 
                axios.post(`${GConf.ApiLink}/list/avis/add`, {
                    PID : code,
                    UID: GConf.UserData.UData.UID,
                    rateValue: rateValue,
                })
                .then(function (response) {
                    toast.success(<><div><h5> Avis Ajouter    </h5> </div></>, GConf.TostInternetGonf)
                }).catch((error) => {
                    if(error.request) {
                    toast.error(<><div><h5>  Probléme de connexion   </h5> </div></>, GConf.TostInternetGonf) 
                    }
                });
            }
        }
        const AddCommandeFuncCheck = () =>{
            if (!GConf.UserData.UData.UID) { setOpenD(true) }
            else { navigate(`/Commande/${tag}/${code}`) }
        }
        const saveFunction = () =>{
            if (!rendyVousD.Genre) {toast.error("Genre Invalide !", GConf.TostErrorGonf)}
            else if (!GConf.defaultPos.region) {toast.error("Gouv Invalide !", GConf.TostErrorGonf)}
            else if (!GConf.defaultPos.depart) {toast.error("Deleg Invalide !", GConf.TostErrorGonf)}
            else if (!targetPosition[0]) {toast.error("Lat Invalide !", GConf.TostErrorGonf)}
            else if (!targetPosition[1]) {toast.error("Lng Invalide !", GConf.TostErrorGonf)}
            else if (!rendyVousD.Comment) {toast.error("Comment Invalide !", GConf.TostErrorGonf)}
             
            else{
                setLS(true)
                axios.post(`${GConf.ApiLink}/list/commande/add`, {
                    UID : GConf.UserData.UData.UID ,
                    PID : code,
                    Localisation : {Gouv : GConf.defaultPos.region, Deleg : GConf.defaultPos.depart, Lat: targetPosition[0], Lng: targetPosition[1]} ,
                    commandeD : rendyVousD,
                }).then(function (response) {
                    toast.success(<><div><h5> Commande Enregistreé Avec Success </h5>  </div></>,GConf.TostInternetGonf)
                    //socket.emit('saveRequest', { UID: GConf.UserData.UData , PID: proffData });
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
        const saveFunctionOld = () =>{
           // console.log('Text')
           //SOket-io : it works cool in localhost but the problem with domaine name 
            //const [notification, setNotification] = useState({message : 'this message', toId: `${props.TAG}-${props.PID}`});
            //const [userId, setUserId] = useState(`USER-${props.UID}`);
            //const socket = io(GConf.SoketLink, { query: { userId: `USER-${props.UID}`, }, });
            //socket.emit('saveRequest', { userId, message: notification });
            //socket.emit('saveRequest', { UID: GConf.UserData.UData , PID: proffData });
            console.log('text')
        }
    /* ############### Card #################*/
        const TopCard = () =>{
                return(<>
                        <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex: 900}}>
                                <div className='row'>
                                    <div className='col-8 text-start'>
                                            <NavLink exact='true' to='/'>
                                            <span className='bi bi-arrow-left bi-sm text-white'></span>
                                            </NavLink>
                                    </div>
                                    <div className='col-4 align-self-center text-end'>   
                                        {
                                            GConf.UserData.UData.UID ? 
                                            <NavLink to='/User/L'>
                                                <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' />
                                            </NavLink>
                                            :
                                            <></>
                                        }
                                    </div>
                                </div>
                        </div>
                </>)
        }
        /* */
        const ProfDataCard = () =>{
                return(<>
                <div className='card card-body shadow-sm border-div mb-4 sticky-top' style={{top:'70px', zIndex:100}}>
                        <div className='row'>
                            <div className='col-3 align-self-center'><img src={`https://assets.ansl.tn/Images/kallax/${tag}.gif`}  className='img-responsive rounded-circle border' width='80px'  height='80px'  /></div>
                            <div className='col-9'>
                                <h5 className='mt-2 ms-4 mb-0 text-secondary text-start'><span className='bi bi-person'></span> {proffData.Social_Name} : {proffData.Specialite} </h5>
                                {/* <h5 className='mt-2 ms-4 mb-0 text-secondary text-start'><span className='bi bi-phone'></span> +33 {proffData.Phone}  </h5> */}
                                <h5 className='mt-2 ms-4 mb-0 text-secondary text-start'><span className='bi bi-geo-alt'></span> {proffData.Gouv} , {proffData.Deleg}</h5>
                                <h5 className='mt-2 ms-4 mb-0 text-secondary text-start'><span className='bi bi-diagram-3'></span>  {proffData.Experience == 0 ? 1 : proffData.Experience}  ans experience </h5>
                            </div>
                        </div>   
                        {/* <br /> */}
                        {/* <Button className='system-color bg-success text-white border-div' size='large' fluid onClick={() => AddCommandeFuncCheck()} ><span className='bi bi-calendar-week'></span> Passer Un Demmande <span className='bi bi-chevron-double-right'></span></Button>                         */}
                </div>
                </>)
        }
        /* */
        const RatingCard = () =>{
            const RatingBar = (props) => {
                return (<>
                    <div className="row">
                        <div className="col-2"><h3>{props.name}</h3></div>
                        <div className="col-8 align-self-center">
                            <div className="progress" style={{height: "5px"}}>
                                <div className="progress-bar bg-warning" role="progressbar" style={{width: `${props.value}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div> 
                        </div>
                        <div className="col-2"><small>{props.value} %</small></div>
                    </div>
                </>)
            }

            return(<>    
                <div className='row'>
                    <div className='col-12 align-self-center text-center'>
                        <h1 className='text-warning'>0</h1>
                        <Rating className='d-inline' maxRating={5} defaultRating={0} icon='star' disabled size='huge' />
                        <h6 className="pt-2">{0} </h6>
                    </div>
                    <div className='col-12'>
                        <RatingBar name={1} value={0} />
                        <RatingBar name={2} value={0} />
                        <RatingBar name={3} value={0} />
                        <RatingBar name={4} value={0} />
                        <RatingBar name={5} value={0} />
                    </div>
                </div>
            </>)
        }
        const ProffSpesificData = () =>{
            const DefaultHoraire = () =>{
                return(<>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Lundi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            <tr>
                                <th>Mardi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            <tr>
                                <th>Mercredi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            <tr>
                                <th>Jeudi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            <tr>
                                <th>Vendredi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            <tr>
                                <th>Samedi</th>
                                <td>08:00</td>
                                <td>12:00</td>
                                <td>14:00</td>
                                <td>18:00</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </>)
            }
            const AucinServiceCard = () =>{
                return(<>
                    <div className='text-center'><img src='https://assets.ansl.tn/Images/kallax/prices.svg' width='60%' height='90px' /></div>
                    <h3 className='text-center text-secondary'>aucun tarifs a afficher</h3>
                </>)
            }
            return(<>
                <div className='card card-body   border-div mb-3 ' >
                    <h5 className='text-secondary d-none'><span className='bi bi-card-heading'></span> Info Génerale</h5>
                    <div className=' card-body text-secondary d-none'>
                                        <div className="row ">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-person'></span>  </b></div>
                                            <div className='col-10'> {proffData.Social_Name} </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-telephone'></span>  </b></div>
                                            <div className='col-10'> +33 {proffData.Phone} </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-geo-alt'></span>  </b></div>
                                            <div className='col-10'> {proffData.Gouv} </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-pin-map'></span>   </b></div>
                                            <div className='col-10'> {proffData.Deleg} </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-map'></span>   </b></div>
                                            <div className='col-10'> {proffData.Adress} </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-1 h5 system-color-text'><b><span className='bi bi-diagram-3'></span>  </b></div>
                                            <div className='col-10'> {proffData.Experience == 0 ? 1 : proffData.Experience}  ans experience </div>
                                        </div>
                    </div>

                    <h5 className='text-secondary'><span className='bi bi-alarm'></span> Horire</h5>
                    <div className='card-body mb-4'>
                            <div className='table-responsive'>
                                    {JSON.parse(proffData.Horaires).length == 0 ? 
                                    <DefaultHoraire />
                                    :
                                    <table className="table">
                                        <tbody>
                                            {JSON.parse(proffData.Horaires).map((data,index) => <tr> <th>{data.day}</th> <td>{data.matin.start}</td> <td>{data.matin.end}</td> <td>{data.soir.start}</td><td>{data.soir.end}</td></tr>)}
                                        </tbody>
                                    </table>}
                            </div>
                    </div>

                    <h5 className='text-secondary d-none'><span className='bi bi-pin-map'></span> Position </h5>
                    <div className='p-2 mb-4 d-none'>
                                <MapContainer  center={proffData.Lat != 0 ? [proffData.Lat,proffData.Lng] : [48.60693300840386, 7.755644917488099]} zoom={15} scrollWheelZoom={false} style={{zIndex:88}} className="map-height cursor-map-crosshair border-div"  >
                                    <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    
                                    <Marker position={proffData.Lat != 0 ? [proffData.Lat,proffData.Lng] : [48.60693300840386,7.755644917488099]}>
                                        <Popup>
                                            
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                    </div>
                    

                    <h5 className='text-secondary'><span className='bi bi-currency-euro'></span> Tarification</h5>
                    <div className='card-body mb-4'>
                            {proffData.Services == '' ? <AucinServiceCard />
                            :
                            <>
                            {JSON.parse(proffData.Services).map((data,index) => <li key={index}>{data.Name}</li>)}
                            </>} 
                    </div>

                    <h5 className='text-secondary'><span className='bi bi-images'></span> Images </h5>
                    <div className='p-1 mb-4'>
                            <Swiper
                                    spaceBetween={30}
                                    pagination={{
                                        dynamicBullets: true,
                                    }}
                                    autoplay={true}
                                    modules={[Pagination]}
                                    className="mySwiper pb-5 mb-0"
                                >
                                        <SwiperSlide key={4}>
                                                <img src='https://assets.ansl.tn/images/kallax/bg/four.png' className='img-responsive rounded' width='100%' height='150px' /> 
                                        </SwiperSlide>
                                        <SwiperSlide key={5}>
                                                <img src='https://assets.ansl.tn/images/kallax/bg/five.png' className='img-responsive rounded ' width='100%' height='150px' /> 
                                        </SwiperSlide>
                                        <SwiperSlide key={1}>
                                                <img src='https://assets.ansl.tn/images/kallax/bg/one.jpg' className='img-responsive rounded' width='100%' height='150px' />  
                                        </SwiperSlide>
                                        <SwiperSlide key={2}>
                                                <img src='https://assets.ansl.tn/images/kallax/bg/two.jpg' className='img-responsive rounded' width='100%' height='150px' /> 
                                        </SwiperSlide>
                                        <SwiperSlide key={3}>
                                                <img src='https://assets.ansl.tn/images/kallax/bg/three.jpeg' className='img-responsive rounded' width='100%' height='150px' /> 
                                        </SwiperSlide>
                                        
                                </Swiper>
                    </div>
                    <h5 className='text-secondary'><span className='bi bi-star-half'></span> Avis</h5>
                    <div className='card-body mb-4'>
                            <RatingCard />
                    </div>
                    <h5 className='text-secondary'><span className='bi bi-chat-left-quote'></span> Commentaires</h5>
                    <div className='card-body mb-4'>
                            <div className='text-center img-gray'><img src='https://cdn.abyedh.tn/images/Search/comments.svg' width='60%' height='90px' className='img-responsive' /></div>
                            <h4 className='text-secondary text-center'> Pas de commentaire </h4>
                    </div>

                </div>
            </>)
        }
        const UserNotLogged = () =>{
            return(<>                    
                    <div className='card-body  p-2'>
                        <br />
                        <br />
                        <div className='text-center'><img src='https://cdn.abyedh.tn/images/Search/comments.svg' width='60%' height='90px' className='img-responsive' /></div>
                        <br />
                        <h5 className='text-center text-danger'>Inscrivez-vous pour pouvoir évaluer le professionnel</h5>
                    </div> 
            </>)
        }
        const SuivieCard = () =>{
            const SuivieIsEmptyCard = () =>{
                return(<>                    
                        <div className='card card-body shadow-sm border-div'  >
                            <br />
                            <br />
                            <div className='text-center'><img src='https://assets.ansl.tn/Images/kallax/old-action.svg' width='60%' height='90px' className='img-responsive' /></div>
                            <br />
                            <br />
                            <h5 className='text-center'>Vous n'avez aucun ancien opérations</h5>
                        </div> 
                </>)
            }

            return(<>
                <div>
                    {suivieListe.length == 0 ?
                        <SuivieIsEmptyCard />
                        :
                        <SuivieCardListe />
                    }
                </div>
            </>)
        }
        const SuivieCardListe = () => {
            const AcceuiItemCard = (props) =>{
                return(<>
                <div className='card card-body mb-2 shadow-sm border-div'>
                    <div className='row'>
                            <div className='col-2 aign-self-center'><img src={`https://assets.ansl.tn/Images/kallax/${props.data.Genre}.gif`}  className='img-responsive rounded-circle border' width='40px'  height='40px'  /></div>
                            <div className='col-8 aign-self-center'>
                                <h5 className='mb-1 text-secondary mt-0'>{props.data.Social_Name}</h5>
                                <small>{new Date(props.data.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} | {props.data.R_Time.slice(0, -3)}</small>
                            </div>
                            <div className='col-2'>
                                <Button className='system-color bg-success text-white rounded-circle' size='mini'  icon onClick={() => navigate(`/User/L/demmande/info`)} >  <span className='bi bi-chevron-double-right'></span></Button> 
                            </div>
                    </div>
                    <div className='card-body mb-0 pb-0'>
                        <StateCard status={props.data.State} />
                        <StateTextCard status={props.data.State} />
                    </div>
                    <div className='row'>
                            {props.data.State == 'A' ? 
                            <div className='col-12'>
                                <Button className='text-white bg-success rounded-pill ' fluid size='small'  icon onClick={() => navigate(`/User/L/Paymment/${props.data.R_ID}`)} > <span className='bi bi-trash'></span> Passer aux Paymment </Button> 
                            </div>
                            :
                            <></>}
                            
                    </div>
                </div>
                </>)
            }
            const StateCard = ({ status }) => {
                    const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
                    const statusCard = React.useCallback(() => {
                    switch(status) {
                        case 'W': return <StateCard color='warning' text='En Attent' />;  
                        case 'S': return <StateCard color='info' text='Vu' />;  
                        case 'A': return <StateCard color='success' text='Acepteé' /> ;
                        case 'R': return <StateCard color='danger' text='Refuseé' />;
    
                        case 'RT': return <StateCard color='retarder' text='Retardeé' />;
                        case 'RD': return <StateCard color='rederecter' text='Redirecteé' />;
                        case 'LV': return <StateCard color='retarder' text='Livreé' />;
                        case 'MD': return <StateCard color='redirecter' text='Modifieé' />;
                        case 'PR': return <StateCard color='redirecter' text='Pret' />;
                        case 'PI': return <StateCard color='retarder' text='Plus d info' />;
    
                        case 'T': return <StateCard color='secondary' text='Termineé' />;
                        default:  return <StateCard color='dark' text='Indefinie' />;    
                    }
                    }, [status]);
                
                    return (
                    <div className="container">
                        {statusCard()}
                    </div>
                    );
            };
            const StateTextCard = ({ status }) => {
                const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
                const statusCard = React.useCallback(() => {
                switch(status) {
                    case 'W': return <>Votre Demmande est en cours d'ecucution</>;  
                    case 'S': return <>Le Professionnel vu votre demmande </>
                    case 'A': return <>Votre Demmande a éte accapteé vous pouvez passer aux paimment</> ;
                    case 'R': return <>Demmande Refuseé Car : </>;
                    default:  return <></>;    
                }
                }, [status]);
            
                return (
                <div className="p-2 mt-2">
                    <h5 className='text-secondary'>{statusCard()}</h5>
                </div>
                );
            };
            return(<>
                    {suivieListe.map((data,index) => <AcceuiItemCard key={index} data={data} />)}
                <br />
            </>)
        }

        /* */
        const BottomCard = () =>{
            return(<>
                    <div className='card card-body shadow-sm' style={{borderRadius:'30px 30px 0 0', backgroundColor:'#6f787d'}}>
                        <div className='row'>
                            <div className="col-lg-6 col-12 text-left align-self-center text-white ">
                                <div className="p-3">
                                    <h6><span className="bi bi-telephone-fill"></span> +21697913914, +33 6 56 70 89 08</h6>
                                    <h6><span className="bi bi-geo-alt-fill"></span>  5, rue oberlin Schiltigheim 67300</h6>   
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
            <div className='container'>
                {
                    loading ?  SKLT.ProfileCard
                    :
                    <div className='row'>
                        <div className='col-12 col-lg-4'>
                            <ProfDataCard />
                        </div>
                        <div className='col-12 col-lg-8'>
                            <Tab menu={{ secondary: true, widths: panes.length , pointing: true }} panes={panes} />
                        </div>
                    </div>
                }
            </div>

            <br />
            <br />
            <BottomCard />
            
            
            <Modal
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                //dimmer= 'blurring'
                className=' m-0 p-0'  
                >
                    
                <Modal.Content    >
                        <div className='card-body mb-4'>
                            <div className='text-center'><img src='https://assets.ansl.tn/images/kallax/log-in-please.svg' width='50%' height='90px' /></div>
                            <h4>Pour pouvoir passer des demandes vous devez connecter  tout d'abord ! </h4>
                            <div className='row mt-4'>
                                <div className='col-6 text-start'><Button className='rounded-pill' onClick={() => navigate('/User/logIn')} ><span className='bi bi-box-arrow-in-left'></span> Connexion</Button></div>
                                <div className='col-6 text-end'><Button className='rounded-pill' onClick={() => navigate('/User/SignUp')} ><span className='bi bi-check-circle'></span> S'inscrire</Button></div>
                            </div>
                            
                        </div>
                </Modal.Content>
            </Modal>
        </> );
}

export default ArticleInfo;