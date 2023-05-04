import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

function Famille() {
    //variables
    let [familleList, setFamillesList] = useState([]);
    const [loading , setLoading] = useState(false)

    //useEffect
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/stock/familles`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
            setFamillesList(response.data)
            setLoading(true)
          })
    }, [])

    //card
    const FamilleCard = (props) =>{
        return(<>
                <div className='col-6'>
                    <NavLink exact="true" to={`/C/L/cg/familles/${props.data.Genre}`}>
                        <div className='card p-2 shadow-sm mb-2 text-center'>
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
        <BackCard data={InputLinks.backCard.cgFamille}/>
        <br />
        <div className='container-fluid'>
            <div className='row'>
                {loading ?  
                    <>
                        {familleList.map( (data) => <FamilleCard key={data.PK}  data={data} />)}
                    </>
                : SKLT.CardList }
            </div>
        </div>
        </> );
}

export default Famille