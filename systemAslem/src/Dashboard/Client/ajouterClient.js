import React, { useState } from 'react';
import BreadCrumb from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import TunMap from '../../AssetsM/tunMap';
import { Bounce } from 'react-reveal';
import { Button, Form, Icon, Input, Loader, Select, TextArea } from 'semantic-ui-react';
import useGetCamion from '../Assets/Hooks/fetchCamion';
import { toast } from 'react-toastify';
import axios from 'axios';
import useGetClientMap from '../Assets/Hooks/fetchClientMap';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import { useEffect } from 'react';

function AjouterClient() {
    /*################[Variable]###############*/
    const  [clientList, setClientList] = useState([]); 
    const [clientD, setClientD] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [clientMap] = useGetClientMap()
    const [delegList ,setDelegList] = useState([]) 
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Offline`));

    /*################[UseEffect]###############*/
    useEffect(() => {
        axios.get(`${GConf.ApiLink}/client`)
        .then(function (response) {
            setClientList(response.data)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des client sur votre ordinateur  </div></>, GConf.TostInternetGonf)   
              setClientList(Offline.client)
            }
          });
    }, [])

    /*################[Function]###############*/    
    const GetDelegList = (value) =>{
        setClientD({...clientD, Gouv: value })
        let found = TunMap.Deleg.filter(element => element.tag === value)
        setDelegList([])
        setDelegList(found)
    }
    const checkClientExistance = () =>{
        if(clientD.Code_Fiscale){
            const foundClient = clientList.find(element => element.Code_Fiscale === clientD.Code_Fiscale)
            if (foundClient) {
                toast.error("Client Exist Deja", GConf.TostErrorGonf)
                setClientD({...clientD, Code_Fiscale: '' })
            }
            
        }
    }
    const SaveClient = (event) => {
        if (!clientD.Code_Fiscale) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Phone) {toast.error("Phone Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Social_Name) {toast.error("Nom Sociale  Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Gouv) {toast.error("Gouvernorat Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Deleg) {toast.error("Delegation Invalide !", GConf.TostErrorGonf)}
        else if (!clientD.Adress) {toast.error("Adresee Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            setSaveBtnState(true)
            axios.post(`${GConf.ApiLink}/client/ajouter`, {
                tag : GConf.SystemTag,
                clientD : clientD,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Client Ajouter !", GConf.TostSuucessGonf)
                    SaveNotification('clientAjouter',GConf.SystemTag, clientD)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                    setSaveBtnState(false)
                    }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Le client sera enregistrer sur votre ordinateur   </div></>, GConf.TostInternetGonf)   
                  Offline.clientToSave.push(clientD)
                  localStorage.setItem(`${GConf.SystemTag}_Offline`,  JSON.stringify(Offline));
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

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.ClientAdd} />
            <br />
            <Bounce left>
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                         <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Matricule Fiscale:</h5>
                            <Input icon='key'  onKeyPress={event => OnKeyPressFunc(event)} iconPosition='left' placeholder='Matricule Fiscale' className='w-100 border-0 shadow-sm rounded mb-1' onBlur={checkClientExistance} value={clientD.Code_Fiscale} onChange={(e) => setClientD({...clientD, Code_Fiscale: e.target.value })}/>
                         </div>
                         <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom Et Prenon :</h5>
                            <Input icon='user' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Nom Et Prenon ' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setClientD({...clientD, Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Telephone :</h5>
                            <Input icon='phone' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Telephone ' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setClientD({...clientD, Phone: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Nom Sociale:</h5>
                            <Input icon='home' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Nom Sociale' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setClientD({...clientD, Social_Name: e.target.value })}/>
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Geolocation</h5>
                            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={clientD.gouv} onChange={(e, { value }) => GetDelegList(value)} />
                            <Select placeholder='Selectionnez Delegation ' fluid value={clientD.Deleg} options={delegList} onChange={(e, { value }) => setClientD({...clientD, Deleg: value })} />
                        </div>
                        {/* <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Map:</h5>
                            <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' onChange={(e, data) => setClientD({...clientD, Gouv: data.value })} />  
                           
                        </div> */}
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Adresse:</h5>
                            <Form>
                                <TextArea  rows="3" onKeyPress={event => OnKeyPressFunc(event)} placeholder='designer votre article' className='w-100 shadow-sm rounded mb-3' onChange={(e) => setClientD({...clientD, Adress: e.target.value })}/>
                            </Form> 
                        </div>
                        <div className='text-end mb-5'>
                            <Button  onClick={SaveClient} disabled={saveBtnState} className='text-end rounded-pill bg-system-btn ' positive>  <Icon name='save outline' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                    </div>
                    <div className='col-lg-4 d-none d-lg-block align-self-center'>
                        <div className='text-center'>
                                <img src='https://assets.ansl.tn/Images/usful/client-add.svg' width='80%'  height='200px' /> 
                        </div> 
                    </div>
                </div>
            </Bounce>
    </> );
}

export default AjouterClient;