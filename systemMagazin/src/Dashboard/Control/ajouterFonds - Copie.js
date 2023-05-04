import React, { useEffect, useState } from 'react';
import BreadCrumb  from '../Assets/breadCrumb';
import GConf from '../../AssetsM/generalConf';
import { Button, Dropdown, Icon, Input, Loader, Tab } from 'semantic-ui-react';
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
const PrintBSBL = ({BonSL, setBonSL, PrintFunction, saveBtnState}) =>{
    return (<>
            <div className='card card-body shadow-sm mb-2'>
                <h5>Bond de Sortie / Livraision </h5>
                <Input icon='user' size="small" iconPosition='left' placeholder='Chauffeur '  fluid className='mb-1' value={BonSL.chauffeur}  onChange={(e) => setBonSL({...BonSL, chauffeur: e.target.value })} />
                <div className='row'>
                    <div className='col-6'><Input icon='map marker' size="small" iconPosition='left' placeholder='De'  fluid className='mb-1'  value={BonSL.de}  onChange={(e) => setBonSL({...BonSL, de: e.target.value })}/></div>
                    <div className='col-6'><Input icon='map marker alternate' size="small" iconPosition='left' placeholder='Vers'  fluid className='mb-1' value={BonSL.vers}  onChange={(e) => setBonSL({...BonSL, vers: e.target.value })}/></div>
                </div>
                <div className='row mb-1 mt-3'>
                    <div className='col-6'>
                        <Button disabled={!saveBtnState} className='rounded-pill btn-imprimer' size='small' fluid onClick={ (e) => PrintFunction('PrintBonL') }><Icon name='print' /> BL</Button>
                    </div>
                    <div className='col-6'>
                        <Button disabled={!saveBtnState} className='rounded-pill btn-imprimer' size='small' fluid onClick={ (e) => PrintFunction('PrintBonS') }> <Icon name='print' />BS</Button>
                    </div>
                </div>
            </div>
    </>)
}

