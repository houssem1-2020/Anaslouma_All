import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import {Grid} from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { _ } from 'gridjs-react';

function StockRepture() {
    /*#########################[Const]##################################*/
     let {RID} = useParams()
     const [responseData, setResponseData] = useState({DemmandeListe:[], FavoriteListe:[], RequestList:[], PaymmentListe:[]})
     const [loading,setLoading] =useState(true)
     const [userData, setUserData] = useState({});
     
    /*#########################[UseEffect]###########################*/
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.post(`${GConf.ApiLink}/User/Landing`, {
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
            //console.log(response.data)
            if (!response.data) {
                  toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
                  setLoading(false)
            } else {
                setResponseData(response.data)
                setLoading(false)
            }
          })
        
    }, [])

    /*#########################[Functions]##################################*/
    const PaymmentFunc2 = () =>{
        axios.post(`${GConf.ApiLink}/User/paymment`, {
            RID : RID,
            UID : GConf.UserData.UData.UID
          })
          .then(function (response) {
              console.log(response.data)
              window.location = response.data.url
          })
    }

     /** */
     const PaymmentFunc = () =>{
        axios.post(`${GConf.ApiLink}/User/paymment/creat-bank-account`, {
            RID : 1456985425

          })
          .then(function (response) {
              console.log(response.data)
              //window.location = response.data.url
          })
    }
    const GenerateTableData = () => {
        let rendredListe = []
        responseData.PaymmentListe.map( (getData) => rendredListe.push([
            getData.Name,
            new Date(getData.Pay_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Pay_Time.slice(0, -3),
            getData.Pay_Ammount,             
            // _(<Button className='rounded-circle bg-danger text-white' icon size='mini' onClick={ (e) => alert(`/S/sk/info/${getData.R_ID}`)}> <Icon  name='expand arrows alternate' /></Button>),
          ],))
          return(rendredListe)
    }
    const CalculatePayValue = () => {
        let totalAmount = 0;
        for (let i = 0; i < responseData.PaymmentListe.length; i++) {
            totalAmount += responseData.PaymmentListe[i].Pay_Ammount;
          }
        return totalAmount 
    }

    /*#########################[Component]##################################*/ 
    
     /* */
     const WalletCard = () =>{
        const PasserPaimmentCard = () => {
            return(<>
                <div className='card card-body mb-2 shadow-sm border-div'>
                    <h5 className='text-secondary mb-2'> votre sold est : </h5>
                        <h1 className='text-center text-secondary mb-2 mt-2'>{CalculatePayValue()} <span className='bi bi-currency-euro'></span></h1>
                </div>

                 
                <br />
                <h5 className='text-info'>Cliquer Sur le bouton pour avoir votre argent  : </h5>
                <ul>
                    <li>l'opération peut prendre quelque heurs  </li>
                    <li>le versement s'effectué une seul fois par jour  </li>
                    <li>Une fois que l'opération est réalisée, il est impossible de l'annuler.  </li>
                </ul>
                <Button className='bg-success text-white' fluid onClick={() => PaymmentFunc() } ><Icon name='payment' />Avoir votre  argent </Button>
                <br />
                <div className=''>
                    <h5 className='text-secondary mb-1'>Liste des operation payeé : </h5>
                    <TableGrid tableData={GenerateTableData()} columns={['Nom','Date', 'Temps', 'Valeur','voir']}  />
                </div>

            </>)
        }
        const FinishPaimmentDataCard = () => {
            return(<>
            Pour terùminer le paimment vous devez avoir un cimpote stripe ou un compte bancaire <br />
            entre l IBAN bancaire !
            </>)
        }
        return(<>
            <div className='card card-body shadow-sm border-div mb-4'>
                {userData.Bank_Account == '' ? <FinishPaimmentDataCard /> : <PasserPaimmentCard /> }
            </div>
        </>)
    }

    return (  <>
        <BackCard data={InputLinks.backCard.pm}/>
        <br />
        <div className='container-fluid'>
            <WalletCard />
        </div>
 
    </>);
}


export default StockRepture;