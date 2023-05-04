import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

function FamilleList() {
    //variables
    let [familleList, setFamillesList] = useState([]);
    const [loading , setLoading] = useState(false)

    //useEffect
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/stock/familles`, {
            PID: InputLinks.forPID.PID,
          })
          .then(function (response) {
            console.log(response.data)
            setFamillesList(response.data)
            setLoading(true)
          })
    }, [])

    //card
    const FamilleCard = (props) =>{
        return(<>
                <div className='col-4'>
                    <NavLink exact="true" to={`/C/L/sk/List/${props.data.Genre}`}>
                        <div className={`card p-2 shadow-sm border-div bg-hover-card mb-2 text-center ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}>
                                <div className='text-center mt-4 mb-2'>
                                    <span className='bi bi-boxes bi-lg' style={{width:'80px'}}></span>
                                </div>
                                <h1 className='mb-1'>{props.data.Genre}</h1>
                                <small> {props.data.Description} </small>
                            </div>
                       
                    </NavLink>
                </div>
        </>)
    }

    return ( <>
    <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
        <BackCard data={InputLinks.backCard.skList}/>
        <br />
        <div className='container'>
            <div className='row'>
                {loading ?  
                    <>
                        {familleList.map( (data) => <FamilleCard key={data.PK}  data={data} />)}
                    </>
                : SKLT.CardList }
            </div>
        </div>
    </div>
        </> );
}

export default FamilleList