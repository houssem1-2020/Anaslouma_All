import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
//import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios';
import { toast } from 'react-toastify';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

function CalendarFournisseur() {
    /*#########################[Const]##################################*/
    const [fournisseurEvent , setFounisseurEvent] = useState([])
    const now = new Date();
    date.locale(fr)
    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/fournisseur`, {
            PID : GConf.PID,
        })
        .then(function (response) {
            console.log(response.data)
            let commandeContainer = []
            response.data.map( (commandeDate) => commandeContainer.push( { title: commandeDate.Four_Name, className:'bg-transpareant border text-dark',  date: RenderCustomDate(commandeDate.Jour_Periodique)}))
            setFounisseurEvent(commandeContainer)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier l'article  </div></>, GConf.TostInternetGonf)   
              setFounisseurEvent([])
            }
          });
    }, [])

    /*#########################[Function]##################################*/
    const RenderCustomDate = (targetDate) =>{
        let curr = new Date()
        let first = curr.getDate() - curr.getDay() 
        switch (targetDate) {
            case 'lundi': 
                    return new Date(curr.setDate(first + 1)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'mardi': 
                    return new Date(curr.setDate(first + 2)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'mercredi': 
                    return new Date(curr.setDate(first + 3)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'jeudi': 
                    return new Date(curr.setDate(first + 4)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'vendredi': 
                    return new Date(curr.setDate(first + 5)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'samedi': 
                    return new Date(curr.setDate(first + 6)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            case 'dimanche': 
                    return new Date(curr.setDate(first)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
            default:
                    return new Date(curr.setDate(first)).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
                break;
        }

    }
    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.FournisseurCalendar} />
        <br />
        <div className='border-0 border-div mb-4'>
            <FullCalendar 
                plugins={[ dayGridPlugin  ]}
                initialView="dayGridWeek"
                locale='fr' 
                events={fournisseurEvent}
                height='500px'
                allDaySlot= {false}
                navLinks={true}
                buttonText= {{ today:'aujourd\'hui', }}
            />
        </div>
        <br />
        <br />
    </> );
}

export default CalendarFournisseur;