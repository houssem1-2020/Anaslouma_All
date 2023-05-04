import React, { useEffect, useState } from 'react';
import { Button, Divider, Icon, Input,  Header, Grid, Segment, Loader} from 'semantic-ui-react'
import GConf from '../AssetsM/generalConf';
import Bounce from 'react-reveal/Bounce';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink, useNavigate} from 'react-router-dom';

function LogIn() {
    /*#########################[Const]##################################*/
    const navigate = useNavigate();
    const [loginD, setLoginD] = useState([])
    const [loaderState, setLS] = useState(false)

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        const pidIsSet = localStorage.getItem(`Admin_Secure_key`);
        if (pidIsSet) {window.location.href = "/S";}      
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
                    localStorage.setItem(`Admin_Secure_key`, response.data[1]);
                    navigate('/')
                    setLS(false)

                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            })
        }   
    }

    return (<> 
        <div className='row m-0'>
            
            <div className='col-12  col-lg-4'></div>
            <div className='col-12  col-lg-8'>
                <div className='card-body' >
                <Bounce left>
                            <br />
                            <br />
                            <Divider horizontal className='w-login-input'>
                                <Header as='h4'>
                                    <Icon circular inverted name='user' color="yellow" />
                                </Header>
                            </Divider>

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
                                <Button onClick={logIn}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-login-input'> Connextion <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                            <br />
                            
                            
                            
                    </Bounce>
                </div>
            </div>
        </div> 
    </>);
}

export default LogIn;