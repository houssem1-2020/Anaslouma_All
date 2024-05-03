import React ,{useEffect, useState} from 'react';
import { Button, Icon, Input, Segment } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import { toast } from 'react-toastify';
import axios from 'axios';
import { NavLink } from 'react-router-dom/dist';
import {LoginSocialFacebook, LoginSocialGoogle} from 'reactjs-social-login'
import {FacebookLoginButton, GoogleLoginButton} from 'react-social-login-buttons'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import { useNavigate} from 'react-router-dom';
import { AppBar, Backdrop, CircularProgress, IconButton, Toolbar, Typography } from '@mui/material';

function UserLogIn() {
    /*#########################[Const]##################################*/
    const navigate = useNavigate();
    const [loginD, setLoginD] = useState([])
    const [loaderState, setLS] = useState(false)
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        const inputIsLogged = localStorage.getItem('UserIsLogged');
        if (inputIsLogged) {window.location.href = "/User/L";}
        
    });

    /*#########################[Functions]##################################*/
    const logInSystem = () =>{
        
        // localStorage.setItem('UserIsLogged', 'response.data[1]');
        // localStorage.setItem('UserData', 'JSON.stringify({Name: response.data[1] , genre:response.data[2], tag:response.data[3]})');
        // window.location.href = "/User";
        if (!loginD.Log) {toast.error("Entrer Un identifiant !", GConf.TostErrorGonf)}
        else if (!loginD.Pwd) {toast.error("Entrer Le mot DP  !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/User/LogIn`, {
                tag : GConf.SystemTag,
                LoginData : loginD,
            }).then(function (response) {
                if(response.data.length != 0) {
                    toast.success("Connecté !", GConf.TostSuucessGonf)
                        //localStorage.setItem('UserIsLogged', response.data[1]);
                        localStorage.setItem('UserIsLogged', JSON.stringify(response.data));
                        localStorage.setItem('SearchIn', JSON.stringify({depart:response.data.BirthGouv, region:response.data.BirthDeleg}))
                        if (response.data.Related_PID) {
                            localStorage.setItem('ProffAccount', JSON.stringify({PID: response.data.Related_PID, UID : response.data.UID}));
                            window.location.href = "/";
                        }  else {
                            window.location.href = "/";
                        }
                        setLS(false)
                }
                else{
                    toast.error('Cet User n\'existe pas ! ', GConf.TostSuucessGonf)
                    
                }
            })
        } 
    }

    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm-s border-0 system-color-s rounded-0 fixed-top' style={{backgroundColor : '#f9fafb' }}>
                    <NavLink exact='true' to='/'>
                    <img src='https://assets.ansl.tn/Images/favicon.ico' className='img-responsive' width='30px' heigth='30px' />
                        {/* <span className='bi bi-arrow-left bi-sm text-white'></span> */}
                    </NavLink>
                </div>
        </>)
    }

    const BottomCard = () =>{
        return(<>
                <div className='card card-body shadow-sm' style={{borderRadius:'30px 30px 0 0', backgroundColor:'#6f787d'}}>
                    <div className='row mb-0'>
                        <div className="col-lg-6 col-12 text-left align-self-center text-white ">
                            <div className="ms-3 pe-3 pt-3">
                                <h6><span className="bi bi-telephone-fill"></span> +21697913914, +33 6 56 70 89 08</h6>
                                <h6><span className="bi bi-geo-alt-fill"></span>  5, rue oberlin Schiltigheim 67300</h6>   
                            </div>   
                        </div>
                         <div className='row mt-0 text-white'>
                                <div className='col-8 align-self-center text-center'>
                                    <IconButton aria-label="delete" onClick={() => navigate('#')}> <FacebookIcon className='text-white' /></IconButton>
                                    <IconButton aria-label="delete" onClick={() => navigate('#')}> <YouTubeIcon className='text-white' /></IconButton>
                                    <IconButton aria-label="delete" onClick={() => navigate('#')}> <InstagramIcon className='text-white' /></IconButton>
                                    <IconButton aria-label="delete" onClick={() => navigate('#')}> <WhatsAppIcon className='text-white' /></IconButton>
                                    <IconButton aria-label="delete" onClick={() => navigate('#')}> <XIcon className='text-white' /></IconButton>

                                </div>
                                <div className='col-4 align-self-center text-end'>
                                    <IconButton aria-label="delete" onClick={() => navigate('/about')}> <ArrowForwardIcon className='text-white' /></IconButton>
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

             <div className='container d-flex align-items-center justify-content-center ' style={{paddingTop:'70px'}}>
                <div className='col-12 col-lg-5 mb-4'>
                <Segment padded className='sub-sys-round' style={{borderBottom:`3px solid ${GConf.themeColor}`}}>
                            <h2 className='text-cente'><Icon name='linkify' /> Connexion :</h2>
                            <br />
                            <div className='mb-3'>
                                <Input   icon='user' iconPosition='left' placeholder='Identification' className='shadow-sm w-100' onChange={(e) => setLoginD({...loginD, Log: e.target.value })}/>
                            </div>
                            <div className='mb-3'>
                                <Input  icon='key' iconPosition='left' placeholder='Mot DP' type='password' className='shadow-sm w-100' onChange={(e) => setLoginD({...loginD, Pwd: e.target.value })}/>
                            </div>
                            <div className='mb-3'>
                                <Button onClick={logInSystem}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-100'>Connextion</Button>
                            </div>
                            <br />
                            <hr />
                            <br />
                             
                                <NavLink to='/User/SignUp'   ><Button fluid size='large' className='text-white bg-info '> S'inscrire  <Icon name='arrow right' /> </Button></NavLink>
                           
                            
                            <br />
                            {/* <LoginSocialFacebook
                                className='mb-3'
                                appId='744682274298902'
                                // fieldsProfile={
                                //     'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender,user_location,user_gender,user_birthday'
                                // }
                                onResolve={(response) => {
                                    console.log(response);
                                    
                                }}
                                onReject={err => {
                                    console.log(err);
                                  }}
                            >

                                
                                <Button fluid size='large' className='text-white bg-primary '><Icon name='facebook square' /> Connexion avec Facbook </Button>
                            </LoginSocialFacebook>  */}
                            {/* <LoginSocialGoogle
                                appId='744682274298902'
                                onResolve={(response) => {
                                    console.log(response);
                                }}
                            >
                                <GoogleLoginButton />
                            </LoginSocialGoogle>  */}
                </Segment>
                <br />
                </div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loaderState}
                    onClick={() => setLS(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                
            </div>
            <BottomCard />
            
    </> );
}

export default UserLogIn;