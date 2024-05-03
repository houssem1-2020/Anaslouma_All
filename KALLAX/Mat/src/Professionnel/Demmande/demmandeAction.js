import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableGrid from '../Assets/tableGrid'
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import GConf from '../../AssetsM/generalConf';
import {Grid, _ } from "gridjs-react";
import { Button, Icon } from 'semantic-ui-react';
import { Select } from 'semantic-ui-react'
import { useParams } from 'react-router-dom';
import SKLT from '../../AssetsM/usedSlk';

function DemmandeAction() {
    //*#########################[Const]##################################*/
    let {RID} = useParams()
    let [camionList, setCamioList] = useState([])
    let [articleList, setArticleList] = useState([])
    let [loading,setLoading] =useState(true)
    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/User/Demmande/info`, {
            RID:RID,

          })
          .then(function (response) {
            setArticleList(response.data[0])
            setLoading(false)
          })
        }, [])

    /*#########################[Functions]##################################*/
    const GetCamVente = (value) =>{
        axios.post(`${GConf.ApiLink}/User/Demmande/info`, {
            RID:RID,

          })
          .then(function (response) {
            console.log('response.data')
            setArticleList(response.data[0])
          })

        
    }

    /*#########################[Component]##################################*/ 
 

    const DemmandeCard = (props) =>{
        return(<>
                <div className='card card-body mb-2 border-div shadow-sm '>
                    <h5 className='text-secondary'><span className='bi bi-grid-3x3-gap'></span> Info du demande : </h5>
                    <div className='text-secondary'><span className='bi bi-wrench-adjustable'></span> Genre : {props.data.reqGenre}</div>
                    <div className='text-secondary'><span className='bi bi-person-circle'></span> Nom : {props.data.Social_Name}</div>
                    <div className='text-secondary'><span className='bi bi-calendar-week'></span> Date : {new Date(props.data.R_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} </div>
                    <div className='text-secondary'><span className='bi bi-clock'></span> Temps : {props.data.R_Time.slice(0, -3)}</div>
                    <div className='text-secondary'><span className='bi bi-geo-alt'></span> Region : {JSON.parse(props.data.Localisation).Gouv}</div>
                    <div className='text-secondary'><span className='bi bi-pin-map'></span> Depart : {JSON.parse(props.data.Localisation).Deleg}</div>
                    <div className='text-secondary'><span className='bi bi-stars'></span> Services : {props.data.Services == '[]' || props.data.Services == "" ? <></> : JSON.parse(props.data.Services).map((data,index) => <li key={index}>{props.data.Name}</li>)}</div>
                </div>
                </>)
    }
    const EditCard = () =>{
        return(<>
                <div className='card card-body mb-2 shadow-sm  border-div'>
                    <h5 className='text-secondary'><span className='bi bi-grid-3x3-gap'></span> Action de demande : </h5>
                    <div className='text-center mb-2'>
                        <Button className='rounded-pill bg-success text-white' fluid onClick={() =>console.log('W')}  disabled={false}  size='large' icon  > <Icon name='check' />   Marquer comme non lu    </Button>
                    </div>
                    <div className='text-center mb-2'>
                        <Button className='rounded-pill bg-success text-white' fluid onClick={() =>console.log('W')}  disabled={false}  size='large' icon  > <Icon name='check' />   Accepter    </Button>
                    </div>y
                    <div className='text-center mb-2'>
                        <Button className='rounded-pill bg-warning text-white' fluid onClick={() =>console.log('W')}  disabled={false}  size='large' icon  > <Icon name='clock' />   Restarder     </Button>
                    </div>
                    <div className='text-center mb-2'>
                        <Button className='rounded-pill bg-danger text-white' fluid onClick={() =>console.log('W')}  disabled={false}  size='large' icon  > <Icon name='times' />   Refuseé    </Button>
                    </div>
                </div>
                </>)
    }
    // const UpdateDemmandeState = (RIDValue,StateToUPD, columToUpdate, valueToUpdate) =>{
    //     axios.post(`${GConf.ApiLink}/User/Demmande/Edit`, {
    //         RID : RIDValue,
    //         updateData : StateToUPD,
    //         suppData : {columToUpdate: columToUpdate, valueToUpdate: valueToUpdate}

    //       })
    //       .then(function (response) {
    //           console.log(response.data)
    //           setOpenD(false)
    //           //window.location = response.data.url
    //       })
    // }

    return (  <>
        <BackCard data={InputLinks.backCard.cv}/>
        <br />

        <div className='container-fluid'>
                {
                    loading ? 
                    
                    SKLT.UserProfileCard
                    :
                    <>
                    <DemmandeCard data={articleList} />
                    <EditCard />
                    </>
            
                }
        </div>
 
    </>);
}


export default DemmandeAction;