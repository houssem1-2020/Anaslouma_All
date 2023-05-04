import React from 'react'
import { BrowserRouter as Router, Routes,Route, Outlet} from "react-router-dom";
import { Navigate } from 'react-router-dom';

//main 
import InputLoginPage from '../../Caisse/loginPage'
import InputLandingPage from '../../Caisse/caisseLandingPage'
import UploadeCamionPage from '../../Caisse/Upload/updatePage';
import GConf from '../generalConf';

//Caisse Simple 
import CaisseSimple from "../../Caisse/Caisse/caisseSimple";

//Caisse Rapide  
import CaisseRapide from "../../Caisse/CaisseRapide/caisseRapide";

//Stock
import Stock from "../../Caisse/Stock/stockPage";
import StockList from '../../Caisse/Stock/stockList';
import ArticleInfo from '../../Caisse/Stock/ArticleInfo';
import CaissePannier from '../../Caisse/Stock/caissePannier';
import FamilleList from '../../Caisse/Stock/FamilleList';

//Client
import ClientsPage from "../../Caisse/Clients/client";
import ReglemmentClient from '../../Caisse/Clients/reglemmentClient';
import ClientList from '../../Caisse/Clients/clientList'; 

//Recette
import Recette from "../../Caisse/Recette/recette";
import DepenseRecette from '../../Caisse/Recette/ajouterDepense';
import ImprimerRecette from '../../Caisse/Recette/imprimerRecette';
import MesFactures from '../../Caisse/Recette/mesFactures';
import FactureInfo from '../../Caisse/Recette/factureInfo';




const RedirectingPage = () => {
    const CamionIsLogged = localStorage.getItem(`Magazin_Caisse_LocalD`);
    return (<>
        {
            CamionIsLogged ? <Navigate to='/C/L'  /> : <Navigate to='/C/logIn'  />
        } 
</>);}

const caisseRouter = () => (
    <Route path="C" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<InputLoginPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />
                    <Route path="nv" exact element={<CaisseSimple />} />
                    <Route path="cr" exact element={<CaisseRapide />} />
                    <Route path="sk" exact element={<Outlet />} >
                        <Route path="" exact element={<Stock />} />
                        <Route path="Famille" exact element={< FamilleList />} />
                        <Route path="List/:genre" exact element={< StockList />} />
                        <Route path="Info/:code" exact element={<ArticleInfo />} />
                        <Route path="pannier" exact element={<CaissePannier />} />
                    </Route>
                    <Route path="cl" exact element={<Outlet />} >
                        <Route path="" exact element={<ClientList />} />
                        <Route path="info/:CLID" exact element={<ReglemmentClient />} />
                        {/* <Route path="List" exact element={<ClientList />} /> */}
                    </Route>
                    <Route path="rt" exact element={<Outlet />} >
                        <Route path="" exact element={<Recette />} />
                        <Route path="depenses" exact element={<DepenseRecette />} />
                        <Route path="imprimer" exact element={<ImprimerRecette />} />
                        <Route path="vente" exact element={<MesFactures />} />
                        <Route path="vente/info/:FID" exact element={<FactureInfo />} />
                    </Route>
                    <Route path="up" exact element={<UploadeCamionPage />} />
            </Route>
    </Route>
)

export default caisseRouter 