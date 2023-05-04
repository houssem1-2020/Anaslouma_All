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
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.Name}>{test.Code_Fiscale} - {test.Gouv}</option>
                            )}
                </datalist>
                <Input icon='user' list="clientList"  onChange={(e, { value }) => setFactureD({...factureD, client: value })} size="small" iconPosition='left' placeholder='Client'  fluid className='mb-1' />
            </div>
    </>)
}

function CaisseRapide() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    let camData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const Cam_ID = camData.Cam_ID;
    const [factureD, setFactureD] = useState({client:'PASSAGER', Camion : Cam_ID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [articleList, setArticleList] = useState([])
    const [gettedFID, setFID] = useState('')
    const [keyBordI, setKeyBoedI] = useState('')
    const [clientList, setClientList ] = useState([])
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [autofocusState, setAutoFocus] = useState(false)
    const [loadingPage, setLoadingP] = useState(true)
    //const [stopStream, setStopStram] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`));
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () => <Tab.Pane attached={false}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'bitcoin', content: 'Paymment '  }, 
            render: () => <Tab.Pane attached={false}> <PaymmentCard />  </Tab.Pane>,
        },
        {
            menuItem: { key: 'bons', icon: 'ticket', content: 'Calcuer Bons '  }, 
            render: () => <Tab.Pane attached={false}> <CalculerBons />  </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'user', content: 'Client '  }, 
            render: () => <Tab.Pane attached={false}> <CreditClient />  </Tab.Pane>,
        },
        // {
        //     menuItem: { key: 'client', icon: 'check circle', content: 'Terminer' }, 
        //     render: () =><><Tab.Pane attached={false}>
        //                     <MainDataCard factureD={factureD} setFactureD={setFactureD} clientList={clientList}/>
        //                     <br />
        //                 </Tab.Pane>
        //                 <Tab.Pane attached={false}><ButtonsCard /></Tab.Pane></>,
        // },        
    ]
    const [qrData, setQRData] = useState("Not Found");

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        setClientList(Offline.client)

        axios.post(`${GConf.ApiCaisseLink}/nv/stock`, {
            forPID: camData.PID,
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
        // axios.post(`${GConf.ApiCaisseLink}/sk/reglemment/check`, {
        //     forPID: camData.PID,
        //     camId : Cam_ID,
        //     jour : Today.toISOString().split('T')[0]
        //   })
        //   .then(function (response) {
        //     if(response.data.length != 0) {
        //         setSaveBtnState(true)
        //     }
        //   })
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
                      localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
                      setLS(false)
                    }
                });

            }       
    }
    const BtnClicked = (value) =>{
        if (value === 'C') { 
            setKeyBoedI('') 
        } 
        else if (value === '.' ) { console.log('.') } 
        else {
            setKeyBoedI(Number(keyBordI+value)) 
        }
    }  
    const  EnterKyPressed = (e) =>{
        if (e.which == 13) {
           // alert(keyBordI)
           GetArticleDataByAID()
        }  
        else{
            //console.log(e.which)
        } 
            
    }
    const GetArticleDataByAID = () =>{
        console.log(articleList)
        const searchObjectFirst= articleList.find((article) => article.A_Code == keyBordI);

        if (searchObjectFirst) {
            //alert('exist yess')
            //GetArticleData(keyBordI)
            //AddArticleToList()
            const searchObject = factureD.articles.find((article) => article.A_Code == keyBordI);
            if (searchObject) {
                let IndexOfArticle = factureD.articles.findIndex((article) => article.A_Code == keyBordI)
                factureD.articles[IndexOfArticle].Qte = factureD.articles[IndexOfArticle].Qte + 1
                factureD.articles[IndexOfArticle].PU = ((factureD.articles[IndexOfArticle].Qte) * factureD.articles[IndexOfArticle].Prix ).toFixed(3) 
                setArticleNow([{}])

                setFactureD({...factureD, totale: MakeSum() })
                setAutoFocus(false)
                setKeyBoedI('')
                
            } else {
                let arrayToAdd = {id: factureD.articles.length+1 , A_Code: keyBordI, Name: searchObjectFirst.Name, Prix: searchObjectFirst.Prix_vente, Qte: 1, PU: searchObjectFirst.Prix_vente}
                factureD.articles.push(arrayToAdd)
                setArticleNow([])

                setFactureD({...factureD, totale: MakeSum() })
                setAutoFocus(false)   
                setKeyBoedI('') 
            }

        } else {
            toast.error(<>
                        <div className='card-body w-100 text-center'>
                            <span className='bi bi-box-seam bi-lg'></span> 
                            <h3 className='text-white'>Pas D'article</h3> 
                        </div>
                        </>, GConf.TostCaisseGonf)
        }
    }
    const FireKeyPodBtn = () => {
       
    }
    const AddMoreQte = (valueCode) =>{
        let IndexOfArticle = factureD.articles.findIndex((article) => article.A_Code == valueCode)
        factureD.articles[IndexOfArticle].Qte =  keyBordI
        factureD.articles[IndexOfArticle].PU = ((factureD.articles[IndexOfArticle].Qte) * factureD.articles[IndexOfArticle].Prix ).toFixed(3) 
        setArticleNow([{}])

        setFactureD({...factureD, totale: MakeSum() })
        setAutoFocus(false)
        setKeyBoedI('')
    }

    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    /*#########################[Component]##################################*/ 
    const AddArticles = ({}) =>{
        return (<>
                <div className='row'>
                    <div className='col-12 col-md-5'>
                        <div className='mb-2'>
                            <h5>Entreé</h5> 
                            <Input type='number' size='massive'  icon='braille' value={keyBordI} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value)) ; console.log(keyBordI) }}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                            <br />
                            <div className='row'>
                                <div className='col-6'>
                                    <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => GetArticleDataByAID()}>  <Icon name='check' /> Ajouter</Button>
                                </div>
                                <div className='col-6'>
                                    <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => FireKeyPodBtn()}>  <Icon name='balance' /> Pesé</Button>
                                </div>
                            </div>
                            <h5>Controle</h5> 
                            <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={AddArticleToList}>  <Icon name='redo' /> Nouveaux Ticket</Button>
                            <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='save' /> Valideé Pour PASSAGER</Button>
                        </div>
                    </div>
                    <div className='col-12 col-md-7 align-self-center'>
                        <ClavierCard /> 
                    </div>
                </div> 
                
        </>)
    }
    const ArticleListCard = (props) =>{
        return(<>
                <Fade>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row p-0'>
                            <div className='col-1 align-self-center'><Button disabled={saveBtnState} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)} icon="times" className='rounded-circle p-2 text-white bg-danger'></Button></div>
                            <div className='col-9 text-start align-self-center ps-3'>
                                <div>{props.dataA.Name}</div>
                                <b className='text-danger'>{props.dataA.Qte}</b> * {props.dataA.Prix} = <span className='text-warning'>{props.dataA.PU}</span>
                            </div>
                            <div className='col-2 align-self-center m-0'><Button disabled={saveBtnState} onClick={() => AddMoreQte(props.dataA.A_Code)} icon="plus cart" className='rounded p-2 text-white bg-info'></Button></div>
                        </div>
                    </div>
                </Fade>
                </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 sticky-top border-div' style={{top:'70px'}}>
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
    const ClavierCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className='shadow-sm bg-white border mb-1 border-div' style={{width:'100%', height:'60px'}} onClick={(e) => BtnClicked(props.value) } ><h2>{props.value}</h2></Button>
            </>)
        }
        return(<>
            <div className='row '>
                <div className='col-4 p-2'><BtnCard value='1' /></div>
                <div className='col-4 p-2'><BtnCard value='2' /></div>
                <div className='col-4 p-2'><BtnCard value='3' /></div>
                <div className='col-4 p-2'><BtnCard value='4' /></div>
                <div className='col-4 p-2'><BtnCard value='5' /></div>
                <div className='col-4 p-2'><BtnCard value='6' /></div>
                <div className='col-4 p-2'><BtnCard value='7' /></div>
                <div className='col-4 p-2'><BtnCard value='8' /></div>
                <div className='col-4 p-2'><BtnCard value='9' /></div>
                <div className='col-4 p-2'><BtnCard value='0' /></div>
                <div className='col-4 p-2'><BtnCard value='.' /></div>
                <div className='col-4 p-2'><BtnCard value='C' /></div>
            </div>
        </>)
    }
    const ListeDesBonsCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className='shadow-sm bg-white border mb-1 border-div' style={{width:'100%', height:'60px'}} onClick={(e) => BtnClicked(props.value) } ><h2>{props.value}</h2></Button>
            </>)
        }
        return(<>
            <div className='row '>
                <div className='col-6 p-2'><BtnCard value='2000' /></div>
                <div className='col-6 p-2'><BtnCard value='3000' /></div>
                <div className='col-6 p-2'><BtnCard value='4000' /></div>
                <div className='col-6 p-2'><BtnCard value='5000' /></div>
                <div className='col-6 p-2'><BtnCard value='6000' /></div>
                <div className='col-6 p-2'><BtnCard value='7000' /></div>
                <div className='col-6 p-2'><BtnCard value='8000' /></div>
                <div className='col-6 p-2'><BtnCard value='9000' /></div>
            </div>
            </>)
    }
    const PaymmentCard = ({}) =>{
        return (<>
                <div className='row'>
                    <div className='col-12 col-md-7 align-self-center'>
                        <ClavierCard /> 
                    </div>
                    <div className='col-12 col-md-5'>
                        <div className='mb-2'>
                            <h5 className='text-secondary'>Paymment</h5> 
                            <h3 className='mb-2'>Totale : {factureD.totale}</h3> 
                            <h3 className='mb-2 mt-1'>Reste : {factureD.totale}</h3> 
                            <Input type='number' size='large'  icon='braille' value={keyBordI} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value)) ; console.log(keyBordI) }}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                            <br />
                            <div className='row'>
                                <div className='col-12'>
                                    <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => GetArticleDataByAID()}>  <Icon name='check' /> Payeé</Button>
                                </div>
                            </div>
                            <h5>Imprimer</h5> 
                            <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={AddArticleToList}>  <Icon name='print' /> Imprimer </Button>
                        </div>
                    </div>
                </div> 
                
        </>)
    }
    const CalculerBons = () =>{
        return(<>
        
                <div className='row'>
                    <div className='col-12 col-md-4 align-self-center'>
                        <ListeDesBonsCard /> 
                    </div>
                    <div className='col-12 col-md-8'>
                        <div className='row'>
                            <div className='col-6'>
                                    <div className='mb-2'>
                                        <h5 className='text-secondary'>Paymment</h5> 
                                        <h3 className='mb-2'>Totale : {factureD.totale}</h3> 
                                        <h3 className='mb-2 mt-1'>Reste : {factureD.totale}</h3> 
                                        <Input type='number' size='large'  icon='braille' value={keyBordI} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value)) ; console.log(keyBordI) }}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                                        <br />
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => GetArticleDataByAID()}>  <Icon name='check' /> Payeé</Button>
                                            </div>
                                        </div>
                                        <h5>Imprimer</h5> 
                                        <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={AddArticleToList}>  <Icon name='print' /> Imprimer </Button>
                                    </div>
                            </div>
                            <div className='col-6'>
                                    <div className='mb-2'>
                                        <h5 className='text-secondary'>Paymment</h5> 
                                        <h3 className='mb-2'>Totale : {factureD.totale}</h3> 
                                        <h3 className='mb-2 mt-1'>Reste : {factureD.totale}</h3> 
                                        <Input type='number' size='large'  icon='braille' value={keyBordI} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value)) ; console.log(keyBordI) }}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                                        <br />
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => GetArticleDataByAID()}>  <Icon name='check' /> Payeé</Button>
                                            </div>
                                        </div>
                                        <h5>Imprimer</h5> 
                                        <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={AddArticleToList}>  <Icon name='print' /> Imprimer </Button>
                                    </div>
                            </div>
                        </div>  
                    </div>
                </div> 
        </>)
    }
    const CreditClient = () =>{
        return (<>
                <MainDataCard factureD={factureD} setFactureD={setFactureD} clientList={clientList}/>
                <div className='mt-5'>
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
    return (  <>
        <BackCard data={InputLinks.backCard.nv}/>
        <br />
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12 col-md-4'>
                    <TotaleCard />    
                    {factureD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                    <br />
                </div>
                <div className='col-12 col-md-8'>
                    <Tab menu={{ widths: panes.length , pointing: true  }} panes={panes} />
                </div>
            </div>
        </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/CamSys/facture/${gettedFID}`} />
    </>);
}


export default CaisseRapide;