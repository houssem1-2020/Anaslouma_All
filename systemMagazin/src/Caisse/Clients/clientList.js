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
import { Label } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';

function ClientList() {
    /*################[Variable]###############*/
    const  [clientList, setClientList] = useState([SKLT.STableSlt]); 
    const navigate = useNavigate();
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

    /*################[UseEffect]###############*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/client`,{
            PID: InputLinks.forPID.PID,
        })
        .then(function (response) {
            let testTable = []
            response.data.map( (getData) => testTable.push([
            _(<AvatarCard lettre={capitalizeFirstLetter(getData.CL_Name)} />),
            getData.CL_Name,
            getData.CIN,
            getData.Phone,
            new Date(getData.Creation_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            getData.Adress,
            _(<StateCard status={getData.Genre} />),
            _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/C/L/cl/info/${getData.CL_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
            ],))
            setClientList(testTable)
        })
    }, [])

    /*#########################[Function]##################################*/
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

    const StateCard = ({ status }) => {
        const StateCard = (props) =>{ return <span className={`badge bg-${props.color}`}> {props.text} </span>}
        const statusCard = React.useCallback(() => {
          switch(status) {
            case 'Fidelite': return <StateCard color='primary' text='Fidelite' />;  
            case 'Credit': return <StateCard color='danger' text='Credit' /> ;
            case 'Waitting': return <StateCard color='warning' text='En Attend' /> ;
            default:  return <StateCard color='secondary' text='Indefinie' />;    
          }
        }, [status]);
      
        return (
          <div className="container">
            {statusCard()}
          </div>
        );
    };

    return ( <>
        <div className={`${InputLinks.themeMode == 'dark' ? 'bg-dark-theme-2' : '' }`} style={{height: '100vh', overflow: 'scroll'}}>
            <BackCard data={InputLinks.backCard.clList}/>
            <br />
            <div className='container'>
                <TableGrid dark={true} tableData={clientList} columns={['*','Code','Client','Phone','Cree Le ','Adresse','Genre','Voir']} />
            </div>
        </div>
        </> );
}

export default ClientList