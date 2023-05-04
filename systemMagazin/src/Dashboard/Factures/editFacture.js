import React, { useEffect, useState } from 'react';
import BreadCrumb  from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import { Button, Dropdown, Icon, Input, Loader, Tab } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import useGetArticles from '../Assets/Hooks/fetchArticles';
import useGetClients from '../Assets/Hooks/fetchClient';
import SKLT from '../../AssetsM/usedSlk';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
var moment = require('moment'); // require


const MainDataCard = ({factureD, setFactureD,clientList, allClientList, camionList, OnKeyPressFunc}) =>{
    return (<>
            <div className='card card-body shadow-sm mb-2'>
                <h5>Date & Client  </h5>
                <Input icon='calendar alternate' type='date' size="small" iconPosition='left'   fluid className='mb-1' value={factureD.jour} onChange={(e) => setFactureD({...factureD, jour: e.target.value })}/>
                <datalist id="clientList">
                        {allClientList.map((test) =>
                        <option key={test.key} value={test.CL_ID}>{test.Name} : {test.Code_Fiscale}</option>
                        )}
                </datalist>
                <Input icon='add user' list="clientList" onKeyPress={event => OnKeyPressFunc(event)} placeholder='Selectionner Client' defaultValue={factureD.client}  onBlur={ (e) => setFactureD({...factureD, client: e.target.value })} size="small" iconPosition='left'   fluid className='mb-1' />

                <Dropdown
                    search
                    selection
                    wrapSelection={false}
                    options={camionList}
                    placeholder={factureD.Fournisseurs}
                    className='mb-1'
                    onChange={(e, { value }) => setFactureD({...factureD, Fournisseurs: value })}
                    defaultValue={factureD.Fournisseurs}
                /> 
                {/* <Input icon='truck' type='text' placeholder='Camion' size="small" iconPosition='left'   fluid className='mb-1' value={factureD.Fournisseurs} onChange={(e) => setFactureD({...factureD, Fournisseurs: e.target.value })}/> */}
                <Input icon='user' type='text' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Chauffeur' size="small" iconPosition='left'   fluid className='mb-1' value={factureD.Chauffeur} onChange={(e) => setFactureD({...factureD, Chauffeur: e.target.value })}/>
                <div className='row'>
                    <div className='col-6'><Input icon='map marker' size="small" onKeyPress={event => OnKeyPressFunc(event)} iconPosition='left' placeholder='De'  fluid className='mb-1'  value={factureD.de}  onChange={(e) => setFactureD({...factureD, de: e.target.value })}/></div>
                    <div className='col-6'><Input icon='map marker alternate' onKeyPress={event => OnKeyPressFunc(event)}  size="small" iconPosition='left' placeholder='Vers'  fluid className='mb-1' value={factureD.vers}  onChange={(e) => setFactureD({...factureD, vers: e.target.value })}/></div>
                </div>
                
            </div>
    </>)
}


