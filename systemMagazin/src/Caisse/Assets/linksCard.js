import React from 'react';
import { NavLink } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf'
import InputLinks from './linksData';
function LinkCard(props) {
    return ( <>
        <div className={`card card-body shadow-sm border-div mb-2 text-center h-100  ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-light' : 'bg-hover-card' }`} style={{color: GConf.themeColor}}>
                <NavLink exact='true' to={props.data.link} className="stretched-link"></NavLink>
            <h1 className={`bi bi-${props.data.icon} bi-lg mb-0`} ></h1> 
            <h3>{props.data.text}</h3>
        </div> 
    </> );
}

export default LinkCard;