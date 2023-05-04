import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function PrintPrixLarge() {
    const [articleL, setArticleL] = useState([])
    const [loading , setLoading] = useState(false)
    const bearkList = [5,10,15,20,25,30]

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/ticket/prix`, {
            PID : GConf.PID,
          })
          .then(function (response) {
                setArticleL(response.data)
                setLoading(true)
          }).catch((error) => {
            if(error.request) {
              setLoading(true)
              
            }
          });
    }, [])

    const IsBreackHere = (number) => {
        return bearkList.includes(number)
    }

    return ( <>
           <div className="row border-top border-start mb-3 m-1">                   
                    {loading ?  
                    <>
                    {articleL.map( (artData, index) => <>
                        <div className="col-12 border-end border-bottom p-2">
                            <h1 className='text-center text-blod mb-1' style={{fontSize:'98px'}}><b>{artData.Prix_vente.toFixed(3)}</b></h1>
                            <h6 className="text-danger text-center" style={{fontSize:'30px'}}><b>{artData.Name}</b></h6>
                            <div className="text-end small">{artData.Code}</div>
                        </div>
                        {IsBreackHere(index+1) ? <div className='breack-page-here'></div> : ''}
                        </>
                    )}
                    
                    </>
                    : '...' }                        
                    
            </div>

           
    </> );
}

export default PrintPrixLarge;