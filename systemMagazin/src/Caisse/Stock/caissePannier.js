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
import { Modal } from 'semantic-ui-react';

const MainDataCard = ({clientFidele, setClientFidelle ,clientList}) =>{
    return (<>
            <div className='ccard-body mb-2'>
                <datalist id="clientList">
                            {clientList.map((test) =>
                            <option key={test.PK} value={test.CL_ID}>{test.Phone} - {test.CL_Name}</option>
                            )}
                </datalist>
                <Input icon='user' list="clientList" size='large'   onChange={(e, { value }) => setClientFidelle(clientList.find(obj => obj.CL_ID == value))}  iconPosition='left' placeholder='Client'  fluid className='mb-1' />
            </div>
    </>)
}

const HeadModalSearch = ({saveBtnState,rechercheKey,setRechercheKey,RechercheFunction}) =>{
    return(<>
        <h4>Selectionner Un Article</h4>
        <div className='row'>
                <div className='col-9'><Input  size='meduim'  icon='braille' value={rechercheKey}     onChange={ (e) => {setRechercheKey(e.target.value)}}   iconPosition='left' placeholder=' '  fluid className='mb-1' /></div>
                <div className='col-3'><Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn' onClick={() => RechercheFunction()}>  <Icon name='save' /> Recherche </Button></div>
        </div>
    </>)
}

