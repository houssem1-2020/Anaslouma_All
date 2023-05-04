import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Dropdown, Icon, Input, Loader } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import usePrintFunction from '../Assets/Hooks/printFunction';
import FrameForPrint from '../Assets/frameForPrint';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';

function BonSortie() {
    /*#########################[Const]##################################*/
    const [bonsD, setBonsD] = useState({genre:'Sortie', articles:[]})
    const [BE_ID, setBEID] = useState('')
    const [articleNow, setArticleNow] = useState([])
    const [tableData, setTableData] = useState([]);
    const [articleList, setArticleList] = useState([]);
    const [toUpdatedList, setTUpList] = useState([]);
    const [loaderState, setLS] = useState(false)
    const [updateBtnState, setUpdateBS] = useState(true)
    const [autofocusState, setAutoFocus] = useState(false)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Offline`));
    
   /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //get stock
        axios.post(`${GConf.ApiLink}/stock`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
              let TableNow = []
              response.data.map( (dta) => {TableNow.push({value : dta.A_Code, text : dta.Name, key: dta.PK})})
               setTableData(TableNow)
               setArticleList(response.data)       
          }).catch((error) => {
            if(error.request) {
                toast.error(<><div><h5>Probleme de Connextion</h5> Chargement des article sur votre ordinateur  </div></>, GConf.TostInternetGonf)   
                let TableNow = []
                Offline.stock.map( (dta) => {TableNow.push({value : dta.A_Code, text : dta.Name, key: dta.PK})})
                setTableData(TableNow)
                setArticleList(Offline.stock)
            }
          });
          
          //check Permission
          axios.post(`${GConf.ApiLink}/Permission`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
            if(response.data[0].Edit_Stock === 'true'){setUpdateBS(false)}
          })
    }, [])

    /*#########################[Function]##################################*/
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("Code à barre Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Name || articleNow.Name === '') {toast.error("Nom Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Value || articleNow.Value === '') {toast.error("Qte Invalide !", GConf.TostErrorGonf)}
        else{
            const searchObject = bonsD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = bonsD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                bonsD.articles[IndexOfArticle].NewQte = bonsD.articles[IndexOfArticle].NewQte + parseInt(articleNow.Value)
                bonsD.articles[IndexOfArticle].PureQte = bonsD.articles[IndexOfArticle].PureQte - parseInt(articleNow.Value)
                toUpdatedList[IndexOfArticle][1] = toUpdatedList[IndexOfArticle][1] + parseInt(articleNow.Value)
                setArticleNow([{}])
                setAutoFocus(false)
            } else {
                let P_Qte = (articleNow.Quantite - parseInt(articleNow.Value))
                let arrayToAdd = {id: articleNow.PK , A_Code: articleNow.A_Code, Name: articleNow.Name,  OldQte: articleNow.Quantite, NewQte : parseInt(articleNow.Value) , PureQte: P_Qte}
                bonsD.articles.push(arrayToAdd) 
                let arrayToUpdate = [articleNow.A_Code, parseInt(articleNow.Value)]
                toUpdatedList.push(arrayToUpdate)
                setArticleNow([{}]) 
                setAutoFocus(false)
            } 
        }

    }
    const GetArticleData = (value) =>{
        const searchObject = articleList.find((article) => article.A_Code == value);
        if (searchObject) {
            setArticleNow(searchObject);
            setAutoFocus(true)
            
        }else{
            toast.error('Article Indéfine ', GConf.TostSuucessGonf)
        }
    }
    const UpdateStock = () =>{
        setLS(true)
        setUpdateBS(true)
        axios.post(`${GConf.ApiLink}/stock/bs`, {
            tag: GConf.SystemTag,
            artList: toUpdatedList,
          })
          .then(function (response) {      
            if(response.data.affectedRows) {
                axios.post(`${GConf.ApiLink}/stock/bebs/save`, { 
                    tag: GConf.SystemTag, artList: bonsD, 
                }).then(function (response) { 
                    setBEID(response.data.BE_ID)  
                    SaveNotification('stockSaveBS',GConf.SystemTag, response.data.BE_ID) 
                })
                toast.success("Article Modifier !", GConf.TostSuucessGonf)
                setLS(false)
            }
            else{
                toast.error('Erreur Indéfine ', GConf.TostSuucessGonf)
                setLS(false)
                setUpdateBS(false)
            }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Le Bon n'as pas été enregistreé </div></>, GConf.TostInternetGonf)   
              setLS(false)
            }
          });

    }
    const RemoveArticleFromList = (value) =>{
        const searchObject= bonsD.articles.findIndex((article) => article.A_Code === value);
        const searchObjectTwo = toUpdatedList.findIndex((article) => article[0] === value);
        bonsD.articles.splice(searchObject, 1);
        toUpdatedList.splice(searchObjectTwo, 1);
        let resteArticles = bonsD.articles;
        setBonsD({...bonsD, articles: resteArticles})
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
    }
    const MakeTotaleSum = () =>{
        let tot = 0
        bonsD.articles.map( (art) => { 
           const searchObject = articleList.find((article) => article.A_Code == art.A_Code);
           if (searchObject) {
                tot = tot +  (parseFloat(searchObject.Prix_vente) * art.NewQte)
           } else {
               tot = tot 
           }
           
        })
        return (tot.toFixed(3))
    }

   /*#########################[Card]##################################*/
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-6 text-start align-self-center'>
                                {props.dataA.Name}
                            </div>
                            <div className='col-5 align-self-center'><b>{props.dataA.OldQte} </b> - {props.dataA.NewQte} = {props.dataA.PureQte}</div>
                            <div className='col-1 align-self-center'><Button disabled={updateBtnState} icon="times" className='rounded-circle p-2 text-white bg-danger' onClick={() => RemoveArticleFromList(props.dataA.A_Code)}></Button></div>
                        </div>
                    </div>
                </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-7'>
                            <Button  className='rounded-pill bg-system-btn' disabled={updateBtnState}  fluid onClick={UpdateStock}><Icon name='edit outline' /> Mettre à jour <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                        <div className='col-5'>
                            <Button  className='rounded-pill btn-imprimer'   disabled={!updateBtnState}  fluid onClick={(e) => PrintFunction('printBES')}><Icon name='print' /> Imprimer</Button>
                        </div>
                    </div>
                </div>
        </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Ajouter article</h5> 
                     <datalist id="articlesList">
                        {tableData.map((test) =>
                        <option key={test.key} value={test.value}>{test.text}</option>
                        )}
                    </datalist>
                    <Input icon='barcode' onKeyPress={event => OnKeyPressFunc(event)} list="articlesList" onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' /> 
                    <div className='m-2 text-secondary'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-danger'><b> <span className='bi bi-star-fill '></span> Desg : {articleNow.Name} </b></div>
                    <div className='m-2 mb-2 text-success'><b> <span className='bi bi-box2'></span> Qunatite : {articleNow.Quantite} </b></div>
                    <Input icon='asl' type='number' autoFocus={autofocusState} onChange={ (e) => {articleNow.Value = e.target.value}} size="small" iconPosition='left' placeholder='Valeur'  fluid className='mb-1' />
                    <br />
                    <Button disabled={updateBtnState}  className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.stockBS} />
            <br />
            <div className='row'>
                <div className='col-12 col-lg-5'>
                    <div className="mb-4 sticky-top" style={{top:'70px'}}>
                        <AddArticles />
                        <ButtonsCard />
                    </div>
                </div>
                <div className='col-12 col-lg-7'>
                        <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                            <div className='row'>
                                <div className='col-7 align-self-center text-start'><h1>Totale : {MakeTotaleSum()}</h1></div>
                                <div className='col-5 align-self-center text-center'><h5 className='mb-0'>{bonsD.articles.length}</h5> articles</div>
                            </div>
                        </div>
                        <h5>Listes des Articles</h5>    
                        {bonsD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                        <br />  
                </div>
            </div>
            <FrameForPrint frameId='printBES' src={`/Pr/Stock/bonS/${BE_ID}`} />
           
    </> );
}

export default BonSortie;