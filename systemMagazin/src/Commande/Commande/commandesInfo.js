import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Icon } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

function CommandeInfo() {

    /*#########################[Const]##################################*/
    let {CID} = useParams()
    let [articleL, setArticleL] = useState([])
    let [commandeData, setCommandeD] = useState([])
    let [loading , setLoading] = useState(false)
    let [btnState, setBtnState] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Gerant_Offline`));

    /*#########################[UseEffect]##################################*/ 
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/commande/info`, {
            tag: GConf.SystemTag,
            cid: CID
          }).then(function (response) {
                setArticleL(JSON.parse(response.data[0].Articles))
                setCommandeD(response.data[0])
                setLoading(true)  
                if(response.data[0].State != 'W'){setBtnState(true)}   
                 
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de Charger la facture de son source   </div></>, GConf.TostInternetGonf)   
              const FactureTarged = Offline.commandes.find((facture) => facture.CID == CID);
              setLoading(true)
              setArticleL(JSON.parse(FactureTarged.Articles))
              setCommandeD(FactureTarged)
              setBtnState(true)
            }
          });
    }, [])

    
    /*#########################[Functions]##################################*/
    const UpdateState = (stateBtn) =>{
        axios.post(`${GConf.ApiLink}/commande/controle`, {
            tag: GConf.SystemTag,
            cid: CID,
            state: stateBtn
          })
          .then(function (response) {
            setCommandeD({ ...commandeData, State: stateBtn}) 
            setBtnState('disabled')            
          })
    }
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }

    /*#########################[Car]##################################*/
    const StateCard = ({ status }) => {
        const statusCard = React.useCallback(() => {
            switch(status) {
            case 'W': 
                return <div className="badge badge-pill bg-warning "> En Attent </div>;
                
            case 'A': 
                return <div className="badge badge-pill bg-success"> Acepteé </div>;
                
            case 'R': 
                return <div className="badge badge-pill bg-danger"> Refuseé </div>;

            default: 
                return <div className="badge badge-pill bg-secondary">Indefinie</div>;
            
            }
        }, [status]);
        
        return (
            <div className="container">
            {statusCard()}
            </div>
        );
    }
    const CommandeHeader = () =>{
        return(<>
                <h2 className='text-center'>Commande </h2> 
                <div className='row'>
                    <div className='col-6'>
                        <div className='text-secondary'><b>CODE FACTURE : </b> {CID}</div>
                        <div className='text-secondary'><b>CLIENT: </b> {loading ? <NavLink  exact='true' to={`/S/cl/info/${commandeData.C_ID}`}> {commandeData.Client } </NavLink> : SKLT.BarreSkl } </div>
                    </div>
                    <div className='col-6'>
                        <div className='text-secondary'><b>Passé Le  : </b> {loading ?  new Date(commandeData.Date_Passe).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) : SKLT.BarreSkl } </div>
                        <div className='text-secondary'><b>Voulu Le : </b> {loading ? new Date(commandeData.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )  : SKLT.BarreSkl } </div>
                    </div>
                </div>
        </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Nette & Totale </h5>
                    <div>Totale hors tax: {loading ? CalculateTVA(commandeData.Totale) : SKLT.BarreSkl }</div>
                    <div>TVA: {loading ? (commandeData.Totale - CalculateTVA(commandeData.Totale)).toFixed(3) : SKLT.BarreSkl }</div>
                    <div>Timbre: 0.600 DT</div>
                    <div className='text-danger'><b>Net A Payee TTC: {loading ? (parseFloat(commandeData.Totale) + 0.600).toFixed(3) : SKLT.BarreSkl } </b></div>
                </div>
        </>)
    }
    const BtnsCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-2'>
                    <h5>Controle</h5>
                    <div className='row mb-2'>
                    <div className='col-12'>
                            <Button as='a' href={`/C/L/mc/modifier/${CID}`} animated disabled={btnState} className='rounded-pill bg-system-btn'  fluid>
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

    return ( <>
        <BackCard data={InputLinks.backCard.mcInfo}/>
        <br />
        <div className="container">

                    <h2 className='text-end'><StateCard status={commandeData.State} /></h2>
                    <CommandeHeader />
                    <br />
                    <br />
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">No</th>
                                <th scope="col">Des</th>
                                <th scope="col">Qté</th>
                                <th scope="col">PTTC</th>
                                <th scope="col">P.Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ?  
                                <>
                                {articleL.map( (artData) => 
                                    <tr key={artData.id}>
                                        <th scope="row">{artData.id}</th>
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

                    {/* <div className='card card-body shadow-sm mb-2'>
                        <h5>Controle</h5>
                        <div className='row mb-2'>
                            <div className='col-6'>
                                <Button  className={`rounded-pill ${btnState}`}  fluid onClick={ () => UpdateState('R')}><Icon name='edit outline' /> Anuulée</Button>
                            </div>
                            <div className='col-6'>
                                <Button  className={`rounded-pill ${btnState}`} fluid ><Icon name='edit outline' /> Modifier </Button>
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <div className='col-12'>
                                <Button  className='rounded-pill'  fluid onClick={handlePrint}><Icon name='edit outline' /> Imprimer</Button>
                            </div>
                        </div>
                    </div> */}
        </div>
        </> );
}

export default CommandeInfo;