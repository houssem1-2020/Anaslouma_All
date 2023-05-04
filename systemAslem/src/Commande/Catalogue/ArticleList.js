import React, { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { Button, Icon } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import {Grid, _ } from "gridjs-react";
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function ArticleList() {
  /*#########################[Const]##################################*/
    let [tableData, setTableData] = useState([SKLT.STableSlt]); 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    const navigate = useNavigate();

  /*#########################[UseEffect]##################################*/
  useEffect(() => {
    axios.post(`${GConf.ApiCommandeLink}/stock/all`, {
        tag: GConf.SystemTag,
        genre : '1'
      })
      .then(function (response) {
         let testTable = []
         response.data.map( (getData) => testTable.push([
        _(<img className='rounded-circle' width="40px" height="40px" src={`https://assets.ansl.tn/Images/Articles/${getData.Photo_Path}`} alt="user-img" />),
         getData.A_Code,
         getData.Name,
         getData.Genre,
         getData.Quantite,
         getData.Prix_vente,
         getData.Prix_gros,
         _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/cg/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setTableData(testTable)
      }).catch((error) => {
        if(error.request) {
            toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
            let testTable = []
            Offline.stock.map( (getData) => testTable.push([
              _(<img className='rounded-circle' width="40px" height="40px" src={`https://assets.ansl.tn/Images/Articles/${getData.Photo_Path}`} alt="user-img" />),
               getData.A_Code,
               getData.Name,
               getData.Genre,
               getData.Quantite,
               getData.Prix_vente,
               getData.Prix_gros,
               _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/cg/info/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
              ],))
              setTableData(testTable)
        }
    });
    }, [])
  
  /*#########################[Functions]##################################*/
  const NavigateFunction = (link) => {  navigate(link) }

    return ( <>
        <BackCard data={InputLinks.backCard.cgList}/>
       
        <br />
        <div className='container-fluid'>
            <TableGrid tableData={tableData} commandes columns={['*','Code','Nom','Genre','Stock','Prix','PrixG','Voir']} />
        </div>
        </> );
}

export default ArticleList