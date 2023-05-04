import React  , { useEffect, useState } from 'react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import { Bounce } from 'react-reveal';
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
import CountUp from 'react-countup';

function MainPage() {
    /*#########################[Const]##################################*/
    const localsystemTag = localStorage.getItem(`Admin_Secure_key`);
    const [status, setStat] = useState([]); 
    const now = new Date();
    date.locale(fr)

   /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/check-permission`, {
            TAG: GConf.SystemTag,
          })
          .then(function (response) {
            if(response.data.Permission_Key != localsystemTag){LogOut()}
        })
         
    }, [])

    
    /*#########################[Card]##################################*/
    const LinkCard =  (props) => {

        return (<>
        
                <div className={`col-12 col-md-${props.col} mb-3`}>
                    <div className={`card card-body shadow-sm pb-2 border-div ${props.external ? 'bg-danger text-white' : ''}`}>
                        {
                            props.external ? 
                           <a href='https://ansl.tn/'  target="_blank"  className="stretched-link" /> 
                           :
                           <NavLink exact="true" to={`${props.link}`}   className="stretched-link" />
                        }
                        
                        <div className='text-center p-2'>
                            <span className={`bi bi-${props.icon} bi-lg`} style={{color: props.external ? 'text-white' : GConf.themeColor}}></span>
                        </div>
                        <div className='text-center p-2'>
                            <h3 className={props.external ? 'text-white' : 'text-secondary'}>{props.desc}</h3>
                        </div>
                        
                    </div>
                </div>
               
        </>);
    }
    const TopCardTime = () =>{
        return(<>
            <div className='card card-body mb-4 rounded-system  main-big-card shaodw-sm'>
                <div className='row'>
                    <div className='col-8'>
                        <h1 className='text-white display-1'>{date.format(now, 'dddd')}</h1>
                        <h1 className='text-white'>{date.format(now, ' DD - MMM - YYYY')}</h1>
                    </div>
                    <div className='col-4 text-end align-self-center'>
                        <h1 style={{color:GConf.themeColor}}>{date.format(now, 'HH:mm')}</h1>
                    </div>
                </div>
            </div>
        </>)
    }
    const LinksCrads = () => {
        return(<>
            <div className="row justify-content-center mb-4">
                {GConf.LinkCard.map((stat) =>
                    <LinkCard key={stat.id} col={stat.col} icon={stat.icon} link={stat.link} stat={status[stat.dataTag]} smallT={stat.smallT} desc={stat.desc} external={stat.external} />
                )}
            </div>
        </>)
    }
    const LogOut = () =>{
        localStorage.clear();
        window.location.href = "/login";
    }
    return (<>
        <br />
        <TopCardTime />
        <Bounce bottom> 
            <LinksCrads />     
        </Bounce>    
    </>);
}

export default MainPage;