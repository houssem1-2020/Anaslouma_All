import React, { useEffect, useState } from 'react';
import LinkCard from '../Assets/linksCard'
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import GConf from '../../AssetsM/generalConf';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import { _ } from "gridjs-react";
import axios from 'axios';
import { Button,  Icon } from 'semantic-ui-react';
import TableImage from '../../Dashboard/Assets/tableImg';
import GoBtn from '../../Dashboard/Assets/goBtn';
import SKLT from '../../AssetsM/usedSlk';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';

function StockFonds() {
    /*#########################[Const]##################################*/ 
    let [fondsList, setFondList] = useState([SKLT.STableSlt]);
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID;
    let navigate = useNavigate();

    /*#########################[UseEffect]##################################*/ 
    useEffect(() => {
        axios.post(`${GConf.ApiCamionLink}/sk/fonds`, {
          tag: GConf.SystemTag,
          camId: camId,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([       
            new Date(getData.Jour).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Totale,
            _(<SDCF state={getData.SCF} />),
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/sk/Fonds/info/${getData.Bon_id}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            // _(<GoBtn link={`Fonds/info/${getData.Bon_id}`} />)
            
            ],))
            setFondList(testTable)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger vos fonds</div></>, GConf.TostInternetGonf) 
              setFondList([])            }
        });
        }, [])

    /*#########################[Card]##################################*/
    const SDCF = (props)=>{
        return(<>
            <div className='text-center'><span className={`bi bi-${props.state == "true" ? 'check-circle-fill text-success': 'x-circle-fill text-danger'}`}></span> </div>
        </>)
        }
    
    /*#########################[Functions]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }

    return ( <>
            <BackCard data={InputLinks.backCard.skFond}/>
            <br />
            <div className='container-fluid'>
                <TableGrid tableData={fondsList} columns={['Jour','Totale','Reglé','Voir']} />
            </div>
        </> );

}

export default StockFonds;