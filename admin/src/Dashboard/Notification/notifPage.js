import React, { useEffect, useRef, useState } from 'react';
import { Bounce, Fade } from 'react-reveal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, Divider, Form, Icon, Input, Select, TextArea } from 'semantic-ui-react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import useGetFamilleArticle from '../Assets/Hooks/fetchArticlesFamille';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import NG from './notifGenre';
import SKLT from '../../AssetsM/usedSlk';

function NotifPage() {
    const [notificationList, setNotifList] = useState([])
    const [loading , setLoading] = useState(false)
    /* #########################[Functions]########################### */
    //useEffect
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/notifications`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            setNotifList(response.data)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setNotifList([])
              setLoading(true)
            }
        });
    }, [])

    const NotifCard = (props) => {
        return ( <>
                    <div className='card shadow-sm mb-2 p-3'>
                        <h4 className='mb-4'> <span className='badge bg-danger'> system-{props.genre}</span></h4> 
                        <div className='row '>
                            <div className='col-1 align-self-center text-center d-none d-lg-block'>
                                <span  className={`bi ${props.icon} bi-md me-2`}></span>  
                            </div>
                            <div className='col-12 col-lg-9 text-left'>
                                <h4 className='mb-1'><span  className={`bi ${props.titleIcon} me-1`}></span>  {props.title}</h4>
                                <small>{props.descr} </small>
                            </div>
                            <div className='col-12 col-lg-2 d-none d-lg-block align-self-center text-center text-secondary'>    
                                <h6><b><span  className='bi bi-alarm'></span>  {props.time}</b></h6>
                                <h6>{props.date}</h6>
                            </div>
                        </div> 
                    </div>
                </> )
    }

    return ( <>
        <h5>NOTIFICATION PAGE</h5>
        <br /> 
        <Bounce bottom>
            {loading ?  
                    <>
                    {
                    notificationList.map( (nData, index) => 
                        <NotifCard key={index}  icon={NG[nData.Genre].icon}  title={NG[nData.Genre].title} titleIcon={NG[nData.Genre].titleIcon} genre={nData.SystemTag} descr={nData.Description} date={new Date(nData.N_Date).toLocaleDateString('en-US')} time={nData.N_Time}  />
                        )
                    }
                    </>
                    : SKLT.CardList 
            }

            
            <br />
        </Bounce>
    </> );
}


export default NotifPage;