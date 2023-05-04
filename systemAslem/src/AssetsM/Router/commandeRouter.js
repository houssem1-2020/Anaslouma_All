import React from 'react'
import { BrowserRouter as Router,Routes,Route, Outlet, Navigate} from "react-router-dom";

//logIn & Landing 
import InputLoginPage from '../../Commande/loginPage'
import InputLandingPage from '../../Commande/commandeLanding'


//ajouter commande
import NouveauxCommande from "../../Commande/NCommande/nouveauxCommande";

//mes commandes
import CommandePage from '../../Commande/MCommandes/commandePage';
import CommandeEdit from '../../Commande/MCommandes/commandeEdit';
import CommandeInfo from "../../Commande/MCommandes/commandesInfo"

// Catalogue 
import FamilleList from "../../Commande/Catalogue/FamilleList";
import Famille from '../../Commande/Catalogue/Famille';
import ArticleInfo from '../../Commande/Catalogue/ArticleInfo';
import ArticleList from '../../Commande/Catalogue/ArticleList';
import ArticlePhoto from '../../Commande/Catalogue/ArticlePhoto';

//clients
import ClientsPage from "../../Commande/Clients/clientData";
import ClientPointage from '../../Commande/Clients/clientPointage';
import ClientMap from '../../Commande/Clients/clientMap';
import ClientList from '../../Commande/Clients/clientList';
import AddClient from '../../Commande/Clients/addClient';

//uploade
import UploadeCommandePage from '../../Commande/Upload/updatePage';
import RecettePage from '../../Commande/Recette/recettePage';
import StatPage from '../../Commande/Statistic/statPage';
import GConf from '../generalConf';
import ClientData from '../../Commande/Clients/clientData';
import PannierCommande from '../../Commande/NCommande/pannierCommande';



const RedirectingPage = () => {
    const CommandeIsLogged = localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`);
    return (<>
        {
            CommandeIsLogged ? <Navigate to='/C/L'  /> : <Navigate to='/C/logIn'  />
        } 
</>);}

const commandeRouter = () => (
    <Route path="C" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<InputLoginPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />
                    <Route path="cm" exact element={<NouveauxCommande />} />
                    <Route path="cm/pannier" exact element={<PannierCommande />} />
                    <Route path="mc" exact element={<Outlet />} >
                        <Route path="" exact element={<CommandePage />} />
                        <Route path="modifier/:CID" exact element={<CommandeEdit />} />
                        <Route path="info/:CID" exact element={<CommandeInfo />} />
                    </Route>
                    <Route path="cg" exact element={<Outlet />} >
                        <Route path="" exact element={<ArticleList />} />
                        <Route path="info/:AID" exact element={<ArticleInfo />} />
                        <Route path="familles" exact element={<Famille />} />
                        <Route path="familles/:genre" exact element={<FamilleList />} />
                        <Route path="ajout-ph" exact element={<ArticlePhoto />} />
                    </Route>
                    <Route path="cl" exact element={<Outlet />} >
                        <Route path="" exact element={<ClientsPage />} />
                        <Route path="ajouter" exact element={<AddClient />} />
                        <Route path="recherche" exact element={<ClientMap />} />
                        <Route path="pointage" exact element={<ClientPointage />} />
                        <Route path="List" exact element={<ClientList />} />
                        <Route path="info/:CID" exact element={<ClientData />} />
                    </Route>
                    <Route path="rt" exact element={<RecettePage />} />
                    <Route path="stat" exact element={<StatPage />} />
                    <Route path="up" exact element={<UploadeCommandePage />} />
            </Route>
    </Route>
)

export default commandeRouter 