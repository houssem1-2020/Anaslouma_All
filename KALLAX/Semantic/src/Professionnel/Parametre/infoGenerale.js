import React from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

function InfoGeneraleSetting() {
    return ( <>
        <BackCard data={InputLinks.backCard.pig}/>
        <br />
        <div className='container-fluid'>
        </div>
    </> );
}

export default InfoGeneraleSetting;