function AjouterFond() {
   /* ############################### Const ################################*/
    let Today = new Date()
    let [fondD, setFondD] = useState({camion:'PASSAGER',  Genre:'Fonds', jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    let [camionList, setCamionList] = useState([]); 
    let [articleList, setArticleList] = useState([]); 
    let [fullarticleList, setFullArticleList] = useState([]); 
    let [selectedCam, setSelectedCam] = useState(); 
    let [articleNow, setArticleNow] = useState([]) ; 
    let [camionSelectState, setCamionSS] = useState(false); 
    let [saveBtnState, setSaveBtnState] = useState(false) ; 
    let [gettedBonID, setBonID] = useState('');
    let [autofocusState, setAutoFocus] = useState(false)
    const [loaderState, setLS] = useState(false)
    let [BonSL, setBonSL] = useState({chauffeur:'Chauffeur', de:'Sidi Bourouis', vers:'Arriveé'});

    //sdf and scf 
    let [fixDepoStock, setSDF] = useState([]); 
    let [fixCamionStock, setSCF] = useState([]); 
    let [btnSDFState, setSDFBtnS] = useState(true); 
    let [btnSCFState, setSCFBtnS] = useState(true); 
    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ' }, 
            render: () =><AddArticles />,
        },
        {
            menuItem: { key: 'save', icon: 'save outline', content:  'Enregistrer' }, 
            render: () =><ButtonsCard />,
        },
        {
            menuItem: { key: 'blbs', icon: 'file pdf outline', content:  'Extraire' }, 
            render: () => <PrintBSBL BonSL={BonSL} setBonSL={setBonSL} PrintFunction={PrintFunction} saveBtnState={saveBtnState} />,
        }
        
    ]
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}

   /* ############################### UseEffect ########################*/
    useEffect(() => {
          //camionList
          axios.post(`${GConf.ApiLink}/camions`,{PID :GConf.PID})
          .then(function (response) {
              let ClientLN = []
              response.data.map( (dta) => {ClientLN.push({value : dta.Cam_ID, text : <>{dta.Cam_Name} : {dta.Matricule} - {dta.Chauffeur}</>, key: dta.PK})})
              setCamionList(ClientLN)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Les camion n'ont pas été chargeé </div></>, GConf.TostInternetGonf)   
            }
          });
    }, [])


    /* ########################## Functions ############################*/
    const CamionSelected = (e, { value }) =>{
        axios.post(`${GConf.ApiLink}/camion/ajouterf/stock`, {
            PID : GConf.PID,
            camId : value
        })
        .then(function (response) {
               let TableNow = []
               response.data.map( (dta) => {TableNow.push({value : dta.A_Code, text : dta.Name, key: dta.PK})})
               setArticleList(TableNow)
               setFullArticleList(response.data)
               setCamionSS(true)
               setSelectedCam(value)
               setFondD({...fondD, camion: value })
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les article de camion  </div></>, GConf.TostInternetGonf)   
            }
          });

    }
    const GetArticleData = (value) =>{
        const searchObject= fullarticleList.find((article) => article.A_Code == value);
        if(!searchObject.Qte) {searchObject.Qte = 0}
        setArticleNow(searchObject);
        setAutoFocus(true)
    }
    const AddArticleToList = ()=>{
        if (!articleNow.A_Code) {toast.error("code a barre Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Name ) {toast.error("nom Invalide  !", GConf.TostErrorGonf)}
        else if (!articleNow.Prix_vente ) {toast.error("Prix Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.Groupage ) {toast.error("Groupage Invalide !", GConf.TostErrorGonf)}
        else if (articleNow.Quantite === undefined ) { toast.error("Quantité Invalide !", GConf.TostErrorGonf) }
        else if (articleNow.Qte === undefined ) {toast.error("Qunatite camion  Invalide !", GConf.TostErrorGonf)}
        else if (!articleNow.QteAjoute   && articleNow.QteAjoute != 0 ) {toast.error("Ajouter Quantité  !", GConf.TostErrorGonf)}
        else{
            const searchObject = fondD.articles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = fondD.articles.findIndex((article) => article.A_Code == articleNow.A_Code)
                
                fondD.articles[IndexOfArticle].QteAjoute = parseInt(fondD.articles[IndexOfArticle].QteAjoute) + parseInt(articleNow.QteAjoute)
                fixDepoStock[IndexOfArticle][1] = parseInt(fixDepoStock[IndexOfArticle][1]) + parseInt(articleNow.QteAjoute)
                fixCamionStock[IndexOfArticle][2] = parseInt(fixCamionStock[IndexOfArticle][2]) + parseInt(articleNow.QteAjoute * articleNow.Groupage)
                
                //disolayed data in article list card 
                fondD.articles[IndexOfArticle].Quantite = parseInt(fondD.articles[IndexOfArticle].Quantite) - parseInt(articleNow.QteAjoute)
                fondD.articles[IndexOfArticle].Qte = parseInt(fondD.articles[IndexOfArticle].Qte) + parseInt(articleNow.QteAjoute * articleNow.Groupage)
                
                let tot = MakeSum()
                setFondD({...fondD, totale: MakeSum() })
                setArticleNow([])

            } else {
                
           
            let resteEnDepo = articleNow.Quantite - articleNow.QteAjoute //nouveaux stock du depo
            let soitEnCamion = articleNow.Qte + (articleNow.QteAjoute * articleNow.Groupage) // nouveaux stock du camion
            
            //update save fond table 
            let arrayToAdd = {id:fondD.articles.length + 1 ,A_Code: articleNow.A_Code, Name: articleNow.Name, Prix_vente: articleNow.Prix_vente, Groupage : articleNow.Groupage, Quantite: resteEnDepo , Qte: soitEnCamion , QteAjoute: articleNow.QteAjoute}
            fondD.articles.push(arrayToAdd)
            
            //update SDF
            fixDepoStock.push([articleNow.A_Code, parseInt(articleNow.QteAjoute)])
            
            //update SCF
            fixCamionStock.push([articleNow.A_Code + selectedCam ,articleNow.A_Code, parseInt(articleNow.QteAjoute * articleNow.Groupage)])
           
            let tot = MakeSum()
            setFondD({...fondD, totale: MakeSum() })
            setArticleNow([])
        }
            

        }
    }
    const MakeSum = () => {
        let tot = 0
        fondD.articles.map( (art) => { 
           tot = tot +  (parseFloat(art.QteAjoute) * art.Prix_vente)
        })
        return tot.toFixed(3)
        
    }
    const SaveFond = () =>{
            if (!fondD.camion) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
            else if (!fondD.jour ) {toast.error("Date est Invalide !", GConf.TostErrorGonf)}
            else if (!fondD.totale) {toast.error("totale est Invalide !", GConf.TostErrorGonf)}
            else if (!fondD.articles || fondD.articles.length == 0) {toast.error("article list est Invalide !", GConf.TostErrorGonf)}
            else {
                setLS(true)
                axios.post(`${GConf.ApiLink}/camion/ajouterf`, {
                    PID : GConf.PID,
                    fondD: fondD,
                })
                .then(function (response) {
                    if(response.status = 200) {
                        setSaveBtnState(true)
                        toast.success("Fonds enregistreé !", GConf.TostSuucessGonf)
                        setBonID(response.data.BonID)
                        setSaveBtnState(true)
                        setSDFBtnS(false)
                        setSCFBtnS(false)
                        setLS(false)
                        SaveNotification('camionFondAjouter',GConf.PID, fondD)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                }).catch((error) => {
                    if(error.request) {
                      toast.error(<><div><h5>Probleme de Connextion</h5> Le Fond a été enregistrer dans la memoire interne  </div></>, GConf.TostInternetGonf)   
                      setLS(false)
                    }
                  });
            }       
    }
    const RemoveArticleFromList = (value) =>{
        const targetArticle =  fondD.articles.findIndex((article) => article.A_Code === value);
        fondD.articles.splice(targetArticle, 1);

        const targetArticleDepo = fixDepoStock.findIndex((article) => article[0] === value);
        fixDepoStock.splice(targetArticleDepo, 1);

        const targetArticleCamion = fixCamionStock.findIndex((article) => article[1] === value);
        fixCamionStock.splice(targetArticleCamion, 1);

        let tot = MakeSum()
        setFondD({...fondD, totale: tot })
    }
    const UpdateStockDepo = (e, { value }) =>{  
        setLS(true)   
        axios.post(`${GConf.ApiLink}/stock/bs`, {
            PID : GConf.PID,
            artList: fixDepoStock,
          })
          .then(function (response) {      
            if(response.data.affectedRows) {
                axios.post(`${GConf.ApiLink}/camion/fond/us`, { PID : GConf.PID,  bonId: gettedBonID , state:'SDF'})
                toast.success("Stock Modifier !", GConf.TostSuucessGonf)
                setSDFBtnS(true)
                setLS(false)
                
            }
            else{
                toast.error('Erreur Indéfine ', GConf.TostSuucessGonf)
                setLS(false)
            }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Le stock  du depo n'a pas été mit a jour  </div></>, GConf.TostInternetGonf) 
              setLS(false)  
            }
          });

    }
    const UpdateStockCamion = (e, { value }) =>{
        setLS(true)
        axios.post(`${GConf.ApiLink}/camion/stock/update`, {
            PID : GConf.PID,
            camion : selectedCam,
            artList: fixCamionStock,
          })
          .then(function (response) {      
            if(response.data) {
                axios.post(`${GConf.ApiLink}/camion/fond/us`, { PID : GConf.PID,  bonId: gettedBonID , state:'SCF'})
                toast.success("Stock Modifier !", GConf.TostSuucessGonf)
                setSCFBtnS(true)
                setLS(false)
            }
            else{
                toast.error('Erreur Indéfine ', GConf.TostSuucessGonf)
                setLS(false)
            }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Le stock du camion n'a pas été mit a jour  </div></>, GConf.TostInternetGonf) 
              setLS(false)  
            }
          });

    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}

    /* ############################### card ################################*/
    const ArticleListCard = (props) =>{
        return(<>
                    <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                        <div className='row'>
                            <div className='col-5 text-start align-self-center'>
                            {props.dataA.Name}
                            </div>
                            <div className='col-4 align-self-center'><b>{props.dataA.QteAjoute}</b> * {(props.dataA.Prix_vente).toFixed(3)} = {(props.dataA.Prix_vente * props.dataA.QteAjoute).toFixed(3)}</div>
                            <div className='col-2 align-self-center'><b><span className='bi bi-house-door text-danger'></span> {props.dataA.Quantite}   <span className='bi bi-truck text-success'></span> {props.dataA.Qte} </b></div>
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
                    <h5>Date</h5>
                    <Input icon='calendar alternate' type='date' size="small" iconPosition='left'   fluid className='mb-1' value={fondD.jour} onChange={(e) => setFondD({...fondD, jour: e.target.value })}/>
                </div>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Buttons</h5>
                    <div className='row mb-2'>
                        <div className='col-6'>
                            <Button disabled={saveBtnState} className='rounded-pill  bg-system-btn'  fluid onClick={SaveFond}><Icon name='save' /> Enregistrer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                        <div className='col-6'>
                            <Button  className='rounded-pill btn-imprimer' disabled={!saveBtnState}  fluid onClick={ (e) => PrintFunction('PrintFond') }><Icon name='print' /> Imprimer</Button>
                        </div>
                        
                    </div>
                    <div className='row mb-2'>
                         <div className='col-6'>
                            <Button disabled={btnSDFState} className='rounded-pill btn-regler'  fluid onClick={UpdateStockDepo}><Icon name='flag checkered' /> R.S Depo <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                        <div className='col-6'>
                            <Button disabled={btnSCFState} className='rounded-pill btn-regler'  fluid onClick={UpdateStockCamion}><Icon name='flag checkered' /> R.S Camion <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2 sticky-top rounded-pill' style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {fondD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{fondD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }

 
    
    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.CamionAddFond} />
            <br />
            <div className='row'>
                <div className='col-12 col-lg-5'>
                    <div className="mb-4 sticky-top" style={{top:'70px'}}>
                        <Tab menu={{  pointing: true  }} panes={panes} />
                    </div>
                </div>
                <div className='col-12 col-lg-7'>
                    <TotaleCard />
                    <h5>Listes des Articles</h5>    
                    {fondD.articles.map( (val,index) => <ArticleListCard key={index} dataA={val}/>)}
                    <br /> 
                </div>
            </div>
            <FrameForPrint frameId='PrintFond' src={`/Pr/Camion/Fonds/fondTemp/${gettedBonID}`} />
            <FrameForPrint frameId='PrintBonL' src={`/Pr/Camion/Fonds/FondbonL/${gettedBonID}/${BonSL.chauffeur}/${BonSL.de}/${BonSL.vers}`} />
            <FrameForPrint frameId='PrintBonS' src={`/Pr/Camion/Fonds/FondbonS/${gettedBonID}/${BonSL.chauffeur}/${BonSL.de}/${BonSL.vers}`} />
        </> );
    }

export default AjouterFond;