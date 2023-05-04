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
           tag: GConf.SystemTag,
        })
        .then(function (response) {
            RenderToCalendar(response.data)
            //let commandeContainer = []
            //console.log(new Date(response.data[0].Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ))
            //response.data.map( (commandeDate) => commandeContainer.push( { title: commandeDate.Name, date: new Date(commandeDate.Date_Volu).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) }))
            //setArticleEvents(commandeContainer)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier l'article  </div></>, GConf.TostInternetGonf)   
              setArticleEvents([])
            }
          });
    }, [])
    /*#########################[Function]##################################*/
    const RenderToCalendar = (list) =>{
        const groupedData = list.reduce((acc, obj) => {
            const key = obj.Date_Volu;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }, {});
          
          const result = Object.entries(groupedData).map(([key, value]) => {
            return { date: new Date(key).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' ) , title:  value.length  };
          });
          setArticleEvents(result)
          console.log(result)
    }

    const titleFormat = (eventInfo) => {
            return (
              <div className=" p-2">
               <div className='row'>
                    <div className='col-6'>{eventInfo.event.title}</div>
                    {/* <div className='col-6'>{eventInfo.event.title}</div> */}
               </div>
              </div>
            );
          }

    return ( <>
        <BreadCrumb links={GConf.BreadCrumb.RequestCalendar} />
        <br />
        <FullCalendar 
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            locale='fr' 
            eventContent={titleFormat}
            events={articleEvents}
            height='510px'
            //allDaySlot= {false}
        />
        <br />
        <br />
    </> );
}

export default CalendarCommandes;