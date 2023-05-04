import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

const AddCard = ({teamListe, presenceD , setPresenceData , Ajouter }) =>{
    return<>
    <div className="sticky-top" style={{top:'70px'}}>
        <div className='card card-body shadow-sm border-div mb-2'>
            <h5>Selectioner Membre</h5> 
            <datalist id="teamListe">
                {teamListe.map((team,index) =>
                <option key={index} value={team.T_ID}>{team.T_Name} - {team.Poste}</option>
                )}
            </datalist>
            <Input icon='users' list="teamListe"  onChange={ (e) => setPresenceData({...presenceD, Team_ID:e.target.value})} size="small" iconPosition='left' placeholder={presenceD.Team_ID}  fluid className='mb-1 shadow-sm' /> 
            
            <h5>Montant </h5> 
            <Input icon='asl' type='date'      onChange={ (e) => setPresenceData({...presenceD, PR_Date: e.target.value})} defaultValue={presenceD.PR_Date} size="small" iconPosition='left' placeholder='Valeur'  fluid className='mb-1 shadow-sm' />
            <br />
            <Button disabled={false}  className='rounded-pill bg-system-btn' onClick={Ajouter}>  <Icon name='edit outline' /> Ajouter</Button>
        </div>
    </div>
    </>
}

function TeamDemande() {
    /*#########################[Const]##################################*/
    const Today = new Date()
    let  [presenceListe, setPresenceListe] = useState([]); 
    let  [teamListe, setTeamList] = useState([]); 
    let  [presenceD, setPresenceData] = useState({Team_ID:'', PR_Date: Today.toISOString().split('T')[0]}); 

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/team/presence`, {
            PID :  GConf.PID ,
          })
          .then(function (response) {
            console.log(new Date(response.data[0].PR_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ))
            //new Date(getData.PR_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
            let calendarData = []
            response.data.map( (getData) => calendarData.push( { title: getData.T_Name , date: new Date(getData.PR_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )}))
            setPresenceListe(calendarData)

          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des ancien Camion  </div></>, GConf.TostInternetGonf)   
            }
        });

        axios.post(`${GConf.ApiLink}/team`, {
            PID: GConf.PID,
           }).then(function (response) {
            setTeamList(response.data)
           }).catch((error) => {
                if(error.request) {
                toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des ancien Camion  </div></>, GConf.TostInternetGonf)   
                }
        });

    }, [])

    /*#########################[Functions]##################################*/
      const  Ajouter = () =>{
          if (!presenceD.Team_ID) { toast.error("Memebre Invalide !", GConf.TostErrorGonf) } 
          else if (!presenceD.PR_Date) { toast.error("Valeur Invalide !", GConf.TostErrorGonf) } 
          else {
              axios.post(`${GConf.ApiLink}/team/presence/ajoute`, {
                  PID :  GConf.PID ,
                  presenceD : presenceD
                })
                .then(function (response) {
                  toast.success("Avance Ajouter  !", GConf.TostSuucessGonf)   
                  
              }).catch((error) => {
                  if(error.request) {
                    toast.error(<><div><h5>Probleme de Connextion</h5> Chargemment des ancien Camion  </div></>, GConf.TostInternetGonf)   
                  }
                });
          }
      }
      const GenerateDate = function(str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate.toISOString().split('T')[0];
    }
    /*#########################[Card]##################################*/
    

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.TeamDemande} />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-4'><AddCard teamListe={teamListe} presenceD={presenceD} setPresenceData={setPresenceData} Ajouter={Ajouter} /></div>
                    <div className='col-12 col-lg-8'>
                      <div className='card card-body shadow-sm border-div mb-2'>
                          <FullCalendar 
                              plugins={[ dayGridPlugin ]}
                              initialView="dayGridMonth"
                              locale='fr' 
                              events={presenceListe}
                              height='450px'
                              navLinks ={true}
                          />
                      </div>
                    </div>
                </div>
            </div>
    </> );
}

export default TeamDemande;