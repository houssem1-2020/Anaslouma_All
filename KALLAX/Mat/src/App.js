//React And GLOBAL CSS
import React, { useEffect, useState } from 'react';
import GConf from './AssetsM/generalConf';
import LoadingBar from 'react-top-loading-bar'
import { ToastContainer } from 'react-toastify';
//import { io } from "socket.io-client";

// /*CSS*/
import 'bootstrap-icons/font/bootstrap-icons.css';
import './theme.css';
import "gridjs/dist/theme/mermaid.css";
import 'react-toastify/dist/ReactToastify.css';

//Router & Routes
import { BrowserRouter as Router,Routes,Route, Outlet} from "react-router-dom";
import { Navigate } from 'react-router-dom';

//  Professionnel
import LandingPage from './Routing/Landing/landingPage'
import ProfessionnelInfoPage from './Routing/Professionnel/professionnelInfo'
import ProfessionnelListePage from './Routing/Professionnel/professionnelListe'


//  User
import SignUpPage from './Users/signUpPage';
import UserLogIn from './Users/loginPage'
import CompteProPage from './Users/compteProPage';
import UserLandingPage from './Users/userLandingPage'
import UserDemmandeInfo from "./Users/Demmande/demmandeInfo";
import UserPaymmentPage from './Users/Paymment/paymmentPage'
import SuccessPaymmentCard from './Users/Paymment/successPage';
import CancelPaymmentCard from './Users/Paymment/cancelPage';


//  Prof
import ProfLandingPage from './Professionnel/profLandingPage'
import ProfDemmandeList from './Professionnel/Demmande/demmandeList';
import ProfDemmandeAction from './Professionnel/Demmande/demmandeAction';
import ProfPaymmentPage from './Professionnel/Paymment/paymmentPage'
import ProfCalendarPage from './Professionnel/Calendar/calendarPage'
import ProfComunautePage from './Professionnel/Communite/communitePage'

import FinanceSetting from './Professionnel/Parametre/finance';
import PhotoesSetting from './Professionnel/Parametre/photo';
import InfoGeneraleSetting from './Professionnel/Parametre/infoGenerale';
import HoraireSetting from './Professionnel/Parametre/horaire';
import PositionsSetting from './Professionnel/Parametre/position';
import TarificationSetting from './Professionnel/Parametre/tarif';

