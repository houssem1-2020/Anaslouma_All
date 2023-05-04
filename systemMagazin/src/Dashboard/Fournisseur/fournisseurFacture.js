import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { NavLink, useParams } from 'react-router-dom';
import { Button, Form, Icon, Input, TextArea } from 'semantic-ui-react';
import SKLT from '../../AssetsM/usedSlk';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';

function FournisseurFactureInfo() {
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


    //function 
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    
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
            return <Button  className='rounded-pill btn-system p-1 ps-2 pe-2' size='mini'    onClick={(e) => PrintFunction('printFacture')}><Icon name='edit outline' /> Enregistrer </Button>
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

    //card
    const handlePrint = () =>{
        document.getElementById('framed').contentWindow.window.print();
        console.log(FID)
    }
    const handlePrintBL = () =>{
        document.getElementById('framebl').contentWindow.window.print();
        console.log(FID)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div>Totale hors tax: {loading ? CalculateTVA(factureData.Tota) : SKLT.BarreSkl }</div>
                    <div>TVA: {loading ? (factureData.Tota - CalculateTVA(factureData.Tota)).toFixed(3) : SKLT.BarreSkl }</div>
                    <div>Timbre: 0.600 DT</div>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? (parseInt(factureData.Tota) + 0.600).toFixed(3) : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    <div className='col-12'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='edit outline' /> Imprimer</Button>
                    </div>
                    </div>
                </div>
        </>)
    }
    return ( <> 
        <BreadCrumb links={GConf.BreadCrumb.CamionFactureInfo} />
        <br />
        <div className="row">
            <div className="col-12 col-lg-8">
                <h2 className='text-center'>Facture Camion  </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-danger'><b>STE ANASLOUMA DISTRUBUTION</b></div>
                        <div className='text-secondary'><b>VILLE: </b> SIDI BOUROUIS</div>
                        <div className='text-secondary'><b>MATRICULE F : </b> 1670146/D</div>
                        <div className='text-secondary'><b>TEL : </b> 97913068</div>
                        <div className='text-secondary'><b>FAX : </b> 78898081</div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {FID}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {loading ? factureData.C_Name : SKLT.BarreSkl }</div>
                    </div>
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
                        <th scope="col">Corriger</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {loading ?  
                        <>
                        {articleL.map( (artData) => 
                            <tr key={artData.id}>
                                <th scope="row">{artData.id}</th>
                                <td>{artData.Name}<br /><small>{GetNameFromStock(artData.A_Code)}</small></td>
                                <td>{artData.Qte}</td>
                                <td>{parseFloat(artData.Prix).toFixed(3)}<br /> <small>{GetPrixFromStock(artData.A_Code)}   {GetArrow(artData.Prix,GetPrixFromStock(artData.A_Code))}</small></td>
                                <td>{GetColisFromDepotStock(artData.A_Code)}</td>
                                <td>{artData.PU}</td>
                                <td>
                                <Button disabled={artData.Prix <= GetPrixFromStock(artData.A_Code)} className='rounded-pill btn-imprimer mb-1  p-2' size='mini' fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='dropbox' /> Prix </Button>
                                {/* <Button  className='rounded-pill bg-primary text-white p-1' size='mini'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='dollar sign' /> Stock </Button> */}
                                </td>
                            </tr>
                        )}
                        
                        </>
                        : SKLT.FactureList }                        
                        
                    </tbody>
                </table>
            </div>
            <div className="col-12 col-lg-4">
                <Bounce bottom>
                    <div className="sticky-top" style={{top:'70px'}}>
                        <TotaleCard />
                        <BtnsCard />
                    </div>
                </Bounce>
            </div>
        </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/fournisseur/facture/${genre}/${FID}`} />
        {/* <FrameForPrint frameId='printBl' src={`/Pr/bonL/${FID}`} />
        <FrameForPrint frameId='printBs' src={`/Pr/bonS/${FID}`} /> */}
    </> );
}

export default FournisseurFactureInfo;