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

function CommandeGroupListeCmd() {
    /*########################[Const]########################*/
    let {jour} = useParams()
    let [factureList, setFactList] = useState([])
    let [loadingPage, setL] = useState(false)

    
    /*########################[UseEffect]########################*/
    useEffect(() => {
        setPageSize();
        axios.post(`${GConf.ApiLink}/commandes/groupes`, {
            tag: GConf.SystemTag,
            jour: jour
          })
          .then(function (response) {
                setL(true)
                //setFactList(response.data)
                SortByArticlesSize(response.data)
               
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
                <h5>{props.factureData.Name}</h5> 
                <ContentCard factureData={props.factureData.Articles} /> 
                <br />
            </div>)
    }
    return ( <>
        
        {loadingPage ? 
            <>
                <h5>REGROUPPMENT DES COMMANDES : {new Date(jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</h5>
                <div className='row'>
                    {factureList.map( (data,index) => <LastReturnedCard key={index} factureData={data} />)}
                </div> 
            </> 
            : 
            'ESSEYER UNE AUTRE FOIS  !' 
        }
    </> );
}

export default CommandeGroupListeCmd;