function App() {
  //const and variables 
  //const socket = io.connect(GConf.soketLink);
  const userIsLogged = localStorage.getItem('UserIsLogged');
  const profIsLogged = localStorage.getItem('ProfIsLogged');
  const [progress, setProgress] = useState(2)

  //useefeects
  useEffect(() => {
    setProgress(100);
  }, []);

  //   useEffect(() => {
  //     socket.on(GConf.ProfData.UData.PID, (data) =>{
  //         handleClick(data)
  //         console.log('prof')
  //         //toast.error(<><div><h5>Commande Enregistré</h5> Une Nouvelle commandes est enregitrer</div></>, GConf.TostInternetGonf) 
  //     })
  //     socket.on(GConf.UserData.UData.UID, (data) =>{
  //       handleClick(data)
  //       console.log('user')
  //       //toast.error(<><div><h5>Commande Enregistré</h5> Une Nouvelle commandes est enregitrer</div></>, GConf.TostInternetGonf) 
  //   })
  //   socket.on('cmd-saved-notif', (data) =>{
  //     handleClick(data)
  //     console.log('user')
  //     //toast.error(<><div><h5>Commande Enregistré</h5> Une Nouvelle commandes est enregitrer</div></>, GConf.TostInternetGonf) 
  // })
  // }, [])

// const handleClick = (getedData) => {
//   if ('Notification' in window) {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         const notification = new Notification(getedData.PID.Social_Name, {
//           body: `${getedData.UID.Name} Demmande ... `,
//           icon: 'https://assets.ansl.tn/Images/kallax/user.gif',
//           sound: 'https://assets.ansl.tn/Sound/notification.mp3' // URL du son
//         });
//         notification.onclick = function() {
//           // Navigate to a specific page when the notification is clicked
//           window.location.href = 'https://kallax.ansl.tn/Prof/L';
//         };
//       }
//     });
//   }
  // }

  const NotFound = () =>{
    return (<div className="cpntainer text-danger pt-5 text-center">
            <h1>Page Introuvable 404 </h1>
            <img src='https://assets.ansl.tn/images/old/404.svg' width='200px' className='img-responsive ' />
        </div>);
  }

  const RedirectingPage = () => {
    
    return (<>
        {
            userIsLogged ? <Navigate to='/User/L'  /> : <Navigate to='/User/logIn'  />
        } 
  </>);}

  const ProfRedirectingPage = () => {
      
    return (<>
        {
            profIsLogged ? <Navigate to='/User/L'  /> : <Navigate to='/User/logIn'  />
        } 
  </>);}

  return (
    <>
   
      <Router>
        <Routes>
          <Route path="/" element={userIsLogged ? <LandingPage /> : <Navigate to='/User/logIn'  />} />
          {/* <Route path="Action/:tag/:depart/:region" element={userIsLogged ? <ActionPage /> : <Navigate to='/User/logIn'  />} /> */}
          {/* <Route path="Request/:tag/:subTag" element={userIsLogged ? <AddRequest /> : <Navigate to='/User/logIn'  />} /> */}
          
          <Route path="List/:tag/:subTag" element={userIsLogged ? <ProfessionnelListePage /> : <Navigate to='/User/logIn'  />} />
          <Route path="Article/:tag/:subTag" element={userIsLogged ? <ProfessionnelInfoPage /> : <Navigate to='/User/logIn'  />} />
          {/* <Route path="Commande/:tag/:code" element={userIsLogged ? <AddDemmandesPage /> : <Navigate to='/User/logIn'  />} /> */}
          
          <Route path="User" exact element={<Outlet />} >
            <Route path="" exact element={<RedirectingPage />} />
            <Route path="logIn" exact element={<UserLogIn />} />
            <Route path="SignUp" exact element={<SignUpPage />} />
            <Route path="ComptePro" exact element={<CompteProPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<UserLandingPage />} />
                    <Route path="demmande/info/:RID" exact element={<UserDemmandeInfo />} />
                    <Route path="Paymment/:RID" exact element={<UserPaymmentPage />} />
                    
                    <Route path="Paymment/S" exact element={<SuccessPaymmentCard />} />
                    <Route path="Paymment/C" exact element={<CancelPaymmentCard />} />
            </Route>
          </Route>

          <Route path="Prof" exact element={<Outlet />} >
            <Route path="" exact element={<ProfRedirectingPage />} />
            <Route path="L" exact element={<Outlet />} >
                    <Route path="" exact element={<ProfLandingPage />} />
                    <Route path="menu" exact element={<Outlet />} >
                        <Route path="demmande/Liste" exact element={<ProfDemmandeList />} />
                        <Route path="demmande/action/:RID" exact element={<ProfDemmandeAction />} />
                        <Route path="Paymment" exact element={<ProfPaymmentPage />} />
                        <Route path="calendrier" exact element={<ProfCalendarPage />} />
                        <Route path="Communaute" exact element={<ProfComunautePage />} />
                    </Route>
                    <Route path="Parametre" exact element={<Outlet />} >
                        <Route path="Info" exact element={<InfoGeneraleSetting />} />
                        <Route path="photo" exact element={<PhotoesSetting />} />
                        <Route path="horaire" exact element={<HoraireSetting />} />
                        <Route path="position" exact element={<PositionsSetting />} />
                        <Route path="tarif" exact element={<TarificationSetting />} />
                        <Route path="Finance" exact element={<FinanceSetting />} />
                    </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>   
      </Router>
      <LoadingBar color={GConf.themeColor} progress={progress}  
        //onLoaderFinished={() => setProgress(0)} 
      />
      <ToastContainer />
      
    </>
    
  );
}

export default App;
