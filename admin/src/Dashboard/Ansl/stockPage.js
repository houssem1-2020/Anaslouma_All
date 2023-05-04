import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-reveal';
import SKLT from './../../AssetsM/usedSlk';
import TableGrid from './../Assets/tableGrid';
import TableImage from './../Assets/tableImg';
import GConf from '../../AssetsM/generalConf';
import { toast } from 'react-toastify';
import { Button , Icon} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { _ } from "gridjs-react";

function StockPage(props) {
    /* #########################[Const]########################### */
    let TAG = props.TAG
    let [articleList, setArticleList] = useState([]);
    const NavigateFunction = (link) => { navigate(link) }
    const navigate = useNavigate();
    
    /* #########################[UseEffects]########################### */
     useEffect(() => {
        axios.post(`${GConf.ApiLink}/stock`, {
            tag: TAG,
          })
          .then(function (response) {
                let articleListContainer = []
                response.data.map( (getData) => articleListContainer.push([
                _(<img className='rounded-circle' width="40px" height="40px" src={`https://assets.ansl.tn/Images/Articles/${getData.Photo_Path}`} alt="user-img" />),
                getData.A_Code,
                getData.Name,
                getData.Quantite,
                getData.Prix_achat.toFixed(3),
                getData.Prix_vente.toFixed(3),
                ],))
                setArticleList(articleListContainer) 
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des article dans votre ordinateur </div></>, GConf.TostInternetGonf) 
                setArticleList([])
              }
          });
      }, [])

    /* #########################[Functions]########################### */
    /* #########################[Card]########################### */

    return ( <>
        
            <Fade>
                <div className='container-fluid'>
                    <TableGrid tableData={articleList} columns={['*','Code', 'Nom', 'Stock','P.achat','P.vente']} />
                </div>
            </Fade>
        
    </> );
}

export default StockPage;