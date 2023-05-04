import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import TunMap from '../../AssetsM/tunMap';
import BreadCrumb from '../Assets/breadCrumb'
import { Button, Divider, Icon, Input, Statistic, Form, Loader, Select, TextArea } from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Tab } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { _ } from "gridjs-react";
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import { toast } from 'react-toastify';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import { Navigate } from 'react-router-dom';

const EditTeamCard = ({teamData, setTeamData, EditTeam,delegList,GetDelegList,loaderState}) =>{
    return(<>
            <div className='p-1'>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Matricule Fiscale:</h5>
                            <Input icon='key' iconPosition='left' placeholder='Matricule Fiscale' className='w-100 border-0 shadow-sm rounded mb-1' disabled={true} value={teamData.T_CIN}  onChange={(e) => setTeamData({...teamData, T_CIN: e.target.value })}/>
                        </div>
                        <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom Et Prenon :</h5>
                            <Input icon='user' iconPosition='left' placeholder='Nom Et Prenon ' className='w-100 border-0 shadow-sm rounded mb-1' value={teamData.T_Name} onChange={(e) => setTeamData({...teamData, T_Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Telephone :</h5>
                            <Input icon='phone' iconPosition='left' placeholder='Telephone ' className='w-100 border-0 shadow-sm rounded mb-1' value={teamData.T_Phone} onChange={(e) => setTeamData({...teamData, T_Phone: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Nom Sociale:</h5>
                            <Input icon='home' iconPosition='left' placeholder='Nom Sociale' className='w-100 border-0 shadow-sm rounded mb-1' value={teamData.Poste}  onChange={(e) => setTeamData({...teamData, Poste: e.target.value })}/>
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Geolocation</h5>
                            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={teamData.Four_Gouv} onChange={(e, { value }) => GetDelegList(value)} />
                            <Select placeholder='Selectionnez Delegation ' fluid value={teamData.Four_Deleg} options={delegList} onChange={(e, { value }) => setTeamData({...teamData, Four_Deleg: value })} />
                        </div>
                        {/* <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Map:</h5>
                            <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' value={teamData.Gouv} onChange={(e, data) => setTeamData({...teamData, Gouv: data.value })} />  
                           
                        </div> */}
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Adresse:</h5>
                            <Form>
                                <TextArea  rows="3" placeholder='designer votre article' className='w-100 shadow-sm rounded mb-3' value={teamData.T_Adresse} onChange={(e) => setTeamData({...teamData, T_Adresse: e.target.value })}/>
                            </Form> 
                        </div>
                        <div className='text-end mb-5'>
                            <Button  onClick={EditTeam}  className='text-end rounded-pill bg-system-btn ' positive>  <Icon name='save outline' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </Button>
                        </div>
                    </div>
    </>)
}
const FindInDirectory = ({inDirArticle, setInDirA,FindInDirectoryFunc, loaderState, OnKeyPressFunc,fromDirectory}) =>{
    
    return(<>
        <div className='row'>
            <div className='col-6'>
                <div className='card card-body border'>
                    <h5>Recherche Dans La Base Abyedh </h5>
                    <Input className='mb-4' placeholder='UID' onKeyPress={event => OnKeyPressFunc(event)} value={inDirArticle} onChange={(e) => setInDirA(e.target.value)} />
                    <div className='text-end'>
                        <Button  className='bg-system-btn rounded-pill' fluid onClick={() => FindInDirectoryFunc()}>   <Icon name='search' /> Recherche <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                    </div>
                </div>  
            </div>
            <div className='col-6'>
                <h5 className='text-secondary mt-1 mb-0'>Nom: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Phone: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Gouv: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Deleg: {fromDirectory.Name}</h5>
                <h5 className='text-secondary mt-1 mb-0'>Adresse: {fromDirectory.Name}</h5>
            </div>
            <div className='col-12 text-end'>
                <Button  className='bg-success text-white rounded-pill' onClick={() => FindInDirectoryFunc()}>   <Icon name='check' /> Verifieé <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
            </div>
        </div>
    </>)
}
function TeamInfo() {
        /* ############################### Const ################################*/
        const {TID} = useParams()
        const [teamData, setTeamData] = useState([])
        const [position, setPosition] = useState([36.17720,9.12337])
 
        const [inDirArticle, setInDirA] = useState();
        const [fromDirectory, setFromDir] = useState([]);
        const [presence, setPresence] = useState([])
        const [avances, setAvances] = useState([])
        const [loading , setLoading] = useState(false)
        const [loaderState, setLS] = useState(false)
        const [delegList ,setDelegList] = useState([]) 
        const panes = [
            {
                menuItem: { key: 'fffgg', icon: 'file text', content: 'Presence' }, 
                render: () =><><TableGrid tableData={presence} columns={['*','Nom','Jour','Description','X']} /> </> ,
            },
            {
                menuItem: { key: 'test', icon: 'file text', content: 'Avances' }, 
                render: () =><><TableGrid tableData={avances} columns={['*','Nom','Jour', 'Valeur','Supp']} /> </> ,
            },
            // {
            // menuItem: { key: 'reciept', icon: 'check circle', content: 'Verification' }, 
            // render: () =><Tab.Pane className='border-div mb-4' attached={false}><FindInDirectory inDirArticle={inDirArticle}  setInDirA={setInDirA} FindInDirectoryFunc={FindInDirectoryFunc} loaderState={loaderState} OnKeyPressFunc={OnKeyPressFunc} fromDirectory={fromDirectory}/> </Tab.Pane> ,
            // },
            {
            menuItem: { key: 'edit', icon: 'edit', content: 'Modifier' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}><EditTeamCard teamData={teamData} setTeamData={setTeamData} EditTeam={EditTeam} delegList={delegList} GetDelegList={GetDelegList}  loaderState={loaderState}/></Tab.Pane><br /></>,
            },
            {
                menuItem: { key: 'delete', icon: 'trash alternate', content: 'Supprimer' }, 
                render: () => <><Tab.Pane className='border-div' attached={false}><DeleteTeam /></Tab.Pane><br /></>,
            },
        ]
        L.Icon.Default.mergeOptions(GConf.LeafleftIcon );
        const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
        const Postes = [
            {key:1, value:'Stock', text:'Stock'},
            {key:2, value:'Caisse', text:'Cassieére'},
            {key:3, value:'Rayon', text:'Rayon'},
            {key:4, value:'Contoire', text:'Contoiore'},
            {key:5, value:'Stage', text:'Stagiére'},
          ]

    /* ############################### UseEffect ################################*/
    useEffect(() => {
        //client Info
        axios.post(`${GConf.ApiLink}/team/info`, {
            PID:  GConf.PID,
            Team_ID : TID
        }).then(function (response) {
            if(!response.data[0].PK) {
                toast.error('team Introuvable !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/fs"; }, 2000)
                
            } else {
                setTeamData(response.data[0])
                setLoading(true)
                
                let presenceTable = []
                response.data[0].Presence.map( (getData, index) => presenceTable.push([ 
                (index+1),
                response.data[0].T_Name,  
                new Date(getData.PR_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), 
                getData.Description,
                _(<Button className='rounded-pill bg-danger text-white ' size='mini' onClick={ (e) => alert(getData.PK)}> X </Button>)
                ],))
                setPresence(presenceTable)

                let avancesTable = []
                response.data[0].Avances.map( (getData,index) => avancesTable.push([ 
                    (index+1),
                    response.data[0].T_Name,
                    getData.Valeur,
                    new Date(getData.AV_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                    _(<Button className='rounded-pill bg-danger text-white ' size='mini' onClick={ (e) => alert(getData.PK)}> X </Button>)
                    ],))
                setAvances(avancesTable)

            }

        }).catch((error) => {
            if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les info du client  </div></>, GConf.TostInternetGonf)   
            setTeamData([])
            setPosition([0,0])
            setLoading(true)
            }
        });

    }, [])
     
     
    /* ############################### Functions ################################*/
    const GetDelegList = (value) =>{
        setTeamData({...teamData, Four_Gouv: value })
        const found = TunMap.Deleg.filter(element => element.tag === value)
        setDelegList(found)
    }
    const EditTeam = () =>{
        if (!teamData.Code_Fiscale) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!teamData.Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!teamData.Phone) {toast.error("Phone Invalide !", GConf.TostErrorGonf)}
        else if (!teamData.Social_Name) {toast.error("Nom Sociale  Invalide !", GConf.TostErrorGonf)}
        else if (!teamData.Gouv) {toast.error("Gouvernorat Invalide !", GConf.TostErrorGonf)}
        else if (!teamData.Adress) {toast.error("Adresee Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/fournisseur/modifier`, {
                tag : GConf.PID,
                Team_ID : teamData,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Client Modifier !", GConf.TostSuucessGonf)
                    SaveNotification('clientEdit',GConf.PID, teamData)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                        }
                }).catch((error) => {
                    if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier le client  </div></>, GConf.TostInternetGonf) 
                    setLS(false)  
                    }
                });
                    
        }
    }
    const DeleteTeamFunc = () =>{
            setLS(true)
            axios.post(`${GConf.ApiLink}/fournisseur/supprimer`, {
                tag : GConf.PID,
                clientId : TID,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Client Supprimer !", GConf.TostSuucessGonf)
                    setLS(false)
                    setTimeout(() => {  window.location.href = "/S/fs"; }, 500)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                        }
                }).catch((error) => {
                    if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de supprimer le client  </div></>, GConf.TostInternetGonf) 
                    setLS(false)  
                    }
                });
    }
    const FindInDirectoryFunc = () =>{
        if (!inDirArticle) {toast.error("Entrer Un Code A Barre  !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/fournisseur/checkAbyedhDb`, {
                PID : inDirArticle,
            }).then(function (response) {
                if(response.data.length  != 0) {
                    toast.success("Fournisseur Existe !", GConf.TostSuucessGonf)
                    setLS(false)
                    //setFSData({ ...fournisseurData, Releted_PID: response.data.PID, Code_Fiscale: response.data.Matricule_F , Gouv: response.data.Gouv,   Name: response.data.Name, Phone : response.data.Phone , Adress : response.data.Adress })
                }
                else{
                    toast.error('Pas De Fournisseur ', GConf.TostSuucessGonf)
                    setLS(false)
                }
            }).catch((error) => {
                if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> </div></>, GConf.TostInternetGonf)   
                    setLS(false)
                }
                });
            
        }
    }
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
    }
    const NavigateFunction = (link) => {  Navigate(link) }
    /* ############################### Card ################################*/
    const TeamCard = () =>{
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
                                <h4 className='mt-2'>{loading ? teamData.T_Name : SKLT.BarreSkl } </h4> 
                                <h6 className="text-secondary">  {loading ? <><span className="bi bi-geo-alt-fill"></span> { teamData.T_Adresse } </>: SKLT.BarreSkl} </h6>
                                <h6 className="text-secondary"> {loading ? <><span className="bi bi-geo-fill"></span> { teamData.Four_Gouv } </>: SKLT.BarreSkl } </h6>
                                <Divider horizontal className='text-secondary mt-4'>Matricule.F</Divider>
                                <div className='row text-center'>
                                    <div className='col-12'>    
                                        {loading ?  
                                            <Statistic color='red' size='tiny'>
                                                <Statistic.Value>
                                                    {teamData.T_CIN} 
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
                                                    {teamData.T_Phone} 
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
    const PresenceCard = () =>{
            return (<>
                <div className='p-1'>
                        <h5>Presence</h5>
                        
                </div>
            </>);
    }
    const AvanceCard = () =>{
        return (<>
                <div className='p-1'>
                        <h5>General</h5>
                            
                </div>
        </>);
    }
    const DeleteTeam= () =>{
            return(<><h3 className="text-secondary">Voulez-Vous Vraimment Supprimer Ce Camion ?</h3> 
            <div className='row'>
                    <div className='col-9'>
                        <h5 className="text-danger text-left"><b>Lorsque Vous Supprimer Un Client : </b></h5>
                        <ul className="text-info text-left">
                        <li>le Client  ne sera pas visible dans la branche 'Clients'</li>
                        <li>Tous les factures relier a ce client peut s'endomager   </li>
                        <li>vous ne pouver pas passer ni factures ni commandes avec ce clients autremment   </li>
                        </ul>
                    </div>
                    <div className='col-lg-3 d-none d-lg-block align-self-center'>
                        <div className='text-center'>
                                <img src='https://assets.ansl.tn/Images/usful/delete.svg' width='80%'  height='80px' /> 
                        </div> 
                    </div>
                </div>
            <div className='text-end'>
                <button type="submit" name="add" className="btn btn-danger rounded-pill"  onClick={DeleteTeamFunc}><span className="bi bi-check"></span> Oui, Supprimer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </button>
            </div></>)
    }
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.FournisseurAdd} />
            <br />
            <div className="row">
                    <div className="col-12 col-lg-4">
                        <TeamCard /> 
                    </div>
                    <div className="col-12 col-lg-8 ">
                        <Tab  menu={{secondary: true, pointing: true ,className: "wrapped"}} panes={panes} />
                    </div>
            </div>
    </> );
}

export default TeamInfo;