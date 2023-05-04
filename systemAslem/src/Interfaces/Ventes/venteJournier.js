import React , { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { _ } from "gridjs-react";
import { Button, Icon, Loader } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import {  useParams } from 'react-router-dom';
import GoBtn from '../../Dashboard/Assets/goBtn';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function VenteJournier() {
  /*#########################[Const]##################################*/
    let {code} = useParams()
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID; 
    let [articleVenteListe, setArticleVenteListe] = useState([SKLT.STableSlt]); 
    let navigate = useNavigate();

  /*#########################[UseEffect]##################################*/
  useEffect(() => {
    axios.post(`${GConf.ApiCamionLink}/mv/article`, {
        tag: GConf.SystemTag,
        camId : camId,
        code : code
      })
      .then(function (response) {
        console.log(response.data)
          let testTable = []
          response.data.map( (getData) => testTable.push([
          getData.Name,
          GetQteOfArticle(getData.Articles),
          _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/I/L/mf/info/${getData.F_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setArticleVenteListe(testTable)
      }).catch((error) => {
        if(error.request) {
          toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
          setArticleVenteListe([])
        }
    });
    }, [])

    /*#########################[Function]##################################*/
    const GetQteOfArticle = (list) =>{
      let GettenList = JSON.parse(list)
      const searchObject= GettenList.find((article) => article.A_Code == code);
      return(searchObject.Qte)

    }
    const NavigateFunction = (link) => {  navigate(link) }

    
    return ( <>
        <BackCard data={InputLinks.backCard.vtJour}/>
        <br />
         <div className='container-fluid'>
             <TableGrid tableData={articleVenteListe} columns={['Client','Qte','Voir']} />
         </div>
         </> );
}

export default VenteJournier;