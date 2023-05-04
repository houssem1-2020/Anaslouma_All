import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Icon, Input, Select,  Loader, TextArea, Form, Modal } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const AddCard = ({depData, setDepData,reglerBtnState, AddDepense, Genres, setModaT, setModaPS, loaderState}) =>{
    return(<>
        <div className={`card card-body shadow-sm mb-3 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' } `}>
            <h5 className='mb-1'>Ajouter Depenses :  <span onClick={() => setModaT(true)}>[NUM]</span> </h5>
            {/* <Select  className='w-100 shadow-sm rounded mb-3' placeholder='selectionner' value={depData.genre} fluid options={Genres} onChange={(e, data) => setDepData({...depData, genre: data.value })} /> */}
            <Input icon='pin' iconPosition='left' className='w-100 shadow-sm rounded mb-3' type='number' placeholder='Valeur' fluid  value={depData.valeur}  onChange={(e) => setDepData({...depData, valeur: e.target.value })}/>
            <h5 className='mt-1 mb-1'>Description :  <span onClick={() => setModaPS(true)}>[CLAVIER]</span> </h5>
            <Form>
                <TextArea placeholder='Ajouter Notes ici' value={depData.Description} className="mb-2 rounded" rows='2' onChange={(e) => setDepData({...depData, Description: e.target.value })}/>
            </Form>
            <Button disabled={reglerBtnState} className='rounded-pill bg-system-btn mb-3' fluid onClick={AddDepense}><Icon name='save' /> Ajouter <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
        </div>
    </>)
}

function DepenseRecette() {
    /*#########################[Const]##################################*/
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID;
    let [depList, serDepList] = useState([])
    let [depData, setDepData] = useState({valeur : 0, Description:''})
    let [reglerBtnState, setSaveBtnState] = useState(false)
    let [loaderState, setLS] = useState(false)
    const [loading , setLoading] = useState(false)
    
    //clavier
    const [layoutName, setLayoutName] = useState("default");
    const [modalPS, setModaPS] = useState(false)
    const [modalT, setModaT] = useState(false)
    const [floatOpen, setFloatOpen] = useState(false)
    const [keyBordI, setKeyBoedI] = useState(0)

    let [UpdateList, setUPDL] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`Magazin_Caisse_Offline`));
    const Genres = [
        { key: 1, value: 'Bons', text: 'Bons' },
        { key: 2, value: 'monnaie', text: 'صرف '},
        { key: 3, value: 'Essences', text: 'مزوط' },
        { key: 4, value: 'makkes', text: 'مكس'},
        { key: 5, value: 'autres', text: 'Autres' },

    ]
    const [longPress, setLongPress] = useState(false);
    let timeoutId;

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //check if stock if fixed 
        axios.post(`${GConf.ApiCaisseLink}/rt/depense/list`, {
          forPID : caisseData.PID,
          camId : CaisseID,
        })
        .then(function (response) {
            serDepList(response.data)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger les depenses</div></>, GConf.TostInternetGonf) 
              serDepList([])
              setLoading(true)
            }
        });
      }, [UpdateList])

    /*#########################[Function]##################################*/
    const AddDepense = () =>{
            if (!depData.Description ) {toast.error("Ajouter Description !", GConf.TostErrorGonf)}
            // else if (!depData.Description ) {toast.error("Ajouter Description !", GConf.TostErrorGonf)}
            else if (!depData.valeur ) {toast.error("Ajouter Valeur !", GConf.TostErrorGonf)}
            else {
                    setLS(true)
                    setSaveBtnState(true)
                    axios.post(`${GConf.ApiCaisseLink}/rt/depense/ajouter`, {
                    forPID : caisseData.PID,
                    camId : CaisseID,
                    depenseD : depData

                    })
                    .then(function (response) {
                        toast.success("Depense Ajouter !", GConf.TostSuucessGonf)
                        setLS(false)
                        setUPDL(!UpdateList)
                    }).catch((error) => {
                        if(error.request) {
                          toast.error(<><div><h5>Probleme de Connextion</h5> La depense à été enregistrer sur votre appareil</div></>, GConf.TostInternetGonf) 
                          Offline.depensesToSave.push(depData)
                          localStorage.setItem('Offline',  JSON.stringify(Offline));
                          setLS(false)
                        }
                    });     
                } 
    }

    const DeleteDepense = (value) =>{
        axios.post(`${GConf.ApiCaisseLink}/rt/depense/supprimer`, {
            forPID : caisseData.PID,
            depId : value

        }).then(function (response) {
                toast.success("Depense Supprimeé !", GConf.TostSuucessGonf)
                setUPDL(!UpdateList)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de supprimer la depenses</div></>, GConf.TostInternetGonf) 
            }
        });
    }

    const CalculeSum = () =>{
        let tot = 0;
        depList.map( (dep) => {
           tot = tot + dep.Valeur
        })
        return (tot.toFixed(3))
    }
    const BtnClicked = (value) =>{
        if (value === 'C') { 
            setDepData({...depData, valeur: 0 })
        } 
        else if (value === '.' ) { 
            setFloatOpen(true)
        } 
        else {            
            if (floatOpen) {
                setDepData({...depData, valeur: parseFloat(JSON.stringify(depData.valeur) + '.' + value) })
                setFloatOpen(false)
            } else {
                setDepData({...depData, valeur: parseFloat(JSON.stringify(depData.valeur) + value)})
            }
        }
  }
    const handleMouseDown = () => {
        timeoutId = setTimeout(() => {
          setLongPress(true);
        }, 500); // set the time duration for long press
    };
    
    const handleMouseUp = (depID) => {
        clearTimeout(timeoutId);
        if (longPress) {
          setLongPress(false);
          //alert(depID);
          DeleteDepense(depID)
        }
    };

    //Clavier 
    const onKeyPressClavier = button => {    
        if (button === "{shift}" || button === "{lock}") {
            setLayoutName(layoutName === "default" ? "shift" : "default");
        };
    };
    const onChange = input => {
        setDepData({...depData, Description: input })
    };
    

    /*#########################[Card]##################################*/
    const DepensesListCard = (props) =>{
        return(<>
                <div className={`card p-2 shadow-sm mb-3 rounded-pill  ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-1 text-white' : '' }`}>
                    <div className='row'>
                        <div className='col-4 align-self-center '>
                            <span className='ms-3'>{parseFloat(props.data.Valeur).toFixed(3)}</span>
                        </div>
                        <div className='col-6 align-self-center '>
                            <b>{props.data.Description}</b>
                        </div>
                        <div className='col-2 align-self-center text-end'>
                            <Button className='bg-danger rounded-circle text-white' icon onMouseDown={handleMouseDown} onMouseUp={(e) => handleMouseUp(props.data.PK)} >
                                <Icon name='trash' />
                            </Button>
                        </div>
                    </div>
                </div>
            </>)
    }
    const TotalCard = () =>{
        return(<>
            <div className={`card card-body shadow-sm mb-3 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' }`}>
                Totale : <h1>{CalculeSum()}</h1> 
            </div>
        </>)
    }
    const ClavierCard = () =>{
        const BtnCard = (props) =>{
            return(<>
                <Button className={`shadow-sm ${props.bg == true ? 'bg-danger text-white ' : InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white border-dark' : 'bg-white' } border mb-1 border-div `} style={{width:'100%', height:'60px', backgroundColor:'red'}} onClick={(e) => BtnClicked(props.value) } ><h2>{props.value}</h2></Button>
            </>)
        }
        return(<>
            <div className='row '>
                <div className='col-4 p-2'><BtnCard value={1} /></div>
                <div className='col-4 p-2'><BtnCard value={2} /></div>
                <div className='col-4 p-2'><BtnCard value={3} /></div>
                <div className='col-4 p-2'><BtnCard value={4} /></div>
                <div className='col-4 p-2'><BtnCard value={5} /></div>
                <div className='col-4 p-2'><BtnCard value={6} /></div>
                <div className='col-4 p-2'><BtnCard value={7} /></div>
                <div className='col-4 p-2'><BtnCard value={8} /></div>
                <div className='col-4 p-2'><BtnCard value={9} /></div>
                <div className='col-4 p-2'><BtnCard value={0} /></div>
                <div className='col-4 p-2'><BtnCard value='.' bg={floatOpen} /></div>
                <div className='col-4 p-2'><BtnCard value='C' /></div>
            </div>
        </>)
    }
    return ( <>
    <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
            <BackCard data={InputLinks.backCard.rtDeps}/>
            <br />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-4'>
                        {/* <div className={`card p-2 shadow-sm mb-1 ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-4 text-white' : '' } `} >
                             <div className='row'>
                                <div className='col-6' onClick={() => setModaPS(true)} >[CLAVIER]</div>
                                <div className='col-6 text-end' onClick={() => setModaT(true)}>[NUM]</div>
                             </div>
                        </div> */}
                        <AddCard depData={depData} setDepData={setDepData} reglerBtnState={reglerBtnState} AddDepense={AddDepense} Genres={Genres} setModaT={setModaT} setModaPS={setModaPS} loaderState={loaderState} />                
                        {/* <ClavierCard />  */}
                        <TotalCard />
                        
                    </div>
                    <div className='col-12 col-lg-8'>
                        
                        {loading ?  
                                <>
                                    {depList.map((data, index) => <DepensesListCard key={index} data={data} />)}
                                </>
                        : SKLT.CardList }

                        <br />
                    </div>
                    <Modal
                            size='small'
                            open={modalPS}
                            closeIcon
                            dimmer = 'blurring'
                            onClose={() => setModaPS(false)}
                            onOpen={() => setModaPS(true)}
                        >
                            <Modal.Content scrolling>
                                <h5>Description : {depData.Description} </h5>
                                
                                <Keyboard
                                    layoutName={layoutName}
                                    onChange={onChange}
                                    onKeyPress={onKeyPressClavier}
                                />
                            </Modal.Content>
                            <Modal.Actions>
                                        <Button className='rounded-pill' negative onClick={ () => setModaPS(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                            </Modal.Actions>
                    </Modal>
                    <Modal
                            size='mini'
                            open={modalT}
                            closeIcon
                            dimmer = 'blurring'
                            onClose={() => setModaT(false)}
                            onOpen={() => setModaT(true)}
                        >
                            <Modal.Content scrolling>
                                <h5>Valur : {depData.valeur} </h5> 
                                <ClavierCard />  
                            </Modal.Content>
                            <Modal.Actions>
                                        <Button className='rounded-pill' negative onClick={ () => setModaT(false)}> <span className='bi bi-x' ></span> Fermer</Button>
                            </Modal.Actions>
                    </Modal>
                </div>
            </div>
            <br />
    </div>
            
    </> );
}

export default DepenseRecette;