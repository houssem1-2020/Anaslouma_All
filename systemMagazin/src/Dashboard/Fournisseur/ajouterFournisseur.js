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

const FindInDirectory = ({inDirArticle, setInDirA,FindInDirectoryFunc, loaderState, OnKeyPressFunc}) =>{
    return(<>
      <div className='card card-body border-div shadow-sm mb-3 mt-4'>
          <h5>Recherche Dans La Base Abyedh </h5>
          <Input className='mb-4' placeholder='PID' onKeyPress={event => OnKeyPressFunc(event)} value={inDirArticle} onChange={(e) => setInDirA(e.target.value)} />
          <div className='text-end'>
              <Button  className='bg-system-btn rounded-pill' fluid onClick={() => FindInDirectoryFunc()}>   <Icon name='search' /> Recherche <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
          </div>
      </div>
    </>)
}


function AjouterFournisseur() {
    /*#########################[Const]##################################*/
    const  [fsList, setFSList] = useState([]); 
    const [fournisseurData, setFSData] = useState([])
    const [inDirArticle, setInDirA] = useState();
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [delegList ,setDelegList] = useState([]) 
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`)); 
    const fournisseurGenres = [
      { key: 1 , value: 'af', text: 'Alimentaire' },
      { key: 2 , value: 'af', text: 'Cosmetique' },
      { key: 3 , value: 'af', text: 'Medicale' },
    ]
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
      axios.post(`${GConf.ApiLink}/fournisseur`,{
        PID: GConf.PID
      })
      .then(function (response) {
          setFSList(response.data)
      }).catch((error) => {
          if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des client sur votre ordinateur  </div></>, GConf.TostInternetGonf)   
            setFSList(Offline.client)
          }
        });
    }, [])

    /*#########################[Functions]##################################*/
    const GetDelegList = (value) =>{
        setFSData({...fournisseurData, Gouv: value })
        let found = TunMap.Deleg.filter(element => element.tag === value)
        setDelegList([])
        setDelegList(found)
    }
    const checkFSExistance = () =>{
        if(fournisseurData.Code_Fiscale){
            const foundClient = fsList.find(element => element.Code_Fiscale === fournisseurData.Code_Fiscale)
            if (foundClient) {
                toast.error("Client Exist Deja", GConf.TostErrorGonf)
                setFSData({...fournisseurData, Code_Fiscale: '' })
            }
            
        }
    }
    const SaveFournisseur = (event) => {
        if (!fournisseurData.Code_Fiscale) {toast.error("Matricule Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Name) {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Phone) {toast.error("Phone Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Social_Name) {toast.error("Nom Sociale  Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Gouv) {toast.error("Gouvernorat Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Deleg) {toast.error("Delegation Invalide !", GConf.TostErrorGonf)}
        else if (!fournisseurData.Adress) {toast.error("Adresee Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/fournisseur/ajouter`, {
                PID : GConf.PID,
                fournisseurData : fournisseurData,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    setSaveBtnState(true)
                    toast.success("Client Ajouter !", GConf.TostSuucessGonf)
                    SaveNotification('clientAjouter',GConf.PID, fournisseurData)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                    }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Le client sera enregistrer sur votre ordinateur   </div></>, GConf.TostInternetGonf)   
                  Offline.clientToSave.push(fournisseurData)
                  localStorage.setItem(`${GConf.PID}_Offline`,  JSON.stringify(Offline));
                  setLS(false)
                  setSaveBtnState(true)
                }
              });
                    
        }
                
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
                    setFSData({ ...fournisseurData, Releted_PID: response.data.PID, Code_Fiscale: response.data.Matricule_F , Gouv: response.data.Gouv,   Name: response.data.Name, Phone : response.data.Phone , Adress : response.data.Adress })
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

    /*#########################[Card]##################################*/
    // const FindInDirectory = () =>{
    //   return(<>
    //     <div className='card card-body border-div shadow-sm mb-3 mt-4'>
    //         <h5>Recherche Dans l'annuaire Abyedh</h5>
    //         <Select className='mb-2' placeholder='Selectionner Gnres' options={fournisseurGenres} />
    //         <Input className='mb-4' placeholder='PID...' />
    //         <div className='text-end'>
    //             <Button  className='bg-system-btn rounded-pill' fluid onClick={() => FindInDirectoryFunc()}>   <Icon name='search' /> Recherche <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
    //         </div>
    //     </div>
    //   </>)
    // }
    
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.FournisseurAdd} />
            <br />
            <Bounce left>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-8'>
                         <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Matricule Fiscale:</h5>
                            <Input icon='key' iconPosition='left' placeholder='Matricule Fiscale' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Code_Fiscale} onBlur={checkFSExistance}  onChange={(e) => setFSData({...fournisseurData, Code_Fiscale: e.target.value })}/>
                         </div>
                         <div className='p-1  mb-2'>
                            <h5 className='mb-1'>Nom Et Prenon :</h5>
                            <Input icon='user' iconPosition='left' placeholder='Nom Et Prenon ' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Name} onChange={(e) => setFSData({...fournisseurData, Name: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Telephone :</h5>
                            <Input icon='phone' iconPosition='left' placeholder='Telephone ' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Phone} onChange={(e) => setFSData({...fournisseurData, Phone: e.target.value })} />
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Nom Sociale:</h5>
                            <Input icon='home' iconPosition='left' placeholder='Nom Sociale' className='w-100 border-0 shadow-sm rounded mb-1' value={fournisseurData.Social_Name} onChange={(e) => setFSData({...fournisseurData, Social_Name: e.target.value })}/>
                        </div>
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'>Geolocation</h5>
                            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={fournisseurData.gouv} onChange={(e, { value }) => GetDelegList(value)} />
                            <Select placeholder='Selectionnez Delegation ' fluid value={fournisseurData.Deleg} options={delegList} onChange={(e, { value }) => setFSData({...fournisseurData, Deleg: value })} />
                        </div>
                        {/* <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Map:</h5>
                            <Select placeholder='Choisir Une Region' options={clientMap}  className='w-100 shadow-sm rounded mb-3' onChange={(e, data) => setFSData({...fournisseurData, Gouv: data.value })} />  
                           
                        </div> */}
                        <div className='p-1 mb-2'>
                            <h5 className='mb-1'> Adresse:</h5>
                            <Form>
                                <TextArea  rows="3" placeholder='designer votre article' className='w-100 shadow-sm rounded mb-3' value={fournisseurData.Adress} onChange={(e) => setFSData({...fournisseurData, Adress: e.target.value })}/>
                            </Form> 
                        </div>
                        <div className='text-end mb-5'>
                            <Button  onClick={SaveFournisseur} disabled={saveBtnState} className='text-end rounded-pill bg-system-btn ' positive>  <Icon name='save outline' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
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

export default AjouterFournisseur;