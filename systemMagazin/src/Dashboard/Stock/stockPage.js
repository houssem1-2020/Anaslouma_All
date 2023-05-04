import React, {useEffect,useState}  from 'react';
import GConf from '../../AssetsM/generalConf';
import SubNav from '../Assets/subNav';
import { _ } from "gridjs-react";
import axios from 'axios';
import {Fade } from 'react-reveal';
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import TableImage from '../Assets/tableImg';
import { toast } from 'react-toastify';
import { Button , Icon, Modal, Transition} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';

function StockPage() {

    /*#########################[Const]##################################*/
    const navigate = useNavigate();
    let [articleList, setArticleList] = useState([SKLT.TableSlt]); 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
    const [modalS, setModalS] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState([])

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
      axios.post(`${GConf.ApiLink}/stock`, {
          PID : GConf.PID,
        })
        .then(function (response) {
          console.log(response)
          if (!response.data) {
                toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
          } else {
              let articleListContainer = []
              response.data.map( (getData) => articleListContainer.push([
                _(<TableImage image={getData.Photo_Path} forStock onClick={() => openEditModal(getData,true)}/>),
                getData.A_Code,
                getData.Name,
                getData.Genre,
                getData.Quantite,
                getData.Prix_achat.toFixed(3),
                getData.Prix_vente.toFixed(3),
                _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/sk/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>),
              ],))
              setArticleList(articleListContainer) 
          }
        }).catch((error) => {
          if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des article dans votre ordinateur </div></>, GConf.TostInternetGonf) 
            let articleListContainer = []
            Offline.stock.map( (getData) => articleListContainer.push([
                _(<TableImage image={getData.Photo_Path} forStock/>),
                getData.A_Code,
                _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> {getData.Name} </b></a>),
                getData.Genre,
                getData.Quantite,
                getData.Prix_achat.toFixed(3),
                getData.Prix_vente.toFixed(3),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/sk/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
              ],))
              setArticleList(articleListContainer)
            }
        });
    }, [])



    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }
    const openEditModal = (event,selected) =>{
      setSelectedArticle(event)
      setModalS(true)
    }
    
    
    return (<>
              <SubNav dataForNav={GConf.SubNavs.Stock} />
              <br />
              {/* Lazem tet7at linna beach ma tehlekch el dropdowm menu  */}
              <Fade> 
                <TableGrid tableData={articleList} columns={GConf.TableHead.stock} />
              </Fade> 
              <Transition animation='scale' duration={500}> 
              <Modal
                      size='small'
                      open={modalS}
                      closeIcon
                      onClose={() => setModalS(false)}
                      onOpen={() => setModalS(true)}
                  >
                      <Modal.Header><h4>{selectedArticle.Name}</h4></Modal.Header>
                      <Modal.Content>
                              <div className='row'>
                                  <div className='col-4'> <img src={`https://assets.ansl.tn/Images/Articles/${selectedArticle.Photo_Path}`} className='img-responsive' width='80%' height='200px' /></div>
                                  <div className='col-8 align-self-center'>
                                        <table className='table table-striped'>
                                        <tbody>
                                              <tr>
                                                 <td>Code : </td> 
                                                 <td>{selectedArticle.A_Code}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Achat : </td> 
                                                 <td>{selectedArticle.Prix_achat ? (selectedArticle.Prix_achat).toFixed(3) : ''}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Vente : </td> 
                                                 <td>{selectedArticle.Prix_vente ? (selectedArticle.Prix_vente).toFixed(3) : ''}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Gros :</td> 
                                                 <td>{selectedArticle.Prix_gros ? (selectedArticle.Prix_gros).toFixed(3) : ''}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Qauntite :</td> 
                                                 <td>{selectedArticle.Quantite}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Repture  :</td> 
                                                 <td>{selectedArticle.Repture}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Groupage : </td> 
                                                 <td>{selectedArticle.Groupage}</td> 
                                              </tr>
                                              <tr>
                                                 <td>Description</td> 
                                                 <td>{selectedArticle.Detail}</td> 
                                              </tr>
                                          </tbody>
                                        </table>
                                  </div>
                              </div>  
                      </Modal.Content>
                      <Modal.Actions>
                                  <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                                  <Button className='rounded-pill bg-system-btn'   onClick={ (e) => NavigateFunction(`/S/sk/info/${selectedArticle.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
                      </Modal.Actions>
              </Modal>  
              </Transition>
        </>);
}

export default StockPage;