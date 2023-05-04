import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-reveal';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, Divider, Form, Icon, Input, Select, Loader,  TextArea } from 'semantic-ui-react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import useGetFamilleArticle from '../Assets/Hooks/fetchArticlesFamille';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import { Grid, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { NavLink } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const ChangePWD = ({passWord, setPWD, ChangerPassord, loaderState}) =>{
    return(<>
        <h5 className='mb-1'>Idenbtifiant</h5>
        <Input icon='user' iconPosition='left' placeholder='Nom' value={passWord.Log ?  passWord.Log : ''} onChange={(e) => setPWD({...passWord,  Log : e.target.value })}   fluid />
        <h5 className='mb-1 mt-2'>Mot de passe</h5>
        <Input icon='eye' iconPosition='left' placeholder='telephone' value={passWord.Pwd ? passWord.Pwd : ''} onChange={(e) => setPWD({...passWord,  Pwd : e.target.value })} fluid />
        <br />
        <div className='text-end'>
            <Button  className='rounded-pill bg-system-btn' onClick={ChangerPassord} ><Icon name='save' /> Modifier <Loader inverted active={loaderState}  inline size='tiny' className='ms-2'/></Button>
        </div>

    </>)
}
const SystemCard = ({passWord, setPWD, SystemData, loaderState, ChangerPassord, autorisation, setAutor , ChangerAutorization }) =>{
    
    const Autorisations = () =>{
        return(<>
            <div className="row">
                <div className="col-10 col-lg-10 text-secondary">
                    Autoriser le bon de sortie 
                </div>
                <div className="col-2 col-lg-2">
                    <div className="form-check form-switch">
                         <input className="form-check-input form-check-input-lg" type="checkbox" checked={autorisation.Edit_Stock ? JSON.parse(autorisation.Edit_Stock) : false} onChange={ (e) => ChangerAutorization('Edit_Stock', !JSON.parse(autorisation.Edit_Stock))} /> 
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-10 col-lg-10 text-secondary">
                    Autoriser inventaire du camion
                </div>
                <div className="col-2 col-lg-2">
                    <div className="form-check form-switch">
                        <input className="form-check-input form-check-input-lg" type="checkbox" checked={autorisation.Edit_Camion_Stock ? JSON.parse(autorisation.Edit_Camion_Stock) : false} onChange={ (e) => ChangerAutorization('Edit_Camion_Stock', !JSON.parse(autorisation.Edit_Camion_Stock))}  />
                    </div>
                </div>
            </div>
        </>)
    }

    const HeaderCardSystem = () =>{
        return(<>
             <b className='text-danger'>RECETTE  </b>
            <br />
            <h1>{SystemData.RecetteDepo ? SystemData.RecetteDepo : 0}</h1> 
            <br />
            <b className='text-danger'>AUTORISATION </b>
            <br />
            <br />
        </>)
    }
    return(<>
        <div className='card card-body shadow-sm mb-3 border-div'>
            <div className='row'>
                <div className='col-12 col-lg-6 align-self-center mb-3'>
                    <HeaderCardSystem /> 
                    <Autorisations />
                </div>
                <div className='col-12 col-lg-6'>
                    <b className='text-danger'>CHANGER MOT DE PASSE </b>
                    <ChangePWD passWord={passWord} setPWD={setPWD} ChangerPassord={ChangerPassord} loaderState={loaderState} />
                </div>
            </div>
        </div>
    </>)
}

function Anaslouma(props) {
    /* #########################[Const]########################### */
    let TAG = props.TAG
    let [SystemData, setSystemData] = useState({Password:{},  autorisation:{} ,FondDepoAchat:0, FondDepoVente:0, camionStat:[], RecetteDepo:'0.000',clientsNum:0, facturesNum :0, camionsNum:0,articlesNum:0})
    let [loaderState, setLS] = useState(false)
    let [passWord, setPWD] = useState([])
    let [autorisation, setAutor] = useState([])
    let [dataBar, setDataBar]= useState([])


    let position = [0,0]
    L.Icon.Default.mergeOptions(GConf.LeafleftIcon);
    
    
    /* #########################[UseEffects]########################### */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/anaslouma`, {
            TAG: TAG,
        })
        .then(function (response) {
            //console.log(response.data)
            setSystemData(response.data[0])
            setPWD(response.data[0].Password)
            setAutor(response.data[0].autorisation)
            let camionRT = []
            response.data[0].camionStat.map((data) => camionRT.push({ name: data.Chauffeur, value: data.Recette }))
            setDataBar(camionRT)

        }).catch((error) => {
            if(error.request) {
            
            }
          });

    }, [])
    /* #########################[Functions]########################### */
    const CalculatePourcentage = (a,v) =>{
        let p = (( parseFloat(v) - parseFloat(a) ) /  parseFloat(v) ) * 100
        if(isNaN(p)) {return 0}
        else{
            return(p.toFixed(2))
        }
        
    }
    const ChangerPassord = () =>{
        if (!passWord.Log) {toast.error("Non de La famille est Invamlide !", GConf.TostErrorGonf)}
        else if (!passWord.Pwd) {toast.error("Description est Invamlide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/anaslouma/update-pwd`, {
                tag : TAG,
                PwdData : passWord,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("MDP Modifier avec Suucess", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La famille  n'a pas ete enregistre </div></>, GConf.TostInternetGonf)   
                  setLS(false)
                }
              });
        }
    }
    const ChangerAutorization = (selectedTag, selectedValue) =>{
        axios.post(`${GConf.ApiLink}/anaslouma/update-auth`, {
            tag : TAG,
            WTag : selectedTag,
            WValue : selectedValue,
        }).then(function (response) {
            if(response.data.affectedRows) {
                if (selectedTag == 'Edit_Stock' ) {
                    toast.success("Modifieé ", GConf.TostSuucessGonf)
                    setAutor({...autorisation, Edit_Stock : !autorisation.Edit_Stock })
                } else {
                    toast.success("Modifieé", GConf.TostSuucessGonf)
                    setAutor({...autorisation, Edit_Camion_Stock : !autorisation.Edit_Camion_Stock })
                }  
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> La famille  n'a pas ete enregistre </div></>, GConf.TostInternetGonf)   
            }
          });        
    }

    /* #########################[Card ]########################### */
    const GeneralStat = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-3'>
                <div className='row'>
                    <div className='col-6 col-lg-3 mb-3 text-center'>
                        <div><h2>{SystemData.articlesNum}</h2></div>
                        <div className='text-info'><small>ARTICLE</small></div>
                    </div>
                    <div className='col-6 col-lg-3 mb-3 text-center'>
                        <div><h2>{SystemData.clientsNum}</h2></div>
                        <div className='text-info'><small>CLIENT</small></div>
                    </div>
                    <div className='col-6 col-lg-3 mb-3 text-center'>
                        <div><h2>{SystemData.facturesNum}</h2></div>
                        <div className='text-info'><small>FACTURES</small></div>
                    </div>
                    <div className='col-6 col-lg-3 mb-3 text-center'>
                        <div><h2>{SystemData.camionsNum}</h2></div>
                        <div className='text-info'><small>CAMIONS</small></div>
                    </div>
                </div>
            </div>
        </>)
    }
    const StatDepoCard = () =>{
        return(<> 
            <div className='card card-body shadow-sm mb-2 text-center h-100 border-div'>
               <div className='row'>
                   <div className='col-12 col-lg-5'>
                        <div className='text-start mb-2'><b >Fond d'achat</b> </div>
                        <h1 className='text-danger mb-4'>{SystemData.FondDepoAchat}</h1>
                    </div> 
                   <div className='col-12 col-lg-2'>
                   <div className='text-start mb-2'><b >%</b> </div> 
                        <h2 className=' text-info mb-4'> {CalculatePourcentage(SystemData.FondDepoAchat,SystemData.FondDepoVente)} </h2> 
                    </div> 
                   <div className='col-12 col-lg-5'>
                        <div className='text-start mb-2'><b >Fond du vente</b> </div> 
                        <h1 className=' text-success mb-4'>{SystemData.FondDepoVente}</h1>
                    </div> 
                </div> 
                <div className='text-end mt-3'>
                    <NavLink exact='true' to='stock'><Button size='mini' className='rounded-pill bg-system-btn'  ><Icon name='save' /> Etat du stock </Button></NavLink>
                    <NavLink exact='true' to='stat'><Button size='mini' className='rounded-pill bg-danger text-white'  ><Icon name='save' /> Statistiques </Button></NavLink>
                </div>
            </div>  
        </>)
    }
    const StatCamionCard = () =>{
        const CamionCard = (props) =>{
            return(<>
                    <b>{props.data.Cam_Name} | {props.data.Chauffeur} | {props.data.Matricule} </b> 
                    <h1 className='m-1 p-0 text-info'>recette : {props.data.Recette}</h1> 
                    <h4 className='m-1 p-0 text-danger'>fonds :{props.data.Fonds}</h4> 
                    <div className='text-end mt-2'>
                        <NavLink exact='true' to={`suivie-c/${props.data.Cam_ID}`}><Button size='mini' className='rounded-pill bg-system-btn'  ><Icon name='save' /> suivie camion </Button></NavLink>
                    </div>
                    <br />
            </>)
        }
        return(<>
                <div className='bg-white p-2 border rounded shadow-sm h-100 border-div'>
                    <Swiper
                        spaceBetween={30}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper pb-4 "
                    >
                       {
                            SystemData.camionStat.map((slides, index) => (
                                <SwiperSlide key={index}>
                                    <CamionCard data={slides}/>
                                </SwiperSlide>
                            ))
                        }

                            <SwiperSlide key={1000}>
                                    <BarCht />
                            </SwiperSlide>
                        
                    </Swiper>
                    </div>
        </>)
    }
    
    const CamionMap = () =>{
        return(<>
            <MapContainer center={[36.17720,9.12337]} zoom={8} scrollWheelZoom={false} className="map-height">
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    SystemData.camionStat.map( (data,index) =>  <Marker key={index} position={[data.Positions.lat, data.Positions.lng]}> <Popup> {data.Cam_Name} <br /> {data.Chauffeur} </Popup> </Marker> )
                }
                
            </MapContainer> 
        </>)
    }
    const BarCht = (props) => {

        return (<>
        <ResponsiveContainer  height={150} >
            <BarChart
                layout="vertical"
                data={dataBar} 
            >
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill={GConf.themeColor}  barSize={15}  radius={[0, 10, 10, 0]}/>
                <XAxis type="number" domain={[0, (Math.max(...dataBar.map(o => o.value)) + 10)]} hide  dataKey="value"/>
                <YAxis type="category"   dataKey='name' />
                
            </BarChart>
        </ResponsiveContainer>
        </>)
    }


    return ( <>
        <div className='container-fluid'>
            <h5>Statitiques</h5> 
            <GeneralStat />
            <div className='row'>
                <div className='col-12 col-lg-7 mb-3'><StatDepoCard /> </div>
                <div className='col-12 col-lg-5 mb-3 '><StatCamionCard /></div>
            </div>
            <br />
            <h5>Systeme</h5> 
                <SystemCard passWord={passWord} setPWD={setPWD} SystemData={SystemData} ChangerPassord={ChangerPassord} autorisation={autorisation} setAutor ={setAutor} ChangerAutorization={ChangerAutorization} loaderState={loaderState} />
            <br />
            <h5>Camions</h5> 
            <div className='card card-body shadow-sm mb-3 border-div'>
               <CamionMap />
            </div>
            <br />
        </div> 
    </> );
}


export default Anaslouma;