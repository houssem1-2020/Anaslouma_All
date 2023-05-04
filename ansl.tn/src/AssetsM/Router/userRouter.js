import React from 'react'
import { BrowserRouter as Router, Routes,Route, Outlet} from "react-router-dom";
import { Navigate } from 'react-router-dom';
import UserLogIn from '../../Users/loginPage'
import InputLandingPage from '../../Users/camionLandingPage'

//camion
import CamionVente from "../../Users/Camion/camionVente";
import CamionResumer from '../../Users/Camion/camionResumer';
import StockPage from '../../Users/Stock/StockPage'
import StockRepture from '../../Users/Stock/StockRepture'
import StatRegionale from '../../Users/Stat/StatRegionale'
import StatGenerale from '../../Users/Stat/StatGenerale'
import ArticleInfo from '../../Users/Stock/AerticleInfo';


const RedirectingPage = () => {
    const CamionIsLogged = localStorage.getItem('UserIsLogged');
    return (<>
        {
            CamionIsLogged ? <Navigate to='/User/L'  /> : <Navigate to='/User/logIn'  />
        } 
</>);}

const UserRouter = () => (
    <Route path="User" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<UserLogIn />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />
                    <Route path="camion" exact element={<CamionVente />} />
                    <Route path="camion-r" exact element={<CamionResumer />} />
                    <Route path="Stock" exact element={<Outlet />} >
                        <Route path="" exact element={<StockPage />} />
                        <Route path="info/:code" exact element={<ArticleInfo />} />
                    </Route>
                    <Route path="Repture" exact element={<StockRepture />} />
                    <Route path="Stat-g" exact element={<StatGenerale />} />
                    <Route path="Stat-r" exact element={<StatRegionale />} />

            </Route>
    </Route>
)

export default UserRouter 