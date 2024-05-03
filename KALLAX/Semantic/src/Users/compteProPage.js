import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom/dist';
import { toast } from 'react-toastify';
import GConf from '../AssetsM/generalConf';
import { Input } from 'semantic-ui-react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import { Select ,Icon, Divider ,  Checkbox, Loader} from 'semantic-ui-react';
import franceMap from '../AssetsM/franceMap';
import { Modal, Tab } from 'semantic-ui-react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Map } from 'leaflet';


const Horaire = ({alwaysState, setAlwaysState, timming, setTimming, setPauseDay , SetTimmingData,UpdateTimmingData, setSelectedUpdateDay, selectedUpdateDay}) =>{
    let [addInput, setAddInput] = useState(false)
    let [dateDataToChange, setDateDataToChange] = useState({pauseDay: false, matinStart:'08:00', matinFinsh:'12:00', soirStart:'14:00', soirFinsh:'18:00'})
    const weekDays = [
        { key: 'af', value: 'Lun', text: 'Lundi' },
        { key: 'ax', value: 'Mar', text: 'Mardi' },
        { key: 'al', value: 'Mer', text: 'Mercredi' },
        { key: 'dz', value: 'Jeu', text: 'Jeudi' },
        { key: 'as', value: 'Vend', text: 'Vendredi' },
        { key: 'ad', value: 'Sam', text: 'Samedi' },
        { key: 'ao', value: 'Dim', text: 'Dimmanche' },
    ]
    const ArabificationDate = (dateName) =>{
        switch (dateName) {
            case 'Lun' : return 'Lundi' 
            break;
            case 'Mar' : return 'Mardi'
            break;
            case 'Mer' : return 'Mercredi'
            break;
            case 'Jeu' : return 'Jeudi'
            break;
            case 'Vend' : return 'Vendredi'
            break;
            case 'Sam' : return 'Samedi'
            break;
            case 'Dim' : return 'Dimanche'
            break;

            default:
                break;
        }
    }
    const DayHoraire = (props) =>{
        return(<>
                <div className={`row  mb-1 ${props.data.dayOff ? 'text-danger':''}`}>
                    <div  className='col-3 col-lg-3 m-0 p-1'>
                        <b>{ArabificationDate(props.data.day)}</b>
                    </div>
                    <div  className='col-4 col-lg-4  m-0 p-1'>
                        <small>{props.data.matin.start} - {props.data.matin.end}</small>
                    </div>
                    <div  className='col-4 col-lg-4  m-0 p-1'>
                        <small>{props.data.soir.start} - {props.data.soir.end}</small>
                    </div>
                    <div className='col-1 m-0 p-1'>
                        <span className='bi bi-pencil-square bi-xsm text-secondary' onClick={() => OpenEditTime(props.data.day)}></span>
                    </div>
                </div>
        </>)
    }
    const OpenEditTime = (value) =>{
        setSelectedUpdateDay(value)
        setAddInput(true)
    }
    const UpdateTimingFunc = () =>{
        const targetIndex = timming.findIndex(element => element.day === selectedUpdateDay)
        let copyOfHoraire = timming
        copyOfHoraire[targetIndex] = {day: selectedUpdateDay , dayOff: dateDataToChange.pauseDay , matin:{start: dateDataToChange.matinStart ,end: dateDataToChange.matinFinsh},soir:{start: dateDataToChange.soirStart,end: dateDataToChange.soirFinsh}}
        setTimming(copyOfHoraire)
        //SetTimmingData()
        setAddInput(!addInput)
    }
    return(<>
        <br />
        <div className='card-body pt-0 mt-0'>
            <div className='row'>
                <div className='col-12 col-lg-7'>
                    <div className=' '>
                        <div className='row'>
                            <div className='col-10 col-lg-9 align-self-center'> 
                                <h5 className='mb-0 text-success'>Toujour Ouvert</h5>  
                                <small>Lorsque cette fonctionnalité est activée, elle apparaîtra toujours dans un état ouvert</small>
                            </div>
                            <div className='col-2 col-lg-3  align-self-center '> 
                                <div className="form-check form-switch">
                                    <input className="form-check-input form-check-input-lg" type="checkbox"  onChange={() => setAlwaysState(!alwaysState)}  checked={alwaysState} />
                                </div>
                            </div>
                        </div>
                        <Divider />
                        {addInput ? 
                                <div className='   border-div  '>
                                    <div className='text-start'><span className='bi bi-x-circle-fill  text-danger text-secondary mb-2' onClick={() => setAddInput(!addInput)}></span></div>
                                    <h5 className='mt-0'> Est-ce {ArabificationDate(selectedUpdateDay)}  est Jour de repos ? </h5>
                                    <Select fluid options={[ { key: 'af', value: false, text: 'Nom' }, { key: 'ax', value: true, text: 'Oui' }]} onChange={(e, {value}) => setDateDataToChange({... dateDataToChange, pauseDay : value})} className='mb-3'/>
                                    <div className='row mb-3 '>
                                        <div className='col-6'><Input  type='time' size='mini'  value={dateDataToChange.matinStart}  fluid className='mb-1 w-100'  onChange={(e) => setDateDataToChange({... dateDataToChange, matinStart : e.target.value})} /></div>
                                        <div className='col-6'><Input  type='time' size="mini"  value={dateDataToChange.matinFinsh} fluid className='mb-1 w-100'  onChange={(e) => setDateDataToChange({... dateDataToChange, matinFinsh : e.target.value})}/></div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-6'><Input  type='time' size='mini'  value={dateDataToChange.soirStart}   fluid className='mb-1 w-100'  onChange={(e) => setDateDataToChange({... dateDataToChange, soirStart : e.target.value})} /></div>
                                        <div className='col-6'><Input  type='time' size="mini"  value={dateDataToChange.soirFinsh}  fluid className='mb-1 w-100'  onChange={(e) => setDateDataToChange({... dateDataToChange, soirFinsh : e.target.value})}/></div>
                                    </div>
                                    <Button size='mini'     className='rounded-pill    font-droid' onClick={() => UpdateTimingFunc()} fluid  >   <Icon name='time' /> Ajuster l'heure de  {ArabificationDate(selectedUpdateDay)}  </Button>
                                </div>

                        :
                                <>
                                    <div className='row text-secondary mb-2'>
                                        <div  className='col-4 col-lg-4'> <b>Jour</b> </div>
                                        <div  className='col-4 col-lg-4'> <small>Matin</small> </div>
                                        <div  className='col-4 col-lg-4'> <small>Soir</small> </div>
                                    </div>
                                    
                                    {
                                        timming.map( (data,index) => <DayHoraire key={index} data={data} />)
                                    }
                                </>
                        }
                        
                    </div>
                </div>
                <div className='col-12 col-lg-5 d-none'>
                    <div className='card card-body border-div'>
                        <h5>Choisissez un jour pour modifier l'heure</h5>
                        <Select options={weekDays} onChange={(e, { value }) => setSelectedUpdateDay(value)} className='mb-3'/>
                        <div className='row mb-3 '>
                            <div className='col-6'><Input  type='time' size='mini'  value={timming.find(obj => obj.day === selectedUpdateDay).matin.start}  fluid className='mb-1 w-100'  onChange={(e) => SetTimmingData(selectedUpdateDay,'matin','start',e.target.value)} /></div>
                            <div className='col-6'><Input  type='time' size="mini"  value={timming.find(obj => obj.day === selectedUpdateDay).matin.end} fluid className='mb-1 w-100'  onChange={(e) => SetTimmingData(selectedUpdateDay,'matin','end',e.target.value)}/></div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col-6'><Input  type='time' size='mini'  value={timming.find(obj => obj.day === selectedUpdateDay).soir.start}   fluid className='mb-1 w-100'  onChange={(e) => SetTimmingData(selectedUpdateDay,'soir','start',e.target.value)} /></div>
                            <div className='col-6'><Input  type='time' size="mini"  value={timming.find(obj => obj.day === selectedUpdateDay).soir.end}  fluid className='mb-1 w-100'  onChange={(e) => SetTimmingData(selectedUpdateDay,'soir','end',e.target.value)}/></div>
                        </div>
                        <div className='row mb-3'>
                            <div className='col-2 text-end'>
                                <div className="form-check form-switch">
                                    <input className="form-check-input form-check-input-lg" type="checkbox" checked={timming.find(obj => obj.day === selectedUpdateDay).dayOff}   onChange={() => setPauseDay(selectedUpdateDay,selectedUpdateDay.dayOff)}   />
                                </div>
                            </div>
                            <div className='col-10'>Jour de repos ?</div>
                        </div>
                        
                        <Button size='mini'     className='rounded-pill    font-droid' onClick={() => UpdateTimmingData()} fluid  >   <Icon name='time' /> تعديل  </Button>
                    </div>
                </div>
            </div>
            
        </div>
    </>)
}
const EnterCard = ({articleNow, setArticleNow, disabledSaveBtn, subscriptionData, AddArticleToList}) =>{
    
    return (<>
        <div className='card-body mt-0'>
            <div className='row mb-3'>
                <div className='col-12 align-self-center text-secondary'><h5>Nombre de services enregistrés   : {subscriptionData.Services ? subscriptionData.Services.length : 0}  </h5></div>
                {/* <div className='col-4 align-self-center text-start'></div> */}
            </div>
            <Input icon='pin'   placeholder='Nom du Service' value={articleNow.Name}  onChange={ (e) => setArticleNow({...articleNow, Name: e.target.value })} size="small" iconPosition='left'   fluid className='mb-1' />
            <Input icon='comment alternate'     value={articleNow.Qte}   onChange={ (e) => setArticleNow({...articleNow, Qte: e.target.value })} size="small" iconPosition='left' placeholder='Description'  fluid className='mb-1' />
            <br />
            <Button disabled={disabledSaveBtn}  fluid className='rounded-pill' size='small' color='blue' onClick={AddArticleToList}>  <Icon name='edit outline' className='ms-2' /> Ajouter  </Button>
                
        </div>
    </>)
}
const CommandeCard = ({subscriptionData, setSubscriptionData,   disabledSaveBtn, tag, loaderState}) =>{
    /* Const */
    const [articleNow, setArticleNow] = useState({PK: 1 , Name:'', Qte: ''})
    const PannierPannes = [
        {
            menuItem: { key: 'enter',   content:  <span> <span className='bi bi-1-circle  bi-sm me-2 ms-2 ' style={{color :GConf.themeColor}}></span>   </span> },
            render: () => <EnterCard articleNow={articleNow} setArticleNow={setArticleNow} disabledSaveBtn={disabledSaveBtn} AddArticleToList={AddArticleToList} subscriptionData={subscriptionData} />,
        },
        {
            menuItem: { key: 'article',   content:  <span > <span className='bi bi-2-circle bi-sm  me-2 ms-2' style={{color :GConf.themeColor}}></span>   </span>  },
            render: () => <ArticleListCard />,
        },
    ]
    const Livraisonoptions = [
        { key: '1', value: 'INTIGO', text: 'INTIGO ', image: { src: 'https://foodealz.com/wp-content/uploads/2020/04/intigo-1-300x145-1.png', avatar: true } },
        { key: '2', value: 'Yassir', text: 'Yassir ', image: { src: 'https://foodealz.com/wp-content/uploads/2020/04/yassir.png', avatar: true } },
        { key: '3', value: 'Farm Trust', text: 'Farm Trust ', image: { src: 'https://foodealz.com/wp-content/uploads/2020/04/farmtrust.png', avatar: true } },
        { key: '4', value: 'Founashop', text: 'Founashop', image: { src: 'https://foodealz.com/wp-content/uploads/2020/04/founa-shop.png', avatar: true } },
        { key: '5', value: 'Joy s', text: 'Joy’s', image: { src: 'https://foodealz.com/wp-content/uploads/2020/04/28070452_400909117034010_1865031699315847664_o-300x300-1.jpg', avatar: true } },
      ]
    /* Function  */
    const AddArticleToList = () =>{
        if (articleNow.Name == '') { toast.error(" Entrez nom du service    !", GConf.TostErrorGonf) } 
        else if (articleNow.Qte == '') { toast.error(" Entrez Tarif      !", GConf.TostErrorGonf) } 
        else {
             
            subscriptionData.Services.push(articleNow)
            setArticleNow({PK: subscriptionData.Services.length + 1 , Name:'', Qte: ''})
        }
        
    }
    const DeleteFromUpdateList = (value) =>{
        const searchObject= subscriptionData.Services.findIndex((article) => article.A_Code == value);
        subscriptionData.Services.splice(searchObject, 1);
        let resteServices = subscriptionData.Services;
        setSubscriptionData({...subscriptionData, Services: resteServices})
    }

    /* Card */
    const ArticleListCard = () =>{
        const ListCard = (props) =>{
            return(<>   
                        <div className='card shadow-sm p-2   border-div ps-4 mb-2'>
                            <div className='row'>
                             
                                <div className='col-7 col-lg-9 text-start  align-self-center'>
                                     {props.dataA.Name} 
                                </div>
                                <div className='col-3 col-lg-9 text-start  align-self-center'>
                                     {props.dataA.Qte} Eur 
                                </div>
                                <div className='col-2 align-self-center'><Button icon="trash alternate" className='rounded-circle p-2 text-danger bg-white ' disabled={disabledSaveBtn} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)}></Button></div>
                            </div>
                        </div>
                    </>)
        }
        return (<>
        <div className='card-body mt-2'>
            {subscriptionData.Services.length != 0 ? 
             <>{subscriptionData.Services.map( (val, index) => <ListCard key={index} dataA={val}/>)}</>
             :
             <div className='text-center'>
                <span className='bi bi-list-columns-reverse bi-lg'></span>
            </div>
             
            }
        </div>
        </>)
    }
    
 
        
    return(<>
        <Tab menu={{secondary: true, color: 'grey' , widths: PannierPannes.length , pointing: true, selected: { backgroundColor: GConf.themeColor },  style:{justifyContent: 'right',} }} className='yes-menu-tabs' panes={PannierPannes} /> 
    </>)
}
const MapEventsHandler = ({ onLocationSelected }) => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelected({ lat, lng });
      },
    });
  
    return null;
};


