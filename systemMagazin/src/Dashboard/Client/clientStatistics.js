import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import BreadCrumb from '../Assets/breadCrumb';
import { Select, Tab } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import TunisiaMapSVG from './tunMapSvg2';
import TunMObject from './tunisMapObject'
function ClientStatistics() {
     /* ############################### Const ################################*/
    const [centerPosition, setCenterPosition] = useState([36.17720,9.12337])
    const [clientsPositions, setClientsPositions] = useState([])
    const [selectedGou, setSG] = useState('Tunis')
    const panes = [
        {
            menuItem: { key: 'suivie', icon: 'home', content: 'Genreale' }, 
            render: () =><GeneralStatCard /> ,
        },
        {
            menuItem: { key: 'commande', icon: 'group', content: 'Client' }, 
            render: () =><ClientListCard />,
        },
        {
            menuItem: { key: 'home', icon: 'barcode', content: 'Vente' }, 
            render: () => <VenteStatCard />,
        },
    ]
    const GouvPropD = {
        Tunis:{color:'#88a4bc',value:'0'},
        Sousse:{color:'#88a4bc',value:'0'},
        Kairouan:{color:'#88a4bc',value:'0'},
        Kasserine:{color:'#88a4bc',value:'0'},
        Gabes:{color:'#88a4bc',value:'0'},
        Gafsa:{color:'#88a4bc',value:'0'},
        Sidi_Bouzid:{color:'#88a4bc',value:'0'},
        Sfax:{color:'#88a4bc',value:'0'},
        Siliana:{color:'#88a4bc',value:'0'},
        Mahdia:{color:'#88a4bc',value:'0'},
        Monastir:{color:'#88a4bc',value:'0'},
        Jendouba:{color:'#88a4bc',value:'0'},
        Nabeul:{color:'#88a4bc',value:'0'},
        Zaghouan:{color:'#88a4bc',value:'0'},
        Bizerte:{color:'#88a4bc',value:'0'},
        Ben_Arous:{color:'#88a4bc',value:'0'},
        Beja:{color:'#88a4bc',value:'0'},
        Ariana:{color:'#88a4bc',value:'0'},
        Tozeur:{color:'#88a4bc',value:'0'},
        Kef:{color:'#88a4bc',value:'0'},
        Medenine:{color:'#88a4bc',value:'0'},
        Kebili:{color:'#88a4bc',value:'0'},
        Tataouine:{color:'#88a4bc',value:'0'},
    }
    const [GouvProp, setGouProp] = useState(GouvPropD)
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon );

     /* ############################### UseEffect ################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/client`)
        .then(function (response) {
            setClientsPositions(response.data)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger la map </div></>, GConf.TostInternetGonf)   
            }
          });
    }, [])

    /* ############################### Function ################################*/
    const GetSelectedClients = (value)=>{
        axios.post(`${GConf.ApiLink}/client/position`,{
            gouv : value
        })
        .then(function (response) {
            setClientsPositions(response.data)
            console.log(response.data)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger les position client  </div></>, GConf.TostInternetGonf)   
            }
          });
    }
    const ClickedBtn = (test) =>{
        setSG(test)
        GouvPropD[test].color = '#1e3345'
        setGouProp(GouvPropD)
        //console.log(TunMObject[selectedGou].d1.split( 'L'))
    }

    const GeneralStatCard = () =>{
        const SvGCard = () =>{
            return(<>
            <svg 
                height="200" 
                version="1.1" 
                width="500" 
                //xmlns="http://www.w3.org/2000/svg" 
                //style="overflow: hidden; position: relative; left: -0.5px;" 
                viewBox="0 0 500 200" 
                preserveAspectRatio="xMinYMin" >
                <path 
                    fill="#88a4bc" 
                    stroke="#050505" 
                    d= {TunMObject[selectedGou].d1} 
                    // className="sm_state sm_state_TUN98" 
                    opacity="1" 
                    strokeOpacity="1" 
                    strokeWidth ="3" 
                    strokeLinejoin="round" 
                    transform="matrix(0.1417,0,0,0.1417,0,0)" 
                    //transform="matrix(0.5,0,0,0.2,0,0)" 
                    //style={{opacity: 1, cursor: "pointer", strokeOpacity: 1, strokeLinejoin: "round", fillOpacity: 1}} 
                    fillOpacity="1"
                />
            </svg>
            </>)
        }
        return(<>
        <div className='card card-body shadow-sm mb-3 h-100 border-div'>
                    <h5>Info Generale </h5>
                    <div className='row'>
                        <div className='col-6'>{selectedGou}</div>
                        <div className='col-6 align-self-center'>
                            
                        </div>
                    </div>
                </div>
        </>)
    }
    const ClientListCard = () =>{
        return(<>
        <div className='card card-body shadow-sm mb-3 h-100 border-div'>
                    <h5>Liste des Clients </h5>
                    <div className='row'>
                        <div className='col-6'>{selectedGou}</div>
                        <div className='col-6 align-self-center'>
                            
                        </div>
                    </div>
                </div>
        </>)
    }
    const VenteStatCard = () =>{
        return(<>
        <div className='card card-body shadow-sm mb-3 h-100 border-div'>
                    <h5>Statistique des ventes </h5>
                    <div className='row'>
                        <div className='col-6'>{selectedGou}</div>
                        <div className='col-6 align-self-center'>
                            
                        </div>
                    </div>
                </div>
        </>)
    }
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.ClientStat} />
            <br />

            <div className='row'>
                    <div className='col-12 col-lg-4'>
                        <div className='card card-body border-0 mb-3   border-div'>
                            <h5>Top Factures  </h5>
                            <TunisiaMapSVG ClickedBtn={ClickedBtn} GouvProp={GouvProp} />
                        </div>  
                    </div>
                    <div className='col-12 col-lg-8'>
                        <Tab menu={{ secondary: true, pointing: true ,className: "wrapped"}} panes={panes} /> 
                    </div>
            </div>
            <br />
        </> );
}

export default ClientStatistics;