import React from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';

function PhotoesSetting() {
    return ( <>
        <BackCard data={InputLinks.backCard.pph}/>
        <br />
        <div className='container-fluid'>
        </div>
    </> );
}

export default PhotoesSetting;