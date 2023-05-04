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

function FournisseurPage() {
    /*################[Variable]###############*/
    let  [clientList, setClientList] = useState([SKLT.TableSlt]); 
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

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
    axios.post(`${GConf.ApiLink}/fournisseur`, {
        PID : GConf.PID,
      })
      .then(function (response) {
        console.log(response.data)
         let testTable = []
          response.data.map( (getData) => testTable.push([
        _(<AvatarCard lettre={capitalizeFirstLetter(getData.Four_Name)} />),
         getData.Four_Code_Fiscale,
         getData.Four_Name,
         getData.Four_Phone,
         getData.Four_Adress,
         getData.Articles_Genre,
         getData.Jour_Periodique,
         _(<Button className='rounded-pill bg-system-btn' size='mini' onClick={ (e) => NavigateFunction(`/S/fs/info/${getData.Four_ID}`)}><span className='d-none d-lg-inline'> Info </span><Icon  name='angle right' /></Button>)
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
                <SubNav dataForNav={GConf.SubNavs.Fournisseur}/>
                <br />
                <TableGrid tableData={clientList} columns={GConf.TableHead.fournisseur} />
                
            </Fade>         
        </>);
}

export default FournisseurPage;