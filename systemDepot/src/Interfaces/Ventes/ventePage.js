import React , { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { _ } from "gridjs-react";
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import TableImage from '../../Dashboard/Assets/tableImg';
import GoBtn from '../../Dashboard/Assets/goBtn';
import { useNavigate} from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function VentePage() {
      /*#########################[Const]##################################*/
      let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
      const camId = camData.Cam_ID; 
      let [venteListe, setVenteListe] = useState([SKLT.STableSlt]); 
      let navigate = useNavigate();

      /*#########################[UseEffect]##################################*/
      useEffect(() => {
         axios.post(`${GConf.ApiCamionLink}/mv/resumer`, {
            tag: GConf.SystemTag,
            camId : camId,
          })
          .then(function (response) {
            let testTable = []
            response.data[0].vente.map( (getData) => testTable.push([
              // _(<TableImage image={getData.Photo_Path} forStock/>),
              getData.A_Code,
              getData.Name,
              getData.Qte,
              _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/vt/list/${getData.A_Code}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
              // _(<GoBtn link={`vt/list/${getData.A_Code}`} />)
            ],))
            setVenteListe(testTable)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setVenteListe([])
            }
        });
      }, [])

    /*#########################[Functions]##################################*/
    const NavigateFunction = (link) => {  navigate(link) }

    return ( <>
            <BackCard data={InputLinks.backCard.vt}/>
            <br />
            <div className='container-fluid'>
                <TableGrid tableData={venteListe} columns={['Code','Name','Qte','Voir']} />
            </div>
         </> );
}

export default VentePage;