function CompteProPage() {
    const [subscriptionData, setSubscriptionData] = useState({Related_UID: GConf.UserData.UData.UID , Services:[]});
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [targetPosition, setTragetPosition] = useState([36.17720,9.12337])
    const [delegList ,setDelegList] = useState([])
    const [disabledSaveBtn, setDisabledBtn] = useState(false)
    
    const [selectedUpdateDay , setSelectedUpdateDay] = useState('Lun')
    const [alwaysState , setAlwaysState] = useState(false)
    const [timming, setTimming] = useState([{day:"Lun",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Mar",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Mer",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Jeu",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Vend",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Sam",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}},{day:"Dim",dayOff:false,matin:{start:"08:00",end:"12:00"},soir:{start:"14:00",end:"18:00"}}])
    const [test , setTest] = useState(10)
    
    const [okayForCondition , setOkayForCondition] = useState(false)
    
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    const sexListe = [
        {id:1,  value:'Plombier',  text:'Plombier' },
        {id:2,  value:'Électricien',  text:'Électricien' },
        {id:3,  value:'Serrurier',  text:'Serrurier' },
        {id:3,  value:'Vitrier',  text:'Vitrier' },
        {id:3,  value:'Chauffagiste',  text:'Chauffagiste' },
        {id:3,  value:'Électroménager',  text:'Électroménager' },
        {id:3,  value:'Jardinier',  text:'Jardinier' },
        {id:3,  value:'Couvreur',  text:'Couvreur' },
        {id:3,  value:'Menuisier',  text:'Menuisier' },

    ]

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    /* ############### Functions #################*/
    const GetDelegList = (value) =>{
        setSubscriptionData({...subscriptionData, Gouv: value })
        const found = franceMap.Region.filter(element => element.tag === value)
        setDelegList(found) 
    }  
    const handleLocationSelected = (location) => {
        setTragetPosition([location.lat , location.lng])
       // rendyVousD.targetPosition = {Lat: location.lat , Lng : location.lng}
    }
    
    const SetTimmingData = (day,time,genre,value) => {
        const targetIndex = timming.findIndex(element => element.day === day)
        let copyOfHoraire = timming

        if (time == 'matin') {
            if (genre == 'start') {
                copyOfHoraire[targetIndex].matin.start = value
                setTimming(copyOfHoraire)
            } else {
                copyOfHoraire[targetIndex].matin.end = value
                setTimming(copyOfHoraire)
            }
        } else {
            if (genre == 'start') {
                copyOfHoraire[targetIndex].soir.start = value
                setTimming(copyOfHoraire)
            } else {
                copyOfHoraire[targetIndex].soir.end = value
                setTimming(copyOfHoraire)
            }
        }

    }
    const UpdateTimmingData = (day,time,genre,value) => {
        //setTimming(...timming)
        setTest(Math.random())
        toast.success("", GConf.TostAddedToTimming)

    }  
    const setPauseDay = (day,state) =>{
        const targetIndex = timming.findIndex(element => element.day === day)
        let copyOfHoraire = timming
        copyOfHoraire[targetIndex].dayOff = !state
        setTimming(copyOfHoraire)
        setTest(Math.random())
    }
    
    const SignUpFunc = (event) => {
        console.log(targetPosition)
        if (!subscriptionData.Related_UID) {toast.error("Related_UID Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Social_Name) {toast.error("Social_Name Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Genre) {toast.error("Genre Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Specialite) {toast.error("Specialite Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Gouv) {toast.error("Gouv Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Deleg) {toast.error("Deleg Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Phone) {toast.error("Phone Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Adress) {toast.error("Adress Invalide !", GConf.TostErrorGonf)}
        else if (!subscriptionData.Services || subscriptionData.Services.length == 0) {toast.error("Services Invalide !", GConf.TostErrorGonf)}
         
        else if (!okayForCondition) {toast.error("Acceptez les condition  Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            //setSaveBtnState(true)
            axios.post(`${GConf.ApiLink}/User/Sign-up/professionnel`, {
                horaireData : timming,
                //alwaysOpen : alwaysState,
                position : targetPosition,
                subscriptionData : subscriptionData ,
            }).then(function (response) {
                if(response.data.PID) {
                    toast.success("Proffestionnel Enregistreé  !", GConf.TostSuucessGonf)
                    setLS(false)
                    localStorage.setItem('ProffAccount', JSON.stringify({PID : response.data.PID , UID : subscriptionData.Related_UID , Social_Name: subscriptionData.Social_Name, Phone :subscriptionData.Phone ,    Gouv:subscriptionData.Gouv ,  Deleg:subscriptionData.Deleg , Genre:subscriptionData.Genre , Specialite :subscriptionData.Specialite  }));
                    window.location.href = "/User";
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                    setSaveBtnState(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> L'article sera enregistrer sue votre ordinateur </div></>, GConf.TostInternetGonf)   
                   
                   
                  setLS(false)
                }
              });
            
        }
        
    } 

    /* ############### Cards #################*/
    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex : 900 }}>
                    <NavLink exact='true' to='/'>
                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                    </NavLink>
                </div>
        </>)
    }
    const BtnCard = () =>{
        return(<>
            
            <div className='  card-body   mb-3 border-div'>
             
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                        <div className='text-secondary'>
                            <ul>
                                <li>  Le processus de finalisation de l'inscription peut prendre jusqu'à 15 heures pour vérifier les informations indiquées. Vous pouvez confirmer le processus à partir de la page de suivi</li>
                                <li>  Chaque abonné bénéficie d'une version miniature et gratuite du système pour recevoir les commandes et communiquer avec les clients. </li>
                                <li> <span className='bi bi-exclamation-triangle-fill text-danger'></span> Toute demande d'inscription contenant des informations fausses ou trompeuses sera automatiquement annulée</li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 align-self-center'>
                            <div className='row mb-3'>
                                <div className='col-2 text-end'>
                                    <Checkbox
                                        onChange={(e, data) => setOkayForCondition(data.checked)}
                                        checked={okayForCondition}
                                    />
                                </div>
                                <div className='col-8 text-end'>D'ACCORD </div>
                            </div>   
                            
                            <Button   disabled={saveBtnState} icon className='rounded-pill  text-white font-droid' onClick={SignUpFunc} fluid style={{backgroundColor:GConf.themeColor}}>   <Icon name='world' /> Inscription  <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
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
        <div className='container-fluid'>
            <div className='mb-4 card card-body shadow-sm border-div'>
                <div className='row'>
                        
                        <div className='col-3 align-self-center'>
                            <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='50px' height='50px' />
                        </div>
                        <div className='col-9 text-start align-self-center'>
                            <h5 className='mb-1 mt-0'>Le Propriétaire du compte : </h5>
                            <h5 className='mb-1 mt-0'>{GConf.UserData.UData.Name} </h5>
                        </div>
                </div>  
            </div>

            <div className='card card-body  shadow-sm border-div mb-4'>
                
                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-ui-checks-grid'> </span> Quel Est votre Métier  ? </h5>
                <Select placeholder='votre Métier '  className='mb-3'  fluid options={sexListe} value={subscriptionData.Genre} onChange={(e, { value }) => setSubscriptionData({...subscriptionData, Genre: value })} />

                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-shield-slash-fill'> </span> Quel Est votre Specialité  ? </h5>
                <Select placeholder='votre Specialité'  className='mb-3'  fluid options={sexListe} value={subscriptionData.Specialite} onChange={(e, { value }) => setSubscriptionData({...subscriptionData, Specialite: value })} />


                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-stars'> </span> Quel Est votre Nom Sociale :</h5>
                <Input icon='user' iconPosition='left' placeholder='Nom & Prénon' className='w-100 border-0 shadow-sm rounded mb-3'  value={subscriptionData.Social_Name} onChange={(e) => setSubscriptionData({...subscriptionData, Social_Name: e.target.value })}  />

                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-telephone-fill'> </span> Quel Est votre Telephone Professtionnel:</h5>
                <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={subscriptionData.Phone} onChange={(e) => setSubscriptionData({...subscriptionData, Phone: e.target.value })}  />

                
                <h5 className='mb-1 mt-2 text-secondary'> <span className='bi bi-pin-map'> </span> Où se trouve ton travaille :</h5>
                <Select style={{zIndex : 888 }} placeholder='Regions'   fluid options={franceMap.Depart} value={subscriptionData.gouv} onChange={(e, { value }) => GetDelegList(value)} />
                
                <h5 className='mb-1 mt-2 text-secondary'> <span className='bi bi-geo-alt'> </span> Dans Quel Départements :</h5>
                <Select style={{zIndex : 887 }} placeholder='Departements' fluid  value={subscriptionData.deleg} options={delegList} onChange={(e, { value }) => setSubscriptionData({...subscriptionData, Deleg: value })} />

                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-map'> </span> Quel Est votre Adresse :</h5>
                <Input icon='map' iconPosition='left' placeholder='Adresse ' className='w-100 border-0 shadow-sm rounded mb-3'  value={subscriptionData.Adress} onChange={(e) => setSubscriptionData({...subscriptionData, Adress: e.target.value })}  />


                <h5 className='mb-1 mt-2 text-secondary'> <span className='bi bi-geo-fill'> </span> Sélectionnez la position sur la carte :</h5>
                <MapContainer  center={myPosition} zoom={15} scrollWheelZoom={false} className="map-height-small cursor-map-crosshair border-div mb-3"  >
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
                
                <br />
                <h5 className='mb-0 mt-2 text-secondary'><span className='bi bi-clock-history'> </span> Quel Est votre Horaire de Travaille:</h5>
                <Horaire alwaysState={alwaysState} setAlwaysState={setAlwaysState} timming={timming} setTimming={setTimming} setPauseDay={setPauseDay} SetTimmingData={SetTimmingData} setSelectedUpdateDay={setSelectedUpdateDay} selectedUpdateDay={selectedUpdateDay} UpdateTimmingData={UpdateTimmingData} />
                
                <h5 className='mb-3 mt-2 text-secondary'><span className='bi bi-currency-euro'> </span> Entrez Vos Tarifs  :</h5>
                <CommandeCard subscriptionData={subscriptionData} setSubscriptionData={setSubscriptionData}   disabledSaveBtn={disabledSaveBtn} tag={'docteur'} loaderState={loaderState} /> 
                
                <br />
                <br />
                <br />
                <h5 className='mb-1 mt-2 text-secondary'> <span className='bi bi-geo-alt'> </span> La dernière etape  :</h5>
                <BtnCard />
                {/* <div className='mb-4 mt-4'>
                    <Button onClick={SignUpFunc}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-100'> S'inscrire </Button>
                </div> */}
                <Button className='rounded-pill mb-2 mt-3' fluid style={{backgroundColor:'#f0b000', color : 'white'}} size='tiny' onClick={() => localStorage.setItem(`ProffAccount`, '924484298498')}> Cree Un compte Professtionnel </Button>
            </div>
            <br />

    </div>
 </> );
}

export default CompteProPage;