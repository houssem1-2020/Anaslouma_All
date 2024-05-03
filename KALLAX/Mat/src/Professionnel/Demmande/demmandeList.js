import React, { useEffect, useState} from 'react';
import { Button, Icon, Input , Tab, Select, Modal, Loader} from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import { NavLink } from 'react-router-dom/dist';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom/dist';
import franceMap from '../../AssetsM/franceMap';
import SKLT from '../../AssetsM/usedSlk';
import { Suspense } from 'react';
import TableGrid from '../Assets/tableGrid';
import { _ } from 'gridjs-react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { SwipeableDrawer } from '@mui/material';
//import { io } from "socket.io-client"


const AcceptActionCard = ({accepterComment, setAccepterComment, selectedDemmande, UpdateDemmandeState}) => {
    return(<>
        <h4>Voulez vous acceptez Cette Dammnde  ! </h4>
         <Input type='text' className='mb-3' icon='comment' iconPosition='left' placeholder='Ajouter Commentaire' fluid onChange={(e) => setAccepterComment(e.target.value)} />
        <Button className='rounded-pill bg-success text-white' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'A', 'Accepter_Comment', accepterComment)} >Accepter le demande </Button>
    </>)
}
const ReatardActionCard = ({retarderDate, setRetarderDate, selectedDemmande, UpdateDemmandeState}) => {
    return(<>
        <h4>Entre la date de retardemment :  ! </h4>
        <Input fluid type='date' value={retarderDate} onChange={(e) => setRetarderDate(e.target.value)} />
        <br />
        <Button className='rounded-pill mt-2 bg-warning text-white text-center' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'RD', 'Retarder_Vers', retarderDate)} >Retarder la Demande </Button>
    </>)
}
const RejectActionCard = ({rejectCause, setRejectCause, selectedDemmande, UpdateDemmandeState}) => {
    const rejectionList = [
        {id:1, text:'Calendrier Pleinne', value:'Calendrier Pleinne'},
        {id:2, text:'Non Specialteé', value:'Non Specialteé'}
    ]
    return(<>
        <h4>Pourquoi voulez vous refuseé cette demmande ? </h4>
        <Select placeholder='Selectionnez un raison' fluid options={rejectionList} onChange={(e, { value }) => setRejectCause(value)} />
        <br />
        <Button className='rounded-pill bg-danger text-white mt-2 text-center' fluid onClick={() => UpdateDemmandeState(selectedDemmande, 'R', 'Refuser_Cause', rejectCause)} > Refusez Demande </Button>
    </>)
}

