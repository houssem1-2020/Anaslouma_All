import React, {useEffect,useState}  from 'react';
import GConf from '../../AssetsM/generalConf';
import SubNav from '../Assets/subNav';
import { _ } from "gridjs-react";
import axios from 'axios';
import {Fade } from 'react-reveal';
import SKLT from '../../AssetsM/usedSlk'
import TableGrid from '../Assets/tableGrid';
import TableImage from '../Assets/tableImg';
import GoBtn from '../Assets/goBtn';
import { Button , Icon, Label} from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr';

function TeamPage() {
    /*################[Variable]###############*/
    let [clientList, setClientList] = useState([]);  //SKLT.TableSlt
    let navigate = useNavigate();
    let Offline = JSON.parse(localStorage.getItem(`${GConf.PID}_Offline`));
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
    moment().locale('fr')
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
    axios.post(`${GConf.ApiLink}/team`, {
        PID: GConf.PID,
    }).then(function (response) {
        let testTable = []
        response.data.map( (getData) => testTable.push([
        _(<AvatarCard lettre={capitalizeFirstLetter(getData.T_Name)} />),
        getData.T_Name,
        getData.T_Phone,
        getData.T_CIN,
        _(<div className ='badge p-1 bg-info'>{moment(getData.Started_At, "YYYYMMDD").fromNow() }</div>),
        getData.Poste,
        _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/tm/info/${getData.T_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
        ],))
        setClientList(testTable)
    }).catch((error) => {
        if(error.request) {
        toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des ancien Camion  </div></>, GConf.TostInternetGonf)   
        setClientList(Offline.camion)
        }
    });
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

    return ( 
        <>
            <Fade>
                <SubNav dataForNav={GConf.SubNavs.Equipe}/>
                <br />
                <TableGrid tableData={clientList} columns={GConf.TableHead.team} /> 
            </Fade>         
        </>);
}

export default TeamPage;