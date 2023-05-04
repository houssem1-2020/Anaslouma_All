import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';



function ResumerFacture() {
    let {code, s, e} = useParams()
    let targetDate = {start:s, end:e}
    let [clientList, setClientList] = useState([])
    let [venteList, setVenteList] = useState([])


    useEffect(() => {

        //get vente List 
        axios.post(`${GConf.ApiLink}/facture/resumer`, {
            tag: GConf.SystemTag,
            targetDate: targetDate,
          })
          .then(function (response) {
                setVenteList(response.data)
    
          })


          //get client List
          axios.get(`${GConf.ApiLink}/client`)
          .then(function (response) {
            setClientList(response.data)
    
          })
    }, [])


    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }

    const GetTargetClientData = (value) =>{
        const searchObject= clientList.find((client) => client.Name == value);
        if (searchObject) {
            return searchObject.Code_Fiscale
        }
        
        
    }


    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>RESUMEE VENTE   </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>De: </b> {s} </div>
                        <div className='text-secondary'><b>Jusqu'a: </b> {e} </div>
                    </div>
                    <div className='col-6'>
                        
                    </div>
                </div>
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">N0</th>
                            <th scope="col">Facture</th>
                            <th scope="col">Date</th>
                            <th scope="col">Clients</th>
                            <th scope="col">M.F</th>
                            <th scope="col">THT</th>
                            <th scope="col">TVA</th>
                            <th scope="col">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venteList.map( (factDat,index) => 
                            <tr key={factDat.PK}>
                                <th scope="row">{index + 1 }</th>
                                <td>{factDat.F_ID}</td>
                                <td>{new Date(factDat.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</td>
                                <td>{factDat.C_Name}</td>
                                <td>{GetTargetClientData(factDat.C_Name)}</td>
                                <td>{CalculateTVA(factDat.Tota)}</td>
                                <td>{(factDat.Tota - CalculateTVA(factDat.Tota)).toFixed(3)}</td>
                                <td>{factDat.Tota}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>
            <br />
            <br />
           
    </> );
}

export default ResumerFacture;