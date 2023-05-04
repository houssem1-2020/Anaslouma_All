import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import {Grid, _ } from "gridjs-react";
import { Button, Icon, Input } from 'semantic-ui-react';
import { Select } from 'semantic-ui-react'


function CamionResumer() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    let userData = JSON.parse(localStorage.getItem("UserData"));
    let [camionList, setCamioList] = useState([])
    let [searchD, setSearchD] = useState({start:Today.toISOString().split('T')[0], end:Today.toISOString().split('T')[0]})
    let [articleList, setArticleList] = useState([])

    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/User/Camion/List`, {
            tag: userData.tag,
            genre : userData.genre,

          })
          .then(function (response) {
            let camionListC = []
            response.data.map( (data,index) => camionListC.push({ key: index, value: data.Cam_ID , text: data.Cam_Name }))
            setCamioList(camionListC)
          })
        }, [])

    /*#########################[Functions]##################################*/
    const GetCamVente = (value) =>{
        console.log(value)
        axios.post(`${GConf.ApiLink}/User/Camion/Journier`, {
            tag: userData.tag,
            camId : value,

          })
          .then(function (response) {
            setArticleList(response.data)
          })

        
    }

    /*#########################[Component]##################################*/ 
    const SelectCamion = () =>{
        return(<>
                <div className='card card-body mb-2 shadow-sm'>
                    <h5 className='mb-1'>Selectionnez Le Jour de depart</h5>
                    <Input className='mb-0' icon='calendar alternate' type='date' size="small" iconPosition='left'   fluid className='mb-1' value={searchD.start} onChange={(e) => setSearchD({...searchD, start: e.target.value })}/>
                    <h5 className='mb-1'>Selectionnez Le Jour finale</h5>
                    <Input icon='calendar alternate' type='date' size="small" iconPosition='left'   fluid className='mb-1' value={searchD.end} onChange={(e) => setSearchD({...searchD, end: e.target.value })}/>
                    <h5 className='mb-1'>Selectionnez Un Camion</h5> 
                    <Select placeholder='Selectionner Un Camion' fluid options={camionList} onChange={(e, { value }) => GetCamVente(value)} />
                </div>
                </>)
    }

    const VenteCard = (props) =>{
        return(<>
                <div className='card card-body mb-2 shadow-sm'>
                    <div className='row'>
                        <div className='col-6'>{props.data.Name}</div>
                        <div className='col-2'><b>{props.data.Qte}</b></div>
                        <div className='col-4'>3</div>
                    </div>
                </div>
                </>)
    }
    const TotaleCard = () =>{
        return(<>
                <div className='card card-body mb-2 shadow-sm bg-danger text-white'>
                    <div className='row'>
                        <div className='col-6'>Totale</div>
                        <div className='col-4'>1253.125</div>
                    </div>
                </div>
                </>)
    }
    

    return (  <>
        <BackCard data={InputLinks.backCard.cr}/>
        <br />

        <div className='container-fluid'>
            <SelectCamion />
            <br />
            {articleList.map( (data,index) => <VenteCard key={index} data={data} />)}
            {articleList.length == 0 ? '' : <TotaleCard />}
        </div>
 
    </>);
}


export default CamionResumer;