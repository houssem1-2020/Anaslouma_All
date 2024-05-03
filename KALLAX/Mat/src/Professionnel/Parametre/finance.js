import React from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';


function FinanceSetting() {
    return ( <>
        <BackCard data={InputLinks.backCard.pf}/>
        <br />
        <div className='container-fluid'>
        </div>
    </> );
}

export default FinanceSetting;