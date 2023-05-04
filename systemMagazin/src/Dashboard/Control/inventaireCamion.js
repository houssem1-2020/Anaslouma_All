import React, { useEffect, useState } from 'react';
import BreadCrumb  from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import { Button, Dropdown, Icon, Loader, Input, Tab } from 'semantic-ui-react';
import { Fade } from 'react-reveal';
import axios from 'axios';
import { toast } from 'react-toastify';
import usePrintFunction from '../Assets/Hooks/printFunction';
import FrameForPrint from '../Assets/frameForPrint';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';

const SelectCamion = ({CamionSelected, camionList, camionSelectState, selectedCam}) =>{
    return (<>
                <h5>Camion  </h5>
                <Dropdown
                    disabled={camionSelectState}
                    search
                    selection
                    wrapSelection={false}
                    options={camionList}
                    placeholder='Selectionnez Client'
                    className='mb-1'
                    onChange={CamionSelected}
                    value={selectedCam}
                />   
    </>)
}

function InventaireCamion() {
    /* ############################### Const ################################*/
   let Today = new Date()
   let [selectedCam, setSelectedCam] = useState('')
   let [inventaireD, setInventaireD] = useState({camion:selectedCam, Genre:'Inventaire',  jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
   let [camionList, setCamionList] = useState([]);
   let [articleList, setArticleList] = useState([]);
   let [fullarticleList, setFullArticleList] = useState([]);
   let [articleNow, setArticleNow] = useState([])
   let [camionSelectState, setCamionSS] = useState(false)
   let [saveBtnState, setSaveBtnState] = useState(false)
   let [gettedBonID, setBonID] = useState('');
   let [autofocusState, setAutoFocus] = useState(false)
   const [loaderState, setLS] = useState(false)

   //scf
   let [tabeleToSend,setTableToSend] = useState([]);
   
   const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () =><AddArticles />,
        },
        {
            menuItem: { key: 'save', icon: 'box', content:  'Modifier' }, 
            render: () =><ButtonsCard />,
        }
        
    ]
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}

    /* ############################### UseEffect ################################*/
    useEffect(() => {
          //camionList
          axios.post(`${GConf.ApiLink}/camions`,{PID :GConf.PID })
          .then(function (response) {
              let ClientLN = []
              response.data.map( (dta) => {ClientLN.push({value : dta.Cam_ID, text : <>{dta.Cam_Name} : {dta.Matricule} - {dta.Chauffeur}</>, key: dta.PK})})
              setCamionList(ClientLN)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Imossible de charger les camion </div></>, GConf.TostInternetGonf)   
            }
          });
    }, [])


    /* ############################### Function ################################*/
    const CamionSelected = (e, { value }) =>{
        axios.post(`${GConf.ApiLink}/camion/inventaire/stock`, {
            PID : GConf.PID ,
            camId : value
        })
        .then(function (response) {
               let TableNow = []
               response.data.map( (dta) => {TableNow.push({value : dta.A_Code, text : dta.Name, key: dta.PK})})
               setArticleList(TableNow)
               setFullArticleList(response.data)
               setCamionSS(true)
               setSelectedCam(value)
               setInventaireD({...inventaireD, camion: value })
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger le stock du camion  </div></>, GConf.TostInternetGonf)   
            }
          });

    }
    const GetArticleData = (value) =>{
        const searchObject= fullarticleList.find((article) => article.A_Code == value);
        if(!searchObject.Qte) {searchObject.Qte = 0}
        setArticleNow(searchObject);
        setAutoFocus(true)
        console.log(inventaireD)
    }
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("Entrer Un article !", GConf.TostErrorGonf)}
        else if (!articleNow.Name ) {toast.error("Entrer Un article !", GConf.TostErrorGonf)}
        else if (!articleNow.Prix_vente ) {toast.error("Entrer Un article !", GConf.TostErrorGonf)}
        else if (!articleNow.Groupage ) {toast.error("Entrer Un article !", GConf.TostErrorGonf)}
        else if (!articleNow.Qte && articleNow.Qte != 0) {toast.error("Entrer Un article !", GConf.TostErrorGonf)}
        else if (!articleNow.QteAjoute ) {toast.error("Entrer Un article 7!", GConf.TostErrorGonf)}
        else{

            const searchObject = inventaireD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = inventaireD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                
                searchObject.QteAjoute =  parseInt(articleNow.QteAjoute)
                tabeleToSend[IndexOfArticle][2] = parseInt(articleNow.QteAjoute)
            } else {
                let arrayToAdd = {A_Code: articleNow.A_Code, Name: articleNow.Name, Prix_vente: articleNow.Prix_vente, Quantite: articleNow.Quantite , Qte: articleNow.Qte , QteAjoute: parseInt(articleNow.QteAjoute)}
                inventaireD.articles.push(arrayToAdd)
                tabeleToSend.push([articleNow.A_Code + selectedCam , articleNow.A_Code, parseInt(articleNow.QteAjoute)])
            }
            setArticleNow([])
        }
    }
    const RemoveArticleFromList = (value) =>{
        const targetArticle =  inventaireD.articles.findIndex((article) => article.A_Code === value);
        inventaireD.articles.splice(targetArticle, 1);

        const targetArticleCamion = tabeleToSend.findIndex((article) => article[1] === value);
        tabeleToSend.splice(targetArticleCamion, 1);

        setInventaireD({...inventaireD, totale: 0 })


    }
    const FaireInventaire = () =>{
            if (!tabeleToSend || tabeleToSend.length == 0) {toast.error("La Liste est Vide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiLink}/camion/inventaire`, {
                    PID : GConf.PID ,
                    artList: tabeleToSend,
                    camion : selectedCam
                })
                .then(function (response) {
                    if(response.data.affectedRows) {
                        axios.post(`${GConf.ApiLink}/camion/ajouterf`, { 
                            PID : GConf.PID , fondD:inventaireD,
                        }).then(function (response) {
                            setBonID(response.data.BonID)
                            setSaveBtnState(true)
                            toast.success("Inventaire enregistreé !", GConf.TostSuucessGonf)  
                            SaveNotification('camionInventaire',GConf.PID , {camion : selectedCam, id: response.data.BonID})
                            setLS(false)
                        })
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> L'inventaire n'a pas été fut  </div></>, GConf.TostInternetGonf) 
                      setLS(false)  
                    }
                  });
            }       
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}


    /* ############################### Card ################################*/
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-5 text-start align-self-center'>
                            {props.dataA.Name}
                            </div>
                            <div className='col-4 align-self-center'><b>{props.dataA.QteAjoute}</b> * {(props.dataA.Prix_vente).toFixed(3)} = {(props.dataA.Prix_vente * props.dataA.QteAjoute).toFixed(3)}</div>
                            <div className='col-2 align-self-center'><b>{props.dataA.Qte}   <span className='bi bi-arrow-left-right text-success'></span> {props.dataA.QteAjoute} </b></div>
                            <div className='col-1 align-self-center'><Button icon="times" disabled={saveBtnState} className='rounded-circle p-2 text-white bg-danger' onClick={() => RemoveArticleFromList(props.dataA.A_Code)}></Button></div>
                        </div>
                    </div>
                </>)
    }
    const AddArticles = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                <SelectCamion CamionSelected={CamionSelected} camionList={camionList} camionSelectState={camionSelectState} selectedCam={selectedCam} />
                    <h5>Ajouter article</h5> 
                    <datalist id="articlesList">
                            {articleList.map((test) =>
                            <option key={test.key} value={test.value}>{test.text}</option>
                            )}
                    </datalist>
                    <Input icon='barcode' list="articlesList"  onBlur={ (e) => GetArticleData(e.target.value)} size="small" iconPosition='left' placeholder='Desg'  fluid className='mb-1' />
                    <div className='m-2 text-secondary'><b> <span className='bi bi-upc '></span> Code a barre : {articleNow.A_Code} </b></div>
                    <div className='m-2 text-danger'><b> <span className='bi bi-star-fill '></span> Nom : {articleNow.Name} </b></div>
                    <div className='row'>
                        <div className='col-7'>
                             <div className='m-2 text-warning'><b> <span className='bi bi-currency-dollar '></span> Prix : {articleNow.Prix_vente} </b></div>
                        </div>
                        <div className='col-5'>
                            <div className='m-2 text-warning'><b> <span className='bi bi-box2 '></span> Groupage : {articleNow.Groupage} </b></div>
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col-7'>
                            <div className='m-2 text-success'><b> <span className='bi bi-house '></span> Qte Depo : {articleNow.Quantite} </b></div>
                        </div>
                        <div className='col-5'>
                            <div className='m-2 text-success'><b> <span className='bi bi-truck '></span> Qte Camion : {articleNow.Qte} </b></div>
                        </div>
                    </div>
                    <Input type='number' icon='dropbox' autoFocus={autofocusState} onChange={ (e) => {articleNow.QteAjoute = e.target.value}} size="small" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                    <br />
                    <Button  className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='edit outline' /> Ajouter</Button>
                </div>
        </>)
    }
    const ButtonsCard = () =>{
        return (<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button disabled={saveBtnState} className='rounded-pill  bg-system-btn'  fluid onClick={FaireInventaire}><Icon name='refresh' /> Mettre à jour <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                        
                    </div>
                    <div className='row mb-2'>
                        <div className='col-12'>
                            <Button  className='rounded-pill btn-imprimer' disabled={!saveBtnState}  fluid onClick={ (e) => PrintFunction('PrintInventaire') }><Icon name='print' /> Imprimer</Button>
                        </div>
                    </div>
                </div>
        </>)
    }
 
    
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.CamionInv} />
            <br />
            <div className='row'>
                <div className='col-12 col-lg-5'>
                    <div className="mb-4 sticky-top" style={{top:'70px'}}>
                        <Tab menu={{  pointing: true  }} panes={panes} />
                    </div>
                </div>
                <div className='col-12 col-lg-7'>
                    <h5>Listes des Articles</h5>    
                        {inventaireD.articles.map( (val,index) => <ArticleListCard key={index} dataA={val}/>)}
                    <br />
                    
                </div>
            </div>
            <FrameForPrint frameId='PrintInventaire' src={`/Pr/Camion/Inventaire/${gettedBonID}`} />
        </> );
    }

export default InventaireCamion;