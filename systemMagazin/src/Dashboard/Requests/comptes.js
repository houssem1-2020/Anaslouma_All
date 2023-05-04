import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { Button, Dimmer, Form, Icon, Input, Loader, Modal, Pagination, Select, TextArea } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import axios from 'axios';
import {toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';

const EditModal = ({setModalS,EditCompte,editCompteD,setCompteEdit,modalS}) =>{
    return(<>
            <Modal
                    size='mini'
                    open={modalS}
                    dimmer = 'blurring'
                    closeIcon
                    onClose={() => setModalS(false)}
                    onOpen={() => setModalS(true)}
                >
                    <Modal.Header><h4>Modifier Region</h4></Modal.Header>
                    <Modal.Content> 
                            <h5 className='mb-1 mt-2'>Nom & Prenom  </h5>
                                <Input icon='user plus' iconPosition='left' value={editCompteD.Name} placeholder='Nom & Prenom' className='w-100 border-0 rounded ' onChange={(e) => setCompteEdit({...editCompteD, Name: e.target.value })}/>  
                            <h5 className='mb-1 mt-2'>Identifiant  </h5>
                                <Input icon='user plus' iconPosition='left' value={editCompteD.Identifiant} placeholder='Identifiant' className='w-100 border-0 rounded ' onChange={(e) => setCompteEdit({...editCompteD, Identifiant: e.target.value })}/>  
                            <h5 className='mb-1 mt-2'>Mot De Passe </h5>
                                <Input icon='key' iconPosition='left' value={editCompteD.Password} placeholder='Mot De Passe' className='w-100 border-0 rounded ' onChange={(e) => setCompteEdit({...editCompteD, Password: e.target.value })}/>
                            <br />
                    </Modal.Content>
                    <Modal.Actions>
                                <Button  className=' bg-system-btn rounded-pill' onClick={EditCompte}>  <Icon name='save' /> Enregistrer </Button>
                    </Modal.Actions>
            </Modal>
    </>)
}
const DeleteModal = ({setDeleteModalS,DeleteRegion,editCompteD,setCompteEdit,deletemodalS}) =>{
    return(<>
            <Modal
                    size='mini'
                    open={deletemodalS}
                    dimmer = 'blurring'
                    closeIcon
                    onClose={() => setDeleteModalS(false)}
                    onOpen={() => setDeleteModalS(true)}
                    
                >
                    <Modal.Header><h4>Supprimer Region</h4></Modal.Header>
                    <Modal.Content>
                            Voulez-Vous Vraimment Supprimer Cette Region 
                            <br />
                            <br />
                            <div className='mb-0 p-0'><h5> Gouvernorat : {editCompteD.Gouv}</h5></div>         
                            <div><h5> Localisation : {editCompteD.Localisation} </h5></div>
                    </Modal.Content>
                    <Modal.Actions>
                                {/* <Button className='rounded-pill' negative onClick={ () => setDeleteModalS(false)}> <span className='bi bi-x' ></span> </Button> */}
                                <Button negative className='rounded-pill' onClick={DeleteRegion}>  <Icon name='trash' /> Supprimer </Button>
                    </Modal.Actions>
            </Modal>
    </>)
}

function ComptesCommandes() {
        /*########################[Const]############################ */
        const [comptesList, setComptes] = useState([]);
        const [displayComptes, setDisplayComptes] = useState([]);
        const [saveBtnState, setSaveBtnState] = useState('')
        const [updateFT, setUpdateFT] = useState('')
        const [compteData, setCompteData] = useState([])
        const [editCompteD, setCompteEdit] = useState([])
        const [modalS, setModalS] = useState(false)
        const [deletemodalS, setDeleteModalS] = useState(false)
        const [loaderState, setLS] = useState(false)
        const [loading , setLoading] = useState(false)
        const [activePage , setActivePage] = useState(1)
    
        const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    
        /*########################[UseEffect]############################ */
        useEffect(() => {
            axios.post(`${GConf.ApiLink}/commande/comptes`, {
                tag: GConf.PID,
              })
              .then(function (response) {
                setComptes(response.data)
                setLoading(true)
                setDisplayComptes(response.data.slice(0,5));
              }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les regions </div></>, GConf.TostInternetGonf)   
                  setComptes([])
                  setLoading(true)
                  setDisplayComptes([].slice(0.5))
                }
              });
        }, [updateFT])
        
        /*########################[Functionj]############################ */

        const SaveCompte = () => {
            if (!compteData.Name) {toast.error("Non  est Invalide !", GConf.TostErrorGonf)}
            else if (!compteData.Identifiant) {toast.error("Identifiant est Invalide !", GConf.TostErrorGonf)}
            else if (!compteData.Password) {toast.error("MDP est Invalide !", GConf.TostErrorGonf)}
            else{
    
                setLS(true)
                axios.post(`${GConf.ApiLink}/commande/comptes/ajouter`, {
                    PID : GConf.PID,
                    compteData : compteData,
                }).then(function (response) {
                    if(response.data.affectedRows) {
                        setSaveBtnState('disabled')
                        toast.success("Compte Ajouter avec Suucess", GConf.TostSuucessGonf)
                        setCompteData([])
                        setLS(false)
                        setUpdateFT(Math.random() * 10)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de sauvgarder la regions   </div></>, GConf.TostInternetGonf)   
                      setLS(false)
                    }
                  });
            }
        }
        const EditCompte = () => {
            setLS(true)
            axios.post(`${GConf.ApiLink}/commande/comptes/modifier`, {
                PID : GConf.PID,
                editCompteD : editCompteD,
            }).then(function (response) {
                console.log(response.data)
                if(response.data.affectedRows) {
                    setModalS(false)
                    toast.success("Compte Modifier avec Suucess", GConf.TostSuucessGonf)
                    setUpdateFT(Math.random() * 10)
                    setLS(false)
                }
                else{
                    setModalS(false)
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
                
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier la regions  </div></>, GConf.TostInternetGonf)   
                  setLS(false)
                }
              });
            
    
        }
        const DeleteRegion = () =>{
    
        }
        const checkComptesExistance = () =>{
            if(compteData.Name){
                if(compteData.Name in comptesList) {
                    toast.error("Famille Deja Exist", GConf.TostErrorGonf)
                    setCompteData({...compteData, Name: '' })
                } 
            }
        }
    
        const openEditModal = (event,selected) =>{
            setCompteEdit({PK: event.PK , CID:event.CID, Name:event.Name, Identifiant:event.Identifiant, Password:event.Password})
            selected ? setModalS(true) : setDeleteModalS(true)
        }
        const handlePaginationChange = (e,{ activePage }) =>{
            setActivePage(activePage)
            let start = 5 * (activePage - 1)
            let end = 5*  activePage
            setDisplayComptes(comptesList.slice(start, end));
        }
    
    
        /*########################[Card]############################ */
        const CompteCard = (props) =>{
            return(<>
                    <div className='card p-2 shadow-sm mb-2'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className="d-flex p-0">
                                    <div className="flex-shrink-0 align-self-center">
                                        <span className='bi bi-person-circle bi-md system-color'></span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className='mb-1'>{props.data.Name}</h6>
                                        <small> {props.data.CID} </small>
                                    </div>
                                </div>
                            </div>
                            <div className='col-4 align-self-center'>
                                    <h5 className='mb-1'><span className='bi bi-person '></span> {props.data.Identifiant}</h5>
                                    <h5 className='mb-1 mt-0'><span className='bi bi-key '></span> {props.data.Password}</h5>
                            </div>
                            <div className='col-2 align-self-center text-end'>
                                    <Button  icon='edit outline' size='mini' className='rounded-circle bg-system-btn' onClick={() => openEditModal(props.data,true)}/>
                                    <Button  icon='trash alternate' size='mini' className='rounded-circle bg-danger text-white' onClick={() => openEditModal(props.data,false)}/>
                            </div>
                        </div>
                    </div>
            </>)
        }
    
        return ( <>
                <BreadCrumb links={GConf.BreadCrumb.RequestCompte} />
                <br />
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className='mb-3 text-end'>
                            <Pagination  onPageChange={handlePaginationChange} defaultActivePage={1} firstItem={null} lastItem={null} totalPages={Math.floor((comptesList.length / 5))+1} />
                        </div>
                        {loading ?  
                        <>
                            {displayComptes.map( (data) => <CompteCard key={data.PK}  data={data} />)}
                        </>
                        : SKLT.CardList }
                    
                    </div>
                    <div className="col-12 col-lg-4">
                    <Bounce bottom>
                        <div className="card card-body shadow-sm mb-4 sticky-top border-div" style={{top:'70px' , zIndex:'1'}}>
                            <h4>Ajouter Compte</h4>
                            <h5 className='mb-1 mt-2'>Nom & Prenom  </h5>
                                <Input icon='user plus' iconPosition='left' value={compteData.Name} placeholder='Nom & Prenom' className='w-100 border-0  shadow-sm' onBlur={checkComptesExistance} onChange={(e) => setCompteData({...compteData, Name: e.target.value })}/>  
                            <h5 className='mb-1 mt-2'>Identifiant  </h5>
                                <Input icon='user plus' iconPosition='left' value={compteData.Identifiant} placeholder='Identifiant' className='w-100 border-0 shadow-sm ' onBlur={checkComptesExistance} onChange={(e) => setCompteData({...compteData, Identifiant: e.target.value })}/>  
                            <h5 className='mb-1 mt-2'>Mot De Passe </h5>
                                <Input icon='key' iconPosition='left' value={compteData.Password} placeholder='Mot De Passe' className='w-100 border-0 shadow-sm ' onBlur={checkComptesExistance} onChange={(e) => setCompteData({...compteData, Password: e.target.value })}/>
                            <br />
                            <div className='text-end'>
                                <Button  className={`text-end bg-system-btn rounded-pill ${saveBtnState}`} onClick={SaveCompte}>   <Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                            </div>
                        </div>
                    </Bounce>
                    </div>
                </div>
                <EditModal setModalS={setModalS} EditCompte={EditCompte} editCompteD={editCompteD}  setCompteEdit={setCompteEdit} modalS={modalS} />
                <DeleteModal setDeleteModalS={setDeleteModalS} DeleteRegion={DeleteRegion} editCompteD={editCompteD}  setCompteEdit={setCompteEdit} deletemodalS={deletemodalS} />
        </> );
}

export default ComptesCommandes;