import React, {useEffect,useState}  from 'react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import { toast } from 'react-toastify';
import { Segment , Icon, Input, Button, Loader, Dropdown, Dimmer} from 'semantic-ui-react';
import { CircularProgressbar,  buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';

function UpdatePage() {
    /*#########################[Const]##################################*/
    const [isDisabled , setIsDisabled] = useState(false)
    let [commandeList, setCommandes] = useState([]); 
    let [stockList, setStock] = useState([]); 
    let [familleList, setFamille] = useState([]); 
    let [facturesList, setFactures] = useState([]); 
    let [camionList, setCamions] = useState([]); 
    let [clientList, setClients] = useState([]); 
    const [FID, setFID] = useState(0)
    const [loadingPage, setLoadingP] = useState(true)
    let [Offline, setOffline] = useState(JSON.parse(localStorage.getItem(`Magazin_Offline`))); 
    const [loaderState, setLS] = useState(false)
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    const Genres = [
        {text: 'Commandes', allT: commandeList, whT: Offline.commande , whtTag :'commande' },
        {text: 'Stock', allT: stockList, whT: Offline.stock , whtTag :'stock' },
        {text: 'Facture', allT: facturesList, whT: Offline.facture , whtTag :'facture' },
        {text: 'Camion', allT: camionList, whT: Offline.camion , whtTag :'camion' },
        {text: 'Client', allT: clientList, whT: Offline.client , whtTag :'client' },
        {text: 'Famille', allT: familleList, whT: Offline.famille , whtTag :'famille' },
    ]
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/update`, {
            PID: GConf.PID,
        }).then(function (response) {
            setCommandes(response.data[0].commande)
            setStock(response.data[0].stock)
            setFamille(response.data[0].stockFamille)
            setFactures(response.data[0].facture)
            setCamions(response.data[0].camion)
            setClients(response.data[0].client)
            setLoadingP(false)
            console.log(caches)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Vous ne pouver pas mettre à jour vos donneé maintenant</div></>, GConf.TostInternetGonf) 
              setStock([])
              setFactures([])
              setIsDisabled(true)
              setLoadingP(false)
            }
        });
      }, [])
    
    /*#########################[Functions]#############################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const UpdateItem = (allTable, whTableTag) =>{
            Offline[whTableTag] = allTable
            localStorage.setItem(`Magazin_Offline`, JSON.stringify(Offline));
            setOffline(JSON.parse(localStorage.getItem(`Magazin_Offline`)))
    }
    const UpdateAllItem = () =>{
        for (let index = 0; index < Genres.length; index++) {
            const allT = Genres[index].allT;
            const whtTag = Genres[index].whtTag;
            UpdateItem(allT,whtTag)
            console.log(allT,whtTag)
        }
       
        // navigator.storage.estimate().then(function(estimate) {
        //     var currentStorage = estimate.usage;
        //     var storageLeft = estimate.quota - currentStorage;
        //     if (storageLeft < stockList.length) {
        //       navigator.storage.persist().then(function(persistent) {
        //         if (persistent) {
        //           // Increase the quota
        //           console.log(currentStorage)
        //           navigator.storage.requestPersistentQuota(stockList.length).then(function(grantedQuota) {
        //             // Quota was granted
        //           }).catch(function(error) {
        //             // Quota request was denied
        //           });
        //         } else {
        //           // Persistence could not be granted
        //           console.log(storageLeft)
        //         }
        //       });
        //     }else{
        //         console.log(storageLeft)
        //     }
        //   });
    }
    const GetPourcentageValue = (allTable, whTable) => {
            let all = allTable.length
            let weHave = whTable.length
            let value = (((all - (all - weHave)) / all ) * 100 )
            return isFinite(value) ? parseInt(value) : 0.0;
    }
    const DeleteFromOffline = (targetTable, targetElm) =>{
        console.log(Offline[targetTable][targetElm])
        Offline[targetTable].splice(targetElm,1)
        localStorage.setItem(`Magazin_Offline`,  JSON.stringify(Offline));
    }
    const SaveFactureFunc = (targetIndex) => {
        setLS(true)
        let factureSelected = Offline.factureToSave[targetIndex]
        console.log(factureSelected)
        axios.post(`${GConf.ApiLink}/facture/ajouter`, {
            PID: GConf.PID,
            factD: factureSelected,
        })
        .then(function (response) {
            if(response.status = 200) {
                toast.success("Facture Enregistreé !", GConf.TostSuucessGonf)
                setLS(false)
                SaveNotification('factureAjouter',GConf.PID, factureSelected)
                Offline.factureToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Offline`,  JSON.stringify(Offline));
            }
            else{
                toast.error('Erreur!  esseyez de nouveaux', GConf.TostSuucessGonf)
                setLS(false)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5>   </div></>, GConf.TostInternetGonf)  
              setLS(false) 
            }
          });
        
    }
    const PrintFactureFunc = (targetIndex) =>{
        setFID(targetIndex)
        PrintFunction('printFacture')
    }
    const SaveArticleFunc = (targetIndex) => {
        setLS(true)
        let ArticleSelected = Offline.articleToSave[targetIndex]
        axios.post(`${GConf.ApiLink}/stock/ajouter`, {
            Tag : GConf.PID,
            articleD : ArticleSelected,
        }).then(function (response) {
            if(response.data.affectedRows) {
                toast.success("Article Enregistreé !", GConf.TostSuucessGonf)
                setLS(false)
                SaveNotification('stockSaveArticle',GConf.PID, ArticleSelected)
                Offline.articleToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Offline`,  JSON.stringify(Offline));
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                setLS(false)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5>   </div></>, GConf.TostInternetGonf)  
              setLS(false) 
            }
          });
        
    }
    const SaveClientFunc = (targetIndex) => {
        setLS(true)
        let clientSelected = Offline.clientToSave[targetIndex]
        axios.post(`${GConf.ApiLink}/client/ajouter`, {
            tag : GConf.PID,
            clientD : clientSelected,
        }).then(function (response) {
            if(response.data.affectedRows) {
                toast.success("Client Ajouter !", GConf.TostSuucessGonf)
                SaveNotification('clientAjouter',GConf.PID, clientSelected)
                setLS(false)
                Offline.clientToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Offline`,  JSON.stringify(Offline));
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                setLS(false)
                }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5>   </div></>, GConf.TostInternetGonf)  
              setLS(false) 
            }
          });
        
    }
    const SaveCamionFunc = (targetIndex) => {
        setLS(true)
        let CamionSelected = Offline.camionToSave[targetIndex]
        axios.post(`${GConf.ApiLink}/camions/ajouter`, {
            tag : GConf.PID,
            camionD : CamionSelected,
        }).then(function (response) {
            console.log(response.data)
            if(response.data.affectedRows) {
                toast.success("Camion Ajouteé !", GConf.TostSuucessGonf)
                setLS(false)
                SaveNotification('camionAjouter',GConf.PID, CamionSelected)
                Offline.camionToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Offline`,  JSON.stringify(Offline));
            }
            else {
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5>   </div></>, GConf.TostInternetGonf)  
              setLS(false) 
            }
          });
        
    }

    /*#########################[Card]##################################*/
    const OfflineItem = (props) =>{
        return(<>
        <div className='col-12 col-lg'>
            <div className='card card-body shadow-sm mb-2 border-div'>
                
                <div className='align-self-center mb-0'>
                    <div style={{ width: 100, height: 100 , textAlign:'center'}}>
                        <CircularProgressbar className='text-center' strokeWidth={2}  value={GetPourcentageValue(props.genre.allT,props.genre.whT)} maxValue={100} minValue={0} text={`${GetPourcentageValue(props.genre.allT,props.genre.whT)}%`} />
                    </div> 
                    <div className='text-center mt-2 text-danger'>
                        <b>{props.genre.text}</b>
                    </div>
                </div>
                {/* <div className='text-center'><Button size='tiny' disabled={isDisabled} fluid className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateItem(props.genre.allT,props.genre.whtTag)}>  <Icon name='retweet' /> Mettre à Jour </Button></div>  */}
            </div> 
        </div>
        </>)
    }
    const PasDeResult = (props) =>{
        return(<>
            <div className='card-body'>
                <div className='row'>
                <div className='col-12 text-center align-self-center'> <img src='https://assets.ansl.tn/Images/usful/empty-logo.svg' width='50%'  height='100px' /></div>
                    <div className='col-12 text-center align-self-center text-secondary'><b>Il y'a Pas de {props.genre} a enregistreé </b></div>
                </div>
                
            </div>
        </>)
    }
    const ArticleTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm border-div'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-6 col-lg-2 align-self-center'>Code à barre :  {props.data.A_Code}</div>
                            <div className='col-6 col-lg-3 align-self-center'>Nom :  {props.data.Name}</div>
                            <div className='col-6 col-lg-2 align-self-center'>Famille:  {props.data.Genre} </div>
                            <div className='col-6 col-lg-2 align-self-center'>N articles :  {props.data.PrixV} <small>articles</small> </div>
                            <div className='col-6 col-lg-2 text-end'> <Button size='tiny'    className=' rounded-pill bg-system-btn' icon onClick={(e) => SaveArticleFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button> </div>
                            <div className='col-6 col-lg-1 text-end'> <Button size='tiny'    className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('articleToSave', props.offIndex)}>  <Icon name='save' /></Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }
    const FactureTosaveCard = (props) =>{
        return(<>
            <div className='col-12 col-lg-6'>
                <div className='card p-3 mb-3 shadow-sm border-div'>
                    <div className='row'>
                        <div className='col-6 col-lg-6 align-self-center'> <b className='text-primary'>client :  {props.data.client}</b></div>
                        <div className='col-6 col-lg-6 align-self-center'><b className='text-secondary'> Totale:  {props.data.totale} </b></div>
                        <div className='col-6 col-lg-6 align-self-center'><b className='text-secondary'> Camion :  {props.data.Fournisseurs}  </b></div>
                        <div className='col-6 col-lg-6 align-self-center'><b className='text-secondary'> Chauffeur :  {props.data.Chauffeur}  </b></div>
                        <div className='col-6 col-lg-6 align-self-center'><b className='text-secondary'> N articles :  {props.data.articles.length} </b> <small>articles</small> </div>
                        <div className='col-6 col-lg-6 align-self-center'><b className='text-secondary'> Date : {props.data.jour} </b></div>
                        <div className='col-12 col-lg-12 text-end'>
                           <div className='row mt-3'>
                                <div className='col-6 text-center'>
                                    <Button size='tiny'  className=' rounded-pill btn-imprimer text-white' icon onClick={(e) => PrintFactureFunc(props.offIndex)}>  <Icon name='print' /></Button> 
                                    <Button size='tiny'  className=' rounded-pill btn-imprimer text-white' icon onClick={(e) => PrintFactureFunc(props.offIndex)}>  BL</Button> 
                                    <Button size='tiny'  className=' rounded-pill btn-imprimer text-white' icon onClick={(e) => PrintFactureFunc(props.offIndex)}>  BS</Button> 
                                </div>
                                <div className='col-6 text-end'>
                                    <Button size='tiny'  className=' rounded-pill bg-system-btn' icon onClick={ (e) => SaveFactureFunc(props.offIndex)}>  <Icon name='save' /> </Button>
                                    <Button size='tiny'  className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('factureToSave', props.offIndex)}>  <Icon name='trash alternate outline' /></Button> 
                                </div>
                           </div>

                                    
                        </div>
                    </div>  
                </div>
            </div> 
        </>)
    }
    const CamionTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm border-div'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-6 col-lg-3 align-self-center'>client :  {props.data.Matricule}</div>
                            <div className='col-6 col-lg-2 align-self-center'>Totale:  {props.data.Cam_Name} </div>
                            <div className='col-6 col-lg-2 align-self-center'>N articles :  {props.data.Chauffeur} <small>articles</small> </div>
                            <div className='col-6 col-lg-2 align-self-center'> </div>
                            <div className='col-6 col-lg-2 text-end'> <Button size='tiny'    className=' rounded-pill bg-system-btn' icon onClick={(e) => SaveCamionFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button> </div>
                            <div className='col-6 col-lg-1 text-end'> <Button size='tiny'    className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('camionToSave', props.offIndex)}>  <Icon name='save' /></Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }
    const ClientTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm border-div'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-6 col-lg-2 align-self-center'>Matricule :  {props.data.Code_Fiscale}</div>
                            <div className='col-6 col-lg-3 align-self-center'>Nom:  {props.data.Name} </div>
                            <div className='col-6 col-lg-2 align-self-center'>Tel :  {props.data.Phone} </div>
                            <div className='col-6 col-lg-2 align-self-center'>Adresse ; {props.data.Adress} </div>
                            <div className='col-6 col-lg-2 text-end'> <Button size='tiny'   className=' rounded-pill bg-system-btn' icon onClick={(e) => SaveClientFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button> </div>
                            <div className='col-6 col-lg-1 text-end'> <Button size='tiny'    className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('clientToSave', props.offIndex)}>  <Icon name='save' /></Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }

    return ( <>
            <Dimmer active={loaderState} page inverted style={{minHeight:'100% !important'}}>
                <Loader inverted>{'Enregistremment'} </Loader>
            </Dimmer>
            <h5><span className="bi bi-arrow-repeat"></span> Tableaux a jour </h5>
            <br />
            <div className='row'>
                <div className='col-12 mb-3'>
                    <div className='card card-body shadow-sm'>
                        <div className='row'>
                            <div className='col-4 col-lg-1 align-self-center text-center'><img src='https://assets.ansl.tn/Images/usful/upload.svg' width='auto'  height='50px' /> </div>
                            <div className='col-8 col-lg-8'>
                                <h5 className='text-info mb-1'>Cliquer sur le botton pour mettre à jour vos donneé </h5>
                                <small>lorsque vous mettre a jour les données enregistré sur le serveur internet vous pourrait egalemment utiliser votre appplication en mode  Offline, soiyer toujour à jour </small>
                            </div>
                            <div className='col-12 col-lg-3 align-self-center'><Button size='tiny' disabled={isDisabled} fluid className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateAllItem()}>  <Icon name='retweet' /> Mettre à Jour </Button></div>
                        </div>
                    </div>
                </div>
                <OfflineItem genre={Genres[0]}/>
                <OfflineItem genre={Genres[1]}/>
                <OfflineItem genre={Genres[2]}/>
                <OfflineItem genre={Genres[3]}/>
                <OfflineItem genre={Genres[4]}/>
                <OfflineItem genre={Genres[5]}/>
            </div>
            <br />
            <br />
            <div className='p-2'>
                <h5 className='bg-danger d-inline-block p-2 rounded-pill text-white ps-3 pe-3'><span className='bi bi-receipt-cutoff'></span> Facture à enregistreé : </h5>
                <div className='row'>
                    {Offline.factureToSave.length != 0 ? Offline.factureToSave.map( (data, index) => <FactureTosaveCard key={index} data={data} offIndex={index} />) : <PasDeResult genre='Factures' />}  
                </div>

                <h5 className='bg-danger d-inline-block p-2 rounded-pill text-white ps-3 pe-3'><span className='bi bi-upc-scan'></span> Article à enregistreé : </h5>
                {Offline.articleToSave.length != 0 ? Offline.articleToSave.map( (data, index) => <ArticleTosave key={index} data={data} offIndex={index}/>) : <PasDeResult genre='Articles' />}

                <h5 className='bg-danger d-inline-block p-2 rounded-pill text-white ps-3 pe-3'><span className='bi bi-truck'></span> Camion à enregistreé : </h5>
                {Offline.camionToSave.length != 0 ? Offline.camionToSave.map( (data, index) => <CamionTosave key={index} data={data}  offIndex={index}/>) : <PasDeResult genre='Camion' />} 

                {/* <h5>Fond à enregistreé : </h5>
                {Offline.fondCamionToSave.length != 0 ? Offline.fondCamionToSave.map( (data, index) => <ArticleTosave key={index} data={data} />) : <PasDeResult genre='factures' />}  */}

                <h5 className='bg-danger d-inline-block p-2 rounded-pill text-white ps-3 pe-3'><span className='bi bi-person'></span> Client à enregistreé : </h5>
                {Offline.clientToSave.length != 0 ? Offline.clientToSave.map( (data, index) => <ClientTosave key={index} data={data} offIndex={index}/>) : <PasDeResult genre='Clients' />}
            </div>

            {/* <FrameForPrint frameId='printFacture' src={`/Pr/Facture/offline/info/${FID}`} /> */}
    </> );
}

export default UpdatePage;