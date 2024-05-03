import React, { useEffect, useState} from 'react';
import { Button, Icon, Input , Tab, Select, Loader} from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import { NavLink } from 'react-router-dom/dist';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import franceMap from '../AssetsM/franceMap';
import SKLT from '../AssetsM/usedSlk';
import { Suspense } from 'react';
import { Badge, BottomNavigation, BottomNavigationAction, Box, CircularProgress, TextField  } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import WindowIcon from '@mui/icons-material/Window';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import HistoryIcon from '@mui/icons-material/History';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectMat from '@mui/material/Select';



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
const ParametresCard = ({userData, setUserData, logOutInput, EditUserDataFunction, delegList, setDelegList, GetDelegList, loaderState}) => {
    const [gouv ,setGouv] = useState('Souuse')
    const [deleg ,setDeleg] = useState('fddfgfd')
    const [defaultSearch, setDefaultSearch] = useState({depart:'', region:''})
    //const [delegList ,setDelegList] = useState([])
    
    const sexListe = [
        {id:1, text:'Male', value:'Male'},
        {id:2, text:'Female', value:'Female'},
    ]

    const SetGouvSelected = (value) =>{
        setDefaultSearch({...defaultSearch, depart: value })
        setGouv(value)
        const found = franceMap.Region.filter(element => element.tag === value)
        setDelegList(found)
        localStorage.setItem('SearchIn', JSON.stringify({depart:value, region:''}))
    }
    const SetDelegSelected = (value) =>{
        setDefaultSearch({...defaultSearch, region: value })
        localStorage.setItem('SearchIn', JSON.stringify({depart:defaultSearch.depart, region:value}))
    }

    return(<>
        <div className='card card-body shadow-sm mb-4 border-div'>
            <h5 className='text-secondary'>Paramétre du Prfile</h5>
            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-person-fill'></span> Nom & Prénon:</h5> */}
            <TextField id="standard-basic" label="Nom é Prenom"  size="small" className='text-secondary mb-4 mt-0'   variant="standard" value={userData.Name} onChange={(e) => setUserData({...userData, Name: e.target.value })} />
            {/* <Input icon='user' iconPosition='left' placeholder='Nom & Prénon' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Name} onChange={(e) => setUserData({...userData, Name: e.target.value })}  /> */}

            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-calendar-week'></span> Date de Naissance :</h5> */}
            <TextField id="standard-basic"  label="Date de Naissance" type='date' size="small" className='text-secondary mb-4 mt-0'   variant="standard" value={userData.BirthDay} onChange={(e) => setUserData({...userData, BirthDay: e.target.value })} />
            {/* <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.BirthDay} onChange={(e) => setUserData({...userData, BirthDay: e.target.value })}  /> */}

            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-telephone-fill'></span> Telephone:</h5> */}
            <TextField id="standard-basic" label="Numéro du telephone" size="small" className='text-secondary mb-4 mt-0'   variant="standard" value={userData.PhoneNum} onChange={(e) => setUserData({...userData, PhoneNum: e.target.value })} />
            {/* <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.PhoneNum} onChange={(e) => setUserData({...userData, PhoneNum: e.target.value })}  /> */}


            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-gender-ambiguous'></span> Sex:</h5> */}
            {/* <Select placeholder='Sex'  className='mb-3'  fluid options={sexListe} value={userData.Sex} onChange={(e, { value }) => setUserData({...userData, Sex: value })} /> */}
            <FormControl variant="standard"  className='mb-4'>
                <InputLabel id="demo-simple-select-filled-label">Sex </InputLabel>
                <SelectMat
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    placeholder={userData.Sex}
                    value={userData.Sex}
                    onChange={(e, { value }) => setUserData({...userData, Sex: value })}
                    >
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                </SelectMat>
            </FormControl>

            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt-fill'></span> Regions:</h5>
            <Select placeholder='Regions'    fluid options={franceMap.Depart} value={userData.BirthGouv} onChange={(e, { value }) => GetDelegList(value)} />
            
            <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt'></span> Departements:</h5>
            <Select placeholder='Departements' fluid className='mb-3'  value={userData.BirthDeleg} options={delegList} onChange={(e, { value }) => setUserData({...userData, BirthDeleg: value })} />


            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-key-fill'></span> Identifiant:</h5> */}
            <TextField id="standard-basic" label="Identifiant"  size="small" className='text-secondary mb-4 mt-0'   variant="standard" value={userData.Identifiant} onChange={(e) => setUserData({...userData, Identifiant: e.target.value })} />
            {/* <Input icon='key' iconPosition='left' placeholder='Identifiant' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Identifiant} onChange={(e) => setUserData({...userData, Identifiant: e.target.value })}  /> */}
            
            {/* <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-eye-slash-fill'></span> Mot de passe:</h5> */}
            <TextField id="standard-basic" label="Mot de passe"  size="small" className='text-secondary mb-4 mt-0'   variant="standard" value={userData.Password} onChange={(e) => setUserData({...userData, Password: e.target.value })} />
            {/* <Input icon='eye slash' iconPosition='left' placeholder='Mot de passe' className='w-100 border-0 shadow-sm rounded mb-3'  value={userData.Password} onChange={(e) => setUserData({...userData, Password: e.target.value })}  /> */}

            <div className='text-end'>
                <Button size='small' className='bg-success text-white rounded-pill' onClick={() => EditUserDataFunction()}> <span className='bi bi-sliders'></span> Modifier <Loader active={loaderState} size='mini' inverted inline /> </Button>
            </div>

            
        </div>
        {/* { localStorage.getItem("ProffAccount") ?  <ProSettingCard /> : <></> } */}
        <div className='card card-body mb-4 shadow-sm border-div'>
                <h5 className='text-secondary'><span className='bi bi-hand-index me-2'></span> Selectionez une Region de recherche ... : </h5>
                <div className='row'>
                    <div className='col-12 col-lg-6 mb-3'><Select placeholder='Regions'   fluid options={franceMap.Depart} value={gouv} onChange={(e, { value }) => SetGouvSelected(value)} /></div>
                    <div className='col-12 col-lg-6'><Select placeholder='Departements' fluid  value={deleg} options={delegList} onChange={(e, { value }) => SetDelegSelected(value)} /></div>
                </div>
                <br />
                <div>
                        {(GConf.defaultPos.depart != '' && GConf.defaultPos.region != '') ? <><span className='bi bi-check-circle text-success me-2'></span> <b className='text-secondary'> {GConf.defaultPos.depart} , {GConf.defaultPos.region}</b></> : <><span className='bi bi-x-circle text-danger me-2'></span>  Selectionnez Position </> }
                </div>
                
        </div>
        <div className='card card-body border-div shadow-sm mb-4 '>
            <h5 className='text-danger'>Déconnexion</h5>
            <div className='mb-4'>voulez vous vraiment déconnecter ? </div>
            <Button fluid onClick={() => logOutInput()} className='mb-3 text-white system-color' ><Icon name='log out' /> Déconnexion </Button>
        </div>
    </>)
}

