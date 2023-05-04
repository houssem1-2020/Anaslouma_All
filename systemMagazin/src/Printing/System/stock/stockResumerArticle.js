import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';


function ResumerArticle(props) {
    let {code, s, e} = useParams()
    let [bonsEList, setBonEList] = useState([])
    let [bonsSList, setBonSList] = useState([])
    let [verCamionList, setVersCamion] = useState([])
    let [inFactureList, setInFactureList] = useState([])
    let [articledata, setArticleData] = useState([])

    useEffect(() => {
        //get vente List 
        axios.post(`${GConf.ApiLink}/stock/article/resumer`, {
            PID : GConf.PID,
            code: code,
            start: s,
            end : e
          })
          .then(function (response) {
                //setVenteList(response.data)
                setBonEList(response.data[0].bonE)
                setBonSList(response.data[0].bonS)
                setVersCamion(response.data[0].ForCamion)
                setInFactureList(response.data[0].InFacture)
          })

          //get article data
          axios.post(`${GConf.ApiLink}/stock/article`, {
            PID : GConf.PID,
            code: code,
          })
          .then(function (response) {
            setArticleData(response.data[0])
          })

    }, [])

    //function
    const GetTargetArticleQteFromFacture = (value,Qte) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject[Qte]
    }
    const GetTargetArticlePUFromFacture = (value) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject.PU
    }


    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>RESUMEE STOCK ARTICLE   </h2> 
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
               <h3 className='text-danger text-center'>###############[ Bon Eentre ]###############</h3> 
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Date</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Ajouter</th>
                            <th scope="col">Reste</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonsEList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{new Date(factDat.BE_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'OldQte')}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'NewQte')}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'PureQte')}</td>
                            </tr> 
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />

                <h3 className='text-danger text-center'>###############[ Bon Sortie ]###############</h3> 
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Date</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Retirer</th>
                            <th scope="col">Reste</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonsSList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{new Date(factDat.BE_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'OldQte')}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'NewQte')}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'PureQte')}</td>
                            </tr> 
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />

                <h3 className='text-danger text-center'>###############[ FACTURE  ]###############</h3> 
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Date</th>
                            <th scope="col">Clients</th>
                            <th scope="col">Quantite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inFactureList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{new Date(factDat.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{factDat.C_Name}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'Qte')}</td>
                            </tr> 
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />

                <h3 className='text-danger text-center'>###############[ Camion ]###############</h3> 
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Date</th>
                            <th scope="col">Camion</th>
                            <th scope="col">Qte Avant</th>
                            <th scope="col">Qte Ajouter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {verCamionList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{new Date(factDat.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{factDat.Camion	}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'Quantite')}</td>
                                <td>{GetTargetArticleQteFromFacture(factDat.Articles,'QteAjoute')}</td>
                            </tr> 
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />

            </div>
            <br />
            <br />
           
    </> );
}

export default ResumerArticle;