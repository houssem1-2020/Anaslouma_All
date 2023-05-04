import React, { useEffect, useState } from 'react';
import BreadCrumb from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import { Bounce } from 'react-reveal';
import { Button, Icon, Input, Loader } from 'semantic-ui-react';
import useGetCamion from '../Assets/Hooks/fetchCamion';
import { toast } from 'react-toastify';
import axios from 'axios';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';

function AjouterCamion() {
    /*#########################[Const]##################################*/
    const [camionD, setCamionD] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Offline`));

    /*#########################[Function]##################################*/
    const SaveCamion = () => {
        if (!camionD.Matricule) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!camionD.Cam_Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!camionD.Marque) {toast.error("Marque Invalide !", GConf.TostErrorGonf)}
        else if (!camionD.Chauffeur) {toast.error("Chauffeur Invalide !", GConf.TostErrorGonf)}
        else if (!camionD.Identifiant) {toast.error("Identifiant Invalide !", GConf.TostErrorGonf)}
        else if (!camionD.Password) {toast.error("Mot De Passe Invalide !", GConf.TostErrorGonf)}
        else{
                setLS(true)
                setSaveBtnState(true)
                axios.post(`${GConf.ApiLink}/camions/ajouter`, {
                    tag : GConf.SystemTag,
                    camionD : camionD,
                }).then(function (response) {
                    console.log(response.data)
                    if(response.data.affectedRows) {
                        toast.success("Camion Ajouteé !", GConf.TostSuucessGonf)
                        setLS(false)
                        SaveNotification('camionAjouter',GConf.SystemTag, camionD)
                    }
                    else {
                            toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                            setLS(false)
                            setSaveBtnState(false)
                        }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> Le Camion sera enregistrer sur votre ordinateur   </div></>, GConf.TostInternetGonf)   
                      Offline.camionToSave.push(camionD)
                      localStorage.setItem(`${GConf.SystemTag}_Offline`,  JSON.stringify(Offline));
                      setLS(false)

                    }
                });
                    
            }        
    }
    const GenrateKey = () =>{
        let ID = Math.random().toString(36).slice(2, 8);
        let PWD =  Math.floor(Math.random() * 1000000);
        setCamionD({...camionD, Identifiant: ID , Password:PWD})
    }
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
    }

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.CamionAdd} />
            <br />
            <Bounce left>
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                         <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Matricule:</h5>
                            <Input icon='key' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Matricule' className='w-100 border-0 shadow-sm rounded mb-1'  onChange={(e) => setCamionD({...camionD, Matricule: e.target.value })}/>
                         </div>
                         <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom:</h5>
                            <Input icon='truck' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Nom' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setCamionD({...camionD, Cam_Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Marque:</h5>
                            <Input icon='star' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Marque' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setCamionD({...camionD, Marque: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Chauffeur:</h5>
                            <Input icon='user' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Chauffeur' className='w-100 border-0 shadow-sm rounded mb-1' onChange={(e) => setCamionD({...camionD, Chauffeur: e.target.value })}/>
                        </div>
                        <div className='row mb-3'>
                                <div className='col-12 col-lg-6'>
                                    <h5 className='mb-1'>Identifiant:</h5>
                                    <Input icon='linkify' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='identifiant'  className='w-100 border-0 shadow-sm rounded mb-3' value={camionD.Identifiant} onChange={(e) => setCamionD({...camionD, Identifiant: e.target.value })} />
                                </div>
                                <div className='col-9 col-lg-5'>
                                    <h5 className='mb-1'>Mot De Pass: </h5>
                                    <Input icon='eye' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Nom' className='w-100 border-0 shadow-sm rounded mb-3' value={camionD.Password} onChange={(e) => setCamionD({...camionD, Password: e.target.value })}/>
                                </div>
                                <div className='col-3 col-lg-1 align-self-center'>
                                   <Button onClick={GenrateKey} className="rounded-pill " icon='random'></Button>
                                </div>
                        </div> 
                        <div className='text-end mb-5'>
                            <Button  onClick={SaveCamion}  disabled={saveBtnState} className={`text-end rounded-pill bg-system-btn`} positive>  <Icon name='save outline' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                    </div>
                    <div className='col-lg-4 d-none d-lg-block align-self-center'>
                        <div className='text-center'>
                                <img src='https://assets.ansl.tn/Images/usful/camion-add.svg' width='80%'  height='200px' /> 
                        </div> 
                    </div>
                </div>
            </Bounce>
    </> );
}

export default AjouterCamion;