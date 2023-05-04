import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import { ToWords } from 'to-words';

function FactureTemp() {
    let {fid, client} = useParams()
    let [articleL, setArticleL] = useState([])
    let [totale, setTotale] = useState(0)
    let [factureData, setFactData] = useState([])
    const toWords = new ToWords({
        localeCode: 'fr-FR',
        converterOptions: {
          //currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
        }
      });

    useEffect(() => {
        axios.post(`${GConf.ApiLink}/facture/select`, {
            tag: GConf.SystemTag,
            fid: fid
          })
          .then(function (response) {
                setArticleL(JSON.parse(response.data[0].Articles))
                setFactData(response.data[0])
                    setTotale((parseFloat(response.data[0].Final_Value)))
          })


    }, [])

    //function
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }


    //card
    const FactureHeader = () =>{
        return(<>
                
                <h2 className='text-center'>Facture Client </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>FACTURE ID : </b> {factureData.FACT_ID}</div>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {fid}</div>
                        <div className='text-secondary'><b>CLIENT: {client} </b> 
                         
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='text-danger'><b>Date : </b> {new Date(factureData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                        <div className='text-secondary'><b>Temps: </b> {factureData.T_Time} </div>
                        <div className='text-secondary'><b>Caisse: </b> {factureData.CA_Name} </div>
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
                            {/* <tr>
                                <th scope="col">Totale hors tax:</th>
                                <th scope="col">{CalculateTVA(factureData.Tota)}</th>
                            </tr>
                            <tr>
                                <th scope="col">TVA: </th>
                                <th scope="col">{(factureData.Tota - CalculateTVA(factureData.Tota)).toFixed(3)}</th>
                            </tr>
                            <tr>
                                <th scope="col">Timbre:</th>
                                <th scope="col">0.600 DT</th>
                            </tr> */}
                            <tr>
                                <th scope="col">Net A Payee TTC:</th>
                                <th scope="col">{(parseFloat(factureData.Final_Value)).toFixed(3)}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>)
    }

    return ( <>
           <div className="container mb-4">
                <FactureHeader />
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Designiation</th>
                        <th scope="col">Qté</th>
                        {/* <th scope="col">PUHT</th>
                        <th scope="col">TVA</th> */}
                        <th scope="col">PUTTC</th>
                        <th scope="col">Prix Net</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData, index) => 
                            <tr key={index}>
                                <th scope="row">{index +1 }</th>
                                <td>{artData.Name}</td>
                                <td>{artData.Qte}</td>
                                {/* <td>{CalculateTVA(artData.Prix)}</td>
                                <td>{GConf.DefaultTva} %</td> */}
                                <td>{artData.Prix.toFixed(3)}</td>
                                <td>{artData.PU}</td>
                            </tr>
                        )}
                        
                        
                    </tbody>
                </table>
                <br />
            <TotaleCard />
            Facture arrêtée au total {toWords.convert(totale)} Dinar et {(parseFloat(totale) % 1).toFixed(3) } millimes 
           <br />
            
           </div>
    </> );
}

export default FactureTemp;