function InputLandingPage() {
    /*#########################[Const]###########################*/
    const navigate = useNavigate();
    
    const [activeIndex, setActiveIndex] = useState(0)
    const [responseData, setResponseData] = useState({DemmandeListe:[], FavoriteListe:[], RequestList:[], PaymmentListe:[]})
    const [loading,setLoading] =useState(true)
    const [loaderState, setLoaderState] = useState(false)
    
    const [userData, setUserData] = useState({});
    const [delegList ,setDelegList] = useState([])
    const [value, setValue] = useState(0)
    
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
            menuItem: { key: 'parametre', content:  <b className='' ><span className='bi bi-pencil-square bi-sm'></span></b> , dir:'rtl',  className:'rounded border border-2 border-div'},
          render: () => <><Suspense fallback={<ForLazyLoading />}><ParametresCard userData={userData} setUserData={setUserData} logOutInput={logOutInput} EditUserDataFunction={EditUserDataFunction} delegList={delegList} setDelegList={setDelegList} GetDelegList={GetDelegList} loaderState={loaderState} /></Suspense> </>,
        },
    ]

    /*#########################[UseEffect]###########################*/
    useEffect(() => {
        
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
        localStorage.removeItem('SearchIn');
        localStorage.removeItem('DefaultPosition');
        localStorage.removeItem('ProffAccount');
        window.location.href = "/User";
    }
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
    /*#########################[Card]###########################*/
    const MainTopCard = () =>{
        return(<>
            <div className='card p-3 fixed-top border-0 shadow-sm-s rounded-0' style={{backgroundColor : '#f9fafb' }}>
                <div className='row'>
                    <div className='col-10 align-self-center'><h2> 
                        <NavLink exact='true' to='/'>
                            <span className='bi bi-arrow-left-short bi-md  '></span>
                            {/* <span className="badge system-color  rounded-pill"> Kallax-s.fr </span> */}
                         </NavLink>
                    </h2></div>
                    <div className='col-2 align-self-center text-end' > <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' /> </div>
                </div>
            </div>
        </>)
    }
    const AcceuilCard = () => {
        const AcceuiItemCard = (props) =>{
            return(<>
            <Slide direction="up"
                in={!loading}
                mountOnEnter unmountOnExit
            >
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
            </Slide>
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
        {/* <Grow
          in={!loading}
          style={{ transformOrigin: '0 0 0' }}
          {...(!loading ? { timeout: 1000 } : {})}
        >
            <Paper   sx={{ m: 1, width: '100%', height: 100 }} elevation={4}>
                <svg>
                <Box
                    component="polygon"
                    points="0,100 50,00, 100,100"
                    sx={{
                    fill: (theme) => theme.palette.common.white,
                    stroke: (theme) => theme.palette.divider,
                    strokeWidth: 1,
                    }}
                />
                </svg>
            </Paper>
            
        </Grow> */}
        
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
        const LinkPaneCard = (props) =>{
            return(<>
                <div className={`card p-2 btn-cursor mb-1  pt-3  text-center    border-div border-0 ${ activeIndex == props.activeI ? 'system-color-text  text-blod ': 'text-secondary' }`} onClick={ () => navigate(props.linkabale)}>
                        <h2 className='text-center notification'>
                            {/* <span className={`bi bi-${props.icon}${ activeIndex == props.activeI ? '-fill': '' } ${ activeIndex == props.activeI ? ' bi-xsma': ' bi-xsm' }`}></span> */}
                            <img src='https://assets.ansl.tn/Images/kallax/tech.png' className='img-responsive rounded-circle border' width='30px' height='30px' />
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
                    <div className='col col-lg-2'><ActivePaneCard icon='gear' activeI={2} /> </div>
                    {localStorage.getItem("ProffAccount") ? <div className='col col-lg-2'><LinkPaneCard linkabale='/Prof/L' badgeed badgeValue={responseData.DemmandeListe.length} icon='archive' activeI={4} /> </div>: <></> }
                   
            </div>
        </div>
        </>)
    }
    const LoadingMaterial = () =>{
        return (<>
            <div className='text-center'>
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
                <CircularProgress color="inherit" />
                
                </div>                     
            </>);
    }

    return ( <>
            <MainTopCard />
            <br />                
            <br />                
            <br />                
            <br />   
 
            <div className='container-fluid'>
                    
                { loading ?  <LoadingMaterial /> 
                    :
                    <Tab  
                            menu={{ secondary: true , style: {overflowX : 'auto', justifyContent: 'center', border:'none'} }} 
                            menuPosition='right' 
                            panes={panes}
                            activeIndex={activeIndex}
                            className='no-menu-tabs mt-2' 
                    />
                }
            </div>
 
            <br />
            <br />
            <br />
            <br />
            {/* <FixedBottomMenui /> */}
            <Box  className='fixed-bottom  bg-white shadow-sm' >
                <BottomNavigation
                    //showLabels
                    value={value}
                    onChange={(event, newValue) => {
                    setValue(newValue);
                    }}
                    style={{height: 70,}}
                >
                    <BottomNavigationAction  label="Liste" icon={<WindowIcon fontSize="large"  />} onClick={ () => setActiveIndex(0)} />
                    <BottomNavigationAction label="Rapide" icon={<HistoryIcon fontSize="large"  />}  onClick={ () => setActiveIndex(1)} />
                    <BottomNavigationAction label="Paramétre" icon={<SettingsSuggestOutlinedIcon fontSize="large"  />} onClick={ () => setActiveIndex(2)} />
                    <BottomNavigationAction label="Pro" icon={<Badge   color="secondary" badgeContent={responseData.DemmandeListe.length}><img src='https://assets.ansl.tn/Images/kallax/tech.png' className='img-responsive rounded-circle border' width='30px' height='30px' /></Badge>} onClick={ () => navigate('/Prof/L')} />
                </BottomNavigation>
            </Box>
        </> );
}

export default InputLandingPage;