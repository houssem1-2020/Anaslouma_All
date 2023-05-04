import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { Fade } from 'react-reveal';
import { Button,  Dropdown, Form, Icon, Input, Label, Loader, Tab, TextArea } from 'semantic-ui-react';
import useGetArticles from '../../Dashboard/Assets/Hooks/fetchArticles';
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MainDataCard = ({commandeD, setCommandeD,clientList,GetClientNameById,OnKeyPressFunc}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <h5>Date & Client  </h5>
                <Input icon='calendar alternate' type='date' size="small" iconPosition='left'   fluid className='mb-1' value={commandeD.jour} onChange={(e) => setCommandeD({...commandeD, jour: e.target.value })}/>
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.CL_ID}>{test.Name} : {test.Code_Fiscale} - {test.Gouv}</option>
                            )}
                </datalist>
                <Input icon='user' list="clientList" value={commandeD.client}  onChange={(e, { value }) => setCommandeD({...commandeD, client: value })} size="small" iconPosition='left' placeholder={commandeD.Client}  fluid className='mb-1' />
                <br />
                <h4 className='mb-1 mt-1'>Client : {GetClientNameById(commandeD.client).Name} </h4>    
                <h4 className='mb-1 mt-1'>Matricule Fiscale  : {GetClientNameById(commandeD.client).Code_Fiscale} </h4>    
                <h4 className='mb-1 mt-1'>Adresse  : {GetClientNameById(commandeD.client).Adress} </h4>

                <hr />
                <h5 className='mb-1'>Commentaires</h5>
                <Form>
                    <TextArea  rows="3" onKeyPress={event => OnKeyPressFunc(event)} placeholder='Commentaires' className='w-100 shadow-sm rounded mb-3' onChange={(e) => setCommandeD({...commandeD, Comments: e.target.value })}>{commandeD.Comments}</TextArea>
                </Form>
            </div>
    </>)
}

function CommandeEdit() {
    /*#########################[Const]##################################*/
    let {CID} = useParams()
    let CmdData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`));
    let UID = CmdData.CID;
    const Today = new Date()
    const [commandeD, setCommandeD] = useState({client:null, UID : UID , Comments:'', jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [clientList, setClientList ] = useState([])
    const [articleList, setArticleList] = useState([])
    const [gettedCID, setCID] = useState('*')
    const [loadingEditPage , setLoadingEP] = useState(false)
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [autofocusState, setAutoFocus] = useState(false)
    const [topPrixGrox, setTopPrixGrox] = useState(0)
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'star', content:  <>Articles <Label className='bg-danger' size='tiny'>{commandeD.articles ? commandeD.articles.length : 0}</Label></> }, 
            render: () => 
                        <Tab.Pane attached={false}>
                            <TotaleCard />
                            <h5>Listes des Articles</h5>    
                            {commandeD.articles.map( (val,index) => <ArticleListCard key={index} dataA={val}/>)}
                            <br />
                        </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
            render: () =><><Tab.Pane attached={false}>
                            <MainDataCard commandeD={commandeD} setCommandeD={setCommandeD} clientList={clientList} GetClientNameById={GetClientNameById} OnKeyPressFunc={OnKeyPressFunc} />
                            <br />
                        </Tab.Pane>
                        <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        },
        
    ]

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        setClientList(Offline.client)

        axios.post(`${GConf.ApiCommandeLink}/stock`, {
            tag: GConf.SystemTag,
          }).then(function (response) {
            setArticleList(response.data)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              setArticleList(Offline.stock)

            }
        });

        axios.post(`${GConf.ApiLink}/commande/info`, {
            tag: GConf.SystemTag,
            cid: CID
          }).then(function (response) {
            console.log(response.data[0].Client)
            console.log(GenerateDate(response.data[0].Date_Volu, 1))
            setCommandeD({client:response.data[0].Client, UID : UID , jour:GenerateDate(response.data[0].Date_Volu, 1), totale: response.data[0].Totale , prixGros: response.data[0].Prix_Grox , Comments: response.data[0].Comments , articles:JSON.parse(response.data[0].Articles)})
            setLoadingEP(true)
         }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              setArticleList(Offline.stock)
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
    const GetArticleData = (value) =>{
        const searchObject= articleList.find((article) => article.A_Code == value);
        if (searchObject) {
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
            if (!CheckClientValidite(commandeD.client)) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!commandeD.articles || commandeD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiCommandeLink}/mescommandes/edit`, {
                    tag: GConf.SystemTag,
                    commandD: commandeD,
                    Com_Id : CID
                }).then(function (response) {
                    if(response.status = 200) {
                        setSaveBtnState(true)
                        toast.success("Commande Enregistrer !", GConf.TostSuucessGonf)
                        setCID(response.data.CID)
                        setLS(false)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> La commande sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                      Offline.commandeToSave.push(commandeD)
                      localStorage.setItem('Offline',  JSON.stringify(Offline));
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
    const CheckClientValidite = (clientId) =>{
        const exist = clientList.find((client) => client.CL_ID == clientId);
        if (exist) { return true  } else { return false}
    }
    const GetClientNameById = (clientId) =>{
        const exist = clientList.find((client) => client.CL_ID == clientId);
        if (exist) { return exist  } else { return false}
    }
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 58) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
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
        commandeD.articles.map((data,index) => {
            commandeD.articles[index].Prix = GetPrixGros(data.A_Code)
            commandeD.articles[index].PU = ((commandeD.articles[index].Qte) * GetPrixGros(data.A_Code) ).toFixed(3)
            commandeD.totale = MakeSum()
        })
        setCommandeD({...commandeD, prixGros: true })
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
                </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className=' card-body  mb-2'>
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test, index) =>
                            <option key={index} value={test.A_Code}>{test.Name}</option>
                            )}
                    </datalist>
                    <Input icon='pin' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
                    <div className='m-2 text-system'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-system'><b> <span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div>
                    <div className='row mb-2'>
                        <div className='col-8'>
                            <div className='m-2 text-system'><b> <span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_vente} </b></div>
                            <div className='m-2 text-system'><b> <span className='bi bi-currency-dollar '></span> Prix Gros : {articleNow.Prix_gros} </b></div>
                            <div className='m-2 text-system'><b> <span className='bi bi-box-seam-fill '></span> Qte : {articleNow.Quantite} </b></div>
                        </div>
                        <div className='col-4'>
                            <Button size="small" disabled={saveBtnState} className='rounded-pill bg-warning' onClick={ () => setArticleNow({...articleNow, Prix_vente : 0})} fluid> Gratuit</Button>
                        </div>
                    </div>
                    <Input type='number' icon='dropbox' autoFocus={autofocusState} onChange={ (e) => {articleNow.Qte = e.target.value}} size="small" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                    <br />
                    <Button fluid className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card-body mb-2'>
                    <h5>Buttons</h5>
                    <Button disabled={saveBtnState} className='rounded-pill bg-system-btn' fluid onClick={SaveFacture}><Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='mb-3 d-none'><Button size='big' disabled={commandeD.totale > topPrixGrox ? false : true} className='rounded-pill bg-warning text-dark' onClick={ () => ActivateProxGros()} fluid> Prix Gros</Button></div>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1 className={`${commandeD.prixGros ? 'text-danger' : ''}`} >Totale : {commandeD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{commandeD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.mcInfo}/>
        <br />
        <div className='container-fluid'>
            <Tab menu={{  pointing: true  }} panes={panes} />
        </div>
        </> );
}

export default CommandeEdit;