import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import {  useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Icon } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import FrameForPrint from '../../Dashboard/Assets/frameForPrint';
import usePrintFunction from '../../Dashboard/Assets/Hooks/printFunction';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';


function FactureInfo() {
    /*#########################[Const]##################################*/
    const {FID} = useParams()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const Cam_ID = camData.Cam_ID;
    let [articleL, setArticleL] = useState([])
    let [factureData, setFactData] = useState([])
    let [editState, setEditState] = useState(true)
    let [loading , setLoading] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_Offline`));
    

    
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCamionLink}/mf/select`, {
            tag: GConf.SystemTag,
            fid: FID,
            camId: Cam_ID
          })
          .then(function (response) {
                if(!response.data[0]) {
                    toast.error('Facture Introuvable !', GConf.TostSuucessGonf)
                    setTimeout(() => {  window.location.href = "/I/mf"; }, 2000)
                    
                } else {
                    setArticleL(JSON.parse(response.data[0].Articles))
                    let UsedTableNow = []
                    JSON.parse(response.data[0].Articles).map( (article) => {UsedTableNow.push([article.A_Code, article.Qte ])} )
                    setFactData(response.data[0])
                    setLoading(true)
                    if(response.data[0].Cre_Date){setEditState(false)}
                }
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture de son source   </div></>, GConf.TostInternetGonf)   
              const FactureTarged = Offline.facture.find((facture) => facture.F_ID == FID);
              setLoading(true)
              setArticleL(JSON.parse(FactureTarged.Articles))
              setFactData(FactureTarged)
              setEditState(true)
            }
          });
    }, [])

    /*#########################[Function]##################################*/
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}

    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }

    /*#########################[Card]##################################*/
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div>Totale hors tax: {loading ? CalculateTVA(factureData.Tota) : SKLT.BarreSkl }</div>
                    <div>TVA: {loading ? (factureData.Tota - CalculateTVA(factureData.Tota)).toFixed(3) : SKLT.BarreSkl }</div>
                    <div>Timbre: 0.600 DT</div>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? (parseFloat(factureData.Tota) + 0.600).toFixed(3) : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    <div className='col-12 mb-2'>
                        <Button  className='rounded-pill btn-imprimer'  fluid onClick={(e) => PrintFunction('printFacture')}><Icon name='edit outline' /> Imprimer</Button>
                    </div>
                    <div className='col-12'>
                            <Button as='a' href={`/I/L/mf/modifier/${FID}`} animated disabled={editState} className='rounded-pill bg-system-btn'  fluid>
                                <Button.Content visible><Icon name='edit outline' /> Modifier </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='arrow right' />
                                </Button.Content>
                            </Button>
                    </div>
                    </div>
                </div>
        </>)
    }
    const FactureHeader = () =>{
        return(<>
                <h2 className='text-center'>Facture Client </h2> 
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
                        <div className='text-secondary'><b>CODE FACTURE : </b> {FID}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {loading ? factureData.Name  : SKLT.BarreSkl }</div>
                        <div className='text-secondary'><b>M.F : </b> {factureData.Code_Fiscale}</div>
                    </div>
                </div>
        </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.mfInfo}/>
        <br />
        <br />
        <div className='container-fluid'>
            <FactureHeader />
            <br />
            <br />
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Designiation</th>
                        <th scope="col">Qté</th>
                        <th scope="col">Prix</th>
                        <th scope="col">P. Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ?  
                        <>
                        {articleL.map( (artData, index) => 
                            <tr key={index}>
                                <th scope="row">{index + 1 }</th>
                                <td>{artData.Name}</td>
                                <td>{artData.Qte}</td>
                                <td>{parseFloat(artData.Prix).toFixed(3)}</td>
                                <td>{artData.PU}</td>
                            </tr>
                        )}
                        </>
                        : SKLT.FactureList }
                        
                    </tbody>
                </table>
            </div>
            <br />
            <br />
            <Bounce bottom>
                    <div className="sticky-top" style={{top:'70px'}}>
                        <TotaleCard />
                        <BtnsCard />
                    </div>
            </Bounce>
        </div>
        <FrameForPrint frameId='printFacture' src={`/Pr/CamSys/facture/${FID}`} />
    </> );
}

export default FactureInfo;