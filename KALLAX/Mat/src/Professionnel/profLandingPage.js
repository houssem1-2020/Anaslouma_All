import React, { useEffect, useState} from 'react';
import { Button, Icon, Input , Tab, Select, Modal, Loader} from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import { NavLink } from 'react-router-dom/dist';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom/dist';
import franceMap from '../AssetsM/franceMap';
import SKLT from '../AssetsM/usedSlk';
import { Suspense } from 'react';
import TableGrid from './Assets/tableGrid';
import { _ } from 'gridjs-react';
import { CardActionArea } from '@mui/material';
//import { io } from "socket.io-client"

const ProSettingCard = () =>{
    return(<>
    <h5><span className='bi bi-sliders'> </span> Paramétre deu compte professionnel : </h5>
    <div className="list-group shadow-sm mb-4 border-div">
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/info' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: 'red' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-grid-fill bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Info Génerale </b>
                                <br />
                                <small className="text-secondary">Paramétre Info Générale </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div>
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/photo' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: 'green' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-images bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Photos </b>
                                <br />
                                <small className="text-secondary">Paramétre Photos </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div>
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/horaire' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: 'blue' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-stopwatch bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Horaires </b>
                                <br />
                                <small className="text-secondary">Paramétre Horaires </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div> 
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/position' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: 'purple' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-map bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Positions </b>
                                <br />
                                <small className="text-secondary">Paramétre Positions </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div>
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/tarif' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: '#adb519' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-currency-euro bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Tarification </b>
                                <br />
                                <small className="text-secondary">Paramétre des Tarifs </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div>
            <div className="list-group-item list-group-item-action">
                <Link to='/Prof/L/Parametre/finance' className="stretched-link"></Link>
                <div className="row p-2">
                    <div className="col-10 align-self-center text-left">
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className='rounded-circle text-white m-0'  style={{width:45 , height:45, backgroundColor: '#404040' , textAlign:'center', paddingTop:'25%'}}><span className={`bi bi-currency-exchange bi-sm`} ></span></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <b>Finnaciéres </b>
                                <br />
                                <small className="text-secondary">Paramétre Finnaciéres </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                </div>
            </div>
    </div>
    </>)
}
const ForLazyLoading = () =>{
    return (<>
            <br />            
            <br />            
            <br />
            <div className="loader-container-small">
              <div className="loader-small"></div>
            </div>          
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />            
            <br />                       
        </>);
}
const ParametresCard = ({userData, setUserData, logOutInput, EditUserDataFunction, delegList, GetDelegList, loaderState}) => {
    const sexListe = [
        {id:1, text:'Male', value:'Male'},
        {id:2, text:'Female', value:'Female'},
    ]


    return(<>
        <div className='card card-body shadow-sm mb-4 border-div'>
            <h5 className='text-secondary'>Paramétre du Prfile</h5>
            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-person-fill'></span> Nom & Prénon:</h5>
            <Input icon='user' iconPosition='left' placeholder='Nom & Prénon' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Name} onChange={(e) => setUserData({...userData, Name: e.target.value })}  />

            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-calendar-week'></span> Date de Naissance :</h5>
            <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.BirthDay} onChange={(e) => setUserData({...userData, BirthDay: e.target.value })}  />

            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-telephone-fill'></span> Telephone:</h5>
            <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.PhoneNum} onChange={(e) => setUserData({...userData, PhoneNum: e.target.value })}  />


            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-gender-ambiguous'></span> Sex:</h5>
            <Select placeholder='Sex'  className='mb-3'  fluid options={sexListe} value={userData.Sex} onChange={(e, { value }) => setUserData({...userData, Sex: value })} />

            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt-fill'></span> Regions:</h5>
            <Select placeholder='Regions'    fluid options={franceMap.Depart} value={userData.BirthGouv} onChange={(e, { value }) => GetDelegList(value)} />
            
            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt'></span> Departements:</h5>
            <Select placeholder='Departements' fluid className='mb-3'  value={userData.BirthDeleg} options={delegList} onChange={(e, { value }) => setUserData({...userData, BirthDeleg: value })} />


            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-key-fill'></span> Identifiant:</h5>
            <Input icon='key' iconPosition='left' placeholder='Identifiant' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Identifiant} onChange={(e) => setUserData({...userData, Identifiant: e.target.value })}  />
            
            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-eye-slash-fill'></span> Mot de passe:</h5>
            <Input icon='eye slash' iconPosition='left' placeholder='Mot de passe' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Password} onChange={(e) => setUserData({...userData, Password: e.target.value })}  />

            <div className='text-end'>
                <Button size='small' className='bg-success text-white rounded-pill' onClick={() => EditUserDataFunction()}> <span className='bi bi-sliders'></span> Modifier <Loader active={loaderState} size='mini' inverted inline /> </Button>
            </div>

            
        </div>
        { localStorage.getItem("ProffAccount") ?  <ProSettingCard /> : <></> }
        <div className='card card-body border-div shadow-sm mb-4 '>
            <h5 className='text-danger'>Déconnexion</h5>
            <div className='mb-4'>voulez vous vraiment déconnecter ? </div>
            <Button fluid onClick={() => logOutInput()} className='mb-3 text-white system-color' ><Icon name='log out' /> Déconnexion </Button>
        </div>
    </>)
}
const AcceptActionCard = ({accepterComment, setAccepterComment, selectedDemmande, UpdateDemmandeState}) => {
    return(<>
        <h4>Voulez vous acceptez Cette Dammnde  ! </h4>
         <Input type='text' className='mb-3' icon='comment' iconPosition='left' placeholder='Ajouter Commentaire' fluid onChange={(e) => setAccepterComment(e.target.value)} />
        <Button className='rounded-pill bg-success text-white' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'A', 'Accepter_Comment', accepterComment)} >Accepter le demande </Button>
    </>)
}
const ReatardActionCard = ({retarderDate, setRetarderDate, selectedDemmande, UpdateDemmandeState}) => {
    return(<>
        <h4>Entre la date de retardemment :  ! </h4>
        <Input fluid type='date' value={retarderDate} onChange={(e) => setRetarderDate(e.target.value)} />
        <br />
        <Button className='rounded-pill mt-2 bg-warning text-white text-center' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'RD', 'Retarder_Vers', retarderDate)} >Retarder la Demande </Button>
    </>)
}
const RejectActionCard = ({rejectCause, setRejectCause, selectedDemmande, UpdateDemmandeState}) => {
    const rejectionList = [
        {id:1, text:'Calendrier Pleinne', value:'Calendrier Pleinne'},
        {id:2, text:'Non Specialteé', value:'Non Specialteé'}
    ]
    return(<>
        <h4>Pourquoi voulez vous refuseé cette demmande ? </h4>
        <Select placeholder='Selectionnez un raison' fluid options={rejectionList} onChange={(e, { value }) => setRejectCause(value)} />
        <br />
        <Button className='rounded-pill bg-danger text-white mt-2 text-center' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'R', 'Refuser_Cause', rejectCause)} > Refusez Demande </Button>
    </>)
}

