import React, { useEffect,   useState } from 'react';
//import { _ } from "gridjs-react";
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import { Button, Icon, Modal, Rating } from 'semantic-ui-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L  from 'leaflet';

function ProfessionnelInfoPage() {
    /*#########################[Const]##################################*/
    let {subTag, tag} = useParams()
    
    let [proffListe, setProffListe] = useState([]); 
    let [loading, setLOD] = useState(true); 
    //let [depart, setDepart] = useState(''); 
    //let [region, setRegion] = useState(''); 
    
    const [openD, setOpenD] = useState(false)
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    
    /* ############### UseEffect #################*/
    useEffect(() => {
        window.scrollTo(0, 0);
        //i use it later 
        navigator.geolocation.getCurrentPosition(
            function(position) {
                localStorage.setItem('DefaultPosition', JSON.stringify({lat:position.coords.latitude, lng:position.coords.longitude}))
                 
            },
            function(error) {
                toast.error("Selectionnez un Position", GConf.TostErrorGonf)
            }
        );
        axios.post(`${GConf.ApiLink}/list`, {
            tag: tag,
            genre:  tag,
            depart:  GConf.defaultPos.depart,
            region: GConf.defaultPos.region,
        })
        .then(function (response) {
            if (!response.data) {
                  toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
            } else {
                setProffListe(response.data)
                setLOD(false)
            }
        })

      }, [])
    
    /* ############### Functions #################*/

    /* ############### Card #################*/
    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm system-color rounded-0 fixed-top'>
                        <div className='row'>
                            <div className='col-8 text-start'>
                                <NavLink exact='true' to='/'>
                                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                                </NavLink>
                            </div>
                            <div className='col-4 align-self-center text-end'>   
                                {
                                    GConf.UserData.UData.UID ? 
                                    <NavLink to='/User/L'>
                                        <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' />
                                    </NavLink>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                </div>
            </>)
    }
    const ProfListeCard = (props) =>{
        const ItemCard = (props) =>{
            return(<>
                    <div className='col-12 col-lg-4 mb-3'>
                        <NavLink to={`/Article/${tag}/${subTag}/${props.data.PID}`}>
                        <div className='card p-3  shadow-sm text-center h-100 border-div'>
                            <div className='row'>
                                <div className='col-3 col-lg-12 align-self-center '>
                                <Rating className='d-inline' maxRating={5} defaultRating={3.5} icon='star' disabled size='mini' />
                                    <div><img src={`https://assets.ansl.tn/Images/kallax/${tag}.gif`} className='img-responsive rounded-circle border' width='60px' heigth='60px' /></div>
                                    
                                </div>
                                <div className='col-9 col-lg-12 align-self-center '>
                                    
                                    <h5 className='mt-1  mb-0 text-secondary text-start'><span className='bi bi-person'></span> {props.data.Social_Name}  </h5> {/* (<small>{props.data.Specialite}</small>) */}
                                    {/* <h5 className='mt-1  mb-0 text-secondary text-start'><span className='bi bi-phone'></span> +33 {props.data.Phone} </h5> */}
                                    <h5 className='mt-1  mb-0 text-secondary text-start'><span className='bi bi-geo-alt'></span> {props.data.Gouv} ,  {props.data.Deleg}</h5>
                                    <h5 className='mt-1  mb-0 text-secondary text-start'><span className='bi bi-map'></span>  1Km | 7 min</h5>
                                    
                                    {/* <small className='mt-1  mb-0 text-secondary text-start'><span className='bi bi-eye'></span> {props.data.Views_Num} | <span className='bi bi-hand-thumbs-up'></span> {props.data.Likes_Num} </small> */}
                                </div>
                            </div>                            
                        </div>
                        </NavLink>
                    </div>
            </>)
        }
        const EmptyCard = () => {
            return(<>
                <div className='text-center'>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <img src='https://assets.ansl.tn/Images/kallax/no-result.svg' width='80%' height='120px' /> 
                    <h1 className='text-secondary'> Pas de Resultat </h1> 
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </>)
        }
        const ForMoreResult = () => {
            return(<>
                <div className='text-center'>
                    <br />
                    <br />
                    <br />
                    <img src='https://assets.ansl.tn/Images/kallax/place-proche-result.svg' width='80%' height='120px' /> 
                    <h4 className='text-secondary'> Chercher dans des place proche pour plus de résultat  </h4> 
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </>)
        }
        return(<>
                <div className='row'>
                    {proffListe.length == 0 ? 
                        <EmptyCard /> 
                        :
                        <>
                            {props.list.map( (itemData,index) => <ItemCard key={index} data={itemData}/>)}
                            {proffListe.length == 1 || proffListe.length == 2 ? <ForMoreResult /> : <></>}
                        </>
                    }  
                </div>
        </>)
    }
    const FilterCard = () =>{
        return(<>
        <div className='card card-body shadow-sm border-div mb-3 sticky-top' style={{top:'70px'}}>
            <MapContainer className='border-div' center={[46.582,2.461]} zoom={5} scrollWheelZoom={true} style={{height:'530px'}} >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[46.582,2.461]}>
                    {/* <Popup> {selectedGouv[0].lan} </Popup> */}
                </Marker>
            </MapContainer>
        </div>
        </>)
    }
    const BottomCard = () =>{
        return(<>
                <div className='card card-body shadow-sm' style={{borderRadius:'30px 30px 0 0', backgroundColor:'#6f787d'}}>
                    <div className='row'>
                        <div className="col-lg-6 col-12 text-left align-self-center text-white ">
                            <div className="p-3">
                                <h6><span className="bi bi-telephone-fill"></span> +21697913914, +33 6 56 70 89 08</h6>
                                <h6><span className="bi bi-geo-alt-fill"></span>  5, rue oberlin Schiltigheim 67300</h6>   
                            </div>   
                        </div>
                         
                    </div>
                </div>
            </>)
    }

    return ( <>
            <TopCard /> 
            <br />
            <br />
            <br />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12 col-lg-3 d-none d-lg-block'>
                        <FilterCard />
                    </div>
                    <div className='col-12 col-lg-9'>
                        
                        <div className='card-body border-div mb-4 mt-2  ' style={{top: '50px'}}>
                            <div className='row'>
                                <div className='col-10 col-lg-12 align-self-center'><b className='text-secondary'> <span className='bi bi-search me-2'></span> {tag} près de  "{GConf.defaultPos.region}" </b></div>
                                <div className='col-2 d-lg-none align-self-center'><Button icon className='rounded-circle' onClick={() => setOpenD(true)}> <Icon name='map marker alternate' /> </Button></div>
                            </div>
                        </div>
                         
                        { loading ?  SKLT.CardList  :  <ProfListeCard  list={proffListe} />  }

                    </div>
                </div>
                
            </div>
            <br />
            <br />
            <BottomCard />

            <Modal
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                dimmer= 'blurring'
                className='m-0 p-0'  
                >
                    
                <Modal.Content >        
                    <MapContainer className='border-div' center={[46.582,2.461]} zoom={5} scrollWheelZoom={true} style={{height:'530px'}} >
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[46.582,2.461]}>
                            {/* <Popup> {selectedGouv[0].lan} </Popup> */}
                        </Marker>
                    </MapContainer>
                </Modal.Content>
            </Modal>
        </> );
}

export default ProfessionnelInfoPage;