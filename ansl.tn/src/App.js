//React And GLOBAL CSS
import React, { useEffect, useState } from 'react';
import GConf from './AssetsM/generalConf';
import LoadingBar from 'react-top-loading-bar'
import { toast, ToastContainer } from 'react-toastify';

// /*CSS*/
import 'bootstrap-icons/font/bootstrap-icons.css';
import './theme.css';
import "gridjs/dist/theme/mermaid.css";
import 'react-toastify/dist/ReactToastify.css';

//Router & Routes
import { BrowserRouter as Router,Routes,Route, Outlet} from "react-router-dom";
import { Navigate } from 'react-router-dom';
import userRouter  from './AssetsM/Router/userRouter';


//Login 
import PannierPage from './Routing/Pannier/PannierPage'
import LandingPage from './Routing/Landing/landingPage'
import ArticleInfo from './Routing/Articles/articleInfo'
import ArticleList from './Routing/Articles/articleList'


function App() {
  //const and variables 
  const UserRouter = userRouter();
  const [progress, setProgress] = useState(2)

  //useefeects
  useEffect(() => {
    setProgress(100);
  }, []);

  const NotFound = () =>{
    return (<div className="cpntainer text-danger pt-5 text-center">
            <h1>Page Introuvable 404 </h1>
            <img src='https://system.anaslouma.tn/Assets/images/404.svg' width='200px' className='img-responsive ' />
        </div>);
  }

  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="List/:tag/:genre" element={<ArticleList />} />
          <Route path="Article/:tag/:code" element={<ArticleInfo />} />
          <Route path="Commande" element={<PannierPage />} />
          {UserRouter}
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
