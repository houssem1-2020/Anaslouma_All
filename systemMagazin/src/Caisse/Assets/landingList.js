import React from 'react';
import LinkCard from './linksCard'

function LandingList(props) {
    return ( <>
            <div className='row'>
                    {props.list.map( (links) => <div  key={links.id}  className='col-12 col-md-6 mb-3'><LinkCard data={links} /></div>)}
            </div>
    </> );
}

export default LandingList;