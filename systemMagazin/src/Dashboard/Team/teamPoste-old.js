import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { Button,  Form, Icon, Input, Loader, Modal, Pagination, TextArea } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import axios from 'axios';
import {toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';

const EditModal = ({setModalS,EditPoste,editPosteD,setEditPosteD,modalS}) =>{
    return(<>
            <Modal
                    size='mini'
                    open={modalS}
                    dimmer = 'blurring'
                    closeIcon
                    onClose={() => setModalS(false)}
                    onOpen={() => setModalS(true)}
                >
                    <Modal.Header><h4>Modifier Famille</h4></Modal.Header>
                    <Modal.Content>
                            
                            <h5 className='mb-1'>Famille</h5>
                            <Input icon='tags' iconPosition='left'  placeholder='Non de la famille' className='w-100 border-0 rounded ' value={editPosteD.Poste} onChange={(e) => setEditPosteD({...editPosteD, Name: e.target.value })}/>
                            <h5 className='mb-1'>Description </h5>
                            <Form>
                                <TextArea  rows="3" placeholder='Designer la famille '  className='w-100' value={editPosteD.Description} onChange={(e) => setEditPosteD({...editPosteD, Description: e.target.value })}/>
                            </Form>
                            <br />
                    </Modal.Content>
                    <Modal.Actions>
                                {/* <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> </Button> */}
                                <Button  className=' bg-system-btn rounded-pill' onClick={EditPoste}>  <Icon name='save' /> Enregistrer </Button>
                    </Modal.Actions>
            </Modal>
    </>)
}
const DeleteModal = ({setDeleteModalS,DeletePoste,editPosteD,setEditPosteD,deletemodalS}) =>{
    return(<>
            <Modal
                    size='mini'
                    open={deletemodalS}
                    dimmer = 'blurring'
                    closeIcon
                    onClose={() => setDeleteModalS(false)}
                    onOpen={() => setDeleteModalS(true)}
                    
                >
                    <Modal.Header><h4>Supprimer Famille</h4></Modal.Header>
                    <Modal.Content>
                            Voulez-Vous Vraimment Supprimer Cette Famille 
                            <br />
                            <br />
                            <div className='mb-0 p-0'><h5> Famille : {editPosteD.Poste}</h5></div>         
                            <div><h5> Description : {editPosteD.Description} </h5></div>
                    </Modal.Content>
                    <Modal.Actions>
                                {/* <Button className='rounded-pill' negative onClick={ () => setDeleteModalS(false)}> <span className='bi bi-x' ></span> </Button> */}
                                <Button negative className='rounded-pill' onClick={DeletePoste}>  <Icon name='trash' /> Supprimer </Button>
                    </Modal.Actions>
            </Modal>
    </>)
}

function TeamPoste() {
    /*#########################[Const]##################################*/
    const [postesListe, setPosteListe] = useState([]);
    const [displayFamille, setDisplayFamille] = useState([]);
    const [saveBtnState, setSaveBtnState] = useState('')
    const [updateFT, setUpdateFT] = useState('')
    const [posteD, setPosteD] = useState([])
    const [editPosteD, setEditPosteD] = useState([])
    const [modalS, setModalS] = useState(false)
    const [deletemodalS, setDeleteModalS] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [loading , setLoading] = useState(false)
    const [activePage , setActivePage] = useState(1)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/team/poste`, {
            PID : GConf.PID,
          })
          .then(function (response) {
            setPosteListe(response.data)
            setLoading(true)
            setDisplayFamille(response.data.slice(0,5));
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des Postes dans votre ordinateur  </div></>, GConf.TostInternetGonf)   
              setPosteListe(Offline.famille)
              setLoading(true)
              setDisplayFamille(Offline.famille.slice(0,5));
            }
          });
    }, [updateFT])
    
    /*#########################[Function]##################################*/
    const SavePoste = () => {
        if (!posteD.Poste) {toast.error("Non de La Poste est Invamlide !", GConf.TostErrorGonf)}
        else if (!posteD.Salaire) {toast.error("Description est Invamlide !", GConf.TostErrorGonf)}
        else if (!posteD.Description) {toast.error("Description est Invamlide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            setSaveBtnState('disabled')
            axios.post(`${GConf.ApiLink}/team/poste/ajouter`, {
                PID : GConf.PID,
                posteD : posteD,
            }).then(function (response) {
                console.log(response.data)
                if(response.data.affectedRows) {
                    toast.success("Famille Ajouter avec Suucess", GConf.TostSuucessGonf)
                    setPosteD([])
                    setLS(false)
                    setUpdateFT(Math.random() * 10)
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
    const EditPoste = () => {
        setLS(true)
        axios.post(`${GConf.ApiLink}/stock/familles/modifier`, {
            tag : GConf.PID,
            posteD : editPosteD,
        }).then(function (response) {
            if(response.data.affectedRows) {
                setModalS(false)
                toast.success("Famille Modifier avec Suucess", GConf.TostSuucessGonf)
                setUpdateFT(Math.random() * 10)
                setLS(false)
                SaveNotification('stockEditPoste',GConf.PID, editPosteD)
            }
            else{
                setModalS(false)
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                setLS(false)
            }
            
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Vous Pouvez pas modifier cette famille </div></>, GConf.TostInternetGonf)   
              setLS(false)
            }
          });
        

    }
    const DeletePoste = () =>{

    }
    const checkPosteExistance = () =>{
        if(posteD.Poste){
            if(posteD.Poste in postesListe) {
                toast.error("Famille Deja Exist", GConf.TostErrorGonf)
                setPosteD({...posteD, Name: '' })
            } 
        }
    }
    const openEditModal = (event,selected) =>{
        setEditPosteD({PK: event.PK , Poste:event.Poste, Description:event.Description})
        selected ? setModalS(true) : setDeleteModalS(true)
    }
    const handlePaginationChange = (e,{ activePage }) =>{
        setActivePage(activePage)
        let start = 5 * (activePage - 1)
        let end = 5*  activePage
        setDisplayFamille(postesListe.slice(start, end));
    }


   /*#########################[Card]##################################*/
    const PosteCard = (props) =>{
        return(<>
                <div className='card p-2 shadow-sm mb-2'>
                    <div className='row'>
                        <div className='col-8'>
                        <div className="d-flex p-0">
                                <div className="flex-shrink-0 align-self-center">
                                    <span className='bi bi-diagram-2-fill bi-md system-color'></span>
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <h6 className='mb-1'><b>{props.data.Poste}</b></h6>
                                    <small> {props.data.Description} </small>
                                </div>
                            </div>
                        </div>
                        <div className='col-2 align-self-center '>
                            <h6 className='mb-1'><b><span className='bi bi-currency-exchange'></span> : {props.data.Salaire}</b> D.T</h6>
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
            <BreadCrumb links={GConf.BreadCrumb.TeamPoste} />
            <br />
            <div className="row">
                <div className="col-12 col-lg-8">
                    <div className='mb-3 text-end'>
                        <Pagination  onPageChange={handlePaginationChange} defaultActivePage={1} firstItem={null} lastItem={null} totalPages={Math.floor((postesListe.length / 5))+1} />
                    </div>
                    {loading ?  
                    <>
                        {displayFamille.map( (data) => <PosteCard key={data.PK}  data={data} />)}
                    </>
                    : SKLT.CardList }
                
                </div>
                <div className="col-12 col-lg-4">
                <Bounce bottom>
                    <div className="card card-body border-div mb-4 sticky-top" style={{top:'70px' , zIndex:'1'}}>
                        <h4>Ajouter Poste</h4>
                        <h5 className='mb-1'>Poste </h5>
                        <Input icon='tags' iconPosition='left' value={posteD.Poste} placeholder='Poste ' className='w-100 border-0 rounded shadow-sm' onBlur={checkPosteExistance} onChange={(e) => setPosteD({...posteD, Poste: e.target.value })}/>
                        <h5 className='mb-1 mt-2'>Salaire </h5>
                        <Input icon='dollar sign' type='number' iconPosition='left' value={posteD.Salaire} placeholder='Salaire' className='w-100 border-0 rounded shadow-sm'   onChange={(e) => setPosteD({...posteD, Salaire: e.target.value })}/>
                        <h5 className='mb-1'>Experience Exigeé </h5>
                        <Form>
                            <TextArea  rows="3" placeholder='Experience ' value={posteD.Description} className='w-100 shadow-sm' onChange={(e) => setPosteD({...posteD, Description: e.target.value })}/>
                        </Form>
                        <br />
                        <div className='text-end'>
                            <Button  className={`text-end bg-system-btn rounded-pill ${saveBtnState}`} onClick={SavePoste}>   <Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>
                </Bounce>
                </div>
            </div>
            <EditModal setModalS={setModalS} EditPoste={EditPoste} editPosteD={editPosteD}  setEditPosteD={setEditPosteD} modalS={modalS} />
            <DeleteModal setDeleteModalS={setDeleteModalS} DeletePoste={DeletePoste} editPosteD={editPosteD}  setEditPosteD={setEditPosteD} deletemodalS={deletemodalS} />
        </> );

}

export default TeamPoste;