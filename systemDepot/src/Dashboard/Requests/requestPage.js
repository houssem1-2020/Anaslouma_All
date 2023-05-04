import React, {useEffect,useState}  from 'react';
import GConf from '../../AssetsM/generalConf';
import { _ } from "gridjs-react";
import axios from 'axios';
import { Fade } from 'react-reveal';
import SKLT from '../../AssetsM/usedSlk';
import TableGrid from '../Assets/tableGrid';
import SubNav from '../Assets/subNav';
import GoBtn from '../Assets/goBtn';
import TableImage from '../Assets/tableImg';
import { toast } from 'react-toastify';
import { Button , Icon, Modal, Tab} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';


function RequestPage() {
    /*#########################[Const]##################################*/
    let [commandeList, setCommandeList] = useState([SKLT.TableSlt]); 
    const [modalS, setModalS] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedArticle, setSelectedArticle] = useState([])

    const navigate = useNavigate();
    const panes = [
      {
        menuItem: { key: 'attent',  content: <span className='text-warning'><b><span className='bi bi-hourglass-split'></span> En Attent</b></span> , className:'rounded-pill'},
        render: () => <TableGrid tableData={loading ? [SKLT.TableSlt] : FetchByGenre('W')} columns={GConf.TableHead.request} />,
      },
      {
        menuItem: { key: 'accept',  content: <span className='text-success'><b><span className='bi bi-check-square-fill'></span> Accepteé</b></span> , className:'rounded-pill' },
        render: () => <TableGrid tableData={loading ? [SKLT.TableSlt] : FetchByGenre('A')} columns={GConf.TableHead.request} />,
      },
      {
        menuItem: { key: 'refuse',  content: <span className='text-danger'><b><span className='bi bi-x-square-fill'></span> Refuseé</b></span>, className:'rounded-pill' },
        render: () => <TableGrid tableData={loading ? [SKLT.TableSlt] : FetchByGenre('R')} columns={GConf.TableHead.request} />,
      },
    ]

   /*#########################[UseEfeect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/commande`, {
           tag: GConf.SystemTag,
        })
        .then(function (response) {
          if (!response.data) {
                toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
                setLoading(false)
          } else {
            setCommandeList(response.data)
            setLoading(false)

          }
        }).catch((error) => {
          if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger La Liste de  Commandes  </div></>, GConf.TostInternetGonf)   
            setCommandeList([])
          }
        });
    }, [])
    
   /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }
    const FetchByGenre = (genre) =>{
        let found = commandeList.filter(element => element.State === genre)
        let commandeContainer = []
              found.map( (commandeDate) => commandeContainer.push([          
                _(<TableImage image='commande.jpg' />),
                commandeDate.C_ID,
                commandeDate.Name,
                new Date(commandeDate.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                new Date(commandeDate.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                commandeDate.Totale,
                _(<StateCard status={commandeDate.State} />),
                _( <a  className='data-link-modal'  onClick={() => openEditModal(commandeDate,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/rq/info/${commandeDate.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
        return(commandeContainer)
    }
    const openEditModal = (event,selected) =>{
        setSelectedArticle(event)
        setModalS(true)
    }
    /*#########################[Card]##################################*/
    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'W': return <StateCard color='warning' text='En Attent' />;  
            case 'A': return <StateCard color='success' text='Acepteé' /> ;
            case 'R': return <StateCard color='danger' text='Refuseé' />;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    };
  
    return (<>
        <SubNav dataForNav={GConf.SubNavs.Commande} />
        <br />
        <Fade>
          {/* <TableGrid tableData={commandeList} columns={GConf.TableHead.request} /> */}
          <Tab menu={{ secondary: true }} panes={panes} />
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
                      <br />
                      <br />
                      <div>
                        <figcaption class="blockquote-footer">
                          {selectedArticle.Comments}
                        </figcaption>
                      </div>
                     
              </Modal.Content>
              <Modal.Actions>
                          <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                          <Button className='rounded-pill bg-system-btn'   onClick={ (e) => NavigateFunction(`/S/rq/info/${selectedArticle.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
              </Modal.Actions>
      </Modal>
    </>);
}

export default RequestPage;