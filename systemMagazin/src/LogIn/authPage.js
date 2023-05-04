import React, { useEffect, useState } from 'react';
import { Button, Divider, Icon, Input,  Header, Grid, Segment} from 'semantic-ui-react'
import GConf from '../AssetsM/generalConf';
import Bounce from 'react-reveal/Bounce';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

function AuthPage() {
    /*#########################[Const]##################################*/
    const [loginD, setLoginD] = useState([])
    const [getKeyID, setGetKeyID] = useState(null)
    const [authUser, setAuthUser] = useState([])
    const [authKey, setAuthKey] = useState([])
    const [reqBtnState, setReqBtnState] = useState(false)
    const [checkBtnState, setCheckBtnState] = useState(true)
    const [redirectBtnState, setRedirectBtnState] = useState(true)
    const [position, setPosition]= useState({})

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //get position 
         // console.log(navigator.geolocation.getCurrentPosition().position.coords.latitude)
         navigator.geolocation.getCurrentPosition(
            function(position) {
                setPosition({lat:position.coords.latitude, lng:position.coords.longitude})
            },
            function(error) {
                setPosition({lat:0, lng:0})
            }
        );

        //check if user is authaurised 
        const authIsSet = localStorage.getItem(`Magazin_AuthKeyISSet`);
        if (authIsSet) {window.location.href = "/S/ma";}      
    });
    
    /*#########################[Functions]##################################*/
    const RequestAuth = () =>{
        if (!authUser) {toast.error("Entrer Votre Nom  !", GConf.TostErrorGonf)}
        else if (!position.lat) {toast.error(<><div><h5>ENTRE VOTRE POSITION</h5> Pour ouvrir le system vous devez donnez votre poisition  </div></>, GConf.TostInternetGonf)}
        else if (!position.lng) {toast.error(<><div><h5>ENTRE VOTRE POSITION</h5> Pour ouvrir le system vous devez donnez votre poisition  </div></>, GConf.TostInternetGonf)}
        else{
            axios.post(`${GConf.ApiLink}/Auth/Demande`, {
                tag : 'Magazin',
                authUser : authUser,
                device : navigator.userAgent,
                position : position
            }).then(function (response) {
                if(response.data.affectedRows == 1) {
                    toast.success("Demande Enregistré  !", GConf.TostSuucessGonf)
                    setReqBtnState(true)
                    setCheckBtnState(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    
                }
            })
        }   
    }
    const CheckAuth = () =>{
        if (!authUser) {toast.error("Entrer Votre Nom !", GConf.TostErrorGonf)}
        else if (!authKey) {toast.error("Entrer Votre Clé   !", GConf.TostErrorGonf)}
        else{
            axios.post(`${GConf.ApiLink}/Auth/Check`, {
                tag : 'Magazin',
                authUser : authUser,
                authKey : authKey,
            }).then(function (response) {
                if(response.data[0] == 'false') {
                    toast.error('Cle Incorrect Ou Invalide ', GConf.TostSuucessGonf)
                }
                else {
                    toast.success("Cle Verifier !", GConf.TostSuucessGonf)
                    setGetKeyID(response.data[1][0].PK)
                    setCheckBtnState(true)
                    setRedirectBtnState(false)
                }
            })
        }   
    }
    const RedirectToSystem = () =>{
        if (!getKeyID) {toast.error("Key Id Introuvable !", GConf.TostErrorGonf)}
        else{
            axios.post(`${GConf.ApiLink}/Auth/Invalidate`, {
                authKeyID : getKeyID,
            }).then(function (response) {
                console.log(response)
                if(response.data.affectedRows == 1) {
                    setRedirectBtnState(true)
                    localStorage.setItem(`Magazin_AuthKeyISSet`, authKey);
                    window.location.href = "/";
                }
                else{

                    toast.error('Introuvable', GConf.TostSuucessGonf)
                }
            })
        }   
    }

    /*#########################[Card]##################################*/

    return (<> 
        <div className='row'>
            
            <div className='col-12  col-lg-3'></div>
            <div className='col-12  col-lg-7'>
                <div className='card-body' >
                <Bounce left>

                            <Divider horizontal className='w-login-input'>
                                <Header as='h4'>
                                    <Icon circular inverted name='shield alternate' color="red" />
                                </Header>
                            </Divider>
                            <h2 className='text-cente'><Icon name='shield alternate' /> Authentification :</h2>
                            <div className='w-login-input'>Pour acceder au système vous devez avoir une authentification , la prodedure d'authentification se passe par 3 etape : </div>

                            <h5 className='mb-2 text-secondary '>1- Demande d'authetification de la part de l'Administrateur ( Sghairi Aymen ) </h5>
                            <div className='mb-2'>
                                <Input   icon='user' iconPosition='left' placeholder='Auth Pour ..' className='shadow-sm w-login-input ' value={authUser}  onChange={(e) => setAuthUser(e.target.value)} />
                            </div>
                            <div className='mb-5'>
                                <Button disabled={reqBtnState} onClick={RequestAuth}    className='shadow-sm bg-info text-white  w-login-input  rounded-pill'> Demande d'authetification</Button>
                            </div>

                            <h5 className='mb-2 text-secondary '>2- Après avoir obtenu votre authentification, vous la copiez ici et la vérifiez </h5>
                            <div className='mb-2'>
                                <Input   icon='key' iconPosition='left' placeholder='Clé Auth' className='shadow-sm w-login-input '  value={authKey}  onChange={(e) => setAuthKey(e.target.value)} />
                            </div>
                            <div className='mb-5'>
                                <Button disabled={checkBtnState} onClick={CheckAuth}  className='shadow-sm bg-success text-white w-login-input rounded-pill'>Verifer l'authentification</Button>
                            </div>
                            <h5 className='mb-2 text-secondary '>3- Enfin Si l'authetification est correct, vous pouvez Accéder au system   </h5>
                            <div className='mb-3'>
                                <Button disabled={redirectBtnState} onClick={RedirectToSystem}    className='shadow-sm bg-danger text-white w-login-input  rounded-pill'> Accéder au system</Button>
                            </div>
                            
                            
                    </Bounce>
                    </div>
            </div>
        </div> 
    </>);
}

export default AuthPage;