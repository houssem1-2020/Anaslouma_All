import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import BreadCrumb from '../../Assets/breadCrumb';
import {  _ } from "gridjs-react";
import TableGrid from '../../Assets/tableGrid';

function CamionArticleInfo() {
    /* ############################### Const ################################*/
    const {CID, code} = useParams()
    const [fondListCamion, setFonfListCamion] = useState([]);
    const [factureCamion, setFactureCamion] = useState([]); 
    const [suivieArticle, setArticleSuivie] = useState([]); 
    const [lastInventaire, setLastInventaire] = useState({Articles:'[]' , Jour:'2022-02-2'}); 
    const [articleD, setArticleD] = useState([]); 

    /* ############################### UseEffect ################################*/ 
     useEffect(() => {
        //camion Info
        axios.post(`${GConf.ApiLink}/camions/info/article`, {
            tag: GConf.SystemTag,
            article: code,
            camId : CID
        })
        .then(function (response) {
            setLastInventaire(response.data.LastInv[0])
            console.log(response.data.LastInv[0])
            setArticleD(response.data.ArtData[0])
            let fondTable = []
            response.data.InFond.map( (getData) => fondTable.push([new Date(getData.Jour).toLocaleDateString('en-US'), getData.Bon_id, GetTargetArticleQteFromFond(getData.Articles)],))
            setFonfListCamion(fondTable)

            let factureTable = []
            response.data.InFact.map( (getData) => factureTable.push([new Date(getData.Cre_Date).toLocaleDateString('en-US'), getData.C_Name, GetTargetArticleQteFromFacture(getData.Articles)],))
            setFactureCamion(factureTable)
            
            let suivieTable = []
            response.data.FromSuivie.map( (getData) => suivieTable.push([new Date(getData.Jour).toLocaleDateString('en-US'),  GetTargetArticleQteFromSuivie(getData.Articles,3), GetTargetArticleQteFromSuivie(getData.Articles,2), GetTargetArticleQteFromSuivie(getData.Articles,4)],))
            setArticleSuivie(suivieTable)
        })

    }, [])

    /* ############################### Function ################################*/
    const GetTargetArticleQteFromFacture = (value) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject.Qte
    }
    const GetTargetArticleQteFromFond = (value) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return searchObject.QteAjoute * searchObject.Groupage
    }
    const GetTargetArticleQteFromLastInv = (value) =>{
        if (value) {
            const JsValue = JSON.parse(value)
            const searchObject= JsValue.find((article) => article.A_Code == code);
            
            if (searchObject) {
                return searchObject.QteAjoute
            }
            else return 'Indefinie'
        }
    }

    const GetTargetArticleQteFromSuivie = (value,i) =>{
        const JsValue = JSON.parse(value)
        const searchObject = JsValue.findIndex((article) => article[0] == code);
        return (JsValue[searchObject][i])
    }

    const GenerateDate = function(str, days) {
        if (str) {
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate() + parseInt(days));
            return myDate.toISOString().split('T')[0];
            
        } else {
            return 'Indefinie'
        }
        
    }

    /* ############################### Card ################################*/
    const LastnventaireCard = (props) =>{
        return(<>
        <div className='card card-body shadow-sm mb-4 border-div '>
            <div className='row'>
                <div className='col-8'>
                    <div className='mb-2 text-danger'>Article : {props.Artdata.Name}</div>
                    <div className='mb-2 text-danger'>Quntité : {props.Artdata.Qte}</div>
                    
                   
                </div>
                <div className='col-4'>
                    <div className='mb-2 text-info'>Jour de Dernier Inventaire  : {GenerateDate(props.Invdata.Jour, 1 ) } </div>
                    <div className='mb-2 text-info'>Dernier Inventaire  : {GetTargetArticleQteFromLastInv(props.Invdata.Articles)} </div>
                </div>
            </div>
        </div>
        </>)
    }

    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.CamionArticleInfo} />
        <br />
        <LastnventaireCard Invdata={lastInventaire} Artdata={articleD} />
        <div className="row">
                <div className="col-12 col-lg-4">
                   <h5>Fond:</h5> 
                   <TableGrid tableData={fondListCamion} columns= {['Jour', 'Qte','Genre']} />    
                </div>
                <div className="col-12 col-lg-4">
                    <h5>Factures:</h5>
                    <TableGrid tableData={factureCamion} columns= {['Jour', 'Client','Qte']} />
                </div>
                <div className="col-12 col-lg-4">
                    <h5>Suivie:</h5>
                    <TableGrid tableData={suivieArticle} columns= {['Jour', 'Stock','Vente','Reste']} />
                </div>
        </div>
    </> );
}

export default CamionArticleInfo;