import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';

function RecettePage() {
    /*#########################[Const]##################################*/
    let CmdData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`));
    let UID = CmdData.CID; 
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    let [list, setList] = useState(0)
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCommandeLink}/recette`, {
            tag: GConf.SystemTag,
            UID: UID,
          }).then(function (response) {
            setList(response.data)
            
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              setList(Offline.stock)
            }
        });

    }, [])

    /*#########################[Functions]##################################*/

    /*#########################[Card]##################################*/
    const Card = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-3'>
                <h1 className='text-center text-danger'>Totale: {list.toFixed(3)}</h1>
            </div>
        </>)
    }

    return ( <>
       <BackCard data={InputLinks.backCard.rt}/>
        <br />
        <div className='container-fluid'>
             <div className='row'>
                <div className='col-12'>
                    <Card />
                </div>
             </div>
        </div>
    </> );
}

export default RecettePage;