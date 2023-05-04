import React, {useEffect,useState}  from 'react';
import TableGrid from '../../Dashboard/Assets/tableGrid';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import { _ } from "gridjs-react";
import axios from 'axios';
import TableImage from '../../Dashboard/Assets/tableImg';
import GoBtn from '../../Dashboard/Assets/goBtn';
import SKLT from '../../AssetsM/usedSlk';
import { Button, Icon, Label } from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';

function ClientList() {
    /*################[Variable]###############*/
    const  [clientList, setClientList] = useState([SKLT.STableSlt]); 
    const colors = [
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
    ]
    const navigate = useNavigate();

    /*################[UseEffect]###############*/
    useEffect(() => {
        axios.get(`${GConf.ApiLink}/client`)
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([
            _(<AvatarCard lettre={capitalizeFirstLetter(getData.Name)} />),
            getData.Name,
            getData.Code_Fiscale,
            getData.Phone,
            getData.Gouv,
            getData.Adress,
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/cl/info/${getData.CL_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setClientList(testTable)
        })
    }, [])

    /*################[Functions]###############*/
    const NavigateFunction = (link) => {  navigate(link) }
    const  capitalizeFirstLetter = (string) =>{
        return (string.charAt(0).toUpperCase() + string.slice(1)).charAt(0);
    }
    /*################[Card]###############*/
    const AvatarCard = (props) =>{
            return(<>
                <Label size='massive' circular color={colors[Math.floor(Math.random() * 10)]} key={1}>
                    <h3>{props.lettre}</h3>
                </Label>
                
            </>)
    }

    return ( <>
        <BackCard data={InputLinks.backCard.clList}/>
        <br />
        <div className='container-fluid'>
             <TableGrid tableData={clientList} columns={['*','Client','Mat.','Tel','Gouv', 'Adresse','Voir']} />
        </div>
        </> );
}

export default ClientList