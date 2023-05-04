import React, {useEffect,useState}  from 'react';
import GConf from '../../AssetsM/generalConf';
import SubNav from '../Assets/subNav';
import { _ } from "gridjs-react";
import axios from 'axios';
import {Fade } from 'react-reveal';
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import GoBtn from '../Assets/goBtn';
import TableImage from '../Assets/tableImg';
import { Button , Divider, Icon, Modal, Statistic} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';

function ControlPage() {
  /*#########################[Const]##################################*/
  let [camionList, setCamionList] = useState([ SKLT.TableSlt ]); 
  let [loadingPage, setLoadingP] = useState(false); 
  const navigate = useNavigate();
  let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
  const [modalS, setModalS] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState([])

  /*#########################[UseEffect]##################################*/
  useEffect(() => {
    axios.post(`${GConf.ApiLink}/caisses`, {
        PID: GConf.PID,
      })
      .then(function (response) {
        console.log(response.data)
        setLoadingP(true)
         let testTable = []
          response.data.map( (getData) => testTable.push([
         _(<TableImage image='camion.jpg' />),
         getData.Cam_Name,
         getData.Matricule,
         getData.Chauffeur,
         getData.Fond,
         getData.Recette,
         _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
         _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/cm/info/${getData.Cam_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setCamionList(response.data)
      }).catch((error) => {
        if(error.request) {
          toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des ancien Camion  </div></>, GConf.TostInternetGonf)   
          let testTable = []
          Offline.camion.map( (getData) => testTable.push([
          _(<TableImage image='camion.jpg' />),
          getData.Cam_Name,
          getData.Matricule,
          getData.Chauffeur,
          getData.Fond,
          getData.Recette,
          _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
          _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/cm/info/${getData.Cam_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
          ],))
          setCamionList(Offline.camion)
        }
      });
    }, [])
    
  /*#########################[Function]##################################*/
  const NavigateFunction = (link) => {  navigate(link) }
  const openEditModal = (event,selected) =>{
    setSelectedArticle(event)
    setModalS(true)
  }

  /*#########################[Function]##################################*/
  const  CamionCard = (props) =>{
      return(<>
          <div className='col-12 col-md-4 mb-3'>
            <div className='card card-body border-div  shadow-sm h-100 bg-hover-card-st'>
                    <div className="text-center">
                            <div className='row mb-1'>
                                <div className='col-4 align-self-center text-center'><img src="https://familia.anaslouma.tn/Assets/images/caisse.png" className="rounded-circle" width="50px" /></div>
                                <div className='col-8 align-self-center text-start'><h4 className='mt-2'><a  className='data-link-modal'  onClick={() => openEditModal(props.data,true)} ><b> {loadingPage ? props.data.CA_Name : SKLT.BarreSkl } </b></a> </h4> </div>
                            </div>
                            {/* <h6 className="text-secondary">  {loadingPage ? <><span className="bi bi-truck"></span> : { props.data.Matricule } | <span className="bi bi-person"></span> :  { props.data.Chauffeur } </>: SKLT.BarreSkl} </h6> */}
                            <h5 className="text-secondary mt-0 mb-2">  {loadingPage ? <><span className="bi bi-box2 "></span> :  {props.data.Recette}  | <span className="bi bi-coin"></span> : {parseInt(props.data.Caisse_Fond).toFixed(3)}  </>: SKLT.BarreSkl} </h5>
                    </div>
                    <Button className='rounded-pill bg-system-btn mt-2' size='mini' onClick={ (e) => NavigateFunction(`/S/ca/info/${props.data.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
            </div>
          </div>
      </>)
  }

  return ( <>
          <Fade>
            <SubNav dataForNav={GConf.SubNavs.camion} />
              <br />
              {/* <TableGrid tableData={camionList} columns={GConf.TableHead.camion} /> */}
              {
                loadingPage ? 
                  <div className='row'>
                    {
                      camionList.map( (data,index) => <CamionCard key={index}  data={data} />)
                    }
                  </div>
                :
                <>Loading</>
              }
          </Fade>
          <Modal
              size='mini'
              open={modalS}
              closeIcon
              onClose={() => setModalS(false)}
              onOpen={() => setModalS(true)}
          >
              <Modal.Header><h4>{selectedArticle.Cam_Name}</h4></Modal.Header>
              <Modal.Content>
                      <table className='table table-striped'>
                        <tbody>
                            <tr>
                                <td>ID : </td> 
                                <td>{selectedArticle.Cam_ID}</td> 
                            </tr>
                            <tr>
                                <td>Matricule : </td> 
                                <td>{selectedArticle.Matricule}</td> 
                            </tr>
                            <tr>
                                <td>CHauffeur : </td> 
                                <td>{selectedArticle.Chauffeur}</td> 
                            </tr>
                            <tr>
                                <td>Identifiant : </td> 
                                <td>{selectedArticle.Identifiant}</td> 
                            </tr>
                            <tr>
                                <td>Mot de passe  :</td> 
                                <td>{selectedArticle.Pasword}</td> 
                            </tr>
                          </tbody>
                      </table> 
              </Modal.Content>
              <Modal.Actions>
                          <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                          <Button className='rounded-pill bg-system-btn'   onClick={ (e) => NavigateFunction(`/S/cm/info/${selectedArticle.Cam_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
              </Modal.Actions>
      </Modal>
    </> );
}

export default ControlPage;