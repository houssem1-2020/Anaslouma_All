import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-reveal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, Divider, Form, Icon, Input, Select,  Loader,  TextArea } from 'semantic-ui-react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import useGetFamilleArticle from '../Assets/Hooks/fetchArticlesFamille';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';



function SettingPage() {
    /* #########################[Const]########################### */
    let [password, setPassword] = useState({Log:'' , Pwd:''})

    /* #########################[UseEffects]########################### */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/setting`, {
            TAG: 'admin',
        })
        .then(function (response) {
            console.log(response.data)
            setPassword(response.data[0])
        }).catch((error) => {
            if(error.request) {
            
            }
          });

    }, [])

    /* #########################[Functions]########################### */
    /* #########################[Card]########################### */
    const PasswordCard = () =>{
        return(<>
                <h5 className='mb-1'>Idenbtifiant</h5>
                <Input icon='user' iconPosition='left' placeholder='Nom' value={password.Log}    fluid />
                <h5 className='mb-1 mt-2'>Mot de passe</h5>
                <Input icon='eye' iconPosition='left' placeholder='telephone' value={password.Pwd}   fluid />
                <br />
                <div className='text-end'>
                    <Button  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier <Loader inverted  inline size='tiny' className='ms-2'/></Button>
                </div>
        </>)
    }
    return ( <>
        <div className='container-fluid'>
            <div className='row mt-5'>
                <div className='col-12 col-lg-8 align-self-center mt-4 order-2 order-lg-1'>
                        <PasswordCard />
                </div> 
                <div className='col-12 col-lg-4 align-self-center text-center mb-4 order-1 order-lg-2'>
                   {/* <div className='card card-body rounded-circle shadow-sm' style={{width:'230px' , height:'230px'}}> */}
                        <img src='https://admin.anaslouma.tn/Assets/logo.jpg' className='img-responsive rounded-circle' width='200px'  height='200px' />
                    {/* </div>  */}
                </div> 
            </div>
        </div>
    </> );
}


export default SettingPage;