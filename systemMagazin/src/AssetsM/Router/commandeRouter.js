import React from 'react'
import { BrowserRouter as Router,Routes,Route, Outlet, Navigate} from "react-router-dom";

//logIn & Landing 
import InputLoginPage from '../../Commande/loginPage'
import InputLandingPage from '../../Commande/commandeLanding'



// Stock
import BondRPage from '../../Commande/Stock/Famille';
import BondEPage from '../../Commande/Stock/ArticleInfo';
import ModifierPage from "../../Commande/Stock/FamilleList";
import InventairePage from '../../Commande/Stock/ArticlePhoto';

//Outils
import TicketPrixPage from '../../Commande/Outils/recettePage';
import DateProchePage from '../../Commande/Outils/statPage';

//clients
import ClientList from '../../Commande/Clients/clientList';
import ClientData from '../../Commande/Clients/clientData';

//equipe
import AvancePage from '../../Commande/Clients/clientList';
import PresencePage from '../../Commande/Clients/clientData';

//mes commandes
import NouveauxCommande from "../../Commande/Commande/nouveauxCommande";
import CommandePage from '../../Commande/Commande/commandePage';
import CommandeEdit from '../../Commande/Commande/commandeEdit';
import CommandeInfo from "../../Commande/Commande/commandesInfo"


//autre
import ArticleList from '../../Commande/Stock/ArticleList';
import ClientPointage from '../../Commande/Clients/clientPointage';
import ClientMap from '../../Commande/Clients/clientMap';
import AddClient from '../../Commande/Clients/addClient';
import GConf from '../generalConf';
import UploadeCommandePage from '../../Commande/Upload/updatePage';



const RedirectingPage = () => {
    const CommandeIsLogged = localStorage.getItem(`Magazin_Gerant_LocalD`);
    return (<>
        {
            CommandeIsLogged ? <Navigate to='/U/L'  /> : <Navigate to='/U/logIn'  />
        } 
</>);}

const commandeRouter = () => (
    <Route path="U" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<InputLoginPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />

                    <Route path="sk" exact element={<Outlet />} >
                        <Route path="" exact element={<ArticleList />} />
                        <Route path="bonE" exact element={<BondEPage />} />
                        <Route path="BonR" exact element={<BondRPage />} />
                        <Route path="Modifier" exact element={<ModifierPage />} />
                        <Route path="Inventaire" exact element={<InventairePage />} />
                    </Route>

                    <Route path="ot" exact element={<Outlet />} >
                        <Route path="" exact element={<CommandePage />} />
                        <Route path="ticket" exact element={<TicketPrixPage />} />
                        <Route path="dateP" exact element={<DateProchePage />} />
                    </Route>

                    <Route path="tm" exact element={<Outlet />} >
                        <Route path="presence" exact element={<PresencePage />} />
                        <Route path="avance" exact element={<AvancePage />} />
                    </Route>

                    <Route path="cl" exact element={<Outlet />} >
                        <Route path="List" exact element={<ClientList />} />
                        <Route path="info/:CID" exact element={<ClientData />} />
                    </Route>

                    <Route path="cm" exact element={<NouveauxCommande />} />
                    <Route path="mc" exact element={<Outlet />} >
                        <Route path="" exact element={<CommandePage />} />
                        <Route path="modifier/:CID" exact element={<CommandeEdit />} />
                        <Route path="info/:CID" exact element={<CommandeInfo />} />
                    </Route>

            </Route>
    </Route>
)

export default commandeRouter 