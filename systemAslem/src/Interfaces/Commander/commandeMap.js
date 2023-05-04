import React from 'react';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
function CamionCommandesMap() {
    return ( <>
            <BackCard data={InputLinks.backCard.cmap}/>
            <br />
            <div className='container-fluid'>

            </div>
    </> );
}

export default CamionCommandesMap;