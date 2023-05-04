import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import axios from 'axios';
import { toast } from 'react-toastify';

function CalendarCommandes() {
    /*#########################[Const]##################################*/
    const [articleEvents , setArticleEvents] = useState([])

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/commande`, {
          PID : GConf.PID,
        })
        .then(function (response) {
            let commandeContainer = []
            //console.log(new Date(response.data[0].Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ))
            response.data.map( (commandeDate) => commandeContainer.push( { title: commandeDate.Client, className:'bg-transpareant border text-dark',  date: new Date(commandeDate.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) }))
            setArticleEvents(commandeContainer)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier l'article  </div></>, GConf.TostInternetGonf)   
              setArticleEvents([])
            }
          });
    }, [])

    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.RequestCalendar} />
        <br />
        <div className='card p-5 border-div mb-4'>
            <FullCalendar 
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                locale='fr' 
                events={articleEvents}
                height='510px'
                //allDaySlot= {false}
                navLinks={true}
                buttonText= {{ today:    'aujourd\'hui', }}
            />
        </div>
        <br />
        <br />
    </> );
}

export default CalendarCommandes;