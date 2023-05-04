import React from 'react';
import { NavLink } from 'react-router-dom';
import InputLinks from './linksData';
function BackCard(props) {
    return ( <>
            <div className={`card card-body shadow-sm mb-2 rounded-0 fixed-top ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'bg-ligth-theme-1' }`}>
                <div className='row'>
                    <div className='col-2 align-self-center'>
                         <NavLink exact='false' to={props.data.link}><span className='bi bi-arrow-left-short bi-md'></span></NavLink>
                    </div>
                    <div className='col-10 text-center align-self-center'>
                       <h5>{props.data.text}</h5> 
                    </div>
                </div>
                
            </div>
            <br />
            <br />
            <br />
        </> );
}

export default BackCard;