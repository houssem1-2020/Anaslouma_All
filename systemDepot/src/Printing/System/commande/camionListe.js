import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import { ToWords } from 'to-words';
import axios from 'axios';


function setPageSize() {
    const style = document.createElement('style');
    style.innerHTML = `@page {size: landscape}`;
    style.id = 'page-orientation';
    document.head.appendChild(style);
}

function CommandeGroupListe() {
    /*########################[Const]########################*/
    let {CID,jour} = useParams()
    let [factureList, setFactList] = useState([])
    let [loadingPage, setL] = useState(false)

    
    /*########################[UseEffect]########################*/
    useEffect(() => {
        setPageSize();
        axios.post(`${GConf.ApiLink}/camion/commandes/factures`, {
            tag: GConf.SystemTag,
            camId: CID,
            jour: jour
          })
          .then(function (response) {
                //setFactList(response.data)
                SortByArticlesSize(response.data)
                setL(true)
          })


    }, [])

    /*########################[Functions]########################*/
    const SortByArticlesSize = (list) =>{
        let sorted = list.sort(function(a, b){
            return a.Articles.length - b.Articles.length;
        });
        setFactList(sorted)
    }

    /*########################[Card]########################*/
    const ContentCard = (props) =>{
        return(<>
            <table className="table p-0">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Desig</th>
                        <th scope="col">Qté</th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.parse(props.factureData).map( (artData, index) => 
                        <tr key={index}>
                            <td className='m-0 p-0'>{index +1 }</td>
                            <td className='m-0 p-0'>{artData.Name}</td>
                            <td className='m-0 p-0'>{artData.Qte}</td>
                        </tr>
                    )}
                    
                    
                </tbody>
            </table>
        </>)
    }
    const LastReturnedCard = (props) =>{
        return(
            <div className="col-2-5 font-list-small">
                <h5 className='mb-1'>{props.factureData.Name}</h5> 
                <span>{props.factureData.Tota} - {props.factureData.F_ID} </span>
                <ContentCard factureData={props.factureData.Articles} /> 
                <br />
            </div>)
    }
    return ( <>
        
        {loadingPage ? 
            <>
                <h5>{new Date(jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</h5>
                <div className='row'>
                    {factureList.map( (data,index) => <LastReturnedCard key={index} factureData={data} />)}
                </div> 
            </> 
            : 
            'Esseyer Une Autre fois !' 
        }
    </> );
}

export default CommandeGroupListe;