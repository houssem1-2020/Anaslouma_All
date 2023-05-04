import React , { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import TableImage from '../../Dashboard/Assets/tableImg';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';

function StockList() {
  /*#########################[Const]##################################*/
  let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
  const camId = camData.Cam_ID; 
    let [tableData, setTableData] = useState([SKLT.STableSlt]); 
    let Offline = JSON.parse(localStorage.getItem("Offline"));
    const navigate = useNavigate();

  /*#########################[UseEffect]##################################*/
  useEffect(() => {
    axios.post(`${GConf.ApiCamionLink}/nv/stock`, {
        tag: GConf.SystemTag,
        camId : camId,
      })
      .then(function (response) {
         let testTable = []
        response.data.map( (getData) => testTable.push([
          _(<TableImage image={getData.Photo_Path} forStock/>),
        getData.A_Code,
        getData.Name,
         getData.Genre,
         getData.Prix_vente,
         getData.Qte,
         _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/sk/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setTableData(testTable)
      }).catch((error) => {
        if(error.request) {
          toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
          let testTable = []
          Offline.stock.map( (getData) => testTable.push([
          _(<TableImage image={getData.Photo_Path} forStock/>),
          getData.A_Code,
          getData.Name,
          getData.Genre,
          getData.Prix_vente,
          getData.Qte,
          _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/sk/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setTableData(testTable)
        }
    });
  }, [])

  /*#########################[Functions]##################################*/
  const NavigateFunction = (link) => {  navigate(link) }

  return ( <>
        <BackCard data={InputLinks.backCard.skList}/>
       
        <br />
        <div className='container-fluid'>
            <TableGrid tableData={tableData} columns={['*','Code','Name','Genre','Prix','Qte','Voir']} />
        </div>
  </> );
}

export default StockList;