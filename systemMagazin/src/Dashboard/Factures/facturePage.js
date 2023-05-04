import React, {useEffect,useState}  from 'react';
import GConf from '../../AssetsM/generalConf';
import SubNav from '../Assets/subNav';
import { _ } from "gridjs-react";
import axios from 'axios';
import { Fade } from 'react-reveal';
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import TableImage from '../Assets/tableImg';
import GoBtn from '../Assets/goBtn';
import { toast } from 'react-toastify';
import { Button , Icon, Modal} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';


function FacturePage() {
    /*#########################[Const]##################################*/
    const navigate = useNavigate();
    const [facturesList, setFactureList] = useState([SKLT.TableSlt]); 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
    const [modalS, setModalS] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState([])

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/facture`, {
            PID : GConf.PID,
        })
        .then(function (response) {
            let factureListContainer = []
            response.data.map( (getData) => factureListContainer.push([
            _(<TableImage image='facture.jpg' />),
            getData.T_ID,
            getData.CA_Name,
            getData.CL_Name,
            new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.T_Time,
            getData.Final_Value,
            _(<StateCard status={getData.Pay_State} />),
            _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/ft/info/${getData.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setFactureList(factureListContainer)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Les Donnée importeé sont les ancien donneé</div></>, GConf.TostInternetGonf) 
              let factureListContainer = []
                 Offline.facture.map( (getData) => factureListContainer.push([
                _(<TableImage image='facture.jpg' />),
                getData.T_ID,
                getData.Name,
                new Date(getData.T_Date).toLocaleDateString('fr-FR'),
                new Date(getData.T_Date).toLocaleDateString('fr-FR'),
                getData.Final_Value,
                getData.Cam_Name,
                _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/ft/info/${getData.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
                ],))
                setFactureList(factureListContainer)
            }
          });
    }, [])
    
    

    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }
    const openEditModal = (event,selected) =>{
        setSelectedArticle(event)
        setModalS(true)
    }

    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'Payee': return <StateCard color='success' text='Payeé' />;  
            case 'Credit': return <StateCard color='danger' text='Credit' /> ;
            case 'Waitting': return <StateCard color='warning' text='En Attend' /> ;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    };

    /*#########################[Card]##################################*/
    const CaisseCard = (props)=>{
      return(<>
         <div className='text-left'><span className='badge bg-system-btn p-2'>{props.caisseText}</span> </div>
      </>)
    }
    
    return (<>
        <Fade>
            <SubNav dataForNav={GConf.SubNavs.facture}/>
            <br />
            <TableGrid tableData={facturesList} columns={GConf.TableHead.facture} />
        </Fade>
        <Modal
                size='small'
                open={modalS}
                closeIcon
                onClose={() => setModalS(false)}
                onOpen={() => setModalS(true)}
            >
                <Modal.Header><h4>{selectedArticle.Name}</h4></Modal.Header>
                <Modal.Content scrolling>

                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                <th scope="col">No</th>
                                <th scope="col">Designiation</th>
                                <th scope="col">Qté</th>
                                <th scope="col">PUHT</th>
                                <th scope="col">PUTTC</th>
                                <th scope="col">Prix Net</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                selectedArticle.Articles ? 
                                <>
                                {
                                    JSON.parse(selectedArticle.Articles).map( (data,index) => 
                                        <tr key={index +1 }>
                                            <th scope="row">{index +1 }</th>
                                            <td>{data.Name}</td>
                                            <td>{data.Qte}</td>
                                            <td>{GConf.DefaultTva} %</td>
                                            <td>{data.Prix ? data.Prix.toFixed(3) : ''}</td>
                                            <td>{data.PU}</td>
                                        </tr>
                                    )
                                }
                                </>
                                :
                                <>
                                </>
                            }
                            </tbody>
                        </table> 
                </Modal.Content>
                <Modal.Actions>
                            <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                            <Button className='rounded-pill bg-system-btn'   onClick={ (e) => NavigateFunction(`/S/ft/info/${selectedArticle.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
                </Modal.Actions>
        </Modal>
    </>);
}

export default FacturePage;