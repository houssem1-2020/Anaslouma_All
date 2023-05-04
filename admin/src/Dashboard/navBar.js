import React from 'react';
import { NavLink } from 'react-router-dom';
import { Segment } from 'semantic-ui-react'


function NavBar(props) {
    const LogOut = () =>{
        localStorage.clear();
        window.location.href = "/login";
    }
    const Refresh = () =>{
        window.location.reload();
    }

    return (<>
        <div className="fixed-top">
            <Segment className="rounded-0">
                <div className="row">
                    <div className="col-3 col-lg-2 align-self-center text-left">
                       <NavLink exact='true' to='/'> <img src="https://system.anaslouma.tn/alimentaire/main-lago.gif" alt="." className="p-0" width="80px" height="30px"/></NavLink>
                    </div>
                    <div className="col-5 col-lg-8 align-self-center text-left navsha">                       
                    </div>
                    <div className="col-4 col-lg-2 align-self-center text-end">
                        <div className="dropdown">
                        <NavLink to='setting' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-sliders bi-md me-3 "></i></NavLink>
                        <NavLink onClick={LogOut} to='#' exact="true" className='ps-1 pe-1'><span className="bi bi-box-arrow-left bi-md text-danger"></span></NavLink>
                        </div>
                    </div>
                </div>
            </Segment>
        </div>
    </>);
}

export default NavBar;
