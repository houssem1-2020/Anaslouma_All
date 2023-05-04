import React, { useEffect, useState } from 'react';
import { Button, Divider, Icon, Input,  Header, Grid, Segment, Loader} from 'semantic-ui-react'
import GConf from '../AssetsM/generalConf';
import Bounce from 'react-reveal/Bounce';
import axios from 'axios';
import { toast } from 'react-toastify';
import {  NavLink, useNavigate} from 'react-router-dom';


function LogIn() {
    /*#########################[Const]##################################*/
    const navigate = useNavigate();
    const [loginD, setLoginD] = useState([])
    const [loaderState, setLS] = useState(false)
    let Offline = JSON.parse(localStorage.getItem("Offline"));
    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        const pidIsSet = GConf.PID
        if (pidIsSet) {window.location.href = "/S/ma";}      
    });

    /*#########################[Functions]##################################*/
    const logIn = () =>{
        if (!loginD.Log) {toast.error("Entrer Un identifiant !", GConf.TostErrorGonf)}
        else if (!loginD.Pwd) {toast.error("Entrer Le mot DP  !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/LogIn`, {
                LoginData : loginD,
            }).then(function (response) {
                if(response.data[0] == 'true') {
                    toast.success("Connecteé !", GConf.TostSuucessGonf)
                    if (!Offline) {
                        localStorage.setItem(`Magazin_Offline`, JSON.stringify({commande: [], stock: [], famille: [],   facture: [], camion:[], client:[],   articleToSave:[] , factureToSave:[],  camionToSave:[], fondCamionToSave:[], clientToSave:[]}));
                    }
                    localStorage.setItem(`Magazin_Secure_key`, response.data[1]);
                    localStorage.setItem(`Magazin_Caisse_Theme`, 'ligth');
                    localStorage.setItem('PID', response.data[1]);
                    window.location.href = "/";
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de connecter aux systeme </div></>, GConf.TostInternetGonf)   
                  setLS(false)
                }
            });
        }   
    }

    /*#########################[Card]##################################*/
    const LeftCard = (props) =>{
        return(
            <>
            <div className='col-12 col-lg-4  text-center d-none d-lg-block fixed-top ' style={{backgroundColor:props.color, height:'100vh' }}>
                {/* <h1  style={{marginTop:'50%'}} className='text-white'><img src="https://cdn.abyedh.tn/Images/main-logo.png" alt="." className="p-0" width="120px" height="120px"/></h1> */}
                {/* <h1  style={{marginTop:'30%'}} className='text-white'><img src="https://cdn.abyedh.tn/Images/main-logo.png" alt="." className="p-0" width="120px" height="120px"/></h1> */}
                <h1  style={{marginTop:'30%'}} className='text-white'><img src="https://cdn.abyedh.tn/images/ads/ptvente_shop.svg" alt="." className="p-0" width="300px" height="300px"/></h1>
            {/* <h5 className='text-white'>{GConf.SystemTag}</h5> */}
            </div>
            </>
        )
    }
    const SubSystemLink = (props) => {

        return (<>
    
            <Segment className='p-3 sub-sys-round w-login-input'>
                <NavLink exact='true' to={props.link}>
                    <Grid>
                        <Grid.Column className="align-self-center" mobile={12} tablet={12} computer={13}>
                            <div className="d-flex align-self-center ">
                                <div className="flex-shrink-0 ps-3 align-self-center">
                                <i className={`bi bi-${props.icon} bi-md`}></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-2"> {props.title}</h5>
                                    <small> {props.text} </small>
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column className="p-4 text-center align-self-center pe-4" mobile={4} tablet={4} computer={3}>
                            <i className="bi bi-arrow-right-short bi-md"></i>
                        </Grid.Column>
                    </Grid> 
                </NavLink>
            </Segment>
        </>);
    }

    return (<> 
        <LeftCard color={GConf.themeColor}/>
        <div className='row m-0'>
            <div className='col-12 col-lg-5'></div>
            <div className='col-12 col-lg-7 '>
                <div className='card-body' >
                <Bounce left>
                            <br />
                            <br />
                            <br />
                            <h2 className='text-cente'><Icon name='linkify' /> Connexion :</h2>
                            <br />
                            <div className='mb-3'>
                                <Input   icon='user' iconPosition='left' placeholder='Identification' className='shadow-sm w-login-input'  onChange={(e) => setLoginD({...loginD, Log: e.target.value })} />
                            </div>
                            <div className='mb-3'>
                                <Input  icon='key' iconPosition='left' placeholder='Mot DP' type='password' className='shadow-sm w-login-input'  onChange={(e) => setLoginD({...loginD, Pwd: e.target.value })}/>
                            </div>
                            <div className='mb-3'>
                                <Button onClick={logIn}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-login-input'><Icon name='sign in' /> Connextion <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                            <br />
                            <Divider horizontal className='w-login-input'>
                                <Header as='h4'>
                                    <Icon circular inverted name='thumbtack' color="yellow" />
                                </Header>
                            </Divider>
                            
                            <SubSystemLink title="Caisses" text="Interface Pour La Caisse" icon="pc-display-horizontal" link="/C"/>
                            <br />
                            {/* <SubSystemLink title="Camions" text="Interface Pour Les Camions" icon="truck" link="/I"/> */}
                    </Bounce>
                </div>
            </div>
        </div> 
    </>);
}

export default LogIn;