import React from 'react';
import LinkCard from '../Assets/linksCard'
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'

function Stock() {
    return ( <>
    <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh'}}>
        <BackCard data={InputLinks.backCard.sk}/>
        <br />
        <br />
        <br />
        <br />
        <div className='container'>
            <div className='row'>
                {InputLinks.stock.map( (links) => <div  key={links.id}  className='col-12 col-md-6 mb-3'><LinkCard data={links} /></div>)}
            </div>
        </div>
    </div>
        </> );
}

export default Stock;