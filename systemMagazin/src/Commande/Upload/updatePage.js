import React, {useEffect,useState}  from 'react';
import axios from 'axios';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { toast } from 'react-toastify';
import { Segment , Icon, Input, Button, Loader, Dropdown, Dimmer} from 'semantic-ui-react';
import { CircularProgressbar,  buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GConf from '../../AssetsM/generalConf';

function UploadeCommandePage() {

    /*#########################[Const]##################################*/
    const [isDisabled , setIsDisabled] = useState(false)
    const [loaderState, setLS] = useState(false)
    let [stockList, setStock] = useState([]); 
    let [commandeList, setCommandes] = useState([]); 
    let [clientList, setClients] = useState([]); 
    const [loadingPage, setLoadingP] = useState(true)
    let CmdData = JSON.parse(localStorage.getItem(`Magazin_Gerant_LocalD`));
    let UID = CmdData.CID; 
    let [Offline, setOffline] = useState(JSON.parse(localStorage.getItem(`Magazin_Gerant_Offline`))); 
    const Genres = [
        {text: 'Stock', allT: stockList, whT: Offline.stock , whtTag :'stock' },
        {text: 'Commande', allT: commandeList, whT: Offline.commandes , whtTag :'commande' },
        {text: 'Client', allT: clientList, whT: Offline.client , whtTag :'client' },
    ]

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiGerantLink}/update`, {
            tag: GConf.SystemTag,
            UID : UID
        }).then(function (response) {
            setStock(response.data[0].stock)
            setCommandes(response.data[0].commande)
            setClients(response.data[0].client)
            setLoadingP(false)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Vous ne pouver pas mettre à jour vos donneé maintenant</div></>, GConf.TostInternetGonf) 
              setStock([])
              setCommandes([])
              setIsDisabled(true)
              setLoadingP(false)
            }
        });
      }, [])

    const UpdateItem = (allTable, whTableTag) =>{
            Offline[whTableTag] = allTable
            localStorage.setItem(`Magazin_Gerant_Offline`, JSON.stringify(Offline));
            setOffline(JSON.parse(localStorage.getItem(`Magazin_Gerant_Offline`)))
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
        localStorage.setItem(`Magazin_Gerant_Offline`,  JSON.stringify(Offline));
    }

    const SaveCommandeFunc = (targetIndex) => {
        setLS(true)
        let commandeSelected = Offline.commandeToSave[targetIndex]
        axios.post(`${GConf.ApiGerantLink}/ajouter`, {
            tag: GConf.SystemTag,
            commandD: commandeSelected,
        }).then(function (response) {
            if(response.status = 200) {
                toast.success("Facture Enregistreé !", GConf.TostSuucessGonf)
                setLS(false)
                Offline.commandeToSave.splice(targetIndex,1)
                localStorage.setItem(`Magazin_Gerant_Offline`,  JSON.stringify(Offline));
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
    //card
    const OfflineItem = (props) =>{
        return(<>
        <div className='col-12 col-lg'>
            <div className='card card-body shadow-sm mb-2'>
                <div className='text-left mb-2 text-danger'>
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
    const PasDeResult = () =>{
        return(<>
            <div className=' card p-2 mb-3 shadow-sm rounded-pill text-center text-danger'>
                Pas de Resultat
            </div>
        </>)
    }
    const ArticleTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm rounded-pill'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-2 align-self-center'>Code à barre :  {props.data.A_Code}</div>
                            <div className='col-2 align-self-center'>Nom :  {props.data.Name}</div>
                            <div className='col-2 align-self-center'>Famille:  {props.data.Genre} </div>
                            <div className='col-2 align-self-center'>N articles :  {props.data.PrixV} <small>articles</small> </div>
                            <div className='col-2 align-self-center'>Socite : {props.data.Socite}</div>
                            <div className='col-2 text-end'> <Button size='tiny' disabled={isDisabled}  className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateItem(props.genre.allT,props.genre.whtTag)}>  <Icon name='save' /> Enregistré </Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }
    const CommandeTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-12 align-self-center'>client :  {props.data.client}</div>
                            <div className='col-12 align-self-center'>Totale:  {props.data.totale} </div>
                            <div className='col-12 align-self-center'>N articles :  {props.data.articles.length} <small>articles</small> </div>
                            <div className='col-12 align-self-center'>Date : {props.data.jour} </div>
                            <div className='col-6 col-lg-2 text-start'> <Button size='tiny'   className=' rounded-pill bg-system-btn' icon onClick={(e) => SaveCommandeFunc(props.offIndex)}>  <Icon name='save' /> Enregistré </Button> </div>
                            <div className='col-6 col-lg-1 text-end'> <Button size='tiny'    className=' rounded-pill bg-danger text-white' icon onClick={(e) => DeleteFromOffline('commandeToSave', props.offIndex)}>  <Icon name='save' /></Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }

    const ClientTosave = (props) =>{
        return(<>
            <div className='card p-2 mb-3 shadow-sm rounded-pill'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-2 align-self-center'>client :  {props.data.Code_Fiscale}</div>
                            <div className='col-2 align-self-center'>Totale:  {props.data.Name} </div>
                            <div className='col-2 align-self-center'>N articles :  {props.data.Phone} </div>
                            <div className='col-2 align-self-center'>Gouvernement : {props.data.Gouv} </div>
                            <div className='col-2 align-self-center'>Adresse ; {props.data.Adress} </div>
                            <div className='col-2 text-end'> <Button size='tiny' disabled={isDisabled}  className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateItem(props.genre.allT,props.genre.whtTag)}>  <Icon name='save' /> Enregistré </Button> </div>
                        </div> 
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
                            <div className='col-12 text-end'> <Button size='tiny' disabled={isDisabled}  className=' rounded-pill bg-system-btn' icon onClick={(e) => UpdateItem(props.genre.allT,props.genre.whtTag)}>  <Icon name='save' /> Enregistré </Button> </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </>)
    }

    return (<>
        <BackCard data={InputLinks.backCard.up}/>
       <br />
        <Dimmer active={loaderState || loadingPage} page inverted style={{minHeight:'100% !important'}}>
            <Loader inverted>{loadingPage == true ? 'Chargemment' : 'Enregistremment'} </Loader>
        </Dimmer>
       <div className='container'>
             <h5><span className="bi bi-arrow-repeat"></span> Tableaux a jour </h5>
            <br />
            <div className='row'>
                <OfflineItem genre={Genres[0]}/>
                <OfflineItem genre={Genres[1]}/>
                <OfflineItem genre={Genres[2]}/>
            </div>
            <br />
            <br />
            <div className='p-2'>
               <h5>Commande à enregistreé : </h5>
               {Offline.commandeToSave.length != 0 ? Offline.commandeToSave.map( (data, index) => <CommandeTosave key={index} data={data} offIndex={index} />) : <PasDeResult />}  

               {/* <h5>Client à enregistreé : </h5>
               {Offline.clientToSave.length != 0 ? Offline.clientToSave.map( (data, index) => <ClientTosave key={index} data={data} />) : <PasDeResult />} */}

            </div>
        </div>
    </>);
}

export default UploadeCommandePage;