import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';

function StockRepture() {
    /*#########################[Const]##################################*/
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let [articleList, setArticleList] = useState([])

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/User/Stock/repture`, {
            tag: userData.tag,
            genre : userData.genre,

          })
          .then(function (response) {
             let testTable = []
            response.data.map( (getData) => testTable.push([
                     
            _(<img className='rounded-circle' width="40px" src={`https://anaslouma.tn/Assets/images/Articles_Images/alimentaire/${getData.Photo_Path}`} alt="user-img" />),
            getData.A_Code,
            getData.Name,
             getData.Quantite,
             _(<h6><a href={`/User/L/Stock/info/${getData.A_Code}`} ><Button className='rounded-pill bg-system-btn' size='mini'><Icon  name='angle right' /></Button></a></h6>)
            ],))
            setArticleList(testTable)
          })
        }, [])

    /*#########################[Functions]##################################*/
    

    /*#########################[Component]##################################*/ 
    


    return (  <>
        <BackCard data={InputLinks.backCard.rp}/>
        <br />
        <div className='container-fluid'>
            <TableGrid tableData={articleList} columns={['*','Code','Name','Qte','Voir']} />
        </div>
 
    </>);
}


export default StockRepture;