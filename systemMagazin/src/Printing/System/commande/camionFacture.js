import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';
import { ToWords } from 'to-words';
import axios from 'axios';

function CommandeGroupFacture() {
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
                console.log(response.data)
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

    /*########################[Card]########################*/
    const FactureHeader = (props) =>{
        return(<>
                
                <div className="row">
                    <div className="col-4">
                    <div className="text-start"><img src="https://assets.ansl.tn/images/ansl-logo-last.gif" className="img-responsive" width="150px" height='80px'  /></div>
                    </div>
                    <div className="col-4"><center><h2><b>Facture N: {props.factureData.PK}</b></h2></center></div>
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
                        <div className='text-secondary'><b>Date : </b> {new Date(props.factureData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}</div>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {props.factureData.F_ID}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {props.factureData.C_Name}</div>
                        <div className='text-secondary'><b>M.F : </b> {props.factureData.Code_Fiscale}</div>
                        <div className='text-secondary'><b>Chauffeur : </b> {props.factureData.Chauffeur}</div>
                        <div className='text-secondary'><b>Camion : </b> {props.factureData.Fournisseurs}</div>
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
                                <th scope="col">Totale hors tax:</th>
                                <th scope="col">{CalculateTVA(props.Totale)}</th>
                            </tr>
                            <tr>
                                <th scope="col">TVA: </th>
                                <th scope="col">{(props.Totale - CalculateTVA(props.Totale)).toFixed(3)}</th>
                            </tr>
                            <tr>
                                <th scope="col">Timbre:</th>
                                <th scope="col">0.600 DT</th>
                            </tr>
                            <tr>
                                <th scope="col">Net A Payee TTC:</th>
                                <th scope="col">{(parseFloat(props.Totale) + 0.600).toFixed(3)}</th>
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
                    <th scope="col">Designiation</th>
                    <th scope="col">Qté</th>
                    <th scope="col">PUHT</th>
                    <th scope="col">TVA</th>
                    <th scope="col">PUTTC</th>
                    <th scope="col">Prix Net</th>
                    </tr>
                </thead>
                <tbody>
                    {JSON.parse(props.factureData).map( (artData, index) => 
                        <tr key={index}>
                            <th scope="row">{index +1 }</th>
                            <td>{artData.Name}</td>
                            <td>{artData.Qte}</td>
                            <td>{CalculateTVA(artData.Prix)}</td>
                            <td>{GConf.DefaultTva} %</td>
                            <td>{artData.Prix.toFixed(3)}</td>
                            <td>{artData.PU}</td>
                        </tr>
                    )}
                    
                    
                </tbody>
            </table>
        </>)
    }
    const LastReturnedCard = (props) =>{
        return(
            <div className="container mb-4">
                        <FactureHeader factureData={props.factureData} />
                        <br />
                        <br />
                        <ContentCard factureData={props.factureData.Articles} /> 
                        <br />
                        <TotaleCard Totale={props.factureData.Tota}/>
                        Facture arrêtée au total {toWords.convert(parseFloat(props.factureData.Tota) + 0.600)} Dinar et {(parseFloat(parseFloat(props.factureData.Tota) + 0.600) % 1).toFixed(3) } millimes 
                        <br />

            </div>)
    }
    return ( <>
        
        {loadingPage ? 
            <>
                {factureList.map( (data,index) => <><LastReturnedCard key={index} factureData={data} /> <div className='breack-page-here'></div></>)}
            </>  
            : 
            'Esseyer Une Autre fois !' 
        }
    </> );
}

export default CommandeGroupFacture;