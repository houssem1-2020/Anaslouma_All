import React, { useEffect, useState } from 'react';
import InputLinks from '../Assets/linksData'
import BackCard from '../Assets/backCard'
import { toast } from 'react-toastify';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function StatPage() {
    /*#########################[Const]##################################*/
    let CmdData = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_LocalD`));
    let UID = CmdData.CID;
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));
    let [list, setList] = useState([])
    const [PieData, setPieData]= useState([{ name:'1', value: 6 },{ name:'2', value: 10 }])
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiCommandeLink}/stock`, {
            tag: GConf.SystemTag,
            UID: UID,
          }).then(function (response) {
            setList(response.data)
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment du ancien stock  </div></>, GConf.TostInternetGonf)   
              setList(Offline.stock)
            }
        });

    }, [])

    /*#########################[Functions]##################################*/

    /*#########################[Card]##################################*/
    const Card = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-3'>
               <h5>ouihpuo</h5> 
               <PieChartCard data={PieData} />
            </div>
        </>)
    }
    const PieChartCard =  (props) =>{
        
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        return (
            <PieChart width={300} height={200} >
              <Pie
                data={props.data}
                cx={150}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {PieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          );
    }
    return ( <>
       <BackCard data={InputLinks.backCard.stat}/>
        <br />
        <div className='container-fluid'>
             <div className='row'>
                <div className='col-12'>
                    <div className='card card-body shadow-sm mb-3'>
                        <h5>Totale Commandes</h5> 
                        <PieChartCard data={PieData} />
                    </div>
                </div>
             </div>
        </div>
    </> );
}

export default StatPage;