import React ,{useEffect, useState} from 'react';
import { Button, Icon, Input, Loader, Segment } from 'semantic-ui-react';
import GConf from '../AssetsM/generalConf';
import { toast } from 'react-toastify';
import axios from 'axios';

function InputLoginPage() {
    /*#########################[Const]##################################*/
    const [loginD, setLoginD] = useState([])
    const [loaderState, setLS] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`));

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        const inputIsLogged = localStorage.getItem(`Magazin_Caisse_LocalD`);
        if (inputIsLogged) {window.location.href = "/C/L";}
        
    });

    /*#########################[Functions]##################################*/
    const logInSystem = () =>{
        if (!loginD.Log) {toast.error("Entrer Un identifiant !", GConf.TostErrorGonf)}
        else if (!loginD.Pwd) {toast.error("Entrer Le mot DP  !", GConf.TostErrorGonf)}
        else{
            axios.post(`${GConf.ApiCaisseLink}/LogIn`, {
                LoginData : loginD,
            }).then(function (response) {
                console.log(response.data)
                if(response.data.length != 0 ) {
                        toast.success("Connecteé !", GConf.TostSuucessGonf)
                        if (!Offline) {
                            localStorage.setItem(`Magazin_Caisse_Offline`, JSON.stringify({stock: [], pannier: [] , facture: [],  client:[],  factureToSave:[], clientToSave:[], depensesToSave:[]}));
                        }
                        localStorage.setItem(`Magazin_Caisse_LocalD`, JSON.stringify(response.data));
                        indexedDB.databases().then((databases) => {
                            const databaseExists = databases.some((database) => database.name === 'Magazin_Caisse_DB');
                            if (!databaseExists) {
                                const request = indexedDB.open('Magazin_Caisse_DB');
                                request.onupgradeneeded = function(event) {
                                    var objectStore = event.target.result.createObjectStore('Stock', { keyPath: 'PK' });
                                    var objectStore2 = event.target.result.createObjectStore('Factucre', { keyPath: 'PK' });
                                    var objectStore2 = event.target.result.createObjectStore('Clients', { keyPath: 'PK' });
                                };
                                window.location.href = "/C";
                            }else{
                                window.location.href = "/C";
                            }
                        });

                        
                }
                else{
                    toast.error('Ce Camion n\'existe pas ! ', GConf.TostSuucessGonf)
                    
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de se connecter aux systeme </div></>, GConf.TostInternetGonf)   
                  setLS(false)
                }
            });
        } 
    }

    return ( <>
             <div className='container d-flex align-items-center justify-content-center' style={{paddingTop:'100px'}}>
                <div className='col-12 col-lg-5'>
                <Segment padded className='sub-sys-round' style={{borderBottom:`3px solid ${GConf.themeColor}`}}>
                            <h2 className='text-cente'><Icon name='linkify' /> Connexion :</h2>
                            <br />
                            <div className='mb-3'>
                                <Input   icon='user' iconPosition='left' placeholder='Identification' className='shadow-sm w-100' onChange={(e) => setLoginD({...loginD, Log: e.target.value })}/>
                            </div>
                            <div className='mb-3'>
                                <Input  icon='key' iconPosition='left' placeholder='Mot DP' type='password' className='shadow-sm w-100' onChange={(e) => setLoginD({...loginD, Pwd: e.target.value })}/>
                            </div>
                            <div className='mb-3'>
                                <Button onClick={logInSystem}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-100'>Connextion <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                </Segment>
                </div>
            </div>
            
    </> );
}

export default InputLoginPage;