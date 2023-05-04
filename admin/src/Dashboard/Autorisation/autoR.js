import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-reveal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, Divider, Form, Icon, Input, Select, Loader, TextArea } from 'semantic-ui-react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import useGetFamilleArticle from '../Assets/Hooks/fetchArticlesFamille';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';


function AutoR() {
    /* #########################[Const]########################### */
    let [demandeList, setDemmandeList] = useState([])

    /* #########################[UseEffects]########################### */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/autorisation`, {
            TAG: 'admin',
        })
        .then(function (response) {
            console.log(response.data)
            setDemmandeList(response.data)
        }).catch((error) => {
            if(error.request) {
            
            }
          });

    }, [])

    /* #########################[Functions]########################### */
    /* #########################[Card]########################### */
    const DemmandeCard = (props) =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <div className='row'>
                        <div className='col-12 col-lg'><h3 className='text-danger'> CLE : {props.data.Auth_Key} </h3></div>
                        <div className='col-6 col-lg'>system: {props.data.System_Tag} </div>
                        <div className='col-6 col-lg'>jour: {new Date(props.data.Auth_Date).toLocaleDateString()} </div>
                        <div className='col-6 col-lg'>temps: {props.data.Auth_Time} </div>
                        <div className='col-6 col-lg'>Pour: {props.data.Auth_Name} </div>
                        
                    </div>
                </div>
        </>)
    }
    return ( <>
        <div className='container-fluid'>
            {demandeList.map( (data,index) => <DemmandeCard key={index} data={data} />)}
        </div>
    </> );
}

export default AutoR;