import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function BonEntreSortie(props) {
    let {bonId} = useParams()
    let [articleL, setArticleL] = useState([])
    let [bonES, setBonES] = useState([])

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/stock/bebs/select`, {
            PID : GConf.PID,
            bonId: bonId
          })
          .then(function (response) {
                setArticleL(JSON.parse(response.data[0].Articles))
                setBonES(response.data[0])
    
          })
    }, [])

    const BonHeader = (props) =>{
        return(<>
            <h2 className='text-center'>Bon : {props.genre} </h2> 
            <div className='row'>
                <div className='col-6'>
                    <div className='text-secondary'><b>Bond ID  : </b> {bonId}</div>
                </div>
                <div className='col-6'> 
                    <div className='text-secondary'><b>Jour: </b> {new Date(bonES.BE_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
                </div>
            </div>
        </>)
    }

    return ( <>
           <div className="container mb-4">
                <BonHeader  genre={props.genre} />
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Designiation</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Ajouter</th>
                            <th scope="col">Qté</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={index}>
                                <th scope="row">{index +1}</th>
                                <td>{artData.Name}</td>
                                <td>{artData.OldQte}</td>
                                <td>{artData.NewQte}</td>
                                <td>{artData.PureQte}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>
           
    </> );
}

export default BonEntreSortie;