import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Icon, Input, Select,  Loader } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

const AddCard = ({depData, setDepData,reglerBtnState, AddDepense, Genres, loaderState}) =>{
    return(<>
        <div className='card card-body shadow-sm mb-3 '>
            <h5>Ajouter Depenses :  </h5>
            <Select  className='w-100 shadow-sm rounded mb-3' placeholder='selectionner' value={depData.genre} fluid options={Genres} onChange={(e, data) => setDepData({...depData, genre: data.value })} />
            <Input icon='pin' iconPosition='left' className='w-100 shadow-sm rounded mb-3' type='number' placeholder='Valeur' fluid   onChange={(e) => setDepData({...depData, valeur: e.target.value })}/>
            <Button disabled={reglerBtnState} className='rounded-pill bg-system-btn mb-3' fluid onClick={AddDepense}><Icon name='save' /> Ajouter <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
        </div>
    </>)
}

function DepenseRecette() {
    /*#########################[Const]##################################*/
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID;
    let [depList, serDepList] = useState([])
    let [depData, setDepData] = useState([])
    let [reglerBtnState, setSaveBtnState] = useState(false)
    let [loaderState, setLS] = useState(false)
    const [loading , setLoading] = useState(false)
    let [UpdateList, setUPDL] = useState(false)
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_Offline`));
    const Genres = [
        { key: 1, value: 'Bons', text: 'Bons' },
        { key: 2, value: 'monnaie', text: 'صرف '},
        { key: 3, value: 'Essences', text: 'مزوط' },
        { key: 4, value: 'makkes', text: 'مكس'},
        { key: 5, value: 'autres', text: 'Autres' },

      ]

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        //check if stock if fixed 
        axios.post(`${GConf.ApiCamionLink}/rt/depense/list`, {
          tag: GConf.SystemTag,
          camId : camId,
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
            if (!depData.genre) {toast.error("Slectionneé Genre !", GConf.TostErrorGonf)}
            else if (!depData.valeur ) {toast.error("Ajouter Valeur !", GConf.TostErrorGonf)}
            else {
                    setLS(true)
                    setSaveBtnState(true)
                    axios.post(`${GConf.ApiCamionLink}/rt/depense/ajouter`, {
                    tag: GConf.SystemTag,
                    camId : camId,
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
        axios.post(`${GConf.ApiCamionLink}/rt/depense/supprimer`, {
            tag: GConf.SystemTag,
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

    /*#########################[Card]##################################*/
    const DepensesListCard = (props) =>{
        return(<>
                <div className='card p-2 shadow-sm mb-3 rounded-pill'>
                    <div className='row'>
                        <div className='col-6 align-self-center text-center'>
                            <b>{props.data.Depenses}</b>
                        </div>
                        <div className='col-4 align-self-center'>
                            {parseFloat(props.data.Valeur).toFixed(3)}
                        </div>
                        <div className='col-2 align-self-center'>
                            <Button className='bg-danger rounded-circle text-white' icon onClick={(e) => DeleteDepense(props.data.PK)}>
                                <Icon name='trash' />
                            </Button>
                        </div>
                    </div>
                </div>
            </>)
    }
    const TotalCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-3 '>
                Totale : <h1>{CalculeSum()}</h1> 
            </div>
        </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.rtDeps}/>
        <br />
        <div className='container-fluid'>
            <AddCard depData={depData} setDepData={setDepData} reglerBtnState={reglerBtnState} AddDepense={AddDepense} Genres={Genres} loaderState={loaderState} />
            <h5>Depenses :</h5> 
            {loading ?  
                    <>
                        {depList.map((data, index) => <DepensesListCard key={index} data={data} />)}
                    </>
            : SKLT.CardList }

            <br />
            {/* <h5>#####################################</h5> */}
            <TotalCard />
        </div>
        <br />
    </> );
}

export default DepenseRecette;