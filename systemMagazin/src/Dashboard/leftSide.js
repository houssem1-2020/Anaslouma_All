import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';



function LeftSideCard() {
    const location = useLocation();

    const LogOut = () =>{
        //localStorage.clear();
        localStorage.removeItem(`PID`);
        window.location.href = "/login";
    }

    const GetPathName = (link) =>{
        return link.split( '/' )[2]
    }

    const MainCard = () =>{
        return(<>
                Main            
        </>)
    }
    const CommandeCard = () =>{
        console.log('commande')
        return(<>
                Commande            
        </>)
    }
    const MenuCard = () =>{
        return(<>
                Menu            
        </>)
    }
    const CaisseCard = () =>{
        return(<>
                Caisse            
        </>)
    }

    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'ma': return <MainCard />;  
            case 'rq': return <CommandeCard /> ;
            case 'sk': return <MenuCard /> ;
            case 'ft': return <MainCard /> ;
            case 'ca': return <CaisseCard />;  
            case 'tm': return <MainCard /> ;
            case 'ot': return <MainCard /> ;
            case 'Profile': return <MainCard /> ;
            case 'Parametre': return <MainCard /> ;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    };

    return (  <>
        <div className='col-12 col-lg-2  text-center d-none d-lg-block fixed-top border-end bg-white ' style={{backgroundColor: 'transparent', height:'100vh', zIndex: 999, top:'60px' }}>
        <h1 className='text-white mt-0'><img src={`https://cdn.abyedh.tn/images/ads/ptvente_shop.svg`} alt="." className="p-0" width="120px" height="120px"/></h1>
            
            <div  className='pt-2' style={{height:'40%', overflowX:'auto', overflowX:'hidden'}}>
                {/* <StateCard status = {GetPathName(location.pathname)} />              */}
                {/* <h5>PID : {localStorage.getItem('PID')} <Button size='mini' icon='copy' className='rounded-circle' onClick={() => navigator.clipboard.writeText(localStorage.getItem('PID'))}></Button> </h5> */}
            </div>
            <div className="list-group list-group-flush text-start ps-1">
                {/* <NavLink to='Profile' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-person me-2" style={{color: GConf.themeColor}}></i> Profile</NavLink> */}
                {/* <NavLink to='Parametre' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-sliders me-2" style={{color: GConf.themeColor}}></i> Paramétre</NavLink> */}
                <NavLink to='ot/dbbu' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-sliders me-2" style={{color: GConf.themeColor}}></i> Sauvegarder</NavLink>
                <NavLink to='up' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-arrow-repeat me-2" style={{color: GConf.themeColor}}></i> Synchroniser</NavLink>
                <NavLink to='#' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-journal-text me-2" style={{color: GConf.themeColor}}></i> Documentation</NavLink>
                <NavLink to='#' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-gem me-2" style={{color: GConf.themeColor}}></i> Version Beta <small className="badge rounded-pill" style={{backgroundColor: GConf.themeColor}}>2</small></NavLink>
                <NavLink onClick={LogOut} exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list list-group-item list-group-item-action" : "ps-1 pe-1 abyedh-list list-group-item list-group-item-action"}><i className="bi bi-box-arrow-left me-2" style={{color: GConf.themeColor}}></i> Déconnextion</NavLink>
            </div>
        </div>
        </>
        );
}

export default LeftSideCard;