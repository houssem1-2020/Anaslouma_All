import React, { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { _ } from "gridjs-react";
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Button,  Icon, Modal } from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function CommandePage() {
    /*#########################[Const]##################################*/
    let [tableData, setTableData] = useState([SKLT.STableSlt]);
    const [modalS, setModalS] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState([])
    let CmdData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`));
    let UID = CmdData.CID;
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    const navigate = useNavigate();

    /*#########################[Useeffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCommandeLink}/mescommandes`, {
          tag: GConf.SystemTag,
          UID: UID,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([
                    
            _(<img className='rounded-circle' width="40px" src="https://system.anaslouma.tn/Assets/images/facture.jpg" alt="user-img" />),
            getData.C_ID,
            getData.Name,
            new Date(getData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            // new Date(getData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Totale,
            _(<StateCard status={getData.State} />),
            _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/mc/info/${getData.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setTableData(testTable)
        }).catch((error) => {
          if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              let testTable = []
              Offline.commandes.map( (getData) => testTable.push([
                _(<img className='rounded-circle' width="40px" src="https://system.anaslouma.tn/Assets/images/facture.jpg" alt="user-img" />),
                getData.C_ID,
                getData.Name,
                new Date(getData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                // new Date(getData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                getData.Totale,
                _(<StateCard status={getData.State} />),
                _( <a  className='data-link-modal'  onClick={() => openEditModal(getData,true)} ><b> <span className='bi bi-arrows-fullscreen'></span> </b></a>),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/mc/info/${getData.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
                ],))
                setTableData(testTable)
          }
      });
    }, [])
        
    
    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }
    const openEditModal = (event,selected) =>{
      setSelectedArticle(event)
      setModalS(true)
  }
    /*#########################[Card]##################################*/
    const StateCard = ({ status }) => {
      const statusCard = React.useCallback(() => {
        switch(status) {
          case 'W': 
            return <span className="badge bg-warning "> En Attent </span>;
          
          case 'A': 
            return <span className="badge bg-success"> Acepteé </span>;
          
          case 'R': 
            return <span className="badge bg-danger"> Refuseé </span>;

          default: 
            return <span className="badge bg-secondary">Indefinie</span>;
          
        }
      }, [status]);
    
      return (
        <div className="container">
          {statusCard()}
        </div>
      );
    };


    return ( <>
        <BackCard data={InputLinks.backCard.mc}/>
        <br />
        <div className='container-fluid'>
            <TableGrid tableData={tableData} columns={['*','ID','Client', 'Passé le', 'Totale','Etat','X','Voir']} />
        </div>
        <Modal
              size='small'
              open={modalS}
              closeIcon
              onClose={() => setModalS(false)}
              onOpen={() => setModalS(true)}
          >
              <Modal.Header>
                  <h4 className='mb-0'>{selectedArticle.Name}</h4>
                  <h6>Voulu Le : {new Date(selectedArticle.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</h6>
                </Modal.Header>
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
                          <Button className='rounded-pill bg-system-btn'   onClick={ (e) => NavigateFunction(`/C/L/mc/info/${selectedArticle.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>
              </Modal.Actions>
      </Modal>
        </> );
}

export default CommandePage