import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { Fade } from 'react-reveal';
import { Button,  Dropdown, Icon, Input, Label, Loader, Tab } from 'semantic-ui-react';
import useGetArticles from '../../Dashboard/Assets/Hooks/fetchArticles';
import useGetClients from '../../Dashboard/Assets/Hooks/fetchClient';
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import FrameForPrint from '../../Dashboard/Assets/frameForPrint';
import usePrintFunction from '../../Dashboard/Assets/Hooks/printFunction';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const MainDataCard = ({factureD, setFactureD,clientList}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <h5>Client  </h5>
                {/* <Dropdown
                    fluid
                    search
                    selection
                    wrapSelection={false}
                    options={clientList}
                    placeholder='Selectionnez Client'
                    className='mb-1'
                    onChange={(e, { value }) => setFactureD({...factureD, client: value })}
                    value={factureD.client}
                /> */}
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.Name}>{test.Code_Fiscale} - {test.Gouv}</option>
                            )}
                </datalist>
                <Input icon='user' list="clientList"  onChange={(e, { value }) => setFactureD({...factureD, client: value })} size="small" iconPosition='left' placeholder='Client'  fluid className='mb-1' />
            </div>
    </>)
}

function NouveauxFacture() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    let camData = JSON.parse(localStorage.getItem(`Camion_LocalD`));
    const Cam_ID = camData.Cam_ID;
    //const Cam_ID = localStorage.getItem("InputCamion"); 
    const [factureD, setFactureD] = useState({client:'PASSAGER', Camion : Cam_ID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [articleList, setArticleList] = useState([])
    const [gettedFID, setFID] = useState('')
    const [clientList, setClientList ] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [autofocusState, setAutoFocus] = useState(false)
    const [loadingPage, setLoadingP] = useState(true)
    //const [stopStream, setStopStram] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Camion_Offline`));
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'star', content:  <>Articles <Label className='bg-danger' size='tiny'>{factureD.articles.length}</Label></> }, 
            render: () => 
                        <Tab.Pane attached={false}>
                            <TotaleCard />
                            <h5>Listes des Articles</h5>    
                            {factureD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                            <br />
                        </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
            render: () =><><Tab.Pane attached={false}>
                            <MainDataCard factureD={factureD} setFactureD={setFactureD} clientList={clientList}/>
                            <br />
                        </Tab.Pane>
                        <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        },        
    ]
    const [qrData, setQRData] = useState("Not Found");

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        // let TableNow = []
        // Offline.client.map( (dta) => {TableNow.push({value : dta.Name, text : dta.Name, key: dta.PK})})
        // setClientList(TableNow)
        setClientList(Offline.client)

        axios.post(`${GConf.ApiCaisseLink}/nv/stock`, {
            tag: GConf.SystemTag,
            camId: Cam_ID,
          }).then(function (response) {
            setArticleList(response.data)
            setLoadingP(false)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              setArticleList(Offline.stock)
              setLoadingP(false)
            }
        });

        //if stock regler non 
        axios.post(`${GConf.ApiCaisseLink}/sk/reglemment/check`, {
            tag: GConf.SystemTag,
            camId : Cam_ID,
            jour : Today.toISOString().split('T')[0]
          })
          .then(function (response) {
            if(response.data.length != 0) {
                setSaveBtnState(true)
            }
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
        setFactureD({...factureD, articles: resteArticles })
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
            tot = tot +  parseFloat(art.PU)
        })
        return (tot.toFixed(3))
    }
    const SaveFacture = () =>{
            if (!factureD.client) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!factureD.articles || factureD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiCaisseLink}/nv/ajouter`, {
                    forPID: camData.PID,
                    factureD: factureD,
                })
                .then(function (response) {

                    if(response.status = 200) {
                        setSaveBtnState(true)
                        setFID(response.data.FID)
                        toast.success("Facture Enregistreé !", GConf.TostSuucessGonf)
                        setLS(false)
                        setFID(response.data.FID)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> La facture sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                      Offline.factureToSave.push(factureD)
                      localStorage.setItem(`Camion_Offline`,  JSON.stringify(Offline));
                      setLS(false)
                    }
                });

            }       
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}

    /*#########################[Component]##################################*/ 
    const AddArticles = () =>{
        return (<>
                <div className='mb-2'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test,index) =>
                            <option key={index} value={test.A_Code}>{test.Name}</option>
                            )}
                    </datalist>
                    <ProgressLoadingBar display={loadingPage} />
                    <Input icon='pin' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
        
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
                <Fade>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-10 text-start align-self-center'>
                                <div>{props.dataA.Name}</div>
                                <b className='text-danger'>{props.dataA.Qte}</b> * {props.dataA.Prix} = <span className='text-warning'>{props.dataA.PU}</span>
                            </div>
                           
                            <div className='col-2 align-self-center'><Button disabled={saveBtnState} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)} icon="times" className='rounded-circle p-2 text-white bg-danger'></Button></div>
                        </div>
                    </div>
                </Fade>
                </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className=''>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-12 mb-3'>
                            <Button disabled={saveBtnState} className='rounded-pill bg-system-btn' fluid onClick={SaveFacture}><Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
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
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {factureD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{factureD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }
    const ProgressLoadingBar = (props) =>{
        return(<>
            <div className={`progress-bar-loading ${props.display == true ? '': 'd-none'}`}>
                    <div className="progress-bar-loading-value"></div>
                </div>
            </>)
    }
    // const BarreCodeReader = () =>{
    //     return(<>
    //     <BarcodeScannerComponent
    //         width={'100%'}
    //         height={250}
    //         stopStream = {stopStream}
    //         onUpdate={(err, result) => {
    //         if (result) 
    //             {setQRData(result.text); 
    //             setStopStram(true);
    //         } 
    //         //else {console.log("Not Found");}
    //         }}
    //     />
    //     </>)

    // }

    return (  <>
        <BackCard data={InputLinks.backCard.nv}/>
        <br />
        <div className='container-fluid'>
            <Tab menu={{  pointing: true  }} panes={panes} />
        </div>
        
      
        <FrameForPrint frameId='printFacture' src={`/Pr/CamSys/facture/${gettedFID}`} />
    </>);
}


export default NouveauxFacture;