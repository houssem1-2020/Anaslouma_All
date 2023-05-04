import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function StatisticPage(props) {
    /* #########################[Const]########################### */
    let TAG = props.TAG
    const [familleList, setFamilleList]= useState([])

    /* #########################[UseEffects]########################### */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/stat-f`, {
            TAG: TAG,
        })
        .then(function (response) {
            setFamilleList(response.data)
        }).catch((error) => {
            if(error.request) {
            
            }
          });

    }, [])

    /* #########################[Functions]########################### */
    const CalculatePourcentage = (a,v) =>{
        let p = (( parseFloat(v) - parseFloat(a) ) /  parseFloat(v) ) * 100
        if(isNaN(p)) {return 0}
        else{
            return(p.toFixed(2))
        }
        
    }
    const PurePieData = (data) =>{

        let clientDis = []
        data.map((datacld) => clientDis.push({ name: datacld.Name, value: datacld.Quantite }))

        return(clientDis)

    }
    /* #########################[Card]########################### */
    const FamilleCard = (props) =>{
        return(<>
            <div className='card card-body shadow-sm mb-3'>
                <h4>{props.data.Genre}</h4>
                <div className='row'>
                    <div className='col-8 col-lg-2 align-self-center order-sm-1'>
                            <PieChartCard data={PurePieData(props.data.articles)} />
                    </div>
                    <div className='col-6 col-lg-4 align-self-center order-3'>
                        <div className='text-danger mb-2'> achat: {props.data.achat}</div>
                        <div className='text-success mb-2'> vente: {props.data.vente}</div>
                    </div>
                    <div className='col-6 col-lg-4 align-self-center order-4'>
                        <div className='text-info mb-2'> Nette: {(props.data.achat - props.data.vente).toFixed(3)}</div>
                        <div className='text-info mb-2'> croissance : {CalculatePourcentage(props.data.achat, props.data.vente)} %</div>
                    </div>
                    <div className='col-4 col-lg-2 align-self-center text-center order-sm-2'>
                        <h1>{props.data.articles.length}</h1>
                        <small>Articles</small> 
                    </div>
                </div> 
            </div>
        </>)
    }
    const PieChartCard =  (props) =>{
        
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        return (
            <PieChart width={100} height={100} >
              <Pie
                data={props.data}
                cx={50}
                cy={50}
                innerRadius={30}
                outerRadius={40}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {props.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          );
    }

    return ( <>
        <div className='container-fluid'>
            {
                familleList.map((data,index) => <FamilleCard key={index} data={data} />)
            }
           <br /> 
           <br /> 
        </div>
    </> );
}

export default StatisticPage;