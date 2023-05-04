import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';

function SuivieCamionPage(props) {
    /* #########################[Const]########################### */
    let TAG = props.TAG
    let [cst, setConst] = useState()

    /* #########################[UseEffects]########################### */
    useEffect(() => {
        console.log(TAG)
        axios.post(`${GConf.ApiLink}/anaslouma`, {
            TAG: TAG,
        })
        .then(function (response) {
            console.log(response.data)

        }).catch((error) => {
            if(error.request) {
            
            }
          });

    }, [])

    /* #########################[Functions]########################### */
    /* #########################[Card]########################### */

    return ( <>
        <div className='container-fluid'>
            camion
        </div>
    </> );
}

export default SuivieCamionPage;