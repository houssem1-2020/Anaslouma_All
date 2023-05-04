import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function CamionFondTemp() {
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
                <h2 className='text-center'> Fonds  Camion </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>Camion : {fondD.Cam_Name} </b></div>
                        <div className='text-danger'><b>Matricule : {fondD.Matricule} </b></div>
                        <div className='text-danger'><b>Chauffeur : {fondD.Chauffeur} </b></div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Fond ID : </b> {fid}</div>
                        <div className='text-secondary'><b>Date : </b> {new Date (fondD.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
            <div className='row'>
                <div className='col-6'>
                </div>
                <div className='col-6'>
                    <table className="table">

                        <tbody>
                            <tr>
                                <th scope="col">Totale</th>
                                <th scope="col">{(parseFloat(fondD.Totale)).toFixed(3)}</th>
                            </tr>
                        </tbody>
                    </table>
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
                        <th scope="col">Qté.K</th>
                        <th scope="col">Qté.P</th>
                        <th scope="col">Prix</th>
                        <th scope="col">Totale</th>
                        <th scope="col">Rq</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={artData.id}>
                                <th scope="row">{index + 1 }</th>
                                <td>{artData.Name}</td>
                                <td>{artData.QteAjoute}</td>
                                <td>{artData.QteAjoute * artData.Groupage}</td>
                                <td>{parseFloat(artData.Prix_vente).toFixed(3)}</td>
                                <td>{parseFloat(artData.Prix_vente * artData.QteAjoute).toFixed(3)}</td>
                                <td></td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
                <br />
                <TotaleCard />
            </div>
            
           
    </> );
}

export default CamionFondTemp;