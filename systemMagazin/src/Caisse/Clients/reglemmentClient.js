import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Popup } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { _ } from 'gridjs-react';
import SKLT from '../../AssetsM/usedSlk';
import { Statistic } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Tab } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { useNavigate} from 'react-router-dom';

function ReglemmentClient() {
    const {CLID} = useParams()
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID;

    const [clientD, setClientD] = useState([])
    const [position, setPosition] = useState([36.17720,9.12337])
    const [commande, setCommande] = useState([])
    const [factures, setFactures] = useState([])
    const [reglemment, setReglemment] = useState([])
    const [clientCredit, setClientCredit] = useState('0.000');
    const [loading , setLoading] = useState(false)
    const [loaderState, setLS] = useState(false)
    const navigate = useNavigate();
    const panes = [
        // {
        //     menuItem: { key: 'commande', icon: 'calendar alternate', content: 'Commandes' }, 
        //     render: () =><TableGrid tableData={commande} columns={GConf.TableHead.clientCommande} />,
        // },
        {
            menuItem: { key: 'home', icon: 'home', content: 'Factures' ,className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'bg-ligth-theme-1' } ` }, 
            render: () => <><TableGrid tableData={factures} columns={GConf.TableHead.clientFacture} /><br /></>,
        },
        {
            menuItem: { key: 'reglemment', icon: 'money bill alternate', content: 'Reglemment', className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'bg-ligth-theme-1' } ` }, 
            render: () => <><TableGrid tableData={reglemment} columns={GConf.TableHead.clientReglemment} /><br /></>,
        },
        {
            menuItem: { key: 'saisieR', icon: 'add circle', content: 'Saisie Regl.', className:`p-4 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'bg-ligth-theme-1' } ` }, 
            render: () => <SaisirReglemmentCard /> ,
        },
        // {
        //     menuItem: { key: 'edit', icon: 'edit', content: 'Modifier' }, 
        //     render: () => <><Tab.Pane className='border-div' attached={false}><EditClientCard clientD={clientD} setClientD={setClientD} EditClient={EditClient} delegList={delegList} GetDelegList={GetDelegList}  loaderState={loaderState}/></Tab.Pane><br /></>,
        // },
        
        // {
        //     menuItem: { key: 'delete', icon: 'trash alternate', content: 'Supprimer' }, 
        //     render: () => <><Tab.Pane className='border-div' attached={false}><DeleteClient /></Tab.Pane><br /></>,
        // },
    ]
    /* ############################### UseEffect ################################*/
    useEffect(() => {
        console.log(new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ))
        //client Info
        axios.post(`${GConf.ApiLink}/client/info`, {
            PID : GConf.PID,
            clientId : CLID
        }).then(function (response) {
            if(!response.data[0].PK) {
                toast.error('Client Introuvable !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/cl"; }, 2000)
                
            } else {
                
                setClientD(response.data[0])
                setClientCredit(response.data[0].Credit)

                let factureTable = []
                response.data[0].Facture.map( (getData) => factureTable.push([ getData.T_ID, response.data[0].CL_Name,  new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.T_Time, getData.Final_Value.toFixed(3),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/rt/vente/info/${getData.T_ID}`)}><Icon  name='angle right' /></Button>)
  
                ],))
                setFactures(factureTable)

                let reglemmentTable = []
                response.data[0].Reglemment.map( (getData) => reglemmentTable.push([ getData.R_ID, new Date(getData.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ), getData.Reglemment, getData.Reglemment.toFixed(3),
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/rt/vente/info/${getData.T_ID}`)}><Icon  name='angle right' /></Button>)
                ],))
                setReglemment(reglemmentTable)
                
                setLoading(true)
            }

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les info du client  </div></>, GConf.TostInternetGonf)   
              setClientD([])
              setPosition([0,0])
              setLoading(true)
            }
          });
          //ClientHasTodayFacture()
    }, [])

    /* */
    const NavigateFunction = (link) => {  navigate(link) }
    const SaveReglemment = () =>{
        //client Info
        axios.post(`${GConf.ApiCaisseLink}/client/reglemment`, {
            PID : GConf.PID,
            clientId : CLID,
            totaleRg : clientCredit,
            caisseId : CaisseID
        }).then(function (response) {
            console.log(response.data)

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible d'enregistrer le Reglemment   </div></>, GConf.TostInternetGonf)   
            //   setClientD([])
            //   setPosition([0,0])
            //   setLoading(true)
            }
          });
    }
    const ClientHasTodayFacture = () =>{
        //const searchObject = factures.find((article) => article.A_Code == value);
        let elementToFind = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
        let index = factures.findIndex(subArray => subArray.includes(elementToFind));
        if (index !== -1) {
           return true
        } else {
            return false
        }
    }
    /* ############################### Card ################################*/
    const ClientCard = () =>{
        return (<>
            <div className="sticky-top" style={{top:'70px'}}>
                <div className={`card card-body shadow-sm mb-2 border-div ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-light' : ' ' }`}>
                    <div className="upper">
                        <div className="mcbg main-big-card"></div>
                    </div>
                    <div className="img-card-container text-center">
                        <div className="card-container">
                            <img src="https://system.anaslouma.tn/Assets/images/fourniss.png" className="rounded-circle" width="80" />                    
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                            <h4 className='mt-2'>{loading ? clientD.CL_Name : SKLT.BarreSkl } </h4> 
                            <h6 className="text-secondary">  {loading ? <><span className="bi bi-geo-alt-fill"></span> { clientD.Adress } </>: SKLT.BarreSkl} </h6>
                            {/* <h6 className="text-secondary"> {loading ? <><span className="bi bi-geo-fill"></span> { clientD.Gouv } </>: SKLT.BarreSkl } </h6> */}
                            <Divider horizontal className='text-secondary mt-4'>Credit </Divider>
                            <div className='row text-center'>
                                <div className='col-12'>    
                                    {loading ?  
                                        <Statistic color='red' size='tiny'>
                                            <Statistic.Value>
                                                {clientCredit} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }  
                                    
                                </div>
                            </div>
                            <Divider horizontal className='text-secondary mt-4'>Telephone</Divider>
                            <div className='row text-center'>
                                <div className='col-12 mb-3'> 
                                    {loading ?  
                                        <Statistic color='green' size='tiny'>
                                            <Statistic.Value>
                                                {clientD.Phone} 
                                            </Statistic.Value>
                                        </Statistic>
                                    : SKLT.BarreSkl }   
                                </div>
                                
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }

    const SaisirReglemmentCard = () => {
        return(<>
                <div className={`card card-body border-div shadow-sm ${InputLinks.themeMode == 'dark' ? 'bg-dark text-white' : ' ' }`} >
                    <h3>Saisir tout le reglemment </h3> 
                    <h1 className='mt-1'>{clientCredit}</h1> 
                    <Button disabled={ClientHasTodayFacture() || (clientCredit == 0)} onClick={() => SaveReglemment()} className='rounded-pill bg-success text-white'><Icon name='check circle' /> Regler Toute le credit </Button>
                </div>
            </>)
    }
    return ( <>
        <div  className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : 'bg-ligth-theme-2' }`} style={{height: '100vh', overflow: 'scroll'}}>
                <BackCard data={InputLinks.backCard.clMap}/>
                <br />
                <div className='container'>
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <ClientCard /> 
                        </div>
                        <div className="col-12 col-lg-8 ">
                            <Tab menu={{ secondary: true, pointing: true , className: InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : 'bg-ligth-theme-1' }} panes={panes} />
                        </div>
                </div>
                </div>
        </div>
        </> );
}

export default ReglemmentClient