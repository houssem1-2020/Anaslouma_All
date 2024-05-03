import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

function StockRepture() {
    /*#########################[Const]##################################*/
     let {RID} = useParams()

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        // axios.post(`${GConf.ApiLink}/User/Stock/repture`, {
        //     tag: userData.tag,
        //     genre : userData.genre,

        //   })
        //   .then(function (response) {
        //      let testTable = []
        //     response.data.map( (getData) => testTable.push([
                     
        //     _(<img className='rounded-circle' width="40px" src={`https://anaslouma.tn/Assets/images/Articles_Images/alimentaire/${getData.Photo_Path}`} alt="user-img" />),
        //     getData.A_Code,
        //     getData.Name,
        //      getData.Quantite,
        //      _(<h6><a href={`/User/L/Stock/info/${getData.A_Code}`} ><Button className='rounded-pill bg-system-btn' size='mini'><Icon  name='angle right' /></Button></a></h6>)
        //     ],))
        //     setArticleList(testTable)
        //   })
        }, [])

    /*#########################[Functions]##################################*/
    const PaymmentFunc = () =>{
        axios.post(`${GConf.ApiLink}/User/paymment`, {
            RID : RID,
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
              console.log(response.data)
              window.location = response.data.url
          })
    }

    /*#########################[Component]##################################*/ 
    


    return (  <>
        <BackCard data={InputLinks.backCard.cl}/>
        <br />
        <div className='container-fluid'>
             
        </div>
 
    </>);
}


export default StockRepture;