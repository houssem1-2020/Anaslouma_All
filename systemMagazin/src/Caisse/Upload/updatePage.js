import React, {useEffect,useState}  from 'react';
import axios from 'axios';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { toast } from 'react-toastify';
import { Segment , Icon, Input, Button, Loader, Dropdown, Dimmer} from 'semantic-ui-react';
import { CircularProgressbar,  buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GConf from '../../AssetsM/generalConf';

function UploadeCamionPage() {

    /*#########################[Const]##################################*/
    const [isDisabled , setIsDisabled] = useState(false)
    const [loaderState, setLS] = useState(false)
    let [stockList, setStock] = useState([]); 
    let [stockFrimIDNList, setStockFromIDB] = useState(1); 
    let [facturesList, setFactures] = useState([]); 
    let [clientList, setClients] = useState([]); 
    const [loadingPage, setLoadingP] = useState(true)
    let camData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const camId = camData.Cam_ID; 
    let [Offline, setOffline] = useState(JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`))); 
    const Genres = [
        {text: 'Stock', allT: stockList, whT: Offline.stock , whtTag :'stock' },
        {text: 'Facture', allT: facturesList, whT: Offline.facture , whtTag :'facture' },
        {text: 'Client', allT: clientList, whT: Offline.client , whtTag :'client' },
    ]

    /*#########################[UseEffect]##################################*/
    useEffect(() => {   
        StockInIDB()
        axios.post(`${GConf.ApiCaisseLink}/update`, {
            forPID : InputLinks.forPID.PID,
        }).then(function (response) {
            setStock(response.data[0].stock)
            setFactures(response.data[0].facture)
            setClients(response.data[0].client)
            setLoadingP(false)
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


    /*#########################[Functions]##################################*/
    const SaveStockToIndsexDB = () =>{
        let request = indexedDB.open('Magazin_Caisse_DB');
        request.onsuccess = function(event) {
            var transaction = event.target.result.transaction(['Stock'], 'readwrite');
            var objectStore = transaction.objectStore('Stock');
            objectStore.clear();
            // // Using a loop to add stockList one by one
            for (let i = 0; i < stockList.length; i++) {
                objectStore.add(stockList[i]);
            }

            transaction.oncomplete = function() {
                console.log('stockList inserted successfully!');
            };

            transaction.onerror = function(event) {
                console.log('Error inserting stockList:', event.target.error);
            };
            
        };
    }
    const StockInIDB = () => {
        let request = indexedDB.open('Magazin_Caisse_DB');
        request.onsuccess = function(event) {
            var transaction = event.target.result.transaction(['Stock'], 'readwrite');
            var objectStore = transaction.objectStore('Stock');
            var countRequest = objectStore.count();
            countRequest.onsuccess = function() {
                setStockFromIDB(countRequest.result);
            };
            
        };
    }

    const UpdateItem = (allTable, whTableTag) =>{
            Offline[whTableTag] = allTable
            localStorage.setItem(`Magazin_Caisse_Offline`, JSON.stringify(Offline));
            setOffline(JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`)))
    }
    const GetPourcentageValue = (allTable, whTable) => {
            let all = allTable.length
            let weHave = whTable.length
            let value = (((all - (all - weHave)) / all ) * 100 )
            return isFinite(value) ? parseInt(value) : 0.0;
    }
    const GetPourcentageValueWithLength = (allTable, whTable) => {
        let all = stockList.length
        let weHave = stockFrimIDNList
        let value = (((all - (all - weHave)) / all ) * 100 )
        return isFinite(value) ? parseInt(value) : 0.0;
}
    const DeleteFromOffline = (targetTable, targetElm) =>{
        console.log(Offline[targetTable][targetElm])
        Offline[targetTable].splice(targetElm,1)
        localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
    }
    const SaveFactureFunc = (targetIndex) => {
        setLS(true)
        let factureSelected = Offline.factureToSave[targetIndex]
        console.log(factureSelected)
        axios.post(`${GConf.ApiCaisseLink}/update/ajouter/facture`, {
            forPID : camData.PID,
            factureD: factureSelected,
        })
        .then(function (response) {
            if(response.status = 200) {
                toast.success("Facture Enregistreé !", GConf.TostSuucessGonf)
                setLS(false)
                Offline.factureToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
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
    const SaveClientFunc = (targetIndex) => {
        setLS(true)
        let clientSelected = Offline.clientToSave[targetIndex]
        axios.post(`${GConf.ApiLink}/client/ajouter`, {
            tag : GConf.SystemTag,
            clientD : clientSelected,
        }).then(function (response) {
            if(response.data.affectedRows) {
                toast.success("Client Ajouter !", GConf.TostSuucessGonf)
                setLS(false)
                Offline.clientToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
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
    const SaveDepenseFunc = (targetIndex) => {
        setLS(true)
        let CamionSelected = Offline.camionToSave[targetIndex]
        axios.post(`${GConf.ApiLink}/camions/ajouter`, {
            tag : GConf.SystemTag,
            camionD : CamionSelected,
        }).then(function (response) {
            console.log(response.data)
            if(response.data.affectedRows) {
                toast.success("Camion Ajouteé !", GConf.TostSuucessGonf)
                setLS(false)
                Offline.camionToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
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
        <div className='col-12 col-lg '>
            <div className={`card card-body shadow-sm mb-2 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'text-danger' }`}>
                <div className='text-left mb-2  '>
                    <b>{props.genre.text}</b>
                </div>
                <div className='align-self-center mb-3'>
                    <div style={{ width: 100, height: 100 , textAlign:'center'}}>
                        <CircularProgressbar className='text-center' strokeWidth={2}  value={GetPourcentageValue(props.genre.allT,props.genre.whT)} maxValue={100} minValue={0} text={`${GetPourcentageValue(props.genre.allT,props.genre.whT)}%`} />
                    </div> 
                </div>
                <div className='text-center'><Button size='tiny' disabled={isDisabled} fluid className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateItem(props.genre.allT,props.genre.whtTag)}>  <Icon name='retweet' /> Mettre à Jour </Button></div> 
            </div> 
        </div>
        </>)
    }
    const OfflineItemStock = (props) =>{
        return(<>
        <div className='col-12 col-lg '>
            <div className={`card card-body shadow-sm mb-2 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'text-danger' }`}>
                <div className='text-left mb-2  '>
                    <b>Stock </b>
                </div>
                <div className='align-self-center mb-3'>
                    <div style={{ width: 100, height: 100 , textAlign:'center'}}>
                        <CircularProgressbar className='text-center' strokeWidth={2}  value={GetPourcentageValueWithLength(stockList.length,StockInIDB())} maxValue={100} minValue={0} text={`${GetPourcentageValueWithLength(stockList.length,StockInIDB())}%`} />
                    </div> 
                </div>
                <div className='text-center'><Button size='tiny' disabled={isDisabled} fluid className=' rounded-pill bg-system-btn' icon onClick={() => SaveStockToIndsexDB()} >  <Icon name='retweet' /> Mettre à Jour </Button></div> 
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

    const FactureTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm text-dark border-div'>
                <div className='row'>
                    <div className='col-6'>
                        <div className='row'>
                            <div className='col-12 align-self-center'>Client :  {props.data.client}</div>
                            <div className='col-12 align-self-center'>Totale:  {props.data.totale} </div>
                            <div className='col-12 align-self-center'>N articles :  {props.data.articles.length} <small>articles</small> </div>
                            <div className='col-12 align-self-center'>Date : {props.data.jour} </div>
                            
                        </div> 
                    </div>
                    <div className='col-4 text-end'>
                            <div className='col-12 text-start'>Etat:  {props.data.State} </div>
                            <div className='col-12 text-start'>Espéce :  {props.data.Espece}  </div>
                            <div className='col-12 text-start'>Bons : {props.data.Paye_Bons == '' ? '' : `${JSON.parse(props.data.Paye_Bons).qte} X ${JSON.parse(props.data.Paye_Bons).valeur} `} </div>
                    </div>
                    <div className='col-2 text-end'>
                            <Button size='tiny'   className=' rounded-pill bg-system-btn d-block mb-2' icon onClick={(e) => SaveFactureFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button>  
                            <Button size='tiny'    className=' rounded-pill bg-danger text-white d-block' icon onClick={(e) => DeleteFromOffline('factureToSave', props.offIndex)}>  <Icon name='trash' /> Supprimer</Button>  
                        
                    </div>
                </div>  
            </div>
        </>)
    }
    const DepenseTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-12 align-self-center'>Genre :  {props.data.genre}</div>
                            <div className='col-12 align-self-center'>Valeur:  {props.data.valeur} </div>
                            <div className='col-12 align-self-center'></div>
                            <div className='col-12 align-self-center'></div>
                            <div className='col-6 col-lg-2 text-start'> <Button size='tiny'   className=' rounded-pill bg-system-btn' icon onClick={(e) => SaveClientFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button> </div>
                            <div className='col-6 col-lg-1 text-end'> <Button size='tiny'    className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('clientToSave', props.offIndex)}>  <Icon name='save' /></Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }

    return (<>
    <div className={` spesific-commp ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2 text-white' : 'bg-ligth-theme-2' }`} style={{height: '100vh', overflow: 'scroll'}}>
        <BackCard data={InputLinks.backCard.up}/>
        <br />
        <Dimmer active={loaderState || loadingPage} page inverted style={{minHeight:'100% !important'}}>
            <Loader inverted>{loadingPage == true ? 'Chargemment' : 'Enregistremment'} </Loader>
        </Dimmer>
        <div className='container'>
            {/* <button onClick={() => SaveStockToIndsexDB()} >Cklick here </button> */}
             <h5><span className="bi bi-arrow-repeat"></span> Tableaux a jour </h5>
            <br />
            <div className='row'>
                <OfflineItemStock />
                <OfflineItem genre={Genres[1]} clickFunction={UpdateItem}/>
                <OfflineItem genre={Genres[2]} clickFunction={UpdateItem}/>
            </div>
            <br />
            <br />
            <div className='p-2'>
               <h5>Facture à enregistreé : </h5>
               {Offline.factureToSave.length != 0 ? Offline.factureToSave.map( (data, index) => <FactureTosave key={index} data={data} offIndex={index} />) : <PasDeResult />}  

                {/* <h5>Client à enregistreé : </h5>
               {Offline.clientToSave.length != 0 ? Offline.clientToSave.map( (data, index) => <ClientTosave key={index} data={data} offIndex={index} />) : <PasDeResult />}

              <h5>Depense à enregistreé : </h5>
               {Offline.depensesToSave.length != 0 ? Offline.depensesToSave.map( (data, index) => <DepenseTosave key={index} data={data} offIndex={index} />) : <PasDeResult />} */}

            </div>
        </div>
    </div>
    </>);
}

export default UploadeCamionPage;