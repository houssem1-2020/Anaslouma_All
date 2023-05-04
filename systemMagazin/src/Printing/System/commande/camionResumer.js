import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import { ToWords } from 'to-words';
import axios from 'axios';

function CommandeGroupResumer() {
    /*########################[Const]########################*/
    let {CID,jour} = useParams()
    let [factureList, setFactList] = useState([])
    let [loadingPage, setL] = useState(false)

    
    /*########################[UseEffect]########################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/camion/commandes/factures`, {
            tag: GConf.SystemTag,
            camId: CID,
            jour: jour
          })
          .then(function (response) {
                setFactList(response.data)
                setL(true)
          })


    }, [])

    /*########################[Functions]########################*/
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }
    const toWords = new ToWords({
        localeCode: 'fr-FR',
        converterOptions: {
          //currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
        }
    });
    const MakeSum = () =>{
        let tot = 0
        factureList.map( (art) => { 
           tot = tot +  parseFloat(art.Tota)
        })
        return (tot.toFixed(3))
    }
    /*########################[Card]########################*/
    const FactureHeader = () =>{
        return(<>
                
                <div className="row">
                    <div className="col-12 text-center"><center><h2><b>RESUMER POUR : {new Date().toLocaleDateString('fr-FR')}</b></h2></center></div>
                </div>
                <br /> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>STE ANASLOUMA DISTRUBUTION</b></div>
                        <div className='text-secondary'><b>VILLE: </b> SIDI BOUROUIS</div>
                        <div className='text-secondary'><b>MATRICULE F : </b> 1670146/D</div>
                        <div className='text-secondary'><b>TEL : </b> 97913068</div>
                        <div className='text-secondary'><b>FAX : </b> 78898081</div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Date : </b> {new Date(jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
                        <div className='text-secondary'><b>Chauffeur : </b> </div>
                        <div className='text-secondary'><b>Camion : </b>  </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = (props) =>{
        return(<>
            <div className='row'>
                <div className='col-6'>
                </div>
                <div className='col-6'>
                    <table className="table">

                        <tbody>
                            <tr>
                                <th scope="col">TOTALE:</th>
                                <th scope="col">{MakeSum()}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>)
    }
    const ContentCard = (props) =>{
        return(<>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Client</th>
                    <th scope="col">Totale </th>
                    <th scope="col">Gouv</th>
                    <th scope="col">Deleg</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Etat</th>
                    </tr>
                </thead>
                <tbody>
                    {factureList.map( (artData, index) => 
                        <tr key={index}>
                            <th scope="row">{index +1 }</th>
                            <td>{artData.C_Name}</td>
                            <td>{parseFloat(artData.Tota).toFixed(3)}</td>
                            <td>{artData.Gouv}</td>
                            <td>{artData.Deleg}</td>
                            <td>{artData.Phone}</td>
                            <td> </td>
                        </tr>
                    )}
                    
                    
                </tbody>
            </table>
        </>)
    }
    const LastReturnedCard = () =>{
        return(
            <div className="container mb-4">
                        <FactureHeader />
                        <br />
                        <br />
                        <ContentCard  /> 
                        <br />
                        <TotaleCard/>
                        <br />
            </div>)
    }
    return ( <>
        {loadingPage ?  <LastReturnedCard /> :  'Esseyer Une Autre fois !'  }
    </> );
}

export default CommandeGroupResumer;