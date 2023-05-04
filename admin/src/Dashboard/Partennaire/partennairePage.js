import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-reveal';
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

function PartennairePage() {
    /* #########################[Const]########################### */
    let [partList, setPartenaireList] = useState([])

    /* #########################[UseEffects]########################### */
        useEffect(() => {
            axios.post(`${GConf.ApiLink}/partennaires`, {
                TAG: 'admin',
            })
            .then(function (response) {
                setPartenaireList(response.data)
            }).catch((error) => {
                if(error.request) {
                
                }
            });

        }, [])
    /* #########################[Card]########################### */
    const PartennaireCard = (props) =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <div className='row'>
                        <div className='col-12 col-lg'><h3 className='text-danger'> <span className='badge bg-warning'>{props.data.DataB}</span> </h3></div>
                        <div className='col-12 col-lg  mb-2'> <h2>{props.data.Partenaire} </h2></div>
                        <div className='col-6 col-lg'>ID: {props.data.LogIn} </div>
                        <div className='col-6 col-lg'>Mot de Passe : {props.data.PWD} </div>                        
                    </div>
                </div>
        </>)
    }
    return ( <>
        <div className='container-fluid'>
            {partList.map( (data,index) => <PartennaireCard key={index} data={data} />)}
        </div>
    </> );
}


export default PartennairePage;