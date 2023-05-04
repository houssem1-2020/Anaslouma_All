import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Outlet} from "react-router-dom";
import GConf from '../generalConf';

//navBar
import NavBar from '../../Dashboard/navBar'

//Main
import MainPage from '../../Dashboard/Main/mainPage';
import Anaslouma from '../../Dashboard/Ansl/anasLouma'
import FamiliaPage from '../../Dashboard/Familia/familiaPage'
import ElectroPage from '../../Dashboard/Electro/electroPage'
import AutoR from '../../Dashboard/Autorisation/autoR'
import NotifPage from '../../Dashboard/Notification/notifPage'
import NotesPage from '../../Dashboard/Notes/notePage'
import SettingPage from '../../Dashboard/Setting/settingPage'
import StockPage from '../../Dashboard/Ansl/stockPage';
import StatisticPage from '../../Dashboard/Ansl/statitique';
import SuivieCamionPage from '../../Dashboard/Ansl/suivieCamion';
import SuivieArticlePage from '../../Dashboard/Ansl/suivieArticle';
import PartennairePage from '../../Dashboard/Partennaire/partennairePage';

const SystemLanding = () => {
    useEffect(() => {
        const pidIsSet = localStorage.getItem(`Admin_Secure_key`);
        if (!pidIsSet) {window.location.href = "/login";}
    },[]);
    
    return (<>
        <NavBar/>
        <br />
        <br />
        <br />
        <div className="container pt-4">
            <Outlet />
        </div>
    </>);
}

const systemRouter = () => (
        <Route path="S" exact element={<SystemLanding />} >
            <Route path="" exact element={<MainPage />} />
            <Route path="ma" exact element={<MainPage />} />
            <Route path="alimentaire" exact element={<Outlet />} >
                <Route path="" exact element={<Anaslouma TAG={'alimentaire'} />} />
                <Route path="stat" exact element={<StatisticPage TAG={'alimentaire'} />} />
                <Route path="stock" exact element={<StockPage TAG={'alimentaire'} />} />
                <Route path="stock/article/:code" exact element={<SuivieArticlePage TAG={'alimentaire'} />} />
                <Route path="suivie-c/:CID" exact element={<SuivieCamionPage TAG={'alimentaire'} />} />
            </Route>
            <Route path="cosmetique" exact element={<Outlet />} >
                <Route path="" exact element={<Anaslouma TAG={'cosmetique'} />} />
                <Route path="stat" exact element={<StatisticPage TAG={'cosmetique'} />} />
                <Route path="stock" exact element={<StockPage TAG={'cosmetique'} />} />
                <Route path="stock/article/:code" exact element={<SuivieArticlePage TAG={'cosmetique'} />} />
                <Route path="suivie-c" exact element={<SuivieCamionPage TAG={'cosmetique'} />} />
            </Route>
            <Route path="familia" exact element={<Outlet />}>
                <Route path="" exact element={<FamiliaPage />} />
                <Route path="ajouter" exact element={<FamiliaPage />} />
            </Route>
            <Route path="electro" exact element={<Outlet />}>
                <Route path="" exact element={<ElectroPage />} />
                <Route path="ajouter" exact element={<ElectroPage />} />
            </Route>
            <Route path="partennaire" exact element={<Outlet />}>
                <Route path="" exact element={<PartennairePage />} />
            </Route>
            <Route path="autorisation" exact element={<Outlet />} >
                <Route path="" exact element={<AutoR />} />
            </Route>
            <Route path="notification" exact element={<Outlet />} >
                <Route path="" exact element={<NotifPage />} />
            </Route>
            <Route path="notes" exact element={<Outlet />} >
                <Route path="" exact element={<NotesPage />} />
            </Route>
            <Route path="setting" exact element={<SettingPage />} />
        </Route>
)

export default systemRouter 