import React, { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { _ } from "gridjs-react";
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Button,  Icon } from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function CommandePage() {
    /*#########################[Const]##################################*/
    let [tableData, setTableData] = useState([SKLT.STableSlt]);
    let CmdData = JSON.parse(localStorage.getItem(`Magazin_Gerant_LocalD`));
    let UID = CmdData.CID;
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Gerant_Offline`));
    const navigate = useNavigate();

    /*#########################[Useeffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiGerantLink}/mescommandes`, {
          tag: GConf.SystemTag,
          UID: UID,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([
                    
            _(<img className='rounded-circle' width="40px" src="https://system.anaslouma.tn/Assets/images/facture.jpg" alt="user-img" />),
            getData.C_ID,
            getData.Client,
            new Date(getData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            new Date(getData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Totale,
            _(<StateCard status={getData.State} />),
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
                getData.Client,
                new Date(getData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                new Date(getData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                getData.Totale,
                _(<StateCard status={getData.State} />),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/mc/info/${getData.C_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
                ],))
                setTableData(testTable)
          }
      });
    }, [])
        
    
    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }
      
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
            <TableGrid tableData={tableData} columns={GConf.TableHead.request} />
        </div>
        </> );
}

export default CommandePage