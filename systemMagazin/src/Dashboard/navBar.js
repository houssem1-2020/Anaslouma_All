import React from 'react';
import { NavLink } from 'react-router-dom';
import { Segment } from 'semantic-ui-react'
import { Button, Icon, Modal, List } from 'semantic-ui-react'
import GConf from '../AssetsM/generalConf';

function NavBar(props) {
    const MainLink = (props) => {
        return (<>
            <NavLink exact="true" className={({ isActive  }) => isActive ? "p-2 abyedh-list-a" : "p-2 abyedh-list"} to={props.link}><i className={`icons-a bi bi-${props.icon}`}></i> {props.name}  <span className="d-none d-lg-inline"></span></NavLink>
        </>)
    }
    const ResponsiveLink = (props) => {
        return (<>
            <NavLink exact="true" className={({ isActive  }) => isActive ? "p-2 abyedh-list-a" : "p-2 abyedh-list"} to={props.link}><i className={`icons-a bi bi-${props.icon}`}></i> {props.name}  <span className="d-none d-lg-inline"></span></NavLink>
        </>)
    }
    const LogOut = () =>{
        //localStorage.clear();
        localStorage.removeItem(`PID`);
        window.location.href = "/login";
    }
    const Refresh = () =>{
        window.location.reload();
    }

    return (<>
        <div className="fixed-top">
            <div className="rounded-0 p-3 bg-white border-bottom blur-bckg-st">
                <div className="row">
                    <div className="col-3 col-md-2 align-self-center text-left">
                        <img src="https://cdn.abyedh.tn/Images/main-logo.png" alt="." className="p-0" width="40px" height="30px"/>
                    </div>
                    <div className="col-5 col-md-8 align-self-center text-left navsha">
                       <div className="text-left d-none d-lg-block"> 
                            {GConf.NavsData.map((links) => 
                                <MainLink key={links.id} name={links.name} link={links.link} icon={links.icon} />
                            )}
                        </div>
                        
                        <Modal
                            size='mini'
                            closeIcon
                            dimmer='blurring'
                            trigger={<Button className="d-lg-none rounded-pill bg-system-btn"> <Icon name='list alternate outline' /> Menu</Button>}
                            >
                            <Modal.Content className='d-block'>
                                <div className='p-2 text-start'>
                                    {GConf.NavsData.map((links) => 
                                        <div className="mb-2" key={links.id}><MainLink name={links.name} link={links.link} icon={links.icon} /></div>
                                    )}   
                                </div>
                            </Modal.Content>
                        </Modal>
                       
                    </div>
                    <div className="col-4 col-md-2 align-self-center text-end">
                        <div className="dropdown d-none">
                            <NavLink onClick={Refresh} to='#' exact="true" className='ps-1 pe-1'><span className="bi bi-arrow-clockwise fa-lg text-danger"></span></NavLink>
                            <NavLink to='nt' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-bell fa-lg "></i></NavLink>
                            <NavLink to='up' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-cloud-arrow-down fa-lg "></i></NavLink>
                            {/* <NavLink to='msg' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-envelope fa-lg"></i></NavLink> */}
                            <NavLink onClick={LogOut} to='#' exact="true" className='ps-1 pe-1'><span className="bi bi-box-arrow-left fa-lg"></span></NavLink>
                        </div>
                        <NavLink onClick={Refresh} to='#' exact="true" className='ps-1 pe-3 mt-3'><span className="bi bi-arrow-clockwise fa-lg text-danger"></span></NavLink>
                        {/* <Modal
                            closeIcon
                            //centered={false}
                            size='small'
                            dimmer='blurring'
                            trigger={<Button className=" rounded-circle bg-system-btn" size='tiny' icon> <Icon name='expand arrows alternate' /></Button>}
                            >
                            <Modal.Content className='d-block'>
                                <div className='row'>
                                    <div className='col-4 col-lg align-self-center text-center d-none'>
                                        <NavLink to='nt' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-bell bi-md "></i></NavLink>
                                        <h6>Notification</h6>
                                    </div>
                                    <div className='col-4 col-lg align-self-center text-center d-none'>
                                        <NavLink to='msg' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-envelope bi-md"></i></NavLink>
                                        <h6>Messages</h6>
                                    </div> 
                                    <div className='col-4 col-lg align-self-center text-center d-none'>
                                        <NavLink to='Profile' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-person bi-md"></i></NavLink>
                                        <h6>Profile</h6>
                                    </div> 
                                    <div className='col-4 col-lg align-self-center text-center  d-none'>
                                        <NavLink to='Parametre' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-sliders bi-md"></i></NavLink>
                                        <h6>Paramétre</h6>
                                    </div>
                                    <div className='col-4 col-lg align-self-center text-center  '>
                                        <NavLink to='up' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-arrow-repeat bi-md"></i></NavLink>
                                        <h6>Synchroniser</h6>
                                    </div>
                                    <div className='col-4 col-lg align-self-center text-center border-end '>
                                        <NavLink to='up' exact="true" className={({ isActive }) => isActive ? "ps-1 pe-1 abyedh-list-a-s" : "ps-1 pe-1 abyedh-list"}><i className="bi bi-cloud-arrow-down bi-md "></i></NavLink>
                                        <h6>Mise à Jour</h6>
                                    </div>
                                    <div className='col-4 col-lg align-self-center text-center'>
                                        <NavLink onClick={LogOut} to='#' exact="true" className='ps-1 pe-1'><span className="bi bi-box-arrow-left bi-md"></span></NavLink>
                                        <h6>Déconnextion</h6>
                                    </div>   
                                </div>
                            </Modal.Content>
                        </Modal> */}
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default NavBar;
