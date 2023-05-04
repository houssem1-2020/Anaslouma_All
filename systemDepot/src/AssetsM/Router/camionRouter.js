import React from 'react'
import { BrowserRouter as Router, Routes,Route, Outlet} from "react-router-dom";
import { Navigate } from 'react-router-dom';

//Main
//Factures
import NouveauxFacture from "../../Interfaces/NFacture/nouveauxFacture";

//Mes Factures
import MesFactures from "../../Interfaces/MFactures/mesFactures";

//Client
import ClientsPage from "../../Interfaces/Clients/client";
import ClientPointage from '../../Interfaces/Clients/clientPointage';
import ClientMap from '../../Interfaces/Clients/clientMap';
import ClientList from '../../Interfaces/Clients/clientList';
import AddClient from '../../Interfaces/Clients/addClient';
//Stock
import Stock from "../../Interfaces/Stock/stockPage";

//Recette
import Recette from "../../Interfaces/Recette/recette";

//ventes
import VentePage from "../../Interfaces/Ventes/ventePage";

import InputLoginPage from '../../Interfaces/loginPage'
import InputLandingPage from '../../Interfaces/camionLandingPage'
import FactureInfo from '../../Interfaces/MFactures/factureInfo';
import EditFacture from '../../Interfaces/MFactures/editFacture';
import ArticleInfo from '../../Interfaces/Stock/ArticleInfo';
import ReglemmentStock from '../../Interfaces/Stock/reglemmentStock';
import StockList from '../../Interfaces/Stock/stockList';
import StockFondsData from '../../Interfaces/Stock/fondsData';
import StockFonds from '../../Interfaces/Stock/Fonds';
import RechercheVente from '../../Interfaces/Ventes/recherche';
import VenteJournier from '../../Interfaces/Ventes/venteJournier';
import DepenseRecette from '../../Interfaces/Recette/ajouterDepense';
import ImprimerRecette from '../../Interfaces/Recette/imprimerRecette';
import UploadeCamionPage from '../../Interfaces/Upload/updatePage';
import AncienReglemmentStock from '../../Interfaces/Stock/ancienReglemmentStock';
import GConf from '../generalConf';
import CamionClientData from '../../Interfaces/Clients/clientData';
import CamionCommandesListe from '../../Interfaces/Commander/commandesListe';
import CamionCommandesMap from '../../Interfaces/Commander/commandeMap';

const RedirectingPage = () => {
    const CamionIsLogged = localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`);
    return (<>
        {
            CamionIsLogged ? <Navigate to='/I/L'  /> : <Navigate to='/I/logIn'  />
        } 
</>);}

const camionRouter = () => (
    <Route path="I" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<InputLoginPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />
                    <Route path="nv" exact element={<NouveauxFacture />} />
                    <Route path="mf" exact element={<Outlet />} >
                        <Route path="" exact element={<MesFactures />} />
                        <Route path="info/:FID" exact element={<FactureInfo />} />
                        <Route path="modifier/:FID" exact element={<EditFacture />} />
                    </Route>
                    <Route path="sk" exact element={<Outlet />} >
                        <Route path="" exact element={<Stock />} />
                        <Route path="List" exact element={< StockList />} />
                        <Route path="Info/:code" exact element={<ArticleInfo />} />
                        <Route path="reglemment" exact element={<ReglemmentStock />} />
                        <Route path="reglemment/ancien" exact element={<AncienReglemmentStock />} />
                        <Route path="Fonds/info/:fid" exact element={<StockFondsData />} />
                        <Route path="Fonds" exact element={<StockFonds />} />
                    </Route>
                    <Route path="vt" exact element={<Outlet />}>
                        <Route path="" exact element={<VentePage />}/>
                        <Route path="list/:code" exact element={<VenteJournier />}/>
                        <Route path="recherche" exact element={<RechercheVente />}/>
                    </Route>
                    <Route path="cl" exact element={<Outlet />} >
                        <Route path="" exact element={<ClientsPage />} />
                        <Route path="ajouter" exact element={<AddClient />} />
                        <Route path="recherche" exact element={<ClientMap />} />
                        <Route path="pointage" exact element={<ClientPointage />} />
                        <Route path="List" exact element={<ClientList />} />
                        <Route path="info/:CID" exact element={<CamionClientData />} />
                    </Route>
                    <Route path="rt" exact element={<Outlet />} >
                        <Route path="" exact element={<Recette />} />
                        <Route path="depenses" exact element={<DepenseRecette />} />
                        <Route path="imprimer" exact element={<ImprimerRecette />} />
                    </Route>
                    <Route path="cm" exact element={<CamionCommandesListe />} />
                    <Route path="cmap" exact element={<CamionCommandesMap />} />
                    <Route path="up" exact element={<UploadeCamionPage />} />
            </Route>
    </Route>
)

export default camionRouter 