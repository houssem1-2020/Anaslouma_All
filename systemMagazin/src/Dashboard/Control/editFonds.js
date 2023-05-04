import React, { useEffect, useState } from 'react';
import BreadCrumb  from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import { Button, Dropdown, Icon, Loader, Input, Tab } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';


function EditFond() {
   /* ############################### [Const] ################################*/
    let {FondID} = useParams()
    let Today = new Date()
    let [editFondD, setEditFondD] = useState({camion: 'CAMION' ,  jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    let [articleList, setArticleList] = useState([]);
    let [fullarticleList, setFullArticleList] = useState([]);
    let [articleNow, setArticleNow] = useState([])
    let [saveBtnState, setSaveBtnState] = useState(false)
    let [autofocusState, setAutoFocus] = useState(false)
    const [loaderState, setLS] = useState(false)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}

    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () =><AddArticles />,
        },
        {
            menuItem: { key: 'save', icon: 'save outline', content:  'Modifier' }, 
            render: () =><ButtonsCard />,
        },
        
    ]

     /* ###############################[UseEffect]################################*/
    useEffect(() => {
            //camion Fond
            axios.post(`${GConf.ApiLink}/camion/fond`, {
                PID : GConf.PID,
                fondID: FondID
            })
            .then(function (response) {
                    setEditFondD({ Bon_id: response.data[0].Bon_id , camion: response.data[0].Camion , jour: GenerateDate(response.data[0].Jour, 1)  , totale: response.data[0].Totale , articles:JSON.parse(response.data[0].Articles)})
                    
                    axios.post(`${GConf.ApiLink}/camion/ajouterf/stock`, {
                        PID : GConf.PID,
                        camId : response.data[0].Camion
                    })
                    .then(function (response) {
                        let TableNow = []
                        response.data.map( (dta) => {TableNow.push({value : dta.A_Code, text : dta.Name, key: dta.PK})})
                        setArticleList(TableNow)
                        setFullArticleList(response.data)
                        console.log(editFondD)
                    })            
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger le fond </div></>, GConf.TostInternetGonf)   
                }
              });
    }, [])

    /* ###############################[Function]################################*/
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("Entrer Un article 1!", GConf.TostErrorGonf)}
        else if (!articleNow.Name ) {toast.error("Entrer Un article 2!", GConf.TostErrorGonf)}
        else if (!articleNow.Prix_vente ) {toast.error("Entrer Un article 3!", GConf.TostErrorGonf)}
        else if (!articleNow.Groupage ) {toast.error("Entrer Un article 4!", GConf.TostErrorGonf)}
        else if (!articleNow.Quantite ) {toast.error("Entrer Un article 5!", GConf.TostErrorGonf)}
        else if (!articleNow.Qte && articleNow.Qte != 0) {toast.error("Entrer Un article 6!", GConf.TostErrorGonf)}
        else if (!articleNow.QteAjoute ) {toast.error("Entrer Un article 7!", GConf.TostErrorGonf)}
        else{
            const searchObject = editFondD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = editFondD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                
                editFondD.articles[IndexOfArticle].QteAjoute = parseInt(editFondD.articles[IndexOfArticle].QteAjoute) + parseInt(articleNow.QteAjoute)
                
                //disolayed data in article list card 
                editFondD.articles[IndexOfArticle].Quantite = parseInt(editFondD.articles[IndexOfArticle].Quantite) - parseInt(articleNow.QteAjoute)
                editFondD.articles[IndexOfArticle].Qte = parseInt(editFondD.articles[IndexOfArticle].Qte) + parseInt(articleNow.QteAjoute * articleNow.Groupage)
                
                let tot = MakeSum()
                setEditFondD({...editFondD, totale: MakeSum() })
                setArticleNow([])
                
            } else {

                    //update save fond table 
                    let resteEnDepo = articleNow.Quantite - articleNow.QteAjoute
                    let soitEnCamion = articleNow.Qte + (articleNow.QteAjoute * articleNow.Groupage)
                    let arrayToAdd = {id:editFondD.articles.length + 1 ,A_Code: articleNow.A_Code, Name: articleNow.Name, Prix_vente: articleNow.Prix_vente, Groupage : articleNow.Groupage, Quantite: resteEnDepo , Qte: soitEnCamion , QteAjoute: articleNow.QteAjoute}
                    editFondD.articles.push(arrayToAdd)
            
                    setArticleNow([])
                    setEditFondD({...editFondD, totale: MakeSum() })
                    console.log(editFondD)
                
            }
        }
    }
    const GetArticleData = (value) =>{
        const searchObject= fullarticleList.find((article) => article.A_Code == value);
        if(!searchObject.Qte) {searchObject.Qte = 0}
        setArticleNow(searchObject);
        setAutoFocus(true)
    }
    const MakeSum = () => {
        let tot = 0
        editFondD.articles.map( (art) => { 
            tot = tot +  (parseFloat(art.QteAjoute) * art.Prix_vente)
        })
        return (tot.toFixed(3))
    }
    const EditFond = () =>{
            if (!editFondD.camion) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!editFondD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!editFondD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!editFondD.articles || editFondD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiLink}/camion/fond/modifier`, {
                    PID : GConf.PID,
                    editFondD: editFondD,
                })
                .then(function (response) {
                    console.log(response)
                    if(response.status = 200) {
                        setSaveBtnState('disabled')
                        toast.success("Fond Modifier !", GConf.TostSuucessGonf)
                        SaveNotification('camionFondModifier',GConf.PID, editFondD)
                        setLS(false)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier le Fond </div></>, GConf.TostInternetGonf)   
                      setLS(false)
                    }
                  });

            }       
    }
    const RemoveArticleFromList = (value) =>{
        const targetArticle =  editFondD.articles.findIndex((article) => article.A_Code === value);
        editFondD.articles.splice(targetArticle, 1);
    
        setEditFondD({...editFondD, totale: MakeSum() })

    }
    const GenerateDate = function(str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate.toISOString().split('T')[0];
    }
    
    /* ###############################[Card]################################*/
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-5 text-start align-self-center'>
                            {props.dataA.Name}
                            </div>
                            <div className='col-4 align-self-center'><b>{props.dataA.QteAjoute}</b> * {(props.dataA.Prix_vente).toFixed(3)} = {(props.dataA.Prix_vente * props.dataA.QteAjoute).toFixed(3)}</div>
                            <div className='col-2 align-self-center'><b><span className='bi bi-house-door text-danger'></span> {props.dataA.Quantite}   <span className='bi bi-truck text-success'></span> {props.dataA.Qte} </b></div>
                            <div className='col-1 align-self-center'><Button icon="times" className='rounded-circle p-2 text-white bg-danger' onClick={() => RemoveArticleFromList(props.dataA.A_Code)}></Button></div>
                        </div>
                    </div>
                </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test) =>
                            <option key={test.key} value={test.value}>{test.text}</option>
                            )}
                    </datalist>
                    <Input icon='barcode' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
                    <div className='m-2 text-secondary'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-danger'><b> <span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div>
                    <div className='row'>
                        <div className='col-7'>
                             <div className='m-2 text-warning'><b> <span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_vente} </b></div>
                        </div>
                        <div className='col-5'>
                            <div className='m-2 text-warning'><b> <span className='bi bi-box2 '></span> Groupage : {articleNow.Groupage} </b></div>
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col-7'>
                            <div className='m-2 text-success'><b> <span className='bi bi-house '></span> Qte Depo : {articleNow.Quantite} </b></div>
                        </div>
                        <div className='col-5'>
                            <div className='m-2 text-success'><b> <span className='bi bi-truck '></span> Qte Camion : {articleNow.Qte} </b></div>
                        </div>
                    </div>
                    <Input icon='dropbox' autoFocus={autofocusState} onChange={ (e) => {articleNow.QteAjoute = e.target.value}} size="small" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                    <br />
                    <Button  className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button disabled={saveBtnState} className='rounded-pill  bg-system-btn'  fluid onClick={EditFond}><Icon name='save' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>                        
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {editFondD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{editFondD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.CamionEditFond} />
            <br />
            <div className='row'>
                <div className='col-12 col-lg-5'>
                    <div className="mb-4 sticky-top" style={{top:'70px'}}>
                        <Tab menu={{  pointing: true  }} panes={panes} />
                    </div>
                </div>
                <div className='col-12 col-lg-7'>
                    <TotaleCard />
                    <h5>Listes des Articles</h5>    
                        {editFondD.articles.map( (val,index) => <ArticleListCard key={index} dataA={val}/>)}
                    <br /> 
                </div>
            </div>
        </> );
    }

export default EditFond;