import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Button, Icon, Label, Popup, Select } from 'semantic-ui-react';
import useGetClientMap from '../../Dashboard/Assets/Hooks/fetchClientMap';
import { toast } from 'react-toastify';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { _ } from 'gridjs-react';
import { useNavigate} from 'react-router-dom';

function ClientPointage() {
    /* ############################### Const ################################*/
    const [clientMap] = useGetClientMap()
    const [clientList, setClientList] = useState([])
    const [commandePasse, setCommandePasse] = useState([])
    const [loading, setLoadingP] = useState(false)
    const navigate = useNavigate();
    const colors = [
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
    ]
    
    /* ############################### UseEffect ################################*/
        useEffect(() => {
            axios.post(`${GConf.ApiCommandeLink}/mescommandes/bydate`,{
                tag : GConf.SystemTag
            }).then(function (response) {
                    console.log(response.data)
                    setCommandePasse(response.data)
                }).catch((error) => {
                    if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger la map </div></>, GConf.TostInternetGonf)   
                    setCommandePasse([])
                }
            });
        }, [])

    /* ############################### Function ################################*/
    const GetSelectedClients = (value)=>{
        setLoadingP(true)
        axios.post(`${GConf.ApiLink}/client/position`,{
            gouv : value
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([
            _(<AvatarCard  client={getData.CL_ID} lettre={capitalizeFirstLetter(getData.Name)} />),
            getData.Name,
            getData.Phone,
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/cl/info/${getData.CL_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setClientList(testTable)

            console.log(response.data)
            setLoadingP(false)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger les position client  </div></>, GConf.TostInternetGonf)   
            }
          });
    }

    const NavigateFunction = (link) => {  navigate(link) }
    const  capitalizeFirstLetter = (string) =>{
        return (string.charAt(0).toUpperCase() + string.slice(1)).charAt(0);
    }
    const ClientVisited = (clientId) => {
        const clientTraget = commandePasse.find( client => client.CL_ID == clientId)
        if (clientTraget) {
            return true
        } else {
            return false
        }
    }
    /*################[Card]###############*/
    const AvatarCard = (props) =>{
       
        return(<>
            <Label size='massive' circular className={ClientVisited(props.client) ? `bg-success text-white` : `bg-danger text-white`} key={1}>
                <h3>{props.lettre}</h3>
            </Label>
            
        </>)
}

    return ( <>
        <BackCard data={InputLinks.backCard.clPtg}/>
        <br />
        <div className='container'>
            <div className='card card-body shadow-sm mb-4 '>
                <h5 className='mb-1'>Selectionez Une Region:</h5>
                <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' onChange={(e, data) => GetSelectedClients(data.value)} />  
            </div>
            <div>
                {
                    loading ? 'Chargemment' : 
                    <>
                    <TableGrid tableData={clientList} columns={['*','Client', 'Tel',  'Voir']} />
                    </>
                }
            </div>
        </div>
        </> );
}

export default ClientPointage