function InputLandingPage() {
    /*#########################[Const]###########################*/
    //const socket = io.connect(GConf.soketLink)
    const navigate = useNavigate();
    
    const [activeIndex, setActiveIndex] = useState(0)
    const [responseData, setResponseData] = useState({DemmandeListe:[], FavoriteListe:[], RequestList:[], PaymmentListe:[]})
    const [loading,setLoading] =useState(true)

    const [selectedAction , setSelectedAction] = useState('')
    const [selectedDemmande , setSelectedDemmande] = useState('')
    const [rejectCause , setRejectCause] = useState('')
    const [accepterComment , setAccepterComment] = useState('')
    const [retarderDate , setRetarderDate] = useState(new Date().toISOString().split('T')[0])
    
    const [openD, setOpenD] = useState(false)
    const [loaderState, setLoaderState] = useState(false)
    
    const [userData, setUserData] = useState({});
    const [delegList ,setDelegList] = useState([])
     
    
    const panes = [
        {
            menuItem: { key: 'acceuil', content:  <b className=''><span className='bi bi-grid-3x3-gap-fill bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div' },
            render: () =><><Suspense fallback={<ForLazyLoading />}><AcceuilCard /></Suspense>  </>,
        },
        {
            menuItem: { key: 'favorit', content:  <b className='' ><span className='bi bi-view-list bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div'},
            render: () =><><Suspense fallback={<ForLazyLoading />}><FavoriteCard /></Suspense></> ,
        },
        {
            menuItem: { key: 'demmande', content:  <b className='' ><span className='bi bi-pencil-square bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div'},
          render: () => <><Suspense fallback={<ForLazyLoading />}><DemmandesCard /></Suspense> </>,
        },
        {
            menuItem: { key: 'wallet', content:  <b className='' ><span className='bi bi-pencil-square bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div'},
          render: () => <><Suspense fallback={<ForLazyLoading />}><WalletCard /></Suspense>  </>,
        },
        {
            menuItem: { key: 'parametre', content:  <b className='' ><span className='bi bi-pencil-square bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div'},
          render: () => <><Suspense fallback={<ForLazyLoading />}><ParametresCard userData={userData} setUserData={setUserData} logOutInput={logOutInput} EditUserDataFunction={EditUserDataFunction} delegList={delegList} GetDelegList={GetDelegList} loaderState={loaderState} /></Suspense> </>,
        },
    ]

    /*#########################[UseEffect]###########################*/
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.post(`${GConf.ApiLink}/User/Landing`, {
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
            //console.log(response.data)
            if (!response.data) {
                  toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
                  setLoading(false)
            } else {
                setResponseData(response.data)
                setUserData(response.data.UserData[0])
                setLoading(false)
            }
          })
        
    }, [])

    /*#########################[Function]###########################*/
    const logOutInput = () =>{    
        localStorage.removeItem('UserIsLogged');
        localStorage.removeItem('ProffAccount');
        window.location.href = "/User";
    }
    /* */
    const OpenPaymmentFunc = (RidValue) =>{
        axios.post(`${GConf.ApiLink}/User/paymment`, {
            RID : RidValue,
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
              console.log(response.data)
              window.location = response.data.url
          })
    }
    const OpenActionModal = (RIDS,value) =>{
        setSelectedDemmande(RIDS)
        setSelectedAction(value)
        setOpenD(true)
    }
    const UpdateDemmandeState = (RIDValue,StateToUPD, columToUpdate, valueToUpdate) =>{
        axios.post(`${GConf.ApiLink}/User/Demmande/Edit`, {
            RID : RIDValue,
            updateData : StateToUPD,
            suppData : {columToUpdate: columToUpdate, valueToUpdate: valueToUpdate}

          })
          .then(function (response) {
              console.log(response.data)
              setOpenD(false)
              //window.location = response.data.url
          })
    }
    /** */
    const PaymmentFunc = () =>{
        axios.post(`${GConf.ApiLink}/User/paymment/creat-bank-account`, {
            RID : 1456985425

          })
          .then(function (response) {
              console.log(response.data)
              //window.location = response.data.url
          })
    }
    const GenerateTableData = () => {
        let rendredListe = []
        responseData.PaymmentListe.map( (getData) => rendredListe.push([
            getData.Name,
            new Date(getData.Pay_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Pay_Time.slice(0, -3),
            getData.Pay_Ammount,             
            _(<Button className='rounded-circle bg-danger text-white' icon size='mini' onClick={ (e) => alert(`/S/sk/info/${getData.R_ID}`)}> <Icon  name='expand arrows alternate' /></Button>),
          ],))
          return(rendredListe)
    }
    const CalculatePayValue = () => {
        let totalAmount = 0;
        for (let i = 0; i < responseData.PaymmentListe.length; i++) {
            totalAmount += responseData.PaymmentListe[i].Pay_Ammount;
          }
        return totalAmount 
    }
    /* */
    const GetDelegList = (value) =>{
        setUserData({...userData, BirthGouv: value })
        const found = franceMap.Region.filter(element => element.tag === value)
        setDelegList(found) 
    }
    const EditUserDataFunction = () =>{
        setLoaderState(true)
        axios.post(`${GConf.ApiLink}/User/Edit-info`, {
            UID : GConf.UserData.UData.UID,
            updateData : userData

          })
          .then(function (response) {
            toast.success(<><div><h5> Info Modifeé Avec Success </h5>  </div></>,GConf.TostInternetGonf)
            setLoaderState(false)  
          })
    }
    const saveFunction = () =>{
        // console.log('Text')
        //SOket-io : it works cool in localhost but the problem with domaine name 
         //const [notification, setNotification] = useState({message : 'this message', toId: `${props.TAG}-${props.PID}`});
         //const [userId, setUserId] = useState(`USER-${props.UID}`);
         //const socket = io(GConf.SoketLink, { query: { userId: `USER-${props.UID}`, }, });
         //socket.emit('saveRequest', { userId, message: notification });
         //socket.emit('responseUser', { UID: {UID:654591546345900} , PID: GConf.ProfData.UData });
         console.log('text')
     }

    /*#########################[Card]###########################*/
    const MainTopCard = () =>{
        return(<>
            <div className='card p-3 fixed-top  border-0 shadow-sm-s rounded-0' style={{backgroundColor : '#f9fafb' }}>
                <div className='row'>
                    <div className='col-10 align-self-center'><h2> 
                        <NavLink exact='true' to='/User/L'>
                            <span className='bi bi-arrow-left-short bi-md  '></span>
                            {/* <span className="badge system-color  rounded-pill"> Kallax-s.fr </span> */}
                         </NavLink>
                    </h2></div>
                    <div className='col-2 align-self-center text-end' > 
                        <NavLink to='/User/L'>
                            <img src='https://assets.ansl.tn/Images/kallax/tech.png' className='img-responsive rounded-circle border' width='30px' height='30px' />
                        </NavLink>
                         
                        </div>
                </div>
            </div>
        </>)
    }
    /*  */
    const AcceuilCard = () => {
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
                            <Button className='system-color bg-success text-white rounded-circle' size='mini'  icon onClick={() => navigate(`/User/L/demmande/info/${props.data.reqID}`)} >  <span className='bi bi-chevron-double-right'></span></Button> 
                        </div>
                </div>
                <div className='card-body mb-0 pb-0'>
                    <div className='row'>
                        <div className='col-6 text-start'><StateCard status={props.data.State} /></div>
                        <div className='col-6 text-end'>{props.data.Pay_Ammount ?  <span className={`badge bg-info`}> Payéé </span> :  <></> }</div>
                    </div>
                    
                    <StateTextCard status={props.data.State} />
                </div>
                 
                <StateActionCard status={props.data.State} dataSelected={props.data}   />
                 
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
                    case 'RD': return <StateCard color='primary' text='Redirecteé' />;

                     
                    default:  return <StateCard color='dark' text='Indefinie' />;    
                }
                }, [status]);
            
                return (
                <div className="container">
                    {statusCard()}
                </div>
                );
        }
        const StateTextCard = ({ status }) => {
            const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
            const statusCard = React.useCallback(() => {
            switch(status) {
                case 'W': return <>Votre demande est en cours d'examination</>;  
                case 'S': return <>Le destinataire reçoit votre demande </>
                case 'A': return <>Votre Demande a éte acceptez vous pouvez passer aux paiement </> ;
                case 'R': return <>Demande Refuseé Car : </>;
                case 'RD': return <>Demande Retarder Vers : </>;
                default:  return <></>;    
            }
            }, [status]);
        
            return (
            <div className="p-2 mt-2">
                <h5 className='text-secondary'>{statusCard()}</h5>
            </div>
            );
        }
        const StateActionCard = ({ status , dataSelected }) => {
             
            const statusCard = React.useCallback(() => {
            switch(status) {
                case 'A': return <div className='col-12'>
                                    {dataSelected.Pay_Ammount ?  <></> : <Button className='text-white bg-success rounded-pill ' fluid size='small'  icon onClick={() => OpenPaymmentFunc(dataSelected.R_ID)} > <span className='bi bi-trash'></span> Passer aux Paymment </Button> } 
                                 </div>;  
                case 'S': return <>  </>
                case 'W': return <>  </> ;
                case 'R': return <>  </>;
                default:  return <></>;    
            }
            }, [status]);
        
            return (
            <div className="">
                <h5 className='text-secondary'>{statusCard()}</h5>
            </div>
            );
        }
        return(<>
                {responseData.RequestList.map((data,index) => <AcceuiItemCard key={index} data={data} />)}
            <br />
        </>)
    }
    const FavoriteCard = () => {
        const FavItemCard = (props) =>{
            return(<>
            <div className='card card-body mb-2 shadow-sm border-div'>
                <div className='row'>
                        <div className='col-2 aign-self-center'><img src={`https://assets.ansl.tn/Images/kallax/${props.data.Genre}.gif`}  className='img-responsive rounded-circle border' width='40px'  height='40px'  /></div>
                        <div className='col-8 aign-self-center'>
                            <h5 className='mb-1 text-secondary mt-0'>{props.data.Name}</h5>
                            <small> {props.data.Gouv} , {props.data.Deleg} </small>
                        </div>
                        <div className='col-2 align-self-center'>
                            <Button className='bg-secondary text-white rounded-circle' size='mini'  icon onClick={() => navigate(`/Article/${props.data.Genre}/${props.data.PID}`)} >  <span className='bi bi-chevron-double-right'></span></Button> 
                        </div>
                </div>
            </div>
            </>)
        }
        return(<>
            {responseData.FavoriteListe.map((data,index) => <FavItemCard key={index} data={data} />)}
            <br />
        </>)
    }
    /* */
    
    const DemmandesCard = () => {
        const DemmandeItemCard = (props) =>{
            return(<>
            <div className='card card-body mb-2 shadow-sm border-div'>
                <div className='row'>
                        <div className='col-2 aign-self-center'><img src={`https://assets.ansl.tn/Images/kallax/user.gif`}  className='img-responsive rounded-circle border' width='40px'  height='40px'  /></div>
                        <div className='col-8 aign-self-center'>
                            <h5 className='mb-1 text-secondary mt-0'>{props.data.Name} </h5>
                            <small className='d-flex'> {new Date(props.data.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} | {props.data.R_Time.slice(0, -3)} </small> 
                        </div>
                        <div className='col-2'>
                            <Button className='bg-white text-success border rounded-circle' size='mini'  icon onClick={() => navigate(`/User/L/demmande/action/${props.data.R_ID}`)} >  <span className='bi bi-chevron-double-right'></span></Button> 
                        </div>
                </div>
                <div className='card-body '>
                    <StateCard status={props.data.State} />
                    <div className='text-secondary mt-3'> <span className='bi bi-star'></span> Genre  : {props.data.Genre} </div>
                    <div className='text-secondary'><span className='bi bi-calendar'></span> Date voulu  : {new Date(props.data.Wanted_Day).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                    <div className='text-secondary'><span className='bi bi-map'></span> Localisation   : {JSON.parse(props.data.Localisation).Gouv} </div>
                </div>
                {props.data.Pay_Ammount ? <span>Action confirmeé est Payeé avec Succeé</span>
                :
                <div className='row'>
                        <div className='col-4 '>
                            <Button className=' text-success bg-transparent d-flex ' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`A`)} > <span className='bi bi-check'></span> Accepteé </Button> 
                        </div>
                        <div className='col-4 '>
                            <Button className=' text-primary bg-transparent d-flex' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`RD`)} > <span className='bi bi-arrow-clockwise'></span> Retardeé </Button> 
                        </div>
                        <div className='col-4 '>
                            <Button className=' text-danger bg-transparent d-flex' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`R`)} > <span className='bi bi-x'></span> Annuleé </Button> 
                        </div>  
                </div>
                }
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
                case 'RD': return <StateCard color='primary' text='Redirecteé' />;

                case 'RT': return <StateCard color='retarder' text='Retardeé' />;
                
                case 'LV': return <StateCard color='retarder' text='Livreé' />;
                case 'MD': return <StateCard color='redirecter' text='Modifieé' />;
                case 'PR': return <StateCard color='redirecter' text='Pret' />;
                case 'PI': return <StateCard color='retarder' text='Plus d info' />;

                case 'T': return <StateCard color='secondary' text='Termineé' />;
                default:  return <StateCard color='dark' text='Indefinie' />;    
            }
            }, [status]);
        
            return (
            <div className='mb-0'>
                {statusCard()}
            </div>
            );
        }
    
        return(<>
            {responseData.DemmandeListe.map((data,index) => <DemmandeItemCard key={index} data={data} />)}
            <br />
        </>)
    }
    /* */
    const WalletCard = () =>{
        const PasserPaimmentCard = () => {
            return(<>
                <div className='card card-body mb-2 shadow-sm border-div'>
                    <h5 className='text-secondary mb-2'> votre sold est : </h5>
                        <h1 className='text-center text-secondary mb-2 mt-2'>{CalculatePayValue()} <span className='bi bi-currency-euro'></span></h1>
                </div>

                 
                <br />
                <h5 className='text-info'>Cliquer Sur le bouton pour avoir votre argent  : </h5>
                <ul>
                    <li>l'opération peut prendre quelque heurs  </li>
                    <li>le versement s'effectué une seul fois par jour  </li>
                    <li>Une fois que l'opération est réalisée, il est impossible de l'annuler.  </li>
                </ul>
                <Button className='bg-success text-white' fluid onClick={() => PaymmentFunc() } ><Icon name='payment' />Avoir votre  argent </Button>
                <br />
                <div className=''>
                    <h5 className='text-secondary mb-1'>Liste des operation payeé : </h5>
                    <TableGrid tableData={GenerateTableData()} columns={['Nom','Date', 'Temps', 'Valeur','voir']}  />
                </div>

            </>)
        }
        const FinishPaimmentDataCard = () => {
            return(<>
            Pour terùminer le paimment vous devez avoir un cimpote stripe ou un compte bancaire <br />
            entre l IBAN bancaire !
            </>)
        }
        return(<>
            <div className='card card-body shadow-sm border-div mb-4'>
                {userData.Bank_Account == '' ? <FinishPaimmentDataCard /> : <PasserPaimmentCard /> }
            </div>
        </>)
    }
    
    /* */
    const FixedBottomMenui = () =>{
        const ActivePaneCard = (props) =>{
            return(<>
                <div className={`card p-2 btn-cursor mb-1  pt-3  text-center    border-div border-0 ${ activeIndex == props.activeI ? 'system-color-text  text-blod ': 'text-secondary' }`} onClick={ () => setActiveIndex(props.activeI)}>
                        <h2 className='text-center notification'>
                            <span className={`bi bi-${props.icon}${ activeIndex == props.activeI ? '-fill': '' } ${ activeIndex == props.activeI ? ' bi-xsma': ' bi-xsm' }`}></span>
                            {props.badgeed ? <div className={`rounded-circle badged`}>{props.badgeValue}</div>  : <></>} 
                        </h2> 
                        
                </div>
            </>)
        }

        return(<>
        <div className='card fixed-bottom rounded-0 card-body'>
            <div className='row justify-content-center  ' >
                    <div className='col col-lg-2'><ActivePaneCard icon='grid' activeI={0} /> </div>
                    <div className='col col-lg-2'><ActivePaneCard icon='heart' activeI={1} /> </div>
                    {localStorage.getItem("ProffAccount") ? <div className='col col-lg-2'><ActivePaneCard  badgeed badgeValue={responseData.DemmandeListe.length} icon='archive' activeI={2} /> </div>: <></> }
                    {localStorage.getItem("ProffAccount") ? <div className='col col-lg-2'><ActivePaneCard icon='wallet' activeI={3} /> </div>: <></> }
                    <div className='col col-lg-2'><ActivePaneCard icon='gear' activeI={4} /> </div>
                   
            </div>
        </div>
        </>)
    }


    return ( <>
            <MainTopCard />
            <br />                
            <br />                
            <br />                
            <br />   
 
            <div className='container-fluid'>
                <div className='row'>
                        <div className='col-6' onClick={() => navigate('menu/demmande/Liste')}>
                        <CardActionArea className='border-div  mb-3'>
                            <div className='card card-body  mb-0 border-div text-secondary text-center'>
                                <h3 className='bi bi-cart4 bi-lg mb-1 system-color-text'></h3>
                                <h5 className='mt-0'>Demandes</h5>
                            </div>
                        </ CardActionArea>
                        </div>
                        <div className='col-6' onClick={() => navigate('menu/calendrier')}>
                            <CardActionArea className='border-div  mb-3'>
                                <div className='card card-body mb-0 border-div text-secondary text-center'>
                                    <h3 className='bi bi-calendar-week bi-lg mb-1 system-color-text'></h3>
                                    <h5 className='mt-0'>Calendrier</h5>
                                </div>
                            </ CardActionArea>
                        </div>
                        <div className='col-6' onClick={() => navigate('menu/Paymment')}>
                            <CardActionArea className='border-div  mb-3'>
                                <div className='card card-body  mb-0 border-div text-secondary text-center'>
                                    <h3 className='bi bi-wallet bi-lg mb-1 system-color-text'></h3>
                                    <h5 className='mt-0'>Paymment</h5>
                                </div>
                        </ CardActionArea>
                        </div>
                        <div className='col-6' onClick={() => navigate('menu/Communaute')}>
                            <CardActionArea className='border-div  mb-3'>
                                <div className='card card-body  mb-0 border-div text-secondary text-center'>
                                    <h3 className='bi bi-people bi-lg mb-1 system-color-text'></h3>
                                    <h5 className='mt-0'>Communauté</h5>
                                </div>
                            </ CardActionArea>
                        </div>
                </div> 
                <ProSettingCard />
                <br />
 
  
                {/* { loading ?  SKLT.UserProfileCard
                    :
                    <Tab  
                            menu={{ secondary: true , style: {overflowX : 'auto', justifyContent: 'center', border:'none'} }} 
                            menuPosition='right' 
                            panes={panes}
                            activeIndex={activeIndex}
                            className='no-menu-tabs mt-2' 
                    />
                } */}
            </div>
 
           {/* <br />
            <br />
            <br />
            <br />
             <FixedBottomMenui /> */}
            
            
            <Modal
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                dimmer= 'blurring'
                className=' m-0 p-0'  
                >
                    
                <Modal.Content    >
                        
                        <div className='card-body mb-4'>
                            {selectedAction == 'A' ? <AcceptActionCard accepterComment={accepterComment} setAccepterComment={setAccepterComment} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                            {selectedAction == 'R' ? <RejectActionCard rejectCause={rejectCause} setRejectCause={setRejectCause} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                            {selectedAction == 'RD' ? <ReatardActionCard retarderDate={retarderDate} setRetarderDate={setRetarderDate} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                        </div>
                </Modal.Content>
            </Modal>

        </> );
}

export default InputLandingPage;