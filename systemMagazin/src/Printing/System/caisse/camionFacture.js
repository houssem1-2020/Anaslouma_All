import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../../AssetsM/generalConf';

function CamionFactureTemp() {
    let {genre, FID} = useParams()
    let [articleL, setArticleL] = useState([])
    let [stockL, setStockListe] = useState([])
    let [stockDL, setStockDepotListe] = useState([])
    let [factureData, setFactData] = useState([])
    const [loading , setLoading] = useState(false)


    //Use Effects 
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/fournisseur/facture/info`, {
            tag: GConf.SystemTag,
            fid: FID,
            genre: genre
          })
          .then(function (response) {
            console.log(response.data)
                setArticleL(JSON.parse(response.data.data[0].Articles))
                setFactData(response.data.data[0])
                setStockListe(response.data.stock)
                setStockDepotListe(response.data.Depotstock)
                setLoading(true)
                
                
          })
    }, [])


    //Functions 
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseInt(value) * facteur_p).toFixed(3) 
    }
    const GetPrixFromStock = (value) =>{
        const searchObject = stockL.find((article) => article.A_Code == value);
        if (searchObject) {
            return searchObject.Prix_achat.toFixed(3)
            
        }else{
            return 0
        }
    }
    const GetNameFromStock = (value) =>{
        const searchObject = stockL.find((article) => article.A_Code == value);
        if (searchObject) {
            return searchObject.Name
            
        }else{
            return <span className='bg-danger text-danger'>Neauvoux Article</span>
        }
    }
    const GetColisFromDepotStock = (value) =>{
        const searchObject = stockDL.find((article) => article.A_Code == value);
        if (searchObject) {
            return searchObject.Colis
            
        }else{
            return 1
        }
    }
    const GetArrow = (factPrix, myPrix) =>{
        if (factPrix > myPrix) {
            return (<span className='bi bi-caret-up-fill  text-danger'></span>)
        } 
        else if(factPrix < myPrix) {
            return (<span className='bi bi-caret-down-fill  text-success'></span>)
        }
    }

    return ( <>
           <div className="container mb-4">
                <h2 className='text-center'>Facture Fournisseur  </h2> 
                <div className='row'>
                    {/* <div className='col-6'>
                        <div className='text-danger'><b>STE ANASLOUMA DISTRUBUTION</b></div>
                        <div className='text-secondary'><b>VILLE: </b> SIDI BOUROUIS</div>
                        <div className='text-secondary'><b>MATRICULE F : </b> 1670146/D</div>
                        <div className='text-secondary'><b>TEL : </b> 97913068</div>
                        <div className='text-secondary'><b>FAX : </b> 78898081</div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {fid}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {factureData.C_Name}</div>
                    </div> */}
                </div>
                <br />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Artifcle</th>
                        <th scope="col">Designiation</th>
                        <th scope="col">Qté</th>
                        <th scope="col">Prix</th>
                        <th scope="col">Group</th>
                        <th scope="col">Prix Net</th>
                        <th scope="col">ET</th>
                        </tr>
                    </thead>
                    <tbody>
                         {articleL.map( (artData) => 
                            <tr key={artData.id}>
                            <th scope="row">{artData.id}</th>
                            <td>{artData.Name}<br /><small>{GetNameFromStock(artData.A_Code)}</small></td>
                            <td>{artData.Qte}</td>
                            <td>{parseFloat(artData.Prix).toFixed(3)}<br /> <small>{GetPrixFromStock(artData.A_Code)}   {GetArrow(artData.Prix,GetPrixFromStock(artData.A_Code))}</small></td>
                            <td>{GetColisFromDepotStock(artData.A_Code)}</td>
                            <td>{artData.PU}</td>
                            <td>
                                {artData.Prix > GetPrixFromStock(artData.A_Code) ? <span className='bi bi-check-circle-fill bg-danger text-danger'></span> : ''}
                            {/* <Button disabled={artData.Prix <= GetPrixFromStock(artData.A_Code)} className='rounded-pill btn-imprimer mb-1  p-2' size='mini' fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='dropbox' /> Prix </Button> */}
                            {/* <Button  className='rounded-pill bg-primary text-white p-1' size='mini'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='dollar sign' /> Stock </Button> */}
                            </td>
                        </tr>
                        )}
                        
                        
                    </tbody>
                </table>
            </div>
            <div className='card card-body mb-2'>
                <h5>Facture</h5>
                <div>Totale hors tax: </div>
                <div>TVA: </div>
                <div>Timbre: </div>
                <div className='text-danger'><b>Net A Payee TTC: {factureData.Tota}</b></div>
            </div>
           
    </> );
}

export default CamionFactureTemp;