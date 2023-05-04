import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function CamionStock(props) {
    let {cid} = useParams()
    let [articleL, setArticleL] = useState([])
    let [camionData, setCamionData] = useState([])

    useEffect(() => {
        
        axios.post(`${GConf.ApiLink}/camion/info/printing/stock`, {
            tag: GConf.SystemTag,
            camId: cid,
            genre : props.zero ? '=':'!='
          })
          .then(function (response) {
                setArticleL(response.data[0].Stock)
                setCamionData(response.data[0].Data)
          })
    }, [])

    const StockEnKarton = (S,G) =>{
        let Karton = Math.floor(S/G)
        return (Karton + 'K & ' + (S - (Karton * G)) + 'P')
    }

    const TemplateStockHeader = () =>{
        return(<>
            <div className='card card-body'>
                <div><span className='bi bi-truck'></span> Camion : {camionData ? camionData.Cam_Name : <></>}</div>
                <div><span className='bi bi-truck'></span> Matricule : {camionData ? camionData.Matricule : <></>}</div>
                <div><span className='bi bi-person'></span> Chauffeur : {camionData ? camionData.Chauffeur : <></>}</div>
                <div>Cette Inventaire a ete effectuer Le :  {new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
            </div>
        </>)
    }

    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>Stock Du Camion {props.zero ? 'à Zero ' : ''} </h2> 
                <br />
                <TemplateStockHeader /> 
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col-4">Designiation</th>
                        <th scope="col-1">Genre</th>
                        <th scope="">Q(P)</th>
                        {props.zero ? <></>: <th scope="col-2">Q(K)</th> }
                        <th scope="col-1">Prix</th>
                        <th scope="col-1">Ptg</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={index}>
                                <th scope="row">{index + 1 }</th>
                                <td>{artData.Name}<small>({artData.A_Code})</small></td>
                                <td>{artData.Genre}</td>
                                <td>{artData.Qte}</td>
                                <td>{props.zero ? <></>: StockEnKarton(artData.Qte,artData.Groupage) }</td>
                                <td>{(artData.Qte * (artData.Prix_vente/artData.Groupage)).toFixed(3)}</td>
                                <td></td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>
           
    </> );
}

export default CamionStock;