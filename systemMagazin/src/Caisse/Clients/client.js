import React from 'react';
import LinkCard from '../Assets/linksCard'
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import LandingList from '../Assets/landingList';

function ClientsPage() {
    return ( <>
            <BackCard data={InputLinks.backCard.cl} />
            <br />
            <br />
            <br />
            <br />
            <div className='container'>
                    <LandingList list={InputLinks.client} />
            </div>
             
            </> );
}

export default ClientsPage;