import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function RecetteDepo() {
    let {s,e} = useParams()
    let [factures, setFactures] = useState([])

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/recette`, {
            tag: GConf.SystemTag,
            start: s,
            end: e
          })
          .then(function (response) {
                setFactures(response.data)
    
          })
    }, [])

    //function
    const CalculateTotale = () =>{
        let tot = 0;
        factures.map((fact) => {
            tot = tot + parseFloat(fact.Tota)
        })
        return tot.toFixed(3)
    }

    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>RESUMER DES RECETTE  </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>STE ANASLOUMA DISTRUBUTION</b></div>
                        <div className='text-secondary'><b>VILLE: </b> SIDI BOUROUIS</div>
                        <div className='text-secondary'><b>MATRICULE F : </b> 1670146/D</div>
                        <div className='text-secondary'><b>TEL : </b> 97913068</div>
                        <div className='text-secondary'><b>FAX : </b> 78898081</div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>1 er Date  : {s}</b> </div>
                        <div className='text-secondary'><b>2 éme Date :  {e}</b></div>
                    </div>
                </div>
                <br />   
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Date</th>
                        <th scope="col">Client</th>
                        <th scope="col">Totale</th>
                        </tr>
                    </thead>
                    <tbody>
                         {factures.map( (factData, index) => 
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{new Date(factData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{factData.C_Name}</td>
                                <td>{factData.Tota}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />
                <div className='text-danger'> <b> Totale : {CalculateTotale()} </b></div>
            </div>

           
    </> );
}

export default RecetteDepo;