import React ,{useEffect, useState} from 'react';
import { Button, Icon, Input, Segment } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import { toast } from 'react-toastify';
import axios from 'axios';
import { NavLink } from 'react-router-dom/dist';
import {LoginSocialFacebook, LoginSocialGoogle} from 'reactjs-social-login'
import {FacebookLoginButton, GoogleLoginButton} from 'react-social-login-buttons'

function UserLogIn() {
    /*#########################[Const]##################################*/
    const [loginD, setLoginD] = useState([])
    
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
                }
                else{
                    toast.error('Cet User n\'existe pas ! ', GConf.TostSuucessGonf)
                    
                }
            })
        } 
    }

    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm system-color rounded-0 fixed-top'>
                    <NavLink exact='true' to='/'>
                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                    </NavLink>
                </div>
        </>)
}

    return ( <>
    <TopCard />
            <br />
            <br />

             <div className='container d-flex align-items-center justify-content-center ' style={{paddingTop:'50px'}}>
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
                <br />
                <br />
                </div>
            </div>
            
    </> );
}

export default UserLogIn;