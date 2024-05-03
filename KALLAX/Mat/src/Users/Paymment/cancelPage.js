import React from 'react';
import { NavLink } from 'react-router-dom';
function SuccessPaymmentCard() {

    const TopCard = () =>{
        return(<>

                <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex:900}}>
                        <div className='row'>
                            <div className='col-8 text-start'>
                                    <NavLink exact='true' to={`/User/L`}>
                                        <span className='bi bi-arrow-left bi-sm text-white'></span>
                                    </NavLink>
                            </div>
                            <div className='col-4 align-self-center text-end'>   
                                {
                                    localStorage.getItem('UserIsLogged') ? 
                                    <NavLink to='/User/L'>
                                        <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' />
                                    </NavLink>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                </div>
                {/* <div className='card card-body shadow-sm system-color rounded-0 fixed-top' style={{zIndex:900}}>
                    <NavLink exact='true' to={`/Article/${tag}/${code}`}>
                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                    </NavLink>
                </div> */}
        </>)
    }

    return ( <>
    <TopCard />
        <br />
        <br />
        <br />
        <br />
        <div className='container text-center'>
                    <br />
                    <br />
                    <br />
                    <img src='https://assets.ansl.tn/Images/kallax/paimment-failed.svg' width='80%' height='120px' /> 
                    <h4 className='text-secondary'> échec de paiement  </h4> 
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

            <img />
        </div>
   
    </> );
}

export default SuccessPaymmentCard;