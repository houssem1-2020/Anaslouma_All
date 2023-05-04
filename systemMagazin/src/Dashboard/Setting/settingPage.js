import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { Link, NavLink } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import CountUp from 'react-countup';
import { Button, Icon, Input,  Loader } from 'semantic-ui-react';
import axios from 'axios';
import SKLT from '../../AssetsM/usedSlk';
import { toast } from 'react-toastify';
import Ripples from 'react-ripples'

function SettingPage() {
    /*###############################[Const]################################# */
    const [loading , setLoading] = useState(false)
    const [confirmed , setConfirmed] = useState(false)
    const [setting , setSetting] = useState([])
    const [activationState , setActivationState] = useState(false)

    /*###############################[UseEffect]############################# */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/parametre`, {
            PID: GConf.PID,
        })
        .then(function (response) { 
            console.log(response.data)
            setConfirmed(response.data.confirmation)
            setActivationState(response.data.activation)
            setSetting(response.data.setting)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setConfirmed([])
              setActivationState([])
              setSetting([])
            }   
        });
    }, [])

    /*###############################[Function]############################## */
    const CalculateResteJour = (date) =>{
        let exDate = new Date(date) 
        let date_1 = new Date(exDate);
        let date_2 = new Date();
        const days = (date_1, date_2) =>{
            let difference = date_1.getTime() - date_2.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        return days(date_1, date_2)
    }
    const setChekingItem = (genre,index) =>{
        console.log(genre)
        console.log(index)
    }
    /*###############################[Card]################################# */
    const GeneralSetting = () =>{
        const ConirmedCard = () =>{
            return(<>
                <div className="row p-2">
                    <div className="col-12 col-lg-3 align-self-center text-center"><span className='bi bi-shield-fill-check bi-lg text-success'></span> </div>
                    <div className="col-12 col-lg-8 text-start">
                        <div className='text-success'><b>Confirmé</b></div> 
                        <p className='abyedh-text'>Votre Compte est Confirmé sur l'aunnaire du abyedh.tn </p>
                    </div>
                </div>
            </>)
        }
        const NonConirmedCard = () =>{
            return(<>
                <div className="row p-2">
                    <div className="col-12 col-lg-2 align-self-center text-center"><span className='bi bi-shield-fill-exclamation bi-lg text-danger'></span> </div>
                    <div className="col-12 col-lg-6 text-start">
                        <div className='text-danger'><b>Non Confirmé</b></div> 
                        <p className='abyedh-text'>Votre Compte n'est Confirmé sur l'aunnaire du abyedh.tn </p>
                    </div>
                    <div className="col-12 col-lg-4 align-self-center text-center">
                        <NavLink exact='true' to='confirmation'>
                            <Button  className='rounded-pill bg-system-btn' size="tiny"  ><Icon name='check' /> Confirmer </Button> 
                        </NavLink>   
                    </div>
                </div>
            </>)
        }
        const Activated = (props) =>{
            return(<>
                    <h5><i className="bi bi-check-circle-fill text-success me-1"></i> Activée </h5>
                    <div>{new Date(props.data.LatsActivation).toLocaleDateString()} <i className="bi bi-arrow-left-right"></i> {new Date(props.data.ExpiredThe).toLocaleDateString()}</div>
            </>)
        }
        const Expired = (props) =>{
            return(<>
                    <h5><i className="bi bi-exclamation-diamond-fill text-danger me-1"></i> Expiré </h5>
                    <div>{new Date(props.data.LatsActivation).toLocaleDateString()} <i className="bi bi-arrow-left-right"></i> {new Date(props.data.ExpiredThe).toLocaleDateString()}</div>
            </>)
        }
        return (<>
                <div className="card card-body shadow-sm mb-3 border-div " style={{backgroundColor:'#dae8f0'}}>
                    <h3 style={{color:GConf.themeColor}}> <span className='bi bi-toggle-on'></span> Activation</h3>
                    
                    <div className="row">
                        <div className="col-12 col-md-6  border-end">
                            {/* {activationState.State == 'Activated' ? <Activated data={activationState} /> : <Expired data={activationState} />} */}
                            {CalculateResteJour(activationState.ExpiredThe) > 0 ? <Activated data={activationState} /> : <Expired data={activationState} />}
                        </div>
                        <div className="col-12 col-md-6 align-self-center text-center">
                            <h1 className="pb-0 mb-0 text-danger"> <CountUp end={CalculateResteJour(activationState.ExpiredThe)} duration={2} /> </h1>
                            <small>Jour</small>
                        </div>
                    </div>
                </div>
                <div className="card card-body shadow-sm mb-3 border-div" style={{backgroundColor:'#e6daf0'}}>
                    <h3 style={{color:GConf.themeColor}}><span className='bi bi-check-circle-fill'></span> Confirmation</h3>
                    {confirmed.Activated == 'YES' ? <ConirmedCard /> : <NonConirmedCard />}
                </div>  
        </>);
    }
    const ProfileSetting = (props) =>{
        let  genre = props.genre
        let  setting = JSON.parse(props.setting)
        const CheckBoxSetting = (props) =>{
            return(<>
            <Ripples className='d-block mb-2 shadow-sm border-div' > 
                <div className="card card-body border-div">
                    <h3 style={{color:GConf.themeColor}}><span className={`bi bi-${props.data.icon}`}></span> {props.data.title}</h3>
                    <div className="row">
                        <div className="col-10 col-lg-11 text-secondary">
                        {props.data.text}
                        </div>
                        <div className="col-2 col-lg-1">
                            <div className="form-check form-switch">
                                <input className="form-check-input form-check-input-lg" type="checkbox" onChange={() => setChekingItem(props.genre,props.index)} checked={props.setting} />
                            </div>
                        </div>
                    </div>
                </div>
                </Ripples>
            </>)
        }
        const InputTextSetting = (props) =>{
            
            return(<>
            <Ripples className='d-block mb-2 shadow-sm border-div' >
                <div className="card card-body  border-div">
                    <h3 style={{color:GConf.themeColor}}><span className={`bi bi-${props.data.icon}`}></span> {props.data.title}</h3>
                    <div className="row">
                        <div className="col-8 col-lg-11 text-secondary align-self-center">
                            {props.data.text}
                        </div>
                        <div className="col-4 col-lg-1 align-self-center tex-end">
                            <h2><Input size="mini" transparent className='text-blod w-75'  defaultValue={props.setting} /></h2>
                        </div>
                    </div>
                </div>
                </Ripples>
            </>)
        }
        return (<>
                {GConf.Setting[genre].items.map( (Sitem,index) => 
                        <>
                        { Sitem.genre == 'C' ?
                        <CheckBoxSetting index={index} setting={setting[index]} data={Sitem} genre={genre}/>
                        :
                        <InputTextSetting index={index} setting={setting[index]} data={Sitem} genre={genre} />
                        }
                        </>
                )}
        </>);
    }
    const SettingItemCard = (props) =>{
        return(<>
                <div className="list-group-item list-group-item-action">
                    <Link to={props.link} className="stretched-link"></Link>
                    <div className="row p-2">
                        <div className="col-11 align-self-center text-left">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                <img src={`https://cdn.abyedh.tn/Images/setting/${props.image}.gif`} className="img-responsive rounded-circle" style={{width:"50px"}}></img>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <b>{props.title}</b>
                                    <br />
                                    <small className="text-secondary">Etat de cabinet, camera, laboratoire ...</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-1 align-self-center"><span className="bi bi-arrow-right-short bi-md"></span></div>
                    </div>
                </div>
        </>)
    }
    return (<>
        <Bounce bottom> 
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-5">
                        <div className='sticky-top' style={{top:'80px'}}>
                            <h5>Paramétre Generale</h5>        
                            {loading ? <GeneralSetting /> : SKLT.CardList  }
                            <br />
                            <img src='https://assets.ansl.tn/Images/usful/setting.svg' width='80%'  height='150px' />
                        </div>
                    </div>
                    <div className="col-12 col-lg-7">
                        <div className="list-group shadow-sm mb-4 border-div">
                            {GConf.Setting.map((sett) => <SettingItemCard key={sett.id} link={sett.link} image={sett.image} title={sett.title} />)}
                        </div>
                        {/*<h5>Profile</h5>
                        {loading ?  <ProfileSetting genre='1' setting={setting.Profile}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Profile<Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />

                        <h5>Commandes</h5>
                        {loading ?  <ProfileSetting genre='2' setting={setting.Commandes}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Commandes <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />

                        <h5>Stock</h5>
                        {loading ?  <ProfileSetting genre='3' setting={setting.Stock}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Stock <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />


                        <h5>Factures</h5>
                        {loading ?  <ProfileSetting genre='4' setting={setting.Factures}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' />Modifier  Paramétre Factures <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />

                        <h5>Camions</h5>
                        {loading ?  <ProfileSetting genre='5' setting={setting.Camions}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Camions <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />

                        <h5>Clients</h5>
                        {loading ?  <ProfileSetting genre='6' setting={setting.Clients}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Clients <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />


                        <h5>Equipe</h5>
                        {loading ?  <ProfileSetting genre='7' setting={setting.Equipe}/> : SKLT.CardList  }
                        <div className='text-end mt-2'><Button size='mini'  className='rounded-pill bg-system-btn'  ><Icon name='save' /> Modifier  Paramétre Equipe <Loader inverted  inline size='tiny' className='ms-2'/></Button></div>
                        <br />
                        <br />*/}
                    </div>
                </div>
        </Bounce>
    </>);
}
 
export default SettingPage;