import React, { useEffect , useRef } from 'react'
import { BrowserRouter as Router, Route, Outlet} from "react-router-dom";
import GConf from '../generalConf';

//navBar
import NavBar from '../../Dashboard/navBar'

//Main
import MainPage from '../../Dashboard/Main/mainPage';

//Commandes
import RequestPage from '../../Dashboard/Requests/requestPage';
import RequestInfo from "../../Dashboard/Requests/requestInfo";
import ComptesCommandes from '../../Dashboard/Requests/comptes';
import CalendarCommandes from '../../Dashboard/Requests/calendar';

//Stock
import StockPage from '../../Dashboard/Stock/stockPage';
import AddArticleStock from '../../Dashboard/Stock/addArticle';
import ArticleInfo from "../../Dashboard/Stock/articleInfo";
import Familles from "../../Dashboard/Stock/famille";
import BonSortie from '../../Dashboard/Stock/bonSortie';
import BonsEntre from '../../Dashboard/Stock/bonEntre';

//Facture
import FacturePage from "../../Dashboard/Factures/facturePage";
import AjouterFacture from "../../Dashboard/Factures/ajoutreFacture";
import FactureInfo from "../../Dashboard/Factures/infoFacture";
import EditFacture from "../../Dashboard/Factures/editFacture";
import ResumerFactures from '../../Dashboard/Factures/resumerFactures';

//Camion 
import ControlPage from '../../Dashboard/Control/controlPage'
import AjouterCamion from "../../Dashboard/Control/ajouterCamion";
import AjouterFond from "../../Dashboard/Control/caisseBons";
import CamionInfo from '../../Dashboard/Control/camionInfo'
import CamionArticleInfo from "../../Dashboard/Control/Info/articleInfo";
import CamionFactureInfo from "../../Dashboard/Control/Info/factureInfo";
import CamionFondInfo from "../../Dashboard/Control/Info/fondInfo";
import InventaireCamion from '../../Dashboard/Control/inventaireCamion';
import EditFond from '../../Dashboard/Control/editFonds';

//Client
import ClientPage from '../../Dashboard/Client/clientPage';
import AjouterClient from "../../Dashboard/Client/ajouterClient";
import ClientInfo from '../../Dashboard/Client/clientInfo'


//Outils
import ToolsPage from '../../Dashboard/Tools/toolsPage';

///* Messages */
import MessagesPages from '../../Dashboard/Messages/messagesPage'
import ProfilePage from '../../Dashboard/Profile/profilePage'

///* Notification */
import NotificationPage from '../../Dashboard/Notifications/notificationPage';
import UpdatePage from '../../Dashboard/Upload/uploadPage';
import CataloguePage from '../../Dashboard/Tools/cataloguePage';
import TeamPage from '../../Dashboard/Team/teamPage';
import FournisseurPage from '../../Dashboard/Fournisseur/fournisseurPage';
import AjouterFournisseur from '../../Dashboard/Fournisseur/ajouterFournisseur';
import CalendarFournisseur from '../../Dashboard/Fournisseur/calendarFournisseur';
import RechercheFournisseur from '../../Dashboard/Fournisseur/rechercheFournisseur';
import AjouterTeam from '../../Dashboard/Team/ajouterTeam';
import TeamPoste from '../../Dashboard/Team/teamPoste';
import TeamDemande from '../../Dashboard/Team/demandeTeam';
import TeamInfo from '../../Dashboard/Team/teamInfo';
import FournisseurInfo from '../../Dashboard/Fournisseur/fournisseurInfo';
import SettingPage from '../../Dashboard/Setting/settingPage';
import ConfrimationPage from '../../Dashboard/Setting/confirmation';
import FacturerCommande from '../../Dashboard/Requests/facturerCommande';
import ClientStatistics from '../../Dashboard/Client/clientStatistics';
import ClientRegions from '../../Dashboard/Client/clientFidelite';
import UpdateSettingPage from '../../Dashboard/Setting/updateSettingPage';
import CaisseBons from '../../Dashboard/Control/caisseBons';
import FournisseurFactureInfo from '../../Dashboard/Fournisseur/fournisseurFacture';
import DataBaseBU from '../../Dashboard/Tools/dateBaseBU';
import LeftSideCard from '../../Dashboard/leftSide';
import TicketDePrixPage from '../../Dashboard/Tools/ticketPage';
import BugdetPage from '../../Dashboard/Tools/budgetCard';
import DateProchPage from '../../Dashboard/Tools/dateProche';
import RapportPage from '../../Dashboard/Tools/rapportPage';

// import { io } from "socket.io-client";
// import { toast } from 'react-toastify';

const SystemLanding = () => {
    /*########### [CONST] ########## */
    // const socket = io.connect(GConf.ApiLinkSoket);
    // const audioRef = useRef(null);

    /*########### [USE EFF] ########## */
    useEffect(() => {
        CheckAuthentification()
        CheckLogIn()
        
    },[]);

    // useEffect(() => {
    //     socket.on('cmd-saved-notif', (data) =>{
    //         toast.error(<><div><h5>Button Cliquer </h5> {data.message} </div></>, GConf.TostInternetGonf) 
    //         audioRef.current.play();
    //     })
    // }, [])

    const CheckAuthentification = () =>{
        const AuthenKey = localStorage.getItem(`Magazin_AuthKeyISSet`);
        if (!AuthenKey) {
            window.location.href = "/Auth";
        }
    }

    const CheckLogIn = () =>{
        const pidIsSet = localStorage.getItem('PID');
        if (!pidIsSet) {window.location.href = "/login";}
    }

    return (<>
        <NavBar/>
        <br />
        <br />
        <br />
        <div className='row pt-4 m-1'>
                <div className='col-12 col-md-12 col-lg-2'><LeftSideCard /></div>
                <div className='col-12 col-md-12 col-lg-10'><Outlet /></div>
        </div>
        {/* <div className="container pt-4">
            <audio ref={audioRef} src="https://assets.ansl.tn/Sound/notification.mp3" />
            <Outlet />
        </div> */}
    </>);
}

