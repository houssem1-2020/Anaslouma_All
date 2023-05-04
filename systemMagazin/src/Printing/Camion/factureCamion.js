import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import { ToWords } from 'to-words';

function CaisseFactureTemp() {
    let { fid } = useParams()
    let caisseData = JSON.parse(localStorage.getItem(`Magazin_Caisse_LocalD`));
    const CaisseID = caisseData.C_ID;
    let [articleL, setArticleL] = useState([])
    let [factureData, setFactData] = useState([])

    const toWords = new ToWords({
        localeCode: 'fr-FR',
        converterOptions: {
          //currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
        }
      });

    useEffect(() => {
        axios.post(`${GConf.ApiCaisseLink}/mf/select`, {
            tag: GConf.SystemTag,
            caisseId: CaisseID,
            ticketId: fid
          })
          .then(function (response) {
            console.log(response.data)
                setArticleL(JSON.parse(response.data[0].Articles))
                setFactData(response.data[0])
                console.log(response.data)
          }).catch((error) => {
            if(error.request) {
            //   const FactureTarged = Offline.facture.find((facture) => facture.F_ID == fid);
            //   if (FactureTarged) {
            //     setArticleL(JSON.parse(FactureTarged.Articles))
            //     setFactData(FactureTarged)
            //   }
            }
          });
    }, [])

    const FactureHeader = () =>{
        return(<>
             <div className='row mb-2 p-1'>
                {/* <div className='col-2 fw-bold'>N</div> */}
                <div className='col-6 fw-bold'>Des</div>
                <div className='col-2 fw-bold'>| Qté</div>
                {/* <div className='col fw-bold'> </div> */}
                <div className='col-2 fw-bold'>| PU</div>
                {/* <div className='col fw-bold'> </div> */}
                <div className='col-2 fw-bold'>| Pt</div>
            </div>
        </>)
    }

    const ArticleListCard = (props) =>{
        return(<>
            <div className='row mb-0'>
                {/* <div className='col-3'>:{props.index + 1  }::</div>
                <div className='col-12'><b>{props.data.Name}</b></div>
                <div className='col'>{props.data.Qte} </div>
                <div className='col'> x </div>
                <div className='col'>{factureData.Final_Value ? (props.data.Prix).toFixed(3) : '00.000'} </div>
                <div className='col'> = </div>
                <div className='col'>{parseFloat(props.data.PU).toFixed(3)}</div> */}
                <div className='col-6'><b>{props.data.Name}</b></div>
                <div className='col-2'>{props.data.Qte}</div>
                <div className='col-2'>{factureData.Final_Value ? (props.data.Prix).toFixed(3) : '00.000'} </div>
                <div className='col-2'>{parseFloat(props.data.PU).toFixed(3)}</div>
            </div>
            <small>...............................................................................................................................................</small>
        </>)
    }


    return ( <>
           <div className="container mb-4 font-for-print-1">
                <h2 className='text-center'>Facture Client</h2> 
                <div className='row'>
                    <div className='col-12'>
                        <div className='text-danger'><b>FAMILIA MARKET - A </b></div>
                        {/* <div className='text-secondary'><b>SIDI BOUROUIS </b></div> */}
                        <div className='text-secondary'><b>TICKET NO : </b> {fid}</div>
                        ############################################
                    </div>
                    <div className='col-12'>
                        
                        <div className='text-secondary'><b>DATE : </b> {new Date(factureData.T_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}  | <b>TEMPS : </b> {factureData.T_Time} </div>
                        <div className='text-secondary'><b>CLIENT: </b> {factureData.CL_Name} | <b>CAISSE : </b> {factureData.CA_Name} </div>
                    </div>
                </div>
                <br />
 
                <FactureHeader />
                _____________________________________________________________
                <br />
                {articleL.map( (artData,index) =>  <ArticleListCard key={index} data={artData} index={index} /> )}    
            </div>
            <br />
 
            ################
            <div><b>Net A Payee: {factureData.Final_Value ? (factureData.Final_Value).toFixed(3) : '00.000'}</b></div>
            <br />
            <div>Espece: {factureData.Final_Value ? (factureData.Espece).toFixed(3) : '00.000'}</div>
            <div>Rondue: {factureData.Final_Value ? (parseFloat(factureData.Espece) - parseFloat(factureData.Espece)).toFixed(3) : '00.000'}</div>
            ################
            <br /> 
            Facture arrêtée au total {factureData.Final_Value ? toWords.convert(factureData.Final_Value): ''} Dinar et {factureData.Final_Value ? (parseFloat(factureData.Final_Value) % 1).toFixed(3) : ''} millimes 
           
    </> );
}

export default CaisseFactureTemp;