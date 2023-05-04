import React, { useEffect} from 'react';
import { Bounce } from 'react-reveal';
import { Button } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import LinkCard from './Assets/linksCard'
import InputLinks from './Assets/linksData'

function InputLandingPage() {
    /*#########################[Const]###########################*/
    let userData = JSON.parse(localStorage.getItem("UserData"));
    console.log(userData)

    /*#########################[UseEffect]###########################*/
    useEffect(() => {
        const inputIsLogged = localStorage.getItem('UserIsLogged');
        if (!inputIsLogged) {window.location.href = "/User/logIn";}
        
    })

    /*#########################[Function]###########################*/
    const logOutInput = () =>{    
        localStorage.clear();
        window.location.href = "/User";
    }

    /*#########################[Card]###########################*/
    const MainTopCard = () =>{
        return(<>
            <div className='card p-3 fixed-top border-0 shadow-sm rounded-0'>
                <div className='row'>
                    <div className='col-10 align-self-center'><h2> <span className="badge bg-info"> <span className='bi bi-person '></span>  {userData.Name} </span></h2></div>
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
            <Bounce bottom>            
                <div className='container-fluid'>
                    <div className='row'>
                        <h5>Camion</h5>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[0]} /> </div>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[1]} /> </div>
                    </div>
                    <div className='row'>
                        <h5>Stock</h5>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[2]} /> </div>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[3]} /> </div>
                    </div>
                    <div className='row'>
                        <h5>Statistics</h5>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[4]} /> </div>
                        <div className='col-6 mb-3'> <LinkCard data={InputLinks.main[5]} /> </div>
                    </div>
                </div>
            </Bounce> 
              
        </> );
}

export default InputLandingPage;