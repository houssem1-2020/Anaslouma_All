import React , { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { _ } from "gridjs-react";
import { Button, Icon, Loader } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';

function ReglemmentStock() {
    /*#########################[Const]##################################*/
    let camData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Camion_LocalD`));
    const camId = camData.Cam_ID;
    let [toFixList, setToFixList] = useState([SKLT.STableSlt]); 
    let [toShowFixList, setToShowFixedList] = useState([SKLT.STableSlt]); 
    let [fixedList, setFixedList] = useState([]); 
    let [reglerBtnState, setSaveBtnState] = useState(false)
    let [loadeingPage, setLoadingPage] = useState(true)
    let [loaderState, setLS] = useState(false)
    let [stockFixer, setStockFixer] = useState(false)

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
      // get araticle List 
        axios.post(`${GConf.ApiCamionLink}/mv/resumer`, {
          tag: GConf.SystemTag,
          camId : camId,
        })
        .then(function (response) {
          //check if stock if fixed 
          if(response.data[0].regler.length == 0) {
            setStockFixer(true)
            setLoadingPage(false)
            //if (response.data[0].regler.Articles) { setFixedList(response.data[0].regler.Articles) }
            
          }else{ setLoadingPage(false) }


          //toFixedTable
          let testTable = []
          response.data[0].vente.map( (getData) => testTable.push([ getData.A_Code, getData.Name, getData.Qte, ],))
          setToFixList(testTable)

          
          //toFixedShowTable
          let tosaveTable = []
          response.data[0].vente.map( (getData) => tosaveTable.push([ getData.A_Code, getData.Name, getData.Qte, GetTargetArticleQte(response.data[0].stock, getData.A_Code), GetTargetArticleRest(response.data[0].stock, getData.A_Code,getData.Qte)]))
          setToShowFixedList(tosaveTable)

        }).catch((error) => {
          if(error.request) {
             toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              
          }
      });

      }, [])

    /*#########################[Function]##################################*/
    const ReglemmentDeStock = () =>{

      setLS(true)
      setSaveBtnState(true)
      axios.post(`${GConf.ApiCamionLink}/sk/reglemment`, {
        tag: GConf.SystemTag,
        camId : camId,
        artList : toFixList
      }).then(function (response) {
        if (response.data.affectedRows) {
          axios.post(`${GConf.ApiCamionLink}/sk/reglemment/enregistrer`, {
            tag: GConf.SystemTag,
            camId : camId,
            artList : toShowFixList,
            jour: new Date().toISOString().split('T')[0]
          })
          .then(function (response) {
            toast.success("STOCK REGLER !", GConf.TostSuucessGonf)
            setLS(false)
          })
        } else {
          toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
          setSaveBtnState(false)
          setLS(false)
        }
        

      })

      
    }
    
    const GetTargetArticleQte = (value,code) =>{
      const searchObject= value.find((article) => article.A_Code == code);
      return searchObject.Qte;
    }

    const GetTargetArticleRest = (value,code,qte) =>{
      const searchObject= value.find((article) => article.A_Code == code);
      return (searchObject.Qte - qte);
    }

    /*#########################[Card]##################################*/
    const ReglerStock = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-2'>
                <h5 className='text-danger mb-4'><span className='bi bi-gear-wide-connected'></span> Cliquer Pour Regler Votre stock </h5>
                <Button disabled={reglerBtnState} className='rounded-pill bg-system-btn mb-3' fluid onClick={ReglemmentDeStock}><Icon name='sliders' /> Régler Le Stock <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
            </div>
        </>)
    }

    const StockIsFixed = () =>{
      return(<>
          <div className='card p-3 shadow-sm mb-2 text-center'>
             <span className='bi bi-patch-check-fill bi-lg text-success mb-3'></span> 
            <h1> STOCK EST FIXER </h1>
            <Button className='rounded-pill btn-imprimer mb-3' fluid ><Icon name='print' /> Imrimer </Button>
          </div>
      </>)
  }
    return ( <>
        <BackCard data={InputLinks.backCard.skList}/>
        <br />
        <div className='container-fluid'>
          {loadeingPage ?  SKLT.OneCardList :
            <>   
              {stockFixer ? 
                <> 
                  <ReglerStock /> 
                  
                </> 
                :
                <>
                  <StockIsFixed />
                </>
              }
            </>
          }    
          <TableGrid tableData={toShowFixList} columns={['Code','Name','vente','Qte','reste']} />
        </div>
        </> );
}


export default ReglemmentStock;