const systemRouter = () => (
        <Route path="S" exact element={<SystemLanding />} >
            <Route path="" exact element={<MainPage />} />
            <Route path="ma" exact element={<MainPage />} />
            <Route path="rq" exact element={<Outlet />} >
                <Route path="" exact element={<RequestPage />} />
                <Route path="comptes" exact element={<ComptesCommandes />} />
                <Route path="facturer/:CID" exact element={<FacturerCommande />} />
                <Route path="calendrier" exact element={<CalendarCommandes />} />
                <Route path="info/:CID" exact element={<RequestInfo />} />
            </Route>
            <Route path="sk" exact element={<Outlet />}>
                <Route path="" exact element={<StockPage />} />
                <Route path="ajouter" exact element={<AddArticleStock />} />
                <Route path="bs" exact element={< BonSortie />} />
                <Route path="be" exact element={<BonsEntre />} />
                <Route path="famille" exact element={<Familles />} />
                <Route path="info/:code" exact element={<ArticleInfo />} />
            </Route>
            <Route path="ft" exact element={<Outlet />}>
                <Route path="" exact element={<FacturePage />} />
                <Route path="ajouter" exact element={<AjouterFacture />} />
                <Route path="resumer" exact element={<ResumerFactures />} />
                <Route path="modifier/:FID" exact element={<EditFacture />} />
                <Route path="info/:FID" exact element={<FactureInfo />} />
            </Route>
            <Route path="ca" exact element={<Outlet />}>
                <Route path="" exact element={<ControlPage />} />
                <Route path="ajouter-c" exact element={<AjouterCamion />} />
                <Route path="bons" exact element={<CaisseBons />} />
                <Route path="modifier-f/:FondID" exact element={<EditFond />} />
                <Route path="inventaire" exact element={<InventaireCamion />}/>
                <Route path="info/:CID" exact element={<CamionInfo />} />
                <Route path="info/stock/:CID/:code" exact element={<CamionArticleInfo />} />
                <Route path="info/facture/:CID/:FID" exact element={<CamionFactureInfo />} />
                <Route path="info/fond/:CID/:FondID" exact element={<CamionFondInfo />} />
            </Route>
            <Route path="cl" exact element={<Outlet />} >
                <Route path="" exact element={<ClientPage />} />
                <Route path="ajouter" exact element={<AjouterClient />} />
                <Route path="info/:CLID" exact element={<ClientInfo />} />
                <Route path="statistics" exact element={<ClientStatistics />} />
                <Route path="fidelite" exact element={<ClientRegions />} />
            </Route>
            <Route path="fs" exact element={<Outlet />} >
                <Route path="" exact element={<FournisseurPage />} />
                <Route path="info/:FSID" exact element={<FournisseurInfo />} />
                <Route path="info/facture/:genre/:FID" exact element={<FournisseurFactureInfo />} />
                <Route path="ajouter" exact element={<AjouterFournisseur />} />
                <Route path="calendrier" exact element={<CalendarFournisseur />} />
                <Route path="recherche" exact element={<RechercheFournisseur />} />
            </Route>
            <Route path="tm" exact element={<Outlet />} >
                <Route path="" exact element={<TeamPage />} />
                <Route path="info/:TID" exact element={<TeamInfo />} />
                <Route path="ajouter" exact element={<AjouterTeam />} />
                <Route path="postes" exact element={<TeamPoste />} />
                <Route path="presence" exact element={<TeamDemande />} />
            </Route>
            <Route path="ot" exact element={<Outlet />} >
                <Route path="" exact element={<ToolsPage />} />
                <Route path="cg" exact element={<CataloguePage />} />
                <Route path="dbbu" exact element={<DataBaseBU />} />
                <Route path="tickets" exact element={<TicketDePrixPage />} />
                <Route path="bugdet" exact element={<BugdetPage />} />
                <Route path="dates" exact element={<DateProchPage />} />
                <Route path="rapport" exact element={<RapportPage />} />
            </Route>
            <Route path="Profile" exact element={<ProfilePage />} />
            <Route path="Parametre" exact element={<SettingPage />} />
            <Route path="Parametre/confirmation" exact element={<ConfrimationPage />} />
            <Route path="Parametre/p/:genre" exact element={<UpdateSettingPage />} />
            {/* <Route path="ot" exact element={<ToolsPage />} /> */}
            {/* <Route path="ot/cg" exact element={<CataloguePage />} /> */}
            {/* <Route path="ot/dbbu" exact element={<DataBaseBU />} /> */}
            <Route path="nt" exact element={<NotificationPage />} />
            <Route path="msg" exact element={<MessagesPages />} />
            <Route path="up" exact element={<UpdatePage />} />
        </Route>
)

export default systemRouter 