function InputLandingPage() {
    /*#########################[Const]###########################*/
    //const socket = io.connect(GConf.soketLink)
    const navigate = useNavigate();
    
    const [responseData, setResponseData] = useState({DemmandeListe:[], FavoriteListe:[], RequestList:[], PaymmentListe:[]})
    const [loading,setLoading] =useState(true)

    const [selectedAction , setSelectedAction] = useState('')
    const [selectedDemmande , setSelectedDemmande] = useState('')
    const [rejectCause , setRejectCause] = useState('')
    const [accepterComment , setAccepterComment] = useState('')
    const [retarderDate , setRetarderDate] = useState(new Date().toISOString().split('T')[0])
    
    const [openD, setOpenD] = useState(false)
    
    const [userData, setUserData] = useState({});
     

    /*#########################[UseEffect]###########################*/
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.post(`${GConf.ApiLink}/User/Landing`, {
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
            //console.log(response.data)
            if (!response.data) {
                  toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
                  setLoading(false)
            } else {
                setResponseData(response.data)
                //setUserData(response.data.UserData[0])
                setLoading(false)
            }
          })
        
    }, [])

    /*#########################[Function]###########################*/

    const OpenActionModal = (RIDS,value) =>{
        setSelectedDemmande(RIDS)
        setSelectedAction(value)
        setOpenD(true)
    }
    const UpdateDemmandeState = (RIDValue,StateToUPD, columToUpdate, valueToUpdate) =>{
        axios.post(`${GConf.ApiLink}/User/Demmande/Edit`, {
            RID : RIDValue,
            updateData : StateToUPD,
            suppData : {columToUpdate: columToUpdate, valueToUpdate: valueToUpdate}

          })
          .then(function (response) {
              console.log(response.data)
              setOpenD(false)
              //window.location = response.data.url
          })
    }


    /*#########################[Card]###########################*/
    
    const DemmandesCard = () => {
        const DemmandeItemCard = (props) =>{
            return(<>
            <div className='card card-body mb-2 shadow-sm border-div'>
                <div className='row'>
                        <div className='col-2 aign-self-center'><img src={`https://assets.ansl.tn/Images/kallax/user.gif`}  className='img-responsive rounded-circle border' width='40px'  height='40px'  /></div>
                        <div className='col-8 aign-self-center'>
                            <h5 className='mb-1 text-secondary mt-0'>{props.data.Name} </h5>
                            <small className='d-flex'> {new Date(props.data.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} | {props.data.R_Time.slice(0, -3)} </small> 
                        </div>
                        <div className='col-2'>
                            <Button className='bg-white text-success border rounded-circle' size='mini'  icon onClick={() => navigate(`/Prof/L/menu/demmande/action/${props.data.R_ID}`)} >  <span className='bi bi-chevron-double-right'></span></Button> 
                        </div>
                </div>
                <div className='card-body '>
                    <StateCard status={props.data.State} />
                    <div className='text-secondary mt-3'> <span className='bi bi-star'></span> Genre  : {props.data.Genre} </div>
                    <div className='text-secondary'><span className='bi bi-calendar'></span> Date voulu  : {new Date(props.data.Wanted_Day).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                    <div className='text-secondary'><span className='bi bi-map'></span> Localisation   : {JSON.parse(props.data.Localisation).Gouv} </div>
                </div>
                {props.data.Pay_Ammount ? <span>Action confirmeé est Payeé avec Succeé</span>
                :
                <div className='row'>
                        <div className='col-4 '>
                            <Button className=' text-success bg-transparent d-flex ' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`A`)} > <span className='bi bi-check'></span> Accepteé </Button> 
                        </div>
                        <div className='col-4 '>
                            <Button className=' text-primary bg-transparent d-flex' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`RD`)} > <span className='bi bi-arrow-clockwise'></span> Retardeé </Button> 
                        </div>
                        <div className='col-4 '>
                            <Button className=' text-danger bg-transparent d-flex' fluid size='small'  icon onClick={() => OpenActionModal(props.data.R_ID,`R`)} > <span className='bi bi-x'></span> Annuleé </Button> 
                        </div>  
                </div>
                }
            </div>
            </>)
        }
        const StateCard = ({ status }) => {
            const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
            const statusCard = React.useCallback(() => {
            switch(status) {
                case 'W': return <StateCard color='warning' text='En Attent' />;  
                case 'S': return <StateCard color='info' text='Vu' />;  
                case 'A': return <StateCard color='success' text='Acepteé' /> ;
                case 'R': return <StateCard color='danger' text='Refuseé' />;
                case 'RD': return <StateCard color='primary' text='Redirecteé' />;

                case 'RT': return <StateCard color='retarder' text='Retardeé' />;
                
                case 'LV': return <StateCard color='retarder' text='Livreé' />;
                case 'MD': return <StateCard color='redirecter' text='Modifieé' />;
                case 'PR': return <StateCard color='redirecter' text='Pret' />;
                case 'PI': return <StateCard color='retarder' text='Plus d info' />;

                case 'T': return <StateCard color='secondary' text='Termineé' />;
                default:  return <StateCard color='dark' text='Indefinie' />;    
            }
            }, [status]);
        
            return (
            <div className='mb-0'>
                {statusCard()}
            </div>
            );
        }
    
        return(<>
            {responseData.DemmandeListe.map((data,index) => <DemmandeItemCard key={index} data={data} />)}
            <br />
        </>)
    }


    return ( <>
            <BackCard data={InputLinks.backCard.cliste}/>
            <br />  
 
            <div className='container-fluid'>
                <DemmandesCard />
            </div>
 
            <SwipeableDrawer
                anchor={'bottom'}
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                PaperProps={{
                    style: {
                      borderRadius: '16px 16px 0 0', // Applying border radius only to top corners
                    },
                  }}
            >       
                    <br />
                    <br />
                    <div className='card-body  mb-4'>
                        {selectedAction == 'A' ? <AcceptActionCard accepterComment={accepterComment} setAccepterComment={setAccepterComment} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                        {selectedAction == 'R' ? <RejectActionCard rejectCause={rejectCause} setRejectCause={setRejectCause} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                        {selectedAction == 'RD' ? <ReatardActionCard retarderDate={retarderDate} setRetarderDate={setRetarderDate} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                    </div>
                    <br />
                    <br />
            </SwipeableDrawer>

            {/* <Modal
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                dimmer= 'blurring'
                className=' m-0 p-0'  
                >
                    
                <Modal.Content    >
                        
                        <div className='card-body mb-4'>
                            {selectedAction == 'A' ? <AcceptActionCard accepterComment={accepterComment} setAccepterComment={setAccepterComment} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                            {selectedAction == 'R' ? <RejectActionCard rejectCause={rejectCause} setRejectCause={setRejectCause} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                            {selectedAction == 'RD' ? <ReatardActionCard retarderDate={retarderDate} setRetarderDate={setRetarderDate} selectedDemmande={selectedDemmande} UpdateDemmandeState={UpdateDemmandeState} /> : <></> }
                        </div>
                </Modal.Content>
            </Modal> */}

        </> );
}

export default InputLandingPage;