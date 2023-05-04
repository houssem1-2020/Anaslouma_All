import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Icon, Input, Label, Loader, Tab } from 'semantic-ui-react';
import FrameForPrint from '../../Dashboard/Assets/frameForPrint';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import {  useParams } from 'react-router-dom';
import useGetClients from '../../Dashboard/Assets/Hooks/fetchClient';
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import usePrintFunction from '../../Dashboard/Assets/Hooks/printFunction';

const MainDataCard = ({factureD, setFactureD,clientList,GenerateDate}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <h5>Client  </h5>
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.CL_ID}>{test.Name}: {test.Code_Fiscale} - {test.Gouv} </option>
                            )}
                </datalist>
                <Input icon='user' list="clientList"  value={factureD.client} onChange={(e, { value }) => setFactureD({...factureD, client: value })} size="small" iconPosition='left'   fluid className='mb-1' />
                
            </div>
    </>)
}

function EditFacture() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const Cam_ID = camData.Cam_ID;
    const Today = new Date()
    let [factureD, setFactureD] = useState([{client:'2837561409',  jour: '2022-02-02', totale: 0 , articles:[]}])
    let [articleList, setArticleList] = useState([])
    let [clientList, setClientList ] = useState([])
    let [articleNow, setArticleNow] = useState([])
    let [loading , setLoading] = useState(false)
    let [autofocusState, setAutoFocus] = useState(false)
    let [saveBtnState, setSaveBtnState] = useState(false)
    let [loaderState, setLS] = useState(false)
    const [topPrixGrox, setTopPrixGrox] = useState(0)
    let panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'star', content:  <>Articles <Label className='bg-danger' size='tiny'>{factureD.articles ? factureD.articles.length : 0}</Label></> }, 
            render: () => 
                        <Tab.Pane attached={false}>
                            <TotaleCard />
                            <h5>Listes des Articles</h5>    
                            {factureD.articles.map( (val, index) => <ArticleListCard key={index} dataA={val}/>)}
                            <br />
                        </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
            render: () =><><Tab.Pane attached={false}>
                            <MainDataCard factureD={factureD} setFactureD={setFactureD} clientList={clientList} GenerateDate={GenerateDate}/>
                            <br />
                        </Tab.Pane>
                        <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        },
        
    ]
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_Offline`));

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        setClientList(Offline.client)
        
        //stock du camion
        axios.post(`${GConf.ApiCamionLink}/nv/stock`, {
            tag: GConf.SystemTag,
            camId: Cam_ID,
          })
          .then(function (response) {
            setArticleList(response.data)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier la facture </div></>, GConf.TostInternetGonf)   
              setArticleList([])
            }
        });

        //factute info 
        axios.post(`${GConf.ApiCamionLink}/mf/select`, {
            tag: GConf.SystemTag,
            fid: FID,
            camId : Cam_ID
          })
          .then(function (response) {
                if(!response.data[0]) {
                    toast.error('Facture Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/I/mf"; }, 2000)
                    
                } else {
                    //setFactureD(response.data[0])
                    setFactureD({ client: response.data[0].C_Name , jour: GenerateDate(response.data[0].Cre_Date, 1), totale: response.data[0].Tota , prixGros: response.data[0].Prix_Grox ,  articles:JSON.parse(response.data[0].Articles)})
                    setLoading(true)
                }
          }).catch((error) => {
            if(error.request) {
                const FactureTarged = Offline.facture.find((facture) => facture.F_ID == FID);
                setFactureD(FactureTarged)
                setFactureD({ client: FactureTarged.client , jour: GenerateDate(FactureTarged.Cre_Date, 1), totale: FactureTarged.Tota ,  articles:JSON.parse(FactureTarged.Articles)})
                setLoading(true)
            }
        });
        //check Permission
        axios.post(`${GConf.ApiLink}/Permission`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            setTopPrixGrox(JSON.parse(response.data[0].Totale_Cmd))
        })

    }, [])

    /*#########################[Functions]##################################*/
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
                setArticleNow([{}])
                setFactureD({...factureD, totale: MakeSum() })
                setAutoFocus(false)
                
            } else {
                let prix_u = (articleNow.Qte * articleNow.Prix_piece).toFixed(3)
                let arrayToAdd = {id: factureD.articles.length+1 , A_Code: articleNow.A_Code, Name: articleNow.Name, Prix: articleNow.Prix_piece, Qte: parseInt(articleNow.Qte), PU: prix_u}
                factureD.articles.push(arrayToAdd)
                setArticleNow([])

                setFactureD({...factureD, totale: MakeSum() })
                setAutoFocus(false)     
            }
        }        
    }
    const DeleteFromUpdateList = (value) =>{
        const searchObject= factureD.articles.findIndex((article) => article.A_Code == value);
        factureD.articles.splice(searchObject, 1);
        let resteArticles = factureD.articles;
        setFactureD({...factureD, articles: resteArticles, totale: MakeSum() })
    }
    const GetArticleData = (value) =>{
        const searchObject= articleList.find((article) => article.A_Code == value);
        let Prix_piece = (searchObject.Prix_vente / searchObject.Groupage)
        searchObject.Prix_piece = Prix_piece.toFixed(3)
        setArticleNow(searchObject);
        setAutoFocus(true)
        
    }
    const MakeSum = () => {
        let tot = 0
        factureD.articles.map( (art) => { 
            tot = tot +   parseFloat(art.PU)
        })
        return (tot.toFixed(3))
    }
    const EditFacture = () =>{
            if (!CheckClientValidite(factureD.client)) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.articles || factureD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                setSaveBtnState(true)
                axios.post(`${GConf.ApiCamionLink}/mf/modifier`, {
                    tag: GConf.SystemTag,
                    factD: factureD,
                    fid : FID
                })
                .then(function (response) {
                    if(response.status = 200) {
                        toast.success("Facture Modifieé !", GConf.TostSuucessGonf)
                        setLS(false)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                        setSaveBtnState(false)
                    }
                })
            }       
    }
    const GenerateDate = function(str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate.toISOString().split('T')[0];
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const CheckClientValidite = (clientId) =>{
        const exist = clientList.find((client) => client.CL_ID == clientId);
        if (exist) { return true  } else { return false}
    }
    const GetPrixGros = (Code) =>{
        const searchObject = articleList.find((article) => article.A_Code == Code);
        if (searchObject) {
            if (searchObject.Prix_gros == 0) {
                return searchObject.Prix_vente
            } else {
                return searchObject.Prix_gros
            }
              
        } else{
            toast.error('Article Indéfine ', GConf.TostSuucessGonf)
        }
    }
    const ActivateProxGros = () =>{
        factureD.articles.map((data,index) => {
            factureD.articles[index].Prix = GetPrixGros(data.A_Code)
            factureD.articles[index].PU = ((factureD.articles[index].Qte) * GetPrixGros(data.A_Code) ).toFixed(3)
            factureD.totale = MakeSum()
        })
        setFactureD({...factureD, prixGros: true })
    }

    /*#########################[Component]##################################*/ 
    const AddArticles = () =>{
        return (<>
                <div className='mb-2'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test) =>
                            <option key={test.PK} value={test.A_Code}>{test.Name}</option>
                            )}
                    </datalist>
                    <Input icon='barcode' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
                    
                    <div className='m-2 text-system'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-system'><b> <span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div>
                    <div className='row mb-2'>
                        <div className='col-8'>
                            <div className='m-2 text-system'><b> <span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_piece} </b></div>
                        </div>
                        <div className='col-4'>
                        <Button size="small" disabled={saveBtnState} className='rounded-pill bg-warning' onClick={ () => setArticleNow({...articleNow, Prix_piece : 0})} fluid> Gratuit</Button>
                        </div>
                    </div>
                    <Input type='number' icon='dropbox' autoFocus={autofocusState} onChange={ (e) => {articleNow.Qte = e.target.value}} size="small" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                    <br />
                    <Button disabled={saveBtnState} fluid className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-10 text-start align-self-center'>
                                <div>{props.dataA.Name}</div>
                                <b className='text-danger'>{props.dataA.Qte}</b> * {props.dataA.Prix} = <span className='text-warning'>{props.dataA.PU}</span>
                            </div>
                           
                            <div className='col-2 align-self-center'><Button disabled={saveBtnState} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)} icon="times" className='rounded-circle p-2 text-white bg-danger'></Button></div>
                        </div>
                    </div>
                </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className=''>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-12 mb-3'>
                            <Button disabled={saveBtnState} className='rounded-pill bg-system-btn' fluid onClick={EditFacture}><Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                        </div>
                        <div className='col-12'>
                            <Button disabled={!saveBtnState} className='rounded-pill btn-imprimer' onClick={(e) => PrintFunction('printFacture')} fluid><Icon name='print' /> Imprimer</Button>
                        </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='mb-3 d-none'><Button size='big' disabled={factureD.totale > topPrixGrox ? false : true} className='rounded-pill bg-warning text-dark' onClick={ () => ActivateProxGros()} fluid> Prix Gros</Button></div>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1 className={`${factureD.prixGros ? 'text-danger' : ''}`}>Totale : {factureD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{factureD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.mfEdit}/>
        <br />
        <div className='container-fluid'>
            <Tab menu={{  pointing: true  }} panes={panes} />
        </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/CamSys/facture/${FID}`} />
    </>);

}

export default EditFacture;