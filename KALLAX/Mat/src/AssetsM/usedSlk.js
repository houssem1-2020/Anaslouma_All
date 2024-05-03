import React from 'react'
import { Placeholder } from 'semantic-ui-react'

import {  _ } from "gridjs-react";

const ProfileSkl = () =>{
    return ( <>
        <Placeholder className='rounded-circle' style={{ height: 50, width: 50 }}>
          <Placeholder.Image />
        </Placeholder>
    </> )
}
const BarreSkl = () =>{
    return ( <>
        <Placeholder className='w-50'><Placeholder.Line /></Placeholder>
    </> )
}
const BarreDSkl = () =>{
    return ( <>
        <Placeholder className='w-100'>
            <Placeholder.Line />
            <Placeholder.Line />
        </Placeholder>
    </> )
}

const PragraphSkl = () =>{
    return ( <>
        <Placeholder className='w-100'>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
        </Placeholder>
    </> )
}

const FactureList = () =>{
    const Templete = () =>{
        return(<>
            <th scope="col"> <BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
            <th scope="col"><BarreSkl /></th>
        </>)
    }
    return ( <>
        <tr>
            <Templete /> 
        </tr>
        <tr>
            <Templete /> 
        </tr>
        <tr>
            <Templete /> 
        </tr>
    </> )
}

const CardList = () =>{
    const TempleteCard = () =>{
        return(<>
            <Placeholder fluid className='border-div mb-3 w-100' style={{ height: 120}}>
                <Placeholder.Image />
            </Placeholder>
            
        </>)
    }
    return ( <>
        <div className='mb-2 w-100'><TempleteCard /></div>
        <div className='mb-2 w-100'><TempleteCard /></div>
        <div className='mb-2 w-100'><TempleteCard /></div>
        <div className='mb-2 w-100'><TempleteCard /></div>

    </> )
}
const ProfileCard = () =>{
    const TempleteCard = (props) =>{
        return(<>
            <Placeholder fluid className='border-div mb-3 w-100' style={{ height: props.tall ? 500 : 120}}>
                <Placeholder.Image />
            </Placeholder>
            
        </>)
    }
    return ( <>
        <div className='row'>
            <div className='col-12 col-lg-4'><TempleteCard /></div>
            <div className='col-12 col-lg-8'>
                <TempleteCard tall={true} />
                 
            </div>
        </div>
        

    </> )
}
const UserProfileCard = () =>{
    const TempleteCard = (props) =>{
        return(<>
            <Placeholder fluid className='border-div mb-0 w-100' style={{ height: 120}}>
                <Placeholder.Image />
            </Placeholder>
            
        </>)
    }
    return ( <>
        <div className=''>
            <TempleteCard />
            <TempleteCard />
            <TempleteCard />
            <TempleteCard />
        </div>
        

    </> )
}

const SKLT = {
    TableSlt : [_(<ProfileSkl/>), _(<BarreDSkl/>), _(<BarreDSkl/>), _(<BarreDSkl/>), _(<BarreDSkl/>), _(<BarreDSkl/>), _(<BarreDSkl/>)],
    ProfileSkl : <ProfileSkl />,
    BarreSkl : <BarreSkl />,
    BarreDSkl : <BarreDSkl />, 
    PragraphSkl : <PragraphSkl />,
    FactureList: <FactureList />,
    CardList : <CardList />,
    ProfileCard : <ProfileCard />,
    UserProfileCard : <UserProfileCard />
}
export default SKLT