import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Fade } from 'react-reveal';
import { toast } from 'react-toastify';
import { Button, Form, Icon, Input, Loader, Tab, TextArea } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

const MainDataCard = ({commandeD, setCommandeD,clientList,GetClientNameById,OnKeyPressFunc}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <h5>Date & Clients  </h5>
                <Input icon='calendar alternate' size="large" type='date'  iconPosition='left'   fluid className='mb-1' value={commandeD.jour} onChange={(e) => setCommandeD({...commandeD, jour: e.target.value })}/>
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.CL_ID}>{test.Name} : {test.Code_Fiscale} - {test.Gouv}</option>
                            )}
                </datalist>
                <Input icon='user' placeholder={commandeD.client} list="clientList"  onChange={(e, { value }) => setCommandeD({...commandeD, client: value })} size="large" iconPosition='left'   fluid className='mb-1' />
                <br />
                <h4 className='mb-1 mt-1'>Client : {GetClientNameById(commandeD.client).Name} </h4>    
                <h4 className='mb-1 mt-1'>Matricule Fiscale  : {GetClientNameById(commandeD.client).Code_Fiscale} </h4>    
                <h4 className='mb-1 mt-1'>Adresse  : {GetClientNameById(commandeD.client).Adress} </h4> 
                <hr />
                <h5 className='mb-1'>Commentaires</h5>
                <Form>
                    <TextArea  rows="3" onKeyPress={event => OnKeyPressFunc(event)} placeholder='Commentaires' className='w-100 shadow-sm rounded mb-3' onChange={(e) => setCommandeD({...commandeD, Comments: e.target.value })}/>
                </Form>
            </div>
    </>)
}


function PannierCommande() {
    /*#########################[Const]##################################*/
    let CmdData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`));
    let UID = CmdData.CID; 
    const Today = new Date()
    const [commandeD, setCommandeD] = useState({client: null, UID : UID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loadingPage, setLoadingP] = useState(true)
    const [clientList, setClientList ] = useState([])
    const [articleList, setArticleList] = useState([])
    const [loaderState, setLS] = useState(false)
    const [topPrixGrox, setTopPrixGrox] = useState(0)
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}>
                                <TotaleCard />
                                <h5>Listes des Articles</h5>    
                                {commandeD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                                <br />
                            </Tab.Pane>,
        },{
            menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
            render: () =><>
                        <Tab.Pane attached={false}>
                            <MainDataCard commandeD={commandeD} setCommandeD={setCommandeD} clientList={clientList} GetClientNameById={GetClientNameById} OnKeyPressFunc={OnKeyPressFunc} />
                            <br />
                        </Tab.Pane>
                        <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        },
        
    ]

    /*#########################[UseEffect]##################################*/
    useEffect(()=>{
        setClientList(Offline.client) 
        // console.log(Offline.pannierArticles)
        setCommandeD({...commandeD, articles: Offline.pannierArticles, totale : MakeSumDep() })
        axios.post(`${GConf.ApiCommandeLink}/stock`, {
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

        //check Permission
        axios.post(`${GConf.ApiLink}/Permission`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            setTopPrixGrox(JSON.parse(response.data[0].Totale_Cmd))
        })

    },[])

    /*#########################[Function]##################################*/
    const DeleteFromUpdateList = (value) =>{
        const searchObject= Offline.pannierArticles.findIndex((article) => article.A_Code == value);
        Offline.pannierArticles.splice(searchObject, 1);
        localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
        window.location.reload()
        //let resteArticles = Offline.pannierArticles;
        //setCommandeD({...commandeD, articles: resteArticles })
        //setCommandeD({...commandeD, totale: MakeSum() })
    }
    const MakeSumDep = () => {
            let tot = 0
            Offline.pannierArticles.map( (art) => { 
            tot = tot +  parseFloat(art.PU)
        })
        return (tot.toFixed(3))
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
            setSaveBtnState(true)
            console.log(commandeD)
            axios.post(`${GConf.ApiCommandeLink}/ajouter`, {
                tag: GConf.SystemTag,
                commandD: commandeD,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Commande Enregistrer !", GConf.TostSuucessGonf)
                    setLS(false)
                    //socket.emit('cmd-saved', {message:'doit '})
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    Offline.commandeToSave.push(commandeD)
                    localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
                    setLS(false)
                    setSaveBtnState(true)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La commande sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                  Offline.commandeToSave.push(commandeD)
                  localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
                  setLS(false)
                }
            });

        }       
    }
    const CheckClientValidite = (clientId) =>{
        const exist = clientList.find((client) => client.CL_ID == clientId);
        if (exist) { return true  } else { return false}
    }
    const ClearPannier = () =>{
        Offline.pannierArticles = []
        localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
        window.location.reload()
    }
    const GetClientNameById = (clientId) =>{
        const exist = clientList.find((client) => client.CL_ID == clientId);
        if (exist) { return exist  } else { return false}
    }
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 58) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47  )) {
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
                <div className='mb-3 d-none'><Button size='big' disabled={commandeD.totale > topPrixGrox ? false : true} className='rounded-pill bg-warning text-dark' onClick={ () => ActivateProxGros()} fluid> Prix Gros</Button></div>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {commandeD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{Offline.pannierArticles.length}</h5> articles</div>
                    </div>
                    
                   
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
    const ClearButton = () =>{
        return(<>
            <div className='card-body text-end'>
                <Button className='bg-danger text-white rounded-pill' onClick={() => ClearPannier()}><span className='bi bi-trash'></span> Vider La Pannier </Button>
            </div>
        </>)
    }
    return ( <>
        <BackCard data={InputLinks.backCard.pan}/>
        <br />
        <div className='container-fluid'>
            <ClearButton />
            <Tab menu={{  pointing: true  }} panes={panes} />   
        </div>
    </> );
}

export default PannierCommande;