function CaissePannier() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`));
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID;
    const [qrData, setQRData] = useState("Not Found")
    //const [stopStream, setStopStram] = useState(false)
    
    /*1- Ajouter Article */
    const [factureD, setFactureD] = useState({client:'PASSAGER', Caisse : CaisseID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
    const [articleNow, setArticleNow] = useState([])
    const [articleList, setArticleList] = useState([])
    const [autofocusState, setAutoFocus] = useState(false)
    const [loadingPage, setLoadingP] = useState(true)

    const [keyBordI, setKeyBoedI] = useState('')
    const [floatOpen, setFloatOpen] = useState(false)
    const [peseState, setPeseState] = useState(false)

    const [rechercheKey, setRechercheKey] = useState('')
    const [rechercheList, setRechercheListe] = useState([])
    const [modalS, setModalS] = useState(false)
    const [modalT, setModaT] = useState(false)

    const [gettedFID, setFID] = useState('5555')
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    

    /*2- Paymment */
    const [keyaPaymment, setKeyPaymment] = useState('')
    const [payBtnState, setPayBtnState] = useState(false)

    /*3- Bons */
    const [selectedBon, setSelectedBon] = useState(1)

    /*4- Clients */
    const [clientList, setClientList] = useState([])
    const [clientCredit, setClientCredit ] = useState()
    const [clientFidele, setClientFidelle ] = useState()
    const [fideliteState, setFideliteState ] = useState()


    const panes = [
        {
            menuItem: { key: 'start', icon: 'add circle', content: 'Entrer ', className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' } ` }, 
            render: () => <Tab.Pane attached={false} className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}> <AddArticles /> </Tab.Pane>,
        },
        {
            menuItem: { key: 'articles', icon: 'bitcoin', content: 'Paymment ' , className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' } `  }, 
            render: () => <Tab.Pane attached={false} className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}> <PaymmentCard />  </Tab.Pane>,
        },
        {
            menuItem: { key: 'bons', icon: 'ticket', content: 'Calcuer Bons ' , className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' } ` }, 
            render: () => <Tab.Pane attached={false} className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}> <CalculerBons />  </Tab.Pane>,
        },
        {
            menuItem: { key: 'client', icon: 'user', content: 'Client ' , className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' } ` }, 
            render: () => <Tab.Pane attached={false} className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}> <CreditClient />  </Tab.Pane>,
        },
        // {
        //     menuItem: { key: 'terminer', icon: 'check circle', content: 'Terminer', className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' } ` }, 
        //     render: () =><Tab.Pane attached={false} className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}> </Tab.Pane>,
        // },        
    ]
    

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        setFactureD({...factureD, articles: Offline.pannier, totale : MakeSumDep() })
        setClientList(Offline.client)

        axios.post(`${GConf.ApiCaisseLink}/nv/stock`, {
            forPID: CaisseID,
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
        //     forPID: CaisseID,
        //     camId : CaisseID,
        //     jour : Today.toISOString().split('T')[0]
        //   })
        //   .then(function (response) {
        //     if(response.data.length != 0) {
        //         setSaveBtnState(true)
        //     }
        //   })
    }, [])


    /*#########################[Functions]##################################*/
    /*1- Ajouter Article */
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
    const MakeSumDep = () => {
        let tot = 0
        Offline.pannier.map( (art) => { 
        tot = tot +  parseFloat(art.PU)
    })
    return (tot.toFixed(3))
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
                forPID: CaisseID,
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
        else if (value === '.' ) { 
            //setKeyBoedI(parseFloat(keyBordI)) 
            //alert(parseFloat(keyBordI))
            setFloatOpen(true)
        } 
        else {
            //setKeyBoedI(Number(keyBordI+value)) 
             
            if (floatOpen) {
                setKeyBoedI(prevInput => prevInput + '.' + parseFloat(value))
                setFloatOpen(false)
            } else {
                setKeyBoedI(prevInput => prevInput + parseFloat(value))
            }
        }
    }
    const EnterKyPressed = (e) =>{

        if (e.which == 13) {
            if (e.getModifierState('CapsLock')) {
                GetArticleDataByAID()
            } else {
                toast.error(<>
                    <div className='card-body w-100 text-center'>
                        <span className='bi bi-keyboard-fill bi-lg'></span> 
                        <h3 className='text-white'>Activer Majuscule</h3> 
                    </div>
                    </>, GConf.TostCaisseGonf)
            }
         }  
         else{
             //console.log(e.which)
         } 
            
    }
    const GetArticleDataByAID = () =>{
        if (peseState) {
            let barreCode = keyBordI.toString().substring(0, 7)
            let qte = keyBordI.toString().substring(7)
            const searchObjectFirst= articleList.find((article) => article.A_Code == barreCode);
            if (searchObjectFirst) {
                const searchObject = factureD.articles.find((article) => article.A_Code == keyBordI);
                if (searchObject) {
                    let IndexOfArticle = factureD.articles.findIndex((article) => article.A_Code == keyBordI)
                    factureD.articles[IndexOfArticle].Qte = factureD.articles[IndexOfArticle].Qte + 1
                    factureD.articles[IndexOfArticle].PU = ((factureD.articles[IndexOfArticle].Qte) * factureD.articles[IndexOfArticle].Prix ).toFixed(3) 
                    setArticleNow([{}])

                    setFactureD({...factureD, totale: MakeSum() })
                    setAutoFocus(false)
                    setKeyBoedI('')
                    setPeseState(false)
                    
                } else {
                    let arrayToAdd = {id: factureD.articles.length+1 , A_Code: keyBordI, Name: searchObjectFirst.Name, Prix: searchObjectFirst.Prix_vente, Qte: 1, PU: searchObjectFirst.Prix_vente}
                    factureD.articles.push(arrayToAdd)
                    setArticleNow([])

                    setFactureD({...factureD, totale: MakeSum() })
                    setAutoFocus(false)   
                    setKeyBoedI('') 
                    setPeseState(false)
                }

            } else {
                toast.error(<>
                            <div className='card-body w-100 text-center'>
                                <span className='bi bi-box-seam bi-lg'></span> 
                                <h3 className='text-white'>Pas D'article</h3> 
                            </div>
                            </>, GConf.TostCaisseGonf)
            } 
        } else {
            const searchObjectFirst= articleList.find((article) => article.A_Code == keyBordI);
            if (searchObjectFirst) {
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
    }
    const ActivateCapLock = () => {
        var event = new KeyboardEvent('keydown', {'keyCode': 20, 'which': 20});
        document.dispatchEvent(event);
        alert('gg')
    }
    const FireKeyPosBtn = () => {
       
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
    const RechercheFunction = () => {
        let values = articleList.filter(element => element.Name.toLowerCase().includes(rechercheKey.toLowerCase()));
        setRechercheListe(values)
    }
    const NewTicket = () =>{
        setLoadingP(true)
        setTimeout(() => {
            setLoadingP(false);
        }, 500);
        setFactureD({client:'PASSAGER', Caisse : CaisseID , jour: Today.toISOString().split('T')[0], totale: 0 , articles:[]})
        setArticleNow([])
        setAutoFocus(true)
        setKeyBoedI('')
        setFloatOpen(false)
        setPeseState(false)
        setRechercheKey('')
        setRechercheListe([])
        setModalS(false)
        setModaT(false)
        setFID('')
        setSaveBtnState(false)
        setLS(false)
        setKeyPaymment(0)
        setSelectedBon(1)
        
    }
    /*2- Paymment */
    const PaymmentBtnClicked = (value) =>{
        if (value === 'C') { 
            setKeyPaymment('') 
        } 
        else if (value === '.' ) { 
            setFloatOpen(true)
        } 
        else {             
            if (floatOpen) {
                setKeyPaymment(prevInput => prevInput + '.' + parseFloat(value))
                setFloatOpen(false)
            } else {
                setKeyPaymment(prevInput => prevInput + parseFloat(value))
            }
        }
    }
    const SavePaymmentCache = () =>{

        if (!gettedFID || gettedFID == '') {toast.error("Une Erreur s'est Produit !", GConf.TostErrorGonf)}
        else if (keyaPaymment == '') {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        else if (JSON.parse(factureD.totale) > JSON.parse(keyaPaymment)) {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        else {
            setLoadingP(true)
            axios.post(`${GConf.ApiCaisseLink}/nv/payee/espece`, {
                forPID: CaisseID,
                espece: keyaPaymment,
                fid : gettedFID
            })
            .then(function (response) {
                if(response.status = 200) {
                    setPayBtnState(true)
                    toast.success("Facture Payeé !", GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La facture sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                //   Offline.factureToSave.push(factureD)
                //   localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
                  setLoadingP(false)
                }
            });

        }
    }

    /*3- Bons */
    const BonSlected= (value) =>{
        setSelectedBon(value)
    }
    const CalculateBons = (genre) => {
        if (genre == 'Plus') {
            return {qte : Math.trunc(factureD.totale / selectedBon) +1 , valeur : selectedBon}
        } else {
            return {qte : Math.trunc(factureD.totale / selectedBon) , valeur : selectedBon}
        }
    }
    const SavePaymmentBons = (genre) =>{

        if (!gettedFID || gettedFID == '') {toast.error("Une Erreur s'est Produit !", GConf.TostErrorGonf)}
        else if (selectedBon == '') {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        // else if (JSON.parse(factureD.totale) > JSON.parse(keyaPaymment)) {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        else {
            setLoadingP(true)
            axios.post(`${GConf.ApiCaisseLink}/nv/payee/bons`, {
                forPID: CaisseID,
                bons: CalculateBons(genre),
                fid : gettedFID
            })
            .then(function (response) {
                if(response.status = 200) {
                    setPayBtnState(true)
                    toast.success("Facture Payeé !", GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La facture sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                //   Offline.factureToSave.push(factureD)
                //   localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
                  setLoadingP(false)
                }
            });

        }
    }

    /*4- Clients */
    const SaveClientCredit = (genre) =>{

        if (!gettedFID || gettedFID == '') {toast.error("Une Erreur s'est Produit !", GConf.TostErrorGonf)}
        else if (clientCredit == '') {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        else {
            setLoadingP(true)
            axios.post(`${GConf.ApiCaisseLink}/nv/client/credit`, {
                forPID: CaisseID,
                clientId: clientCredit.CL_ID,
                fid : gettedFID
            })
            .then(function (response) {
                if(response.status = 200) {
                    setPayBtnState(true)
                    toast.success("Crédit Enregistrer !", GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La facture sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                //   Offline.factureToSave.push(factureD)
                //   localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
                  setLoadingP(false)
                }
            });

        }
    }
    const SaveClientFidelle = () =>{

        if (!gettedFID || gettedFID == '') {toast.error("Une Erreur s'est Produit !", GConf.TostErrorGonf)}
        else if (clientFidele == '') {toast.error("Solde Insufisante !", GConf.TostErrorGonf)}
        else {
            setLoadingP(true)
            axios.post(`${GConf.ApiCaisseLink}/nv/client/fidelite`, {
                forPID: CaisseID,
                clientId: clientFidele.CL_ID,
                fid : gettedFID
            })
            .then(function (response) {
                if(response.status = 200) {
                    setFideliteState(true)
                    toast.success("Crédit Enregistrer !", GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLoadingP(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> La facture sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)   
                //   Offline.factureToSave.push(factureD)
                //   localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
                  setLoadingP(false)
                }
            });

        }
    }

    /* Autres */
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}


    /*#########################[Component]##################################*/ 
    const ProgressLoadingBar = (props) =>{
        return(<>
            <div className={`progress-bar-loading ${props.display == true ? '': 'd-none'}`} style={{marginTop:'1px'}}>
                    <div className="progress-bar-loading-value bg-danger"></div>
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

    /*1- Ajouter Article */
    const AddArticles = ({}) =>{
        return (<>
                <div className='row'>
                    <div className='col-12 col-md-5'>
                        <div className='mb-2'>
                            <Button disabled={saveBtnState && !payBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={()=> NewTicket()}>  <Icon name='redo' /> Nouveaux Ticket</Button>
                            <h5>Entreé</h5> 
                            <Input type='number'   size='massive'  icon='barcode' value={keyBordI} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value))}}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                            <br />
                            <div className='row '>
                                <div className='col-6'>
                                    <Button disabled={saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => GetArticleDataByAID()}>  <Icon name='check' /> Ajouter</Button>
                                </div>
                                <div className='col-6'>
                                    <Button disabled={saveBtnState} fluid style={{height:'50px'}} className={`border-div ${peseState ? 'bg-warning text-white' : 'bg-white border '}`} onClick={() => setPeseState(!peseState)}>  <Icon name='balance' /> Pesé </Button>
                                </div>
                            </div>
                            <h5>Enregistrer </h5> 
                            
                            <Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn' onClick={() => SaveFacture()}>  <Icon name='save' /> Valideé Pour PASSAGER</Button>
                        </div>
                    </div>
                    <div className='col-12 col-md-7 align-self-center'>
                       <div className='row'>
                            <div className='col-6'><Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={() => setModalS(true)}>  <Icon name='search' /> Recherche </Button></div>
                            <div className='col-6'><Button disabled={saveBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={() => setModaT(true)}>  <Icon name='search' /> Trouver  </Button></div>
                        </div> 
                        <ClavierCard /> 
                    </div>
                </div> 
                
        </>)
    }
    const ArticleListCard = (props) =>{
        return(<>
                    <div className={`card shadow-sm p-2 mb-1 rounded-pill ps-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' } `} >
                        <div className='row p-0'>
                            <div className='col-1 align-self-center'><Button disabled={saveBtnState} onClick={() => DeleteFromUpdateList(props.dataA.A_Code)} icon="times" className='rounded-circle p-2 text-white bg-danger'></Button></div>
                            <div className='col-9 text-start align-self-center ps-3'>
                                <div>{props.dataA.Name}</div>
                                <b className='text-danger'>{props.dataA.Qte}</b> * {props.dataA.Prix.toFixed(3)} = <span className='text-warning'>{parseFloat(props.dataA.PU).toFixed(3)}</span>
                            </div>
                            <div className='col-2 align-self-center m-0'><Button disabled={saveBtnState} onClick={() => AddMoreQte(props.dataA.A_Code)} icon="plus cart" className='rounded p-2 text-white bg-info'></Button></div>
                        </div>
                    </div>
                </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className={`card card-body shadow-sm mb-2 sticky-top border-div ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white' : '' } `} style={{top:'70px'}}>
                    <div className='row'>
                        <div className='col-9 align-self-center text-start'><h1>Totale : {factureD.totale}</h1></div>
                        <div className='col-3 align-self-center text-center'><h5 className='mb-0'>{factureD.articles.length}</h5> articles</div>
                    </div>
                    
                   
                </div>
            </>)
    }
    const ClavierCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className={`shadow-sm ${props.bg == true ? 'bg-danger text-white ' : InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white border-dark' : 'bg-white' } border mb-1 border-div `} style={{width:'100%', height:'60px', backgroundColor:'red'}} onClick={(e) => BtnClicked(props.value) } ><h2>{props.value}</h2></Button>
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
                <div className='col-4 p-2'><BtnCard value='.' bg={floatOpen} /></div>
                <div className='col-4 p-2'><BtnCard value='C' /></div>
            </div>
        </>)
    }
    const RechercheListeCard = (props) =>{
        return(<>
            <div className='card card-body mb-2 shadow-sm '>
                <div className='row'>
                    <div className='col-3 text-danger'>{props.data.A_Code}</div>
                    <div className='col-7'><b>{props.data.Name}</b></div>
                    <div className='col-2'>{props.data.Prix_vente}</div>
                    <div className='col-1'></div>
                </div>
            </div> 
        </>)
    }

    /*2- Paymment */
    const ClavierPaymmentCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className={`shadow-sm ${props.bg == true ? 'bg-danger text-white ' : InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white border-dark' : 'bg-white' } border mb-1 border-div `} style={{width:'100%', height:'60px'}} onClick={(e) => PaymmentBtnClicked(props.value) } ><h2>{props.value}</h2></Button>
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
                <div className='col-4 p-2'><BtnCard value='.'  bg={floatOpen} /></div>
                <div className='col-4 p-2'><BtnCard value='00' /></div>
                <div className='col-4 p-2'><BtnCard value='10' /></div>
                <div className='col-4 p-2'><BtnCard value='20' /></div>
                <div className='col-4 p-2'><BtnCard value='50' /></div>
            </div>
        </>)
    }
    const PaymmentCard = ({}) =>{
        return (<>
                <div className='row'>
                    <div className='col-12 col-md-7 align-self-center'>
                        <ClavierPaymmentCard /> 
                    </div>
                    <div className='col-12 col-md-5'>
                        <div className='mb-2'>
                            <h5 className='text-secondary'>Paymment</h5> 
                            <h3 className='mb-2'>Totale : {factureD.totale}</h3> 
                            <h3 className='mb-2 mt-1'>Reste : {(keyaPaymment - factureD.totale).toFixed(3)}</h3> 
                                <div className='row'>
                                    <div className='col-9'><Input type='number' size='huge'  icon='money' value={keyaPaymment} onKeyPress={(e) => EnterKyPressed(e)} autoFocus={true} onChange={ (e) => {setKeyPaymment(Number(e.target.value)) }}   iconPosition='left' placeholder=' '  fluid className='mb-1' /></div>
                                    <div className='col-3 ms-0 me-0'> <Button disabled={false} fluid className='border-div   text-white' style={{height:'50px', backgroundColor : InputLinks.themeMode == 'dark' ? '#96999e': '#343536'}} onClick={() => setKeyPaymment('')}> <h2>C</h2> </Button> </div>
                                    
                                </div>
                                
                            <br />
                            <div className='row'>
                                <div className='col-12'>
                                    <Button disabled={payBtnState || !saveBtnState} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => SavePaymmentCache()}>  <Icon name='check' /> Payeé</Button>
                                </div>
                            </div>
                            <h5>Imprimer</h5> 
                            <Button disabled={!saveBtnState || !payBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={() =>PrintFunction('printFacture')}>  <Icon name='print' /> Imprimer </Button>
                        </div>
                    </div>
                </div> 
                
        </>)
    }

    /*3- Bons */
    const ListeDesBonsCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className={`shadow-sm bg-white border mb-1 border-div ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white border-dark' : '' }`} style={{width:'100%', height:'60px'}} onClick={(e) => BonSlected(props.value) } ><h2>{props.value}</h2></Button>
            </>)
        }
        return(<>
            <div className='row '>
                <div className='col-4 p-2'><BtnCard value='2' /></div>
                <div className='col-4 p-2'><BtnCard value='3' /></div>
                <div className='col-4 p-2'><BtnCard value='4' /></div>
                <div className='col-4 p-2'><BtnCard value='5' /></div>
                <div className='col-4 p-2'><BtnCard value='6' /></div>
                <div className='col-4 p-2'><BtnCard value='7' /></div>
                <div className='col-4 p-2'><BtnCard value='8' /></div>
                <div className='col-4 p-2'><BtnCard value='9' /></div>
                <div className='col-4 p-2'><BtnCard value='10' /></div>
                <div className='col-4 p-2'><BtnCard value='20' /></div>
                <div className='col-4 p-2'><BtnCard value='50' /></div>
            </div>
            </>)
    }
    const CalculerBons = () =>{
        return(<>
        
                <div className='row'>
                    <div className='col-12 col-md-7 align-self-center'>
                        <ListeDesBonsCard /> 
                    </div>
                    <div className='col-12 col-md-5'>
                        <div className='row'>
                            <div className='col-6'>
                                    <div className='mb-2'>
                                        <h5 className='text-success'>Avec Reste</h5> 
                                        <h3 className='mb-2'>Nombre : {Math.trunc(factureD.totale / selectedBon) +1 }</h3> 
                                        <h3 className='mb-2 mt-1'>Totale : {((Math.trunc(factureD.totale / selectedBon) +1) * selectedBon).toFixed(3)}</h3> 
                                        <h3 className='mb-2 mt-1'>Reste : {(((Math.trunc(factureD.totale / selectedBon) +1) * selectedBon).toFixed(3) - factureD.totale).toFixed(3)}</h3> 
                                        <br />
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Button disabled={payBtnState ||!saveBtnState} fluid style={{height:'50px'}} className='border-div bg-success text-white' onClick={() => SavePaymmentBons('Plus')}>  <Icon name='check' /> Payeé</Button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className='col-6'>
                                    <div className='mb-2'>
                                        <h5 className='text-danger'>Sans Reste</h5> 
                                        <h3 className='mb-2'>Nombre : {Math.trunc(factureD.totale / selectedBon)}</h3> 
                                        <h3 className='mb-2 mt-1'>Totale : {((Math.trunc(factureD.totale / selectedBon)) * selectedBon).toFixed(3)}</h3> 
                                        <h3 className='mb-2 mt-1'>Termine  : {(((Math.trunc(factureD.totale / selectedBon)) * selectedBon).toFixed(3) - factureD.totale).toFixed(3)}</h3> 
                                        <br />
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Button disabled={payBtnState ||!saveBtnState} fluid style={{height:'50px'}} className='border-div bg-danger text-white' onClick={() => SavePaymmentBons('Moins')}>  <Icon name='check' /> Payeé</Button>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className='col-12'>
                                    <h5>Imprimer</h5> 
                                    <Button disabled={!saveBtnState || !payBtnState} fluid style={{height:'40px'}} className='rounded-pill bg-system-btn mb-3' onClick={() =>PrintFunction('printFacture')}>  <Icon name='print' /> Imprimer </Button>
                            </div>
                        </div>  
                    </div> 
                </div> 
        </>)
    }

    /*4- Clients */
    const SelectClientCard = () =>{
        const ClientCardList = (props) =>{
            return(<>
                <div className='card p-3 mb-2 shadow-sm rounded' onClick={() => setClientCredit(props.data)}>
                    <div className='row'>
                            <div className='col-4'>{props.data.CL_ID}</div> 
                            <div className='col-6'>{props.data.CL_Name}</div> 
                            <div className='col-2'></div> 
                    </div>
                </div>
            </>)
        }
        return(<>
            <Modal
                size='tiny'
                closeIcon
                dimmer='blurring'
                trigger={<Button className=" bg-white border" size='large' fluid> <Icon name='list alternate outline' /> Liste Des Client </Button>}
                >
                <Modal.Content  className='d-block'>
                    <div className='p-2 text-start'>
                           {clientList.map((data, index) => <ClientCardList key={index} data={data} /> )}
                    </div>
                </Modal.Content>
            </Modal>
        </>)
    }
    const CreditClient = () =>{
        return (<>
                <div className='row mb-2'>
                        
                        <div className='col-12 col-lg-6 mb-3'>
                            <SelectClientCard />
                            <div className='mt-4'>
                                <h5>Client Info : </h5>
                                <div>Nom :  {clientCredit ? clientCredit.CL_Name : '' } </div>
                                <div>Phone :  {clientCredit ? clientCredit.Phone : '' } </div>
                                <div>ID :  {clientCredit ? clientCredit.CL_ID : '' } </div>
                            </div>
                            <h5>Enregistrer</h5>
                            <Button disabled={payBtnState ||!saveBtnState || !clientCredit} className='rounded-pill bg-system-btn mb-3' fluid style={{height:'50px',}} onClick={() => SaveClientCredit()}><Icon name='save' /> Enregistrer Credit<Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                            <Button disabled={!payBtnState ||!saveBtnState} className='rounded-pill btn-imprimer' onClick={(e) => PrintFunction('printFacture')} fluid><Icon name='print' /> Imprimer</Button>
                        </div>

                        <div className='col-12 col-lg-6'>
                            <MainDataCard clientFidele={clientFidele} setClientFidelle={setClientFidelle} clientList={clientList}/>
                            <div className='mt-4'>
                                <h5>Client Info : </h5>
                                <div>Nom :  {clientFidele ? clientFidele.CL_Name : '' } </div>
                                <div>Phone :  {clientFidele ? clientFidele.Phone : '' } </div>
                                <div>ID :  {clientFidele ? clientFidele.CL_ID : '' } </div>
                            </div>
                            <h5>Enregistrer</h5>
                            <Button disabled={!payBtnState ||!saveBtnState || !clientFidele || fideliteState} className='rounded-pill bg-system-btn mb-3' fluid style={{height:'50px',}} onClick={() => SaveClientFidelle()}><Icon name='save' /> Enregistrer Credit<Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                            <Button  className='rounded-pill btn-imprimer' onClick={() => setClientFidelle()} fluid><Icon name='print' /> Nouveaux </Button>
                        </div>

                    </div>
        </>)
    }
    
    
    return (  <>
        <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
            <BackCard  data={InputLinks.backCard.pann}/>
            <ProgressLoadingBar  display={loadingPage} />
            <br />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-12 col-md-4'>
                        <TotaleCard />    
                        {factureD.articles.map( (val) => <ArticleListCard key={val.id} dataA={val}/>)}
                        <br />
                    </div>
                    <div className='col-12 col-md-8'>
                        <Tab menu={{ widths: panes.length , pointing: true  , className: InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }} panes={panes} />
                    </div>
                </div>
            </div>
        </div>
        <Modal
                size='small'
                open={modalS}
                closeIcon
                dimmer = 'blurring'
                onClose={() => setModalS(false)}
                onOpen={() => setModalS(true)}
            >
                <Modal.Header>
                    <HeadModalSearch saveBtnState={saveBtnState} rechercheKey={rechercheKey}  setRechercheKey={setRechercheKey} RechercheFunction={RechercheFunction} /> 
                </Modal.Header>
                <Modal.Content scrolling>
                        <div className='p-1'>
                            {rechercheList.map((data,index) => <RechercheListeCard key={index} data={data} />)}
                        </div>  
                </Modal.Content>
                <Modal.Actions>
                            <Button className='rounded-pill' negative onClick={ () => setModalS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                </Modal.Actions>
        </Modal>
        <Modal
                size='small'
                open={modalT}
                closeIcon
                dimmer = 'blurring'
                onClose={() => setModaT(false)}
                onOpen={() => setModaT(true)}
            >
                <Modal.Header>
                    Trouver Un Article 
                </Modal.Header>
                <Modal.Content scrolling>
                        <div className='p-1'>
                            {rechercheList.map((data,index) => <RechercheListeCard key={index} data={data} />)}
                        </div>  
                </Modal.Content>
                <Modal.Actions>
                            <Button className='rounded-pill' negative onClick={ () => setModaT(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                </Modal.Actions>
        </Modal>
        <FrameForPrint frameId='printFacture' src={`/Pr/CamSys/facture/${gettedFID}`} />
    </>);
}


export default CaissePannier;