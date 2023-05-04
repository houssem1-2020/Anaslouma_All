import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { Fade } from 'react-reveal';
import { Button,  Dropdown, Icon, Input, Label, Loader, Tab } from 'semantic-ui-react';
import useGetArticles from '../../Dashboard/Assets/Hooks/fetchArticles';
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';

const MainDataCard = ({commandeD, setCommandeD,clientList}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <h5>Date & Client  </h5>
                <Input icon='calendar alternate' size="large" type='date'  iconPosition='left'   fluid className='mb-1' value={commandeD.jour} onChange={(e) => setCommandeD({...commandeD, jour: e.target.value })}/>
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.Name}>{test.Code_Fiscale} - {test.Gouv}</option>
                            )}
                </datalist>
                <Input icon='user' list="clientList"  onChange={(e, { value }) => setCommandeD({...commandeD, client: value })} size="large" iconPosition='left' placeholder='Client'  fluid className='mb-1' />
                
            </div>
    </>)
}

function NouveauxCommande() {
    /*#########################[Const]##################################*/
    let CmdData = JSON.parse(localStorage.getItem(`Magazin_Gerant_LocalD`));
    let UID = CmdData.CID; 
    const Today = new Date()
    const [commandeD, setCommandeD] = useState({client:'PASSAGER', UID : UID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [clientList, setClientList ] = useState([])
    const [articleList, setArticleList] = useState([])
    const [qteInCommande, setQteInCommande] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loadingPage, setLoadingP] = useState(true)
    const [loaderState, setLS] = useState(false)
    const [autofocusState, setAutoFocus] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Gerant_Offline`));
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'star', content:  <>Articles <Label className='bg-danger' size='tiny'>{commandeD.articles.length}</Label></> }, 
            render: () => 
                        <Tab.Pane attached={false}>
                            <TotaleCard />
                            <h5>Listes des Articles</h5>    
                            {commandeD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                            <br />
                        </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
            render: () =><><Tab.Pane attached={false}>
                            <MainDataCard commandeD={commandeD} setCommandeD={setCommandeD} clientList={clientList}/>
                            <br />
                        </Tab.Pane>
                        <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        },
        // {
        //     menuItem: { key: 'save', icon: 'check circle', content: '(4) Enregistrer' }, 
        //     render: () =><Tab.Pane attached={false}><ButtonsCard /></Tab.Pane>,
        // },
        
    ]

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        setClientList(Offline.client)      
        axios.post(`${GConf.ApiGerantLink}/stock`, {
            tag: GConf.SystemTag,
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

        axios.post(`${GConf.ApiGerantLink}/ajouter/checkexist`, {
            TAG: GConf.SystemTag,
          }).then(function (response) {
             setQteInCommande(response.data)
          }).catch((error) => {
            if(error.request) {
              setQteInCommande([])

            }
        });

    }, [])

    /*#########################[Functions]##################################*/
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("Code à barre Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Name || articleNow.Name == '') {toast.error("Name Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Qte || articleNow.Qte == '') {toast.error("Quantite Invalide !", GConf.TostErrorGonf)}
        else{
            const searchObject = commandeD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = commandeD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                commandeD.articles[IndexOfArticle].Qte = commandeD.articles[IndexOfArticle].Qte + parseInt(articleNow.Qte)
                commandeD.articles[IndexOfArticle].PU = ((commandeD.articles[IndexOfArticle].Qte) * commandeD.articles[IndexOfArticle].Prix ).toFixed(3)
                setArticleNow([{}])

                setCommandeD({...commandeD, totale: MakeSum() })
                setAutoFocus(false)
                
            } else {
                    let prix_u = (articleNow.Prix_vente * articleNow.Qte).toFixed(3)
                    let arrayToAdd = {id: commandeD.articles.length+1 , A_Code: articleNow.A_Code, Name: articleNow.Name, Prix: articleNow.Prix_vente, Qte: parseInt(articleNow.Qte), PU: prix_u}
                    commandeD.articles.push(arrayToAdd)
                    setArticleNow([])
                    let tot = MakeSum()
                    setCommandeD({...commandeD, totale: tot })    
                    setAutoFocus(false)
            }
        } 
        
    }
    const GetQteInCommande = (code) =>{
        const searchQte = qteInCommande.find((article) => article.A_Code == code )
        if(searchQte) {
            return (searchQte.Qte)
        } else {
            return 0
        }
        
    }
    const GetArticleData = (value) =>{
        const searchObject= articleList.find((article) => article.A_Code == value);
        if (searchObject) {
            searchObject.Quantite = searchObject.Quantite - GetQteInCommande(value)
            
            setArticleNow(searchObject)
            setAutoFocus(true)
            
        }else{
            toast.error('Article Indéfine ', GConf.TostSuucessGonf)
        }

        
    }
    const DeleteFromUpdateList = (value) =>{
        const searchObject= commandeD.articles.findIndex((article) => article.A_Code == value);
        commandeD.articles.splice(searchObject, 1);
        let resteArticles = commandeD.articles;
        setCommandeD({...commandeD, articles: resteArticles })
        setCommandeD({...commandeD, totale: MakeSum() })
    }
    const MakeSum = () => {
        let tot = 0
        commandeD.articles.map( (art) => { 
            tot = tot +  parseFloat(art.PU)
        })
        return (tot.toFixed(3))
    }
    const SaveFacture = () =>{
            if (!commandeD.client) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.articles || commandeD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiGerantLink}/ajouter`, {
                    tag: GConf.SystemTag,
                    commandD: commandeD,
                }).then(function (response) {
                    if(response.data.affectedRows) {
                        setSaveBtnState(true)
                        toast.success("Commande Enregistrer !", GConf.TostSuucessGonf)
                        setLS(false)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        Offline.commandeToSave.push(commandeD)
                        localStorage.setItem(`Magazin_Gerant_Offline`,  JSON.stringify(Offline));
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> La commande sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                      Offline.commandeToSave.push(commandeD)
                      localStorage.setItem(`Magazin_Gerant_Offline`,  JSON.stringify(Offline));
                      setLS(false)
                    }
                });

            }       
    }
    const ProgressLoadingBar = (props) =>{
        return(<>
            <div className={`progress-bar-loading ${props.display == true ? '': 'd-none'}`}>
                    <div className="progress-bar-loading-value"></div>
                </div>
            </>)
    }
    /*#########################[Card]##################################*/
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

                {/* <Fade>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-6 text-start align-self-center'>
                                {props.dataA.Name}
                            </div>
                            <div className='col-5 align-self-center'><b>{props.dataA.Qte}</b> * {props.dataA.Prix} = {props.dataA.PU}</div>
                            <div className='col-1 align-self-center'><Button icon="times" className='rounded-circle p-2 text-white bg-danger'></Button></div>
                        </div>
                    </div>
                </Fade> */}
                </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className=' card-body  mb-2'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test) =>
                            <option key={test.PK} value={test.A_Code}>{test.Name} </option>
                            )}
                    </datalist>
                    <ProgressLoadingBar display={loadingPage} />
                    <Input icon='pin' list="articlesList"   onBlur={ (e) => GetArticleData(e.target.value)} size="large" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
                    <div className='m-2 text-system'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-system'><b> <span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div>
                    <div className='row mb-2'>
                        <div className='col-8'>
                            <div className='m-2 text-system'><b> <span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_vente} </b></div>
                            <div className='m-2 text-system'><b> <span className='bi bi-box-seam-fill '></span> Qte : {articleNow.Quantite} </b></div>
                        </div>
                        <div className='col-4'>
                            <Button size="large" disabled={saveBtnState} className='rounded-pill bg-warning' onClick={ () => setArticleNow({...articleNow, Prix_vente : 0})} fluid> Gratuit</Button>
                        </div>
                    </div>
                    <Input type='number' icon='dropbox' autoFocus={autofocusState} onChange={ (e) => {articleNow.Qte = e.target.value}} size="large" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                    <br />
                    <Button fluid  size="large" className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card-body mb-2'>
                    <h5>Buttons</h5>
                    <Button disabled={saveBtnState} className='rounded-pill bg-system-btn' size="large" fluid onClick={SaveFacture}><Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {commandeD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{commandeD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }


    return (  <>
        <BackCard data={InputLinks.backCard.nv}/>
        <br />
        <div className='container-fluid'>
            <Tab menu={{  pointing: true  }} panes={panes} />
        </div>
    </>);
}

export default NouveauxCommande;