import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function CamionInventaireTemp() {
    let {fid} = useParams()
    let [articleL, setArticleL] = useState([])
    let [fondD, setFondD] = useState([])

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/camion/fond`, {
            tag: GConf.SystemTag,
            fondID: fid
          })
          .then(function (response) {
                setArticleL(JSON.parse(response.data[0].Articles))
                setFondD(response.data[0])
    
          })
    }, [])


    //Card
    const FondHeader = () =>{
        return(<>
                <h2 className='text-center'> Inventaire Camion </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>Camion : {fondD.Camion} </b></div>
                        <div className='text-danger'><b>Matricule : {fondD.Camion} </b></div>
                        <div className='text-danger'><b>Chauffeur : {fondD.Camion} </b></div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Inventaire ID : </b> {fid}</div>
                        <div className='text-secondary'><b>Date : </b> {new Date (fondD.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
                    </div>
                </div>
        </>)
    }

    return ( <>
           <div className="container mb-4">
                <FondHeader />
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Artifcle</th>
                        <th scope="col">Designiation</th>
                        <th scope="col">Qte Ancien </th>
                        <th scope="col">Nouveaux Qté</th>
                        <th scope="col">Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={artData.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{artData.Name}</td>
                                <td>{artData.Qte}</td>
                                <td>{artData.QteAjoute}</td>
                                <td>{ artData.QteAjoute - artData.Qte }</td>
                                <td></td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
                <br />

            </div>
            
           
    </> );
}

export default CamionInventaireTemp;