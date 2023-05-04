import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function PrintPrix() {
    let {g} = useParams()
    let [articleL, setArticleL] = useState([])

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/print`, {
            tag: GConf.SystemTag,
            genre: g
          })
          .then(function (response) {
                setArticleL(response.data)
                console.log(response.data)
    
          })
    }, [])



    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>Liste Des Prix  </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>STE ANASLOUMA DISTRUBUTION</b></div>
                        <div className='text-secondary'><b>VILLE: </b> SIDI BOUROUIS</div>
                        <div className='text-secondary'><b>TEL : </b> 97913068</div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Famille  : {g}</b> </div>
                    </div>
                </div>
                <br />   
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Code</th>
                            <th scope="col">Des</th>
                            <th scope="col">Famille</th>
                            <th scope="col">Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{artData.A_Code}</td>
                                <td>{artData.Name}</td>
                                <td>{artData.Genre}</td>
                                <td>{parseFloat(artData.Prix_vente).toFixed(3)}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>

           
    </> );
}

export default PrintPrix;