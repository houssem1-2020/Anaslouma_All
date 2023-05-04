import React, { useState } from 'react';
import BreadCrumb from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import TunMap from '../../AssetsM/tunMap';
import { Bounce } from 'react-reveal';
import { Button, Form, Icon, Input, Loader, Select, TextArea } from 'semantic-ui-react';
import useGetCamion from '../Assets/Hooks/fetchCamion';
import { toast } from 'react-toastify';
import axios from 'axios';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import { useEffect } from 'react';
// import useGetPostes from '../Assets/Hooks/fetchPostes';

const FindInDirectory = ({inDirArticle, setInDirA,FindInDirectoryFunc, loaderState, OnKeyPressFunc}) =>{
    return(<>
      <div className='card card-body border-div shadow-sm mb-3 mt-4'>
          <h5>Recherche Dans La Base Abyedh </h5>
          <Input className='mb-4' placeholder='UID' onKeyPress={event => OnKeyPressFunc(event)} value={inDirArticle} onChange={(e) => setInDirA(e.target.value)} />
          <div className='text-end'>
              <Button  className='bg-system-btn rounded-pill' fluid onClick={() => FindInDirectoryFunc()}>   <Icon name='search' /> Recherche <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
          </div>
      </div>
    </>)
}

function AjouterTeam() {
    /*#########################[Const]##################################*/
    //const [Postes] = useGetPostes() 
    const [teamList, setTealList] = useState([]); 
    const [teamD, setTeamD] = useState([])
    const [inDirArticle, setInDirA] = useState();
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [delegList ,setDelegList] = useState([]) 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`)); 
    const Postes = [
      {key:1, value:'Stock', text:'Stock'},
      {key:2, value:'Caisse', text:'Cassieére'},
      {key:3, value:'Rayon', text:'Rayon'},
      {key:4, value:'Contoire', text:'Contoiore'},
      {key:5, value:'Stage', text:'Stagiére'},
    ]
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
      axios.post(`${GConf.ApiLink}/team`,{
        PID: GConf.PID
      })
      .then(function (response) {
          setTealList(response.data)
      }).catch((error) => {
          if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des client sur votre ordinateur  </div></>, GConf.TostInternetGonf)   
            setTealList(Offline.client)
          }
        });
    }, [])

    /*#########################[Functions]##################################*/
    const GetDelegList = (value) =>{
        setTeamD({...teamD, Gouv: value })
        let found = TunMap.Deleg.filter(element => element.tag === value)
        setDelegList([])
        setDelegList(found)
    }
    const checkFSExistance = () =>{
        if(teamD.T_CIN){
            const foundClient = teamList.find(element => element.T_CIN === teamD.T_CIN)
            if (foundClient) {
                toast.error("Client Exist Deja", GConf.TostErrorGonf)
                setTeamD({...teamD, T_CIN: '' })
            }
            
        }
    }
    const SaveTeam = (event) => {
        if (!teamD.T_CIN) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!teamD.Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!teamD.Phone) {toast.error("Tel Invalide !", GConf.TostErrorGonf)}
        else if (!teamD.Poste) {toast.error("Poste  Invalide !", GConf.TostErrorGonf)}
        // else if (!teamD.Gouv) {toast.error("Gouvernorat Invalide !", GConf.TostErrorGonf)}
        // else if (!teamD.Deleg) {toast.error("Delegation Invalide !", GConf.TostErrorGonf)}
        else if (!teamD.Adress) {toast.error("Adresee Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/team/ajouter`, {
                PID :  GConf.PID,
                teamD : teamD,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    setSaveBtnState(true)
                    toast.success("Menmbre Ajouter !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                    }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Le client sera enregistrer sur votre ordinateur   </div></>, GConf.TostInternetGonf)   
                  setLS(false)
                }
              });
                    
        }
                
    }
    const FindInDirectoryFunc = () =>{
        if (!inDirArticle) {toast.error("Entrer Un UID  !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/client/checkAbyedhDb`, {
                UID : inDirArticle,
            }).then(function (response) {
                if(response.data.length  != 0) {
                    toast.success("Client Existe !", GConf.TostSuucessGonf)
                    setLS(false)
                    setTeamD({ ...teamD, Releted_UID: response.data.UID, Gouv: response.data.BirthGouv,   Name: response.data.Name, Phone : response.data.PhoneNum, Adress : response.data.BirthDeleg})
                }
                else{
                    toast.error('Pas De Clients', GConf.TostSuucessGonf)
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

    /*#########################[Card]##################################*/

    
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.TeamAdd} />
            <br />
            <Bounce left>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                         <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Carte CIN:</h5>
                            <Input icon='key' iconPosition='left' placeholder='CIN ' className='w-100 border-0 shadow-sm rounded mb-1' value={teamD.T_CIN} onBlur={checkFSExistance}  onChange={(e) => setTeamD({...teamD, T_CIN: e.target.value })}/>
                         </div>
                         <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom Et Prenon :</h5>
                            <Input icon='user' iconPosition='left' placeholder='Nom Et Prenon ' className='w-100 border-0 shadow-sm rounded mb-1' value={teamD.Name} onChange={(e) => setTeamD({...teamD, Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Telephone :</h5>
                            <Input icon='phone' iconPosition='left' placeholder='Telephone ' className='w-100 border-0 shadow-sm rounded mb-1' value={teamD.Phone} onChange={(e) => setTeamD({...teamD, Phone: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Poste:</h5>
                            <Select placeholder='Choisir Uu Poste' options={Postes}  className='w-100 shadow-sm rounded mb-3' value={teamD.Poste} onChange={(e, data) => setTeamD({...teamD, Poste: data.value })} />  
                        </div>
                        {/* <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Geolocation</h5>
                            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={teamD.gouv} onChange={(e, { value }) => GetDelegList(value)} />
                            <Select placeholder='Selectionnez Delegation ' fluid value={teamD.Deleg} options={delegList} onChange={(e, { value }) => setTeamD({...teamD, Deleg: value })} />
                        </div> */}
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Adresse:</h5>
                            <Form>
                                <TextArea  rows="3" placeholder='Adresse' className='w-100 shadow-sm rounded mb-3' value={teamD.T_Adress} onChange={(e) => setTeamD({...teamD, Adress: e.target.value })}/>
                            </Form> 
                        </div>
                        <div className='text-end mb-5'>
                            <Button  onClick={SaveTeam} disabled={saveBtnState} className='text-end rounded-pill bg-system-btn ' positive>  <Icon name='save outline' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                    </div>
                    <div className='col-lg-4 d-none d-lg-block  align-self-center'> 
                        <div className='text-center '>
                                <img src='https://assets.ansl.tn/Images/usful/client-add.svg' width='80%'  height='200px' /> 
                        </div> 
                    </div>
                </div>
            </div>
            </Bounce>
    </> );
}

export default AjouterTeam;