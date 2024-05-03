import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
//import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import { Form , Input} from 'semantic-ui-react';
import { TextArea } from 'semantic-ui-react';
import { Select } from 'semantic-ui-react'
import { useParams } from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';
import franceMap from '../../AssetsM/franceMap';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L  from 'leaflet';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const EditCard = ({rendyVousD, setRdvData, stayOptions, myPosition, gouv, GetDelegList, delegList, deleg, setDeleg, handleLocationSelected, targetPosition, saveFunction}) =>{
    return(<>
            <div className='card card-body shadow-sm border-div mb-4' >
            <h5 className='text-secondary'><span className='bi bi-grid-3x3-gap'></span> Modifier la demande : </h5>

            <h5 className='mb-0 mt-3' > <span className='bi bi-person-x-fill'></span> Travaille Demmandeé  </h5>
            <small>  Sélectionnez le Service souhaitée </small>
            <Select style={{zIndex : 889 }} fluid placeholder={rendyVousD.reqGenre}  options={stayOptions} onChange={ (e,value) => setRdvData({...rendyVousD, Genre : value})} />

            <h5 className='mb-2 mt-3' > <span className='bi bi-calendar2'></span> Votre Location Gepgraphique  </h5>
            <Select style={{zIndex : 888 }} fluid placeholder='Selectionez Departemment' className='mb-2 shadow-sm' options={franceMap.Depart} value={gouv} onChange={(e, { value }) => GetDelegList(value)} />
            <Select style={{zIndex : 887 }} fluid placeholder='Selectionez Region ' className='shadow-sm' value={deleg} options={delegList} onChange={(e, { value }) => setDeleg(value)} />
            <br />
            <MapContainer  center={myPosition} zoom={15} scrollWheelZoom={false} className="map-height-small cursor-map-crosshair border-div"  >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventsHandler onLocationSelected={handleLocationSelected} />
                <Marker position={targetPosition}>
                    <Popup>
                        
                    </Popup>
                </Marker>
            </MapContainer>

            <h5 className='mb-2 mt-3' > <span className='bi bi-calendar2'></span>    Termine Le </h5>
            <small>date limite </small>  
            <Input className='mb-3' type='date' fluid    defaultValue={new Date(rendyVousD.Wanted_Day).toISOString().split('T')[0]} onChange={(e) => setRdvData({...rendyVousD, Wanted_Day: e.target.value })}  />                     


            <h5 className='mb-0 mt-3' > <span className='bi bi-person-x-fill'></span>  Commentaires   </h5>
            <Form className='mb-3'>
                <TextArea placeholder='Commentaires' className='font-droid'  rows={3} value={rendyVousD.Comment} onChange={ (e,value) => setRdvData({...rendyVousD, Comment:e.target.value})} />
            </Form>

            <div className='text-center mt-4 mb-3'>
                <Button className='rounded-pill bg-warning text-white' fluid onClick={saveFunction}  disabled={false}  size='large' icon  > <Icon name='save' />   Modifier     </Button>
            </div>
        </div>
            </>)
}

const MapEventsHandler = ({ onLocationSelected }) => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelected({ lat, lng });
      },
    });
  
    return null;
};

function DemmandeInfo() {
    //*#########################[Const]##################################*/
    const {RID} = useParams()
    const [camionList, setCamioList] = useState([])
    const [rendyVousD, setRdvData] = useState([])
    const [loading,setLoading] =useState(true)
    const [delegList ,setDelegList] = useState([])
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [targetPosition, setTragetPosition] = useState([36.17720,9.12337])
    const theme = useTheme();
    const [value, setValue] = useState(0);

    const stayOptions = [
        { key: '1', value: 'installation', text: 'installation'  },
        { key: '2', value: 'entretien', text: 'entretien'  },
        { key: '7', value: 'Non spécifié', text: 'Non spécifié'  },
    ]
    const [loaderState, setLS] = useState(false)
    const [gouv ,setGouv] = useState('')
    const [deleg ,setDeleg] = useState('')
    const LeafleftIcon = {
        iconUrl: require("leaflet/dist/images/position.gif"),
        iconRetinaUrl: require("leaflet/dist/images/position.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    }
    const TostErrorGonf = {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
    }
    const TostInternetGonf = {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
    }
    L.Icon.Default.mergeOptions(LeafleftIcon);

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/User/Demmande/info`, {
            RID:RID,

          })
          .then(function (response) {
            console.log(response.data)
            setRdvData(response.data[0])
            setLoading(false)
            setGouv(JSON.parse(response.data[0].Localisation).Gouv)
            //setDelegList(JSON.parse(response.data[0].Localisation).Gouv)
            setDeleg(JSON.parse(response.data[0].Localisation).Deleg)
          })
        }, [])

    /*#########################[Functions]##################################*/
    const saveFunction = () =>{
        if (!rendyVousD.Genre) {toast.error("Genre Invalide !",TostErrorGonf)}
        else if (!gouv) {toast.error("Gouv Invalide !",TostErrorGonf)}
        else if (!deleg) {toast.error("Deleg Invalide !",TostErrorGonf)}
        else if (!targetPosition[0]) {toast.error("Lat Invalide !",TostErrorGonf)}
        else if (!targetPosition[1]) {toast.error("Lng Invalide !",TostErrorGonf)}
        else if (!rendyVousD.Comment) {toast.error("Comment Invalide !",TostErrorGonf)}
         
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/list/commande/add`, {
                UID : GConf.UserData.UData.UID ,
                PID : RID,
                Localisation : {Gouv : gouv, Deleg : deleg, Lat: targetPosition[0], Lng: targetPosition[1]} ,
                commandeD : rendyVousD,
            }).then(function (response) {
                toast.success(<><div><h5> Commande Enregistreé Avec Success </h5>  </div></>,TostInternetGonf)
                //setLS(false)
                //setDisabledBtn(true)
            }).catch((error) => {
                if(error.request) {
                toast.error(<><div><h5> Erreur de connexion </h5> Esseyeez autre temps </div></>,TostInternetGonf)   
                setLS(false)
                }
            });
        } 
    }
    const GetDelegList = (value) =>{
        setGouv(value)
        const found =franceMap.Region.filter(element => element.tag === value)
        setDelegList(found)
        
    }
    const handleLocationSelected = (location) => {
        setTragetPosition([location.lat , location.lng])
        rendyVousD.targetPosition = {Lat: location.lat , Lng : location.lng}
    };
    const a11yProps = (index)  => {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
      }
    /*#########################[Component]##################################*/ 
      const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p:1 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }
      
      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };

    const DemmandeCard = (props) =>{
        return(<>
                <div className='card card-body mb-2 border-div shadow-sm '>
                    <h5 className='text-secondary'><span className='bi bi-grid-3x3-gap'></span> Info du demande : </h5>
                    <div className='text-secondary'><span className='bi bi-wrench-adjustable'></span> Genre : {props.data.reqGenre}</div>
                    <div className='text-secondary'><span className='bi bi-person-circle'></span> Nom : {props.data.Social_Name}</div>
                    <div className='text-secondary'><span className='bi bi-calendar-week'></span> Date : {new Date(props.data.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                    <div className='text-secondary'><span className='bi bi-clock'></span> Temps : {props.data.R_Time.slice(0, -3)}</div>
                    <div className='text-secondary'><span className='bi bi-geo-alt'></span> Region : {JSON.parse(props.data.Localisation).Gouv}</div>
                    <div className='text-secondary'><span className='bi bi-pin-map'></span> Depart : {JSON.parse(props.data.Localisation).Deleg}</div>
                    <div className='text-secondary'><span className='bi bi-stars'></span> Services : {props.data.Services == '[]' || props.data.Services == "" ? <></> : JSON.parse(props.data.Services).map((data,index) => <li key={index}>{props.data.Name}</li>)}</div>
                </div>
                </>)
    }
   
    

    return (  <>
        <BackCard data={InputLinks.backCard.cv}/>
        <br />

        <div className='container-fluid'>
             
                {
                    loading ? 
                    
                    SKLT.UserProfileCard
                    :
                    <>
                        {/* <DemmandeCard data={rendyVousD} />
                        {rendyVousD.State == 'W' || rendyVousD.State == 'S' ?
                            <EditCard rendyVousD={rendyVousD} setRdvData={setRdvData} stayOptions={stayOptions} myPosition={myPosition} gouv={gouv} GetDelegList={GetDelegList} delegList={delegList} deleg={deleg} setDeleg={setDeleg} handleLocationSelected={handleLocationSelected} targetPosition={targetPosition} saveFunction={saveFunction} />
                            :
                            <>Vous ne pouver pas Modifeé cette demmande </>
                        }
                        <br /> */}
                        <Box  >
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                value={value}
                                onChange={(event, newValue) => setValue(newValue)}
                                indicatorColor="secondary"
                                textColor="inherit"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                                >
                                    <Tab label="Info" {...a11yProps(0)} />
                                    <Tab label="Modifier" {...a11yProps(1)} />
                                    <Tab label="Messages" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={value}
                                onChangeIndex={(event, newValue) => setValue(newValue)}
                            >
                                <TabPanel value={value} index={0} dir={theme.direction}>
                                    <DemmandeCard data={rendyVousD} />
                                </TabPanel>
                                <TabPanel value={value} index={1} dir={theme.direction}>
                                    {rendyVousD.State == 'W' || rendyVousD.State == 'S' ?
                                        <EditCard rendyVousD={rendyVousD} setRdvData={setRdvData} stayOptions={stayOptions} myPosition={myPosition} gouv={gouv} GetDelegList={GetDelegList} delegList={delegList} deleg={deleg} setDeleg={setDeleg} handleLocationSelected={handleLocationSelected} targetPosition={targetPosition} saveFunction={saveFunction} />
                                        :
                                        <>Vous ne pouver pas Modifeé cette demmande </>
                                    }
                                </TabPanel>
                                <TabPanel value={value} index={2} dir={theme.direction}>
                                Item Three
                                </TabPanel>
                            </SwipeableViews>
                        </Box>

                    </>
            
                }
        </div>
 
    </>);
}


export default DemmandeInfo;