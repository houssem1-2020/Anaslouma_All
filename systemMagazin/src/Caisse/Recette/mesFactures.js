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
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID; 
    let Offline = JSON.parse(localStorage.getItem(`Camion_Offline`));
    const navigate = useNavigate();

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCaisseLink}/rt/factures`, {
          forPID : caisseData.PID,
          caisseId : CaisseID,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([       
            _(<TableImage image='facture.jpg' />),
            getData.T_ID,
            getData.CL_Name,
            new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.T_Time ,
            (getData.Final_Value).toFixed(3),
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/rt/vente/info/${getData.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setFactureList(testTable)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
                let testTable = []
                Offline.facture.map( (getData) => testTable.push([       
                _(<TableImage image='facture.jpg' />),
                getData.F_ID,
                getData.Name,
                new Date(getData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
                getData.Tota,
                _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/mf/info/${getData.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
                ],))
                setFactureList(testTable)
            }
        });
    }, [])

    /*#########################[Function]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }

    return ( <>
            <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
                <BackCard data={InputLinks.backCard.mf}/>
                <br />
                <div className='container'>
                    <TableGrid dark={true} tableData={factureList} columns={['*','ID','Client','Jour','Temps','Totale','Voir']} />
                </div>
            </div>
        </> );
}

export default MesFactures;