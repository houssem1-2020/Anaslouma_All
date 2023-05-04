import React , { useEffect, useState } from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import TableImage from '../../Dashboard/Assets/tableImg';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';
import { useParams } from 'react-router-dom';
import { Input } from 'semantic-ui-react';

function StockList() {
  /*#########################[Const]##################################*/
    let camData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    let Offline = JSON.parse(localStorage.getItem("Magazin_Caisse_Offline"));
    const Cam_ID = camData.Cam_ID;
    const navigate = useNavigate();

    let {genre} = useParams()
    const [tableData, setTableData] = useState([SKLT.STableSlt]); 
    const [selectedItem, setSelectedItem] = useState();
    const [loadingPage, setLoadingPage] = useState(true)
    const [keyBordI, setKeyBoedI] = useState('')
    const [floatOpen, setFloatOpen] = useState(false)
    const [articleNow, setArticleNow] = useState([])

  /*#########################[UseEffect]##################################*/
  useEffect(() => {
    axios.post(`${GConf.ApiLink}/stock/getfamille`, {
      famille: genre,
      })
      .then(function (response) {
        setTableData(response.data)
        setLoadingPage(false)
      }).catch((error) => {
        if(error.request) {
          toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
        setTableData(Offline.stock)
        }
    });
  }, [])

  /*#########################[Functions]##################################*/
  const NavigateFunction = (link) => {  navigate(link) }
  const BtnClicked = (value) =>{
        if (value === 'C') { 
            setKeyBoedI('') 
        } 
        else if (value === '.' ) { 
            //setKeyBoedI(parseFloat(keyBordI)) 
            //alert(parseFloat(keyBordI))
            setFloatOpen(true)
        } 
        else {
            //setKeyBoedI(Number(keyBordI+value)) 
            
            if (floatOpen) {
                setKeyBoedI(prevInput => prevInput + '.' + parseFloat(value))
                setFloatOpen(false)
            } else {
                setKeyBoedI(prevInput => prevInput + parseFloat(value))
            }
        }
  }
  const SaveArticleDansPnnier = (indexId) =>{
    if (articleNow.length == 0) { alert('select ')} 
    else {
          const searchObject = Offline.pannier.find((article) => article.A_Code == articleNow.A_Code);
          if (searchObject) {
              let IndexOfArticle = Offline.pannier.findIndex((article) => article.A_Code == indexId)
              Offline.pannier[IndexOfArticle].Qte = Offline.pannier[IndexOfArticle].Qte + parseInt(keyBordI)
              Offline.pannier[IndexOfArticle].PU = ((Offline.pannier[IndexOfArticle].Qte) * Offline.pannier[IndexOfArticle].Prix ).toFixed(3) 
               
              localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
              toast.info(`${articleNow.Name} Reajouter Avec Quantite : ${keyBordI}`, GConf.TostPannier)
              
              
          } else {
              let arrayToAdd = {id: Offline.pannier.length+1 , A_Code: indexId, Name: articleNow.Name, Prix: articleNow.Prix_vente, Qte: parseInt(keyBordI), PU: articleNow.Prix_vente}
              Offline.pannier.push(arrayToAdd)
            
              localStorage.setItem(`Magazin_Caisse_Offline`,  JSON.stringify(Offline));
              toast.info(`${articleNow.Name}  Ajouter !, La Quantite est : ${keyBordI}`, GConf.TostPannier)
              
            }
    }
    
  }
  const SelectArticle = (indexId) =>{
    setSelectedItem(indexId)
    setArticleNow(tableData[indexId])
  }

  /*############################[Card]#################################*/
  const ArticleCard = (props) =>{
    return(<>
        <div className='col-6'>
            <div className={`card p-2 shadow-sm mb-3 border-div  ${props.index == selectedItem ? 'bg-white text-danger' : InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white' : ''}`} onClick={() => SelectArticle(props.index)} style={{cursor:'pointer'}} >
                <div className='row'>
                    <div className='col-8 align-self-center'>
                       <div className='mb-0'>{props.data.Name}</div>  
                       <small className='mb-0'>{props.data.A_Code}</small>  
                      </div>
                    <div className='col-2 align-self-center'> {props.data.Prix_vente}</div>
                    <div className='col-2 align-self-center'> {props.data.Quantite}</div>
                </div> 
                
            </div>
        </div>
    </>)
  }
  const AddToPannier = () =>{
      return(<>
              <div className={`card card-body shadow-sm mb-2 sticky-top border-div ${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-3 text-white' : '' } `} style={{top:'70px'}}>
                  <Input type='number'   size='massive'  icon='barcode' value={keyBordI}  autoFocus={true} onChange={ (e) => {setKeyBoedI(Number(e.target.value))}}   iconPosition='left' placeholder=' '  fluid className='mb-1' />
                  <ClavierCard />
                  <Button disabled={false} fluid style={{height:'50px'}} className='border-div bg-system-btn' onClick={() => SaveArticleDansPnnier()}>  <Icon name='check' /> Ajouter</Button>
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
              <div className='col-4 p-2'><BtnCard value='1' /></div>
              <div className='col-4 p-2'><BtnCard value='2' /></div>
              <div className='col-4 p-2'><BtnCard value='3' /></div>
              <div className='col-4 p-2'><BtnCard value='4' /></div>
              <div className='col-4 p-2'><BtnCard value='5' /></div>
              <div className='col-4 p-2'><BtnCard value='6' /></div>
              <div className='col-4 p-2'><BtnCard value='7' /></div>
              <div className='col-4 p-2'><BtnCard value='8' /></div>
              <div className='col-4 p-2'><BtnCard value='9' /></div>
              <div className='col-4 p-2'><BtnCard value='0' /></div>
              <div className='col-4 p-2'><BtnCard value='.' bg={floatOpen} /></div>
              <div className='col-4 p-2'><BtnCard value='C' /></div>
          </div>
      </>)
  }

  return ( <>
  <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
      <BackCard data={InputLinks.backCard.skfamilleList}/>
          
          <br />
          <div className='container-fluid'>
              <div className='row'>
                    <div className='col-12 col-lg-9'> 
                    <div className='spesific-commp' style={{height: '85vh', overflow: 'scroll', overflowX:'hidden'}}>
                        <div className='row'>
                              {
                                loadingPage ? 
                                SKLT.CardList
                                :
                                <>
                                  {tableData.map( (data,index) => <ArticleCard key={index} data={data} index={index} />)}
                                </>
                              }     
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-3'> 
                          
                          <AddToPannier />
                    </div>
                    
              </div> 
       </div>
  </div>
  </> );
}

export default StockList;