function EditFacture() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    const Today = new Date()
    const [factureD, setFactureD] = useState({client:'PASSAGER', de:'Sidi Bourouis', vers:'', Fournisseurs:'INDEFENIE', Chauffeur:'', jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [loading , setLoading] = useState(false)
    const [colisDesaible, setColisDes] = useState(false)
    const [clientList, allClientList] = useGetClients()
    const [camionList, setCamionList] = useState([]);
    const [codes , articleList, tableData] = useGetArticles()
    const [autofocusState, setAutoFocus] = useState(false)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <AddArticles />,
        },
        {
            menuItem: { key: 'client', icon: 'user', content:  'Date & Client' }, 
            render: () =><MainDataCard factureD={factureD} setFactureD={setFactureD} clientList={clientList} allClientList={allClientList} camionList={camionList} OnKeyPressFunc={OnKeyPressFunc} />,
        },
        {
            menuItem: { key: 'articles', icon: 'save', content:  'Modifier' }, 
            render: () => <ButtonsCard />,
        }
        
    ]

    /*#########################[Const]##################################*/
    useEffect(() => {
          console.log(moment().format())
          axios.post(`${GConf.ApiLink}/facture/select`, {
            PID : GConf.PID,
            fid: FID,
          })
          .then(function (response) {
                if(!response.data[0]) {
                    toast.error('Facture Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/S/ft"; }, 2000)
                    
                } else {
                    if(response.data[0].SDF == 'true'){
                        toast.error('Facture Inmodifiable Car Stock Reglé !', GConf.TostSuucessGonf)
                        setTimeout(() => {  window.location.href = "/S/ft"; }, 2000)
                    }else{
                        setFactureD({ client:response.data[0].C_Name , Fournisseurs:response.data[0].Fournisseurs , Chauffeur:response.data[0].Chauffeur , de:response.data[0].De, vers:response.data[0].Vers, jour: GenerateDate(response.data[0].Cre_Date, 1) , totale: response.data[0].Tota , articles:JSON.parse(response.data[0].Articles)})
                        setLoading(true)
                    }
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture  </div></>, GConf.TostInternetGonf)   
                  setLoading(true)
                }
              });
        //camionList
        axios.post(`${GConf.ApiLink}/camions`,{PID :GConf.PID})
        .then(function (response) {
            let ClientLN = []
            response.data.map( (dta) => {ClientLN.push({value : dta.Cam_ID, text : <>{dta.Cam_Name} : {dta.Matricule} - {dta.Chauffeur}</>, key: dta.PK})})
            setCamionList(ClientLN)
        })
    }, [])


    /*#########################[Function]##################################*/
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("Code à barre Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Name || articleNow.Name == '') {toast.error("Name Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Qte || articleNow.Qte == '') {toast.error("Quantite Invalide !", GConf.TostErrorGonf)}
        else{
            const searchObject = factureD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = factureD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                factureD.articles[IndexOfArticle].Qte = factureD.articles[IndexOfArticle].Qte + parseInt(articleNow.Qte)
                factureD.articles[IndexOfArticle].PU = ((factureD.articles[IndexOfArticle].Qte) * factureD.articles[IndexOfArticle].Prix ).toFixed(3)
                
                let tot = MakeSum()
                setFactureD({...factureD, totale: tot })

                setArticleNow([{}])
                setAutoFocus(false)
                setColisDes(false)
                
            } else {
                let prix_u = (articleNow.Prix_vente * articleNow.Qte).toFixed(3)
                let arrayToAdd = {id: factureD.articles.length + 1 , A_Code: articleNow.A_Code, Name: articleNow.Name, Prix: articleNow.Prix_vente, Qte: parseInt(articleNow.Qte), PU: prix_u }
                factureD.articles.push(arrayToAdd)
                setArticleNow([])
                let tot = MakeSum()
                setFactureD({...factureD, totale: tot }) 
                setColisDes(false)         
            }
        }
    }
    const DeleteFromUpdateList = (value) =>{
        const searchObject= factureD.articles.findIndex((article) => article.A_Code == value);
        factureD.articles.splice(searchObject, 1);
        let resteArticles = factureD.articles;
        let tot = MakeSum()

        setFactureD({...factureD, articles: resteArticles , totale: tot})
        console.log(factureD)
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
    const MakeSum = () => {
        let tot = 0
        factureD.articles.map( (art) => { 
            tot = tot +  parseFloat(art.PU)
        })
        return (tot.toFixed(3))
    }
    const EditFacture = () =>{
            if (!CheckClientValidite(factureD.client)) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.de) {toast.error("Destination De est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.vers) {toast.error("Destination vers est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.articles || factureD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiLink}/facture/modifier`, {
                    PID : GConf.PID,
                    factD: factureD,
                    fid: FID,
                })
                .then(function (response) {
                    if(response.status = 200) {
                        setSaveBtnState(true)
                        toast.success("Facture Modifieé !", GConf.TostSuucessGonf)
                        setLS(false)
                        SaveNotification('factureEdit',GConf.PID, {data: factureD, fid: FID})
                        
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier la facture  </div></>, GConf.TostInternetGonf)   
                      setLS(false)
                    }
                  });

            }       
    }
    const GenerateDate = function(str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate.toISOString().split('T')[0];
    }
    const GetPrixColis = () =>{
        if (articleNow.Qte) {
            const QteColis = (parseInt(articleNow.Qte) * articleNow.Colis)
            setArticleNow({...articleNow, Qte : QteColis})
            setColisDes(true)
        } else {
            toast.error('Pas de Quntitée', GConf.TostSuucessGonf)
        }
    }
    const CheckClientValidite = (clientId) =>{
        const exist = allClientList.find((client) => client.CL_ID == clientId);
        if (exist) { return true  } else { return false}
    }
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
    }
    /*#########################[Card]##################################*/
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-6 text-start align-self-center'>
                                {props.dataA.Name}
                            </div>
                            <div className='col-5 align-self-center'><b>{props.dataA.Qte}</b> * {props.dataA.Prix} = {props.dataA.PU}</div>
                            <div className='col-1 align-self-center'><Button icon="times" className='rounded-circle p-2 text-white bg-danger' disabled={saveBtnState} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)}></Button></div>
                        </div>
                    </div>
                </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {tableData.map((test) =>
                            <option key={test.key} value={test.value}>{test.text}</option>
                            )}
                    </datalist>
                    <Input icon='barcode' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' /> 
                    <div className='m-2 text-secondary'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-danger'><b><span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div> 
                    <div className='row'>
                        <div className='col-8'>
                        <div className='m-2 mb-4 text-success'><b><span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_vente} </b></div> {/* <Input icon='dollar sign' value={articleNow.Prix_vente} size="small" iconPosition='left' placeholder='Prix'  fluid className='mb-1' /> */}
                        </div>
                        <div className='col-4'>
                        <Button size='small' disabled={saveBtnState} className='rounded-pill bg-warning text-dark' onClick={ () => setArticleNow({...articleNow, Prix_vente : 0})} fluid> Gratuit</Button>
                        </div>
                    </div>
                    <div className='row'>
                       <div className='col-8'> <Input icon='dropbox' type='number'   value={articleNow.Qte} autoFocus={autofocusState} onChange={ (e) => {articleNow.Qte = e.target.value}} size="small" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' /> </div> 
                       <div className='col-4'> <Button size='small' disabled={saveBtnState || colisDesaible} className='rounded-pill bg-danger text-white' onClick={ () => GetPrixColis()} fluid> Colis </Button> </div> 
                    </div>
                    
                    <br />
                    <Button disabled={saveBtnState} className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2  border-div'>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button  className='rounded-pill bg-system-btn' disabled={saveBtnState} fluid onClick={EditFacture}><Icon name='save' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {factureD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{factureD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }

    return ( 
    <>
        <BreadCrumb links={GConf.BreadCrumb.factureEdit} />
        <br />
        <div className='row'>
            <div className='col-12 col-lg-5'>
                <div className="mb-4 sticky-top" style={{top:'70px'}}>
                    <Tab menu={{ widths: panes.length, pointing: true  }} panes={panes} />        
                </div>
            </div>
            <div className='col-12 col-lg-7'>
                    <TotaleCard />
                    <h5>Listes des Articles</h5>
                    {loading ?  
                    <>    
                        {factureD.articles.map( (val, index) => 
                            <ArticleListCard key={index} dataA={val}/>
                        )}
                    </>
                        : SKLT.CardList }
                    <br />
                    
            </div>
        </div>
    </> );
}

export default EditFacture;