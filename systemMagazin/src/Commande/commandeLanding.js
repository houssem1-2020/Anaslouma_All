import React, { useEffect, useState} from 'react';
import { Bounce } from 'react-reveal';
import { Button, Statistic } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import LinkCard from './Assets/linksCard'
import InputLinks from './Assets/linksData'
import CountUp from 'react-countup';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function InputLandingPage() {
    //const 
    let CmdData = JSON.parse(localStorage.getItem(`Magazin_Gerant_LocalD`));
    let UID = CmdData.T_ID;
    let Name = CmdData.T_Name;

    const [statData, setStatData] = useState([])



    //functions
    const logOutInput = () =>{    
        localStorage.clear();
        window.location.href = "/U";
    }

    //card
    const MainTopCard = () =>{
        return(<>
            <div className='card p-3 fixed-top border-0 shadow-sm rounded-0'>
                <div className='row'>
                    <div className='col-8 align-self-center'><h2> <span className="badge bg-warning"> <span className='bi bi-person-circle '></span>  {Name}  </span>  </h2></div>
                    <div className='col-2 align-self-center' >
                    </div>
                    <div className='col-2 align-self-center' ><Button onClick={logOutInput} style={{backgroundColor:GConf.themeColor}} className='rounded-circle text-white' icon='log out' /></div>
                </div>
            </div>
        </>)
    }

    return ( <>
            <MainTopCard />
            <br />                
            <br />                
            <br />                
            <br />   
            <br />   
            <div className='container-fluid'>
                <h3>STOCK</h3>
                <div className='row'>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[0]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[1]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[2]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[3]} /> </div>
                </div>

                <h3>OUTILS</h3>
                <div className='row'>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[4]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[5]} /> </div>
                </div>

                <h3>EQUIPE</h3>    
                <div className='row'>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[6]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[7]} /> </div>
                </div>

                <h3>CLIENTS</h3>    
                <div className='row'>
                    <div className='col-12 mb-3'> <LinkCard data={InputLinks.main[8]} /> </div>
                </div>

                <h3>COMMANDES</h3> 
                <div className='row'>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[9]} /> </div>
                    <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[10]} /> </div>
                    <div className='col-12 mb-3'> <LinkCard data={InputLinks.main[11]} /> </div>
                </div> 
 

                
                   
            </div>                   
            </> );
}

export default InputLandingPage;