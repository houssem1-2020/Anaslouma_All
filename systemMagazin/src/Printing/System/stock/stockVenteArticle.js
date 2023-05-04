import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function setPageSize() {
    const style = document.createElement('style');
    style.innerHTML = `@page {size: landscape}`;
    style.id = 'page-orientation';
    document.head.appendChild(style);
}

function VenteArticle(props) {
    let {code, s, e} = useParams()
    let [clientList, setClientList] = useState([])
    let [venteList, setVenteList] = useState([])
    let [articledata, setArticleData] = useState([])

    useEffect(() => {
        setPageSize();
        //get vente List 
        axios.post(`${GConf.ApiLink}/stock/article/vente`, {
            PID : GConf.PID,
            code: code,
            start: s,
            end : e
          })
          .then(function (response) {
                setVenteList(response.data)
    
          })

          //get article data
          axios.post(`${GConf.ApiLink}/stock/article`, {
            PID : GConf.PID,
            code: code,
          })
          .then(function (response) {
            setArticleData(response.data[0])
          })

          //get aclient List
          axios.get(`${GConf.ApiLink}/client`)
          .then(function (response) {
            setClientList(response.data)
    
          })
    }, [])

    //function
    const GetTargetArticleQteFromFacture = (value) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject.Qte
    }
    const GetTargetArticlePUFromFacture = (value) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject.PU
    }
    const GetTargetClientData = (value) =>{
        const searchObject= clientList.find((client) => client.Name == value);
        if (searchObject) {
            return searchObject.Code_Fiscale
        }
        
        
    }

    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>RESUMEE VENTE   </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Article : </b> {articledata.Name}</div>
                        <div className='text-secondary'><b>De: </b> {s} </div>
                        <div className='text-secondary'><b>Jusqu'a: </b> {e} </div>
                    </div>
                    <div className='col-6'>
                        
                    </div>
                </div>
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Facture</th>
                            <th scope="col">Date</th>
                            <th scope="col">Clients</th>
                            <th scope="col">M.F</th>
                            <th scope="col">Quantite</th>
                            <th scope="col">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venteList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{factDat.F_ID}</td>
                                <td>{new Date(factDat.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{factDat.C_Name}</td>
                                <td>{GetTargetClientData(factDat.C_Name)}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles)}</td>
                                <td>{GetTargetArticlePUFromFacture(factDat.Articles)}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>
            <br />
            <br />
           
    </> );
}

export default VenteArticle;