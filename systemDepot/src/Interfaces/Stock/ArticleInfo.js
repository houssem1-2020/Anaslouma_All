import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import GConf from '../../AssetsM/generalConf';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { _ } from "gridjs-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import { useParams } from 'react-router-dom';

function ArticleInfo() {
    /*#########################[Const]##################################*/
    const {code} = useParams()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID;
    const [fondListCamion, setFonfListCamion] = useState([SKLT.STableSlt]);
    const [factureCamion, setFactureCamion] = useState([SKLT.STableSlt]); 
    const [suivieArticle, setArticleSuivie] = useState([SKLT.STableSlt]); 
    const [lastInventaire, setLastInventaire] = useState({Articles:'[]' , Jour:'2022-02-2'}); 
    const [articleD, setArticleD] = useState([]);
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_Offline`));

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCamionLink}/sk/suivie`, {
            tag: GConf.SystemTag,
            article: code,
            camId :camId
        })
        .then(function (response) {
            setLastInventaire(response.data.LastInv[0])
            setArticleD(response.data.ArtData[0])
            let fondTable = []
            response.data.InFond.map( (getData) => fondTable.push([new Date(getData.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Bon_id, GetTargetArticleQteFromFond(getData.Articles)],))
            setFonfListCamion(fondTable)

            let factureTable = []
            response.data.InFact.map( (getData) => factureTable.push([new Date(getData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Name, GetTargetArticleQteFromFacture(getData.Articles)],))
            setFactureCamion(factureTable)
            
            let suivieTable = []
            response.data.FromSuivie.map( (getData) => suivieTable.push([new Date(getData.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), GetTargetArticleQteFromSuivie(getData.Articles,3), GetTargetArticleQteFromSuivie(getData.Articles,2), GetTargetArticleQteFromSuivie(getData.Articles,4)],))
            setArticleSuivie(suivieTable)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Information sur article Invalide   </div></>, GConf.TostInternetGonf)   
                setLastInventaire([])
                const ArticleTarged = Offline.stock.find((article) => article.A_Code == code);
                setArticleD(ArticleTarged)
                setFonfListCamion([])
                setFactureCamion([])
                setArticleSuivie([])
            }
        });
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
                <div className='col-12'>
                    <div className='mb-2 text-danger'>Article : {props.Artdata.Name}</div>
                    <div className='mb-2 text-danger'>Quntité : {props.Artdata.Qte}</div>
                </div>
                <div className='col-12'>
                    <div className='mb-2 text-info'>Jour de Dernier Inventaire  : {GenerateDate(props.Invdata.Jour, 1 ) } </div>
                    <div className='mb-2 text-info'>Dernier Inventaire  : {GetTargetArticleQteFromLastInv(props.Invdata.Articles)} </div>
                </div>
            </div>
        </div>
        </>)
    }
      return ( <>
        <BackCard data={InputLinks.backCard.skInfo}/>
        <br />
        <div className='container-fluid'>
            <LastnventaireCard Invdata={lastInventaire} Artdata={articleD} />
            {/* <TableGrid tableData={factureList} columns={['Jour','Stock','Vente','Reste']} /> */}
            <div className="row">
                <div className="col-12 ">
                   <h5>Fond:</h5> 
                   <TableGrid tableData={fondListCamion} columns= {['Jour', 'Qte','Genre']} />    
                </div>
                <div className="col-12 ">
                    <h5>Factures:</h5>
                    <TableGrid tableData={factureCamion} columns= {['Jour', 'Client','Qte']} />
                </div>
                <div className="col-12 ">
                    <h5>Suivie:</h5>
                    <TableGrid tableData={suivieArticle} columns= {['Jour', 'Stock','Vente','Reste']} />
                </div>
        </div>
        </div>
        </> );
}

export default ArticleInfo