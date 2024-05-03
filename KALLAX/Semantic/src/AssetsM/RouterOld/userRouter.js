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
import SuccessPaymmentCard from '../../Users/Paymment/successPage';
import CancelPaymmentCard from '../../Users/Paymment/cancelPage';
import SignUpPage from '../../Users/signUpPage';
import CompteProPage from '../../Users/compteProPage';


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
            <Route path="SignUp" exact element={<SignUpPage />} />
            <Route path="ComptePro" exact element={<CompteProPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<InputLandingPage />} />
                    <Route path="demmande/info" exact element={<CamionVente />} />
                    <Route path="demmande/action" exact element={<CamionResumer />} />
                    <Route path="Paymment/:RID" exact element={<StockRepture />} />
                    <Route path="Paymment/S" exact element={<SuccessPaymmentCard />} />
                    <Route path="Paymment/C" exact element={<CancelPaymmentCard />} />
            </Route>
    </Route>
)

export default UserRouter 