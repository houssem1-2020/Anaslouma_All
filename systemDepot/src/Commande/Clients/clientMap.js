import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Modal, Popup, Select, Button } from 'semantic-ui-react';
import useGetClientMap from '../../Dashboard/Assets/Hooks/fetchClientMap';
import { toast } from 'react-toastify';

function ClientMap() {

    
    /* ############################### Const ################################*/
    const [centerPosition, setCenterPosition] = useState([36.17720,9.12337])
    const [clientsPositions, setClientsPositions] = useState([])
    const [clientMap] = useGetClientMap() 
    const [open, setOpen] = useState(false)
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);

     /* ############################### UseEffect ################################*/
    useEffect(() => {
        axios.get(`${GConf.ApiLink}/client`)
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

    return ( <>
        <BackCard data={InputLinks.backCard.clMap}/>
        <br />
        <div className='container'>
                <div className='col-12 '>
                <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    trigger={<div className='mb-4'><Button fluid size='large'> CHANGER REGION</Button></div>}
                    >
                    <Modal.Content >
                        <h5 className='mb-1'>Selectionez Une Region:</h5>
                        <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' onChange={(e, data) => GetSelectedClients(data.value)} />  
                
                        <div className='text-end'>
                            <Button color='black' onClick={() => setOpen(false)}> Fermer </Button>
                        </div> 
                    </Modal.Content>
                    
                    </Modal>

                        
                </div>
                <div className='col-12'>
                    <div style={{zIndex:'-10'}}>
                    <MapContainer center={centerPosition} zoom={8} scrollWheelZoom={false} className="map-height-cmd" >
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {clientsPositions.map( (cord) => <Marker key={cord.PK} position={[cord.Lat, cord.Lng]}> <Popup>{cord.Name}</Popup></Marker> )}
                    </MapContainer>
                    </div>
                </div>
            </div>
        </> );
}

export default ClientMap