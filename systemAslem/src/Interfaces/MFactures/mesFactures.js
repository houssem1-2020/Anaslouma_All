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
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';

function MesFactures() {
    /*#########################[Const]##################################*/
    let [factureList, setFactureList] = useState([SKLT.STableSlt]);
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const Cam_ID = camData.Cam_ID; 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_Offline`));
    const navigate = useNavigate();

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCamionLink}/mf`, {
          tag: GConf.SystemTag,
          camId: Cam_ID,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([       
            _(<TableImage image='facture.jpg' />),
            getData.F_ID,
            getData.Name,
            new Date(getData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Tota,
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/mf/info/${getData.F_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setFactureList(testTable)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
                let testTable = []
                Offline.facture.map( (getData) => testTable.push([       
                _(<TableImage image='facture.jpg' />),
                getData.F_ID,
                getData.C_Name,
                new Date(getData.Cre_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                getData.Tota,
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/mf/info/${getData.F_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
                ],))
                setFactureList(testTable)
            }
        });
    }, [])

    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }

    return ( <>
        <BackCard data={InputLinks.backCard.mf}/>
        <br />
        <div className='container-fluid'>
            <TableGrid tableData={factureList} columns={['*','ID','Client','Jour','Totale','Voir']} />
        </div>
        </> );
}

export default MesFactures;