import React from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { useParams } from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';
import { Button, Divider, Icon, Loader, Statistic, Tab } from 'semantic-ui-react';
import { useEffect } from 'react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Map  } from "react-leaflet";
import RoutingMachine from "./RoutingMachine";

function CamionClientData() {
    /*################[Const]###############*/
    const {CID} = useParams()
    const [clientD, setClientD] = useState([])
    const [loading , setLoading] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [position, setPosition] = useState([36.17720,9.12337])
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const panes = [
        {
            menuItem: { key: 'user', icon: 'user', content: 'Information' }, 
            render: () =><ClientCard />,
        },
        {
            menuItem: { key: 'position', icon: 'map pin', content: 'Position' }, 
            render: () =><><Tab.Pane className='border-div' attached={false} tabular={true}><PositionCard /></Tab.Pane><br /></>,
        },
        // {
        //     menuItem: { key: 'suivie', icon: 'map pin', content: 'Position' }, 
        //     render: () => <><Tab.Pane className='border-div' attached={false} tabular={true}><PositionCard /></Tab.Pane><br /></>,
        // },
    ]
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon );
    const icon = L.icon(GConf.LeafleftIconP);

    /*################[UseEffect]###############*/
    useEffect(() => {
        //get position 
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if (!position.coords.latitude) {toast.error(<><div><h5>ENTRE VOTRE POSITION Lat</h5></div></>, GConf.TostInternetGonf)}
                else if (!position.coords.longitude) {toast.error(<><div><h5>ENTRE VOTRE POSITION Lng</h5></div></>, GConf.TostInternetGonf)}
                else{
                    setMyPosition([position.coords.latitude, position.coords.longitude])
                    //setMyPosition[[555, 999]]
                    console.log({lat:position.coords.latitude, lng:position.coords.longitude})
                }
            },
            function(error) {
                toast.error(<><div><h5>ENTRE VOTRE POSITION</h5></div></>, GConf.TostInternetGonf)
            }
        );
        //client Info
        axios.post(`${GConf.ApiLink}/client/info`, {
            tag: GConf.SystemTag,
            clientId : CID
        }).then(function (response) {
            if(!response.data[0].PK) {
                toast.error('Client Introuvable !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/cl"; }, 2000)
                
            } else {
                setClientD(response.data[0])
                setPosition([response.data[0].Lat,response.data[0].Lng])
                setLoading(true) 
            }

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les info du client  </div></>, GConf.TostInternetGonf)   
              setClientD([])
              setPosition([0,0])
              setLoading(true)
            }
          });

    }, [])

    /*################[Function]###############*/
    const EditPosition = () =>{
        if (!myPosition[0]) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
        else if (!myPosition[1] ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
        else {
            setLS(true)
            axios.post(`${GConf.ApiCommandeLink}/client/uppos`, {
                tag: GConf.SystemTag,
                CID: CID,
                position: {latitude :myPosition[0], longitude: myPosition[1]} ,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Commande Enregistrer !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La commande sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                }
            });

        }       
}
    /*################[Card]###############*/
    const ClientCard = () =>{
        return (<>
            <div className="sticky-top" style={{top:'70px'}}>
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <div className="upper">
                        <div className="mcbg main-big-card"></div>
                    </div>
                    <div className="img-card-container text-center">
                        <div className="card-container">
                            <img src="https://system.anaslouma.tn/Assets/images/fourniss.png" className="rounded-circle" width="80" />                    
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                            <h4 className='mt-2'>{loading ? clientD.Name : SKLT.BarreSkl } </h4> 
                            <h6 className="text-secondary">  {loading ? <><span className="bi bi-geo-alt-fill"></span> { clientD.Adress } </>: SKLT.BarreSkl} </h6>
                            <h6 className="text-secondary"> {loading ? <><span className="bi bi-geo-fill"></span> { clientD.Gouv } </>: SKLT.BarreSkl } </h6>
                            <Divider horizontal className='text-secondary mt-4'>Matricule.F</Divider>
                            <div className='row text-center'>
                                <div className='col-12'>    
                                    {loading ?  
                                        <Statistic color='red' size='tiny'>
                                            <Statistic.Value>
                                                {clientD.Code_Fiscale} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }  
                                    
                                </div>
                            </div>
                            <Divider horizontal className='text-secondary mt-4'>Telephone</Divider>
                            <div className='row text-center'>
                                <div className='col-12 mb-3'> 
                                    {loading ?  
                                        <Statistic color='green' size='tiny'>
                                            <Statistic.Value>
                                                {clientD.Phone} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }   
                                </div>
                                
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
    const PositionCard = () =>{
        return (<>
                    <div className='p-1'>
                            <h5>Location</h5>
                            <div className='card-body'>
                                {/* <Button  onClick={EditPosition} fluid className='rounded-pill bg-system-btn ' positive>  <Icon name='map pin' /> Modifier Position <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </Button> */}
                            </div>
                            <MapContainer center={myPosition} zoom={9} scrollWheelZoom={false} className="map-height">
                                <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                
                                <RoutingMachine mypos={myPosition} clientpos={position} />
                            </MapContainer> 
                    </div>
        </>);
    }

    return ( <>
            <BackCard data={InputLinks.backCard.clInfo} />
            <br />
            <div className='container'>
                <Tab menu={{secondary: true ,className: "wrapped"}} panes={panes} />
            </div>
            </> );
}

export default CamionClientData;