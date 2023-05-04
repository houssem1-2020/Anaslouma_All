import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Icon, Input, Loader, Select } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import TunMap from '../../AssetsM/tunMap';

const InputDatCard = ({deleg , setDeleg , gouv ,  delegList ,  FetchTargetList, loaderState, GetDelegList}) => {
    return(<>
        <div className='card card-body shadow-sm mb-2  border-div'>
            <h5>Entrer Une Location   </h5>
            <div className='p-1 mb-2'>
                <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2 shadow-sm' options={TunMap.Gouv} value={gouv} onChange={(e, { value }) => GetDelegList(value)} />
                <Select placeholder='Selectionnez Gouvernorat ' fluid className='shadow-sm' value={deleg} options={delegList} onChange={(e, { value }) => setDeleg(value)} />
            </div>
            <div className='mt-3'>
                <Button  className='rounded-pill bg-system-btn' onClick={FetchTargetList} fluid><Icon name='search' /> Rechercher <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/> </Button>
            </div>
        </div>
    </>)
}

function RechercheFournisseur() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    const [resultList, setResultList] = useState([])
    const [targetDate, setTargetDate] = useState({start: Today.toISOString().split('T')[0], end: Today.toISOString().split('T')[0]})
    const [loaderState, setLS] = useState(false)
    const [delegList ,setDelegList] = useState([])
    const [gouv ,setGouv] = useState('')
    const [deleg ,setDeleg] = useState('')

    /*#########################[Function ]##################################*/
    const FetchTargetList = () =>{
        setLS(true)
        axios.post(`https://api.abyedh.tn/apiAbyedh/Search/search`, {
            tag: 'storage',
            genre:' ',
            gouv:gouv,
            deleg :deleg
          })
          .then(function (response) {
            setResultList(response.data)
            console.log(response.data)
            setLS(false)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5> Probleme de Connextion   </h5> </div></>, GConf.TostInternetGonf) 
              setResultList([])
              setLS(false)
              }
        });
    }
    const CalculateTVA =  (value) =>{
        const facteur_p = (100 / (GConf.DefaultTva + 100));
        return (parseFloat(value) * facteur_p).toFixed(3) 
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId) }

    const GetDelegList = (value) =>{
        let found = TunMap.Deleg.filter(element => element.tag === value)
        setGouv(value)
        setDelegList([])
        setDelegList(found)
    }
    /*#########################[Card]##################################*/
    const FactureListCard = (props) =>{
        return(<>
                <div className='card shadow-sm p-2 mb-1 rounded-pill ps-4'>
                    <div className='row'>
                        <div className='col-1 align-self-center'>{props.dataF.PK}</div>
                        <div className='col-4 text-start align-self-center'> {props.dataF.Name }</div>
                        {/* <div className='col-2 align-self-center'>{props.dataF.F_ID}</div> */}
                        <div className='col align-self-center'>{props.dataF.Adresse}</div>
                        <div className='col align-self-center'>{props.dataF.Phone}</div>
                    </div>
                </div>
        </>)
    }

    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.FournisseurAdd} />
        <br />
        <div className='row'>
            <div className='col-12 col-lg-4'>
                <div className="mb-4 sticky-top" style={{top:'70px'}}>
                    <InputDatCard  deleg={deleg} gouv={gouv} setDeleg={setDeleg} setGouv={setGouv} delegList={delegList} FetchTargetList={FetchTargetList} loaderState={loaderState} GetDelegList={GetDelegList} />
                </div>
            </div>
            <div className='col-12 col-lg-8'>
                <h5>Listes des Factures</h5>    
                    {resultList.map( (val) => <FactureListCard key={val.F_ID} dataF={val}/>)}
                <br />
                    
            </div>
        </div>
        <FrameForPrint frameId='printResumer' src={`/Pr/Facture/resumer/${targetDate.start}/${targetDate.end}`} />
    </> );
}

export default RechercheFournisseur;