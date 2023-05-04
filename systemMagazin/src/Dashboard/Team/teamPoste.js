import axios from 'axios';
import { _ } from 'gridjs-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import TableGrid from '../Assets/tableGrid';

const AddCard = ({teamListe, avanceData , setAvanceData , Ajouter }) =>{
    return<>
    <div className="sticky-top" style={{top:'70px'}}>
        <div className='card card-body shadow-sm border-div mb-2'>
            <h5>Selectioner Membre</h5> 
            <datalist id="teamListe">
                {teamListe.map((team,index) =>
                <option key={index} value={team.T_ID}>{team.T_Name} - {team.Poste}</option>
                )}
            </datalist>
            <Input icon='users' list="teamListe"  onChange={ (e) => setAvanceData({...avanceData, Team_ID:e.target.value})} size="small" iconPosition='left' placeholder={avanceData.Team_ID}  fluid className='mb-1 shadow-sm' /> 
            
            <h5>Montant </h5> 
            <Input icon='asl' type='number' autoFocus={true}    onChange={ (e) => setAvanceData({...avanceData, Valeur:e.target.value})} size="small" iconPosition='left' placeholder='Valeur'  fluid className='mb-1 shadow-sm' />
            <br />
            <Button disabled={false}  className='rounded-pill bg-system-btn' onClick={Ajouter}>  <Icon name='edit outline' /> Ajouter</Button>
        </div>
    </div>
    </>
}

function TeamPoste() {
    /*#########################[Const]##################################*/
    let  [avanceListe, setAvanceListe] = useState([]); 
    let  [teamListe, setTeamList] = useState([]); 
    let  [avanceData, setAvanceData] = useState({Team_ID:'', Valeur:''}); 

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/team/anavce`, {
            PID :  GConf.PID ,
          })
          .then(function (response) {
            let testTable = []
            response.data.map( (getData, index) => testTable.push([
           (index+1),
            getData.T_Name,
            getData.Valeur,
            new Date(getData.AV_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ),
            _(<Button className='rounded-pill bg-danger text-white ' size='mini' onClick={ (e) => alert(getData.PK)}> X </Button>)
            ],))
            setAvanceListe(testTable)
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
        if (!avanceData.Team_ID) { toast.error("Memebre Invalide !", GConf.TostErrorGonf) } 
        else if (!avanceData.Valeur) { toast.error("Valeur Invalide !", GConf.TostErrorGonf) } 
        else {
            console.log('uyg')
            axios.post(`${GConf.ApiLink}/team/anavce/ajoute`, {
                PID :  GConf.PID ,
                avanceD : avanceData
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
    /*#########################[Card]##################################*/
    

    return ( <>
            <BreadCrumb links={GConf.BreadCrumb.TeamPoste} />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-4'><AddCard teamListe={teamListe} avanceData={avanceData} setAvanceData={setAvanceData} Ajouter={Ajouter} /></div>
                    <div className='col-12 col-lg-8'><TableGrid tableData={avanceListe} columns={['*','Nom','Jour', 'Valeur','X']} /></div>
                </div>
            </div>
    </> );
}

export default TeamPoste;