import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { Segment , Icon, Input, Button, Loader, Dropdown} from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import NG from './notifGenre';
import { toast } from 'react-toastify';

function NotificationPage() {
    /* ###############################  Const ################################*/
    let Today = new Date()
    const [notificationList, setNotifList] = useState([])
    const [loading , setLoading] = useState(false)
    const [lastPage , setLastPage] = useState(20)
    const [saturatedState , setSaturatedS] = useState(false)
    const [notifDate , setNotifDate] = useState(Today.toISOString().split('T')[0])
    const [notifGenre , setNotifGenre] = useState('')
    const [loaderState, setLS] = useState(false)
    const GenreOfNotif =[
        {key: 1, value : 'commandeFacturer', text : 'Facturer commande'},
        {key: 2, value : 'stockSaveArticle', text : 'ajouter article'},
        {key: 3, value : 'stockEditArticle', text : 'modifier article'},
        {key: 4, value : 'stockSaveFamille', text : 'ajouter famille'},
        {key: 5, value : 'stockEditFamille', text : 'modifier famille'},
        {key: 6, value : 'stockSaveBE', text : 'enregistrer Bon de Entre'},
        {key: 7, value : 'stockSaveBS', text : 'enregistrer Bon de Sortie'},
        {key: 8, value : 'factureAjouter', text : 'Ajouter Facture'},
        {key: 9, value : 'factureEdit', text : 'Modifier facture'},
        {key: 10, value : 'camionAjouter', text : 'Ajouter camion'},
        {key: 11, value : 'camionEdit', text : 'modifier camion'},
        {key: 12, value : 'camionFondAjouter', text : 'ajouter fond'},
        {key: 13, value : 'camionFondModifier', text : 'modifier fond '},
        {key: 14, value : 'camionInventaire', text : 'ajouter inventaire'},
        {key: 15, value : 'camionSupprimerArticleZero', text : 'supprimer stock camion zero'},
        {key: 16, value : 'clientAjouter', text : 'ajouter client'},
        {key: 17, value : 'clientEdit', text : 'modifier client'},
    ]

    /* ############################### UseEffect ################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/notifications`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            console.log(response.data)
            setNotifList(response.data)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setNotifList([])
              setLoading(true)
            }
        });
    }, [])

    /* ############################### Functions ################################*/
    const GetNotifByDate = () =>{
        setLoading(false)
        axios.post(`${GConf.ApiLink}/notifications/date`, {
            tag: GConf.SystemTag,
            dateN: notifDate,
        })
        .then(function (response) {
            setNotifList(response.data)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setNotifList([])
              setLoading(true)
            }
        });
    }
    const GetNotifByGenre = (e, { value }) =>{
        setLoading(false)
         axios.post(`${GConf.ApiLink}/notifications/genre`, {
            tag: GConf.SystemTag,
            genre: value,
        })
        .then(function (response) {
            setNotifList(response.data)
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setNotifList([])
              setLoading(true)
            }
        });
    }
    const LoadMore = () =>{
            setLS(true)
            axios.post(`${GConf.ApiLink}/notifications/selected`, {
                tag: GConf.SystemTag,
                start : lastPage
            })
            .then(function (response) {
                setNotifList(response.data)
                console.log(response.data)
                if (response.data.length <= notificationList.length) {
                    setSaturatedS(true)
                    setLastPage(response.data.length)
                    setLS(false)
                }
                else{
                    setLS(false)
                    setLastPage(lastPage + 5)
                }
                
            }).catch((error) => {
                if(error.request) {
                toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
                setLS(false)
                }
            });
    }
    const LoadMoreOld = () =>{
        //const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        //if (bottom) { 
            //console.log('done')
        // }
        console.log('work')
        //console.log(window.innerHeight + window.scrollY)
        //console.log(window.innerHeight - document.body.offsetHeight)
        //if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            //console.log("you're at the bottom of the page");
        //}
    }


    /* ############################### Card ################################*/
    const NotifCard = (props) => {
        return ( <>
                    <div className='card border-div mb-2 p-3'>
                        <div className='row '>
                            <div className='col-1 align-self-center text-center d-none d-lg-block'>
                                <span  className={`bi ${props.icon} bi-md me-2`}></span>  
                            </div>
                            <div className='col-12 col-lg-9 text-left'>
                                <h4><span  className={`bi ${props.titleIcon} me-1`}></span>  {props.title}</h4>
                                <small>{props.descr} </small>
                            </div>
                            <div className='col-12 col-lg-2 d-none d-lg-block align-self-center text-center text-secondary'>    
                                <h6><b><span  className='bi bi-alarm'></span>  {props.time}</b></h6>
                                <h6>{props.date}</h6>
                            </div>
                        </div> 
                    </div>
                </> )
    }

    return (<>
        <div  onScroll={() => LoadMore()}>
            <h5><span className="bi bi-bell-fill"></span> Notification</h5>
            <br />
            <div className='card card-body bg-hover-card  border-div' >
                <h5>Selectioner Une action </h5>
                <div className='row'>
                    <div className='col-12 col-lg-8 align-self-center'>
                    <Dropdown
                            fluid
                            search
                            selection
                            wrapSelection={false}
                            options={GenreOfNotif}
                            placeholder='Selectionnez Genre'
                            className='mb-1 shadow-sm'
                            onChange={GetNotifByGenre}

                        />
                    </div>
                    <div className='col-10 col-lg-3 text-end '><Input size='small' fluid type='date' className='shadow-sm' value={notifDate} onChange={(e) => setNotifDate(e.target.value)}/></div>
                    <div className='col-2 col-lg-1 text-end'><Button size='small'  fluid className=' rounded-pill bg-system-btn' icon onClick={(e) => GetNotifByDate()}>  <Icon name='search' /></Button></div>
                </div>
            </div>
                
            <br />
            
            {loading ?  
                <>
                {
                    notificationList.map( (nData,index) =>
                        <NotifCard key={index} icon={NG[nData.Genre].icon}  title={NG[nData.Genre].title} titleIcon={NG[nData.Genre].titleIcon} descr={nData.Description} date={new Date(nData.N_Date).toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )} time={nData.N_Time}  />
                    )
                }
                </>
                : SKLT.CardList 
            }

            
            <br />
            <div className='card-body mb-3'>
                    <Button fluid size='large' disabled={saturatedState} className='rounded-pill bg-info' onClick={ () => LoadMore()} > <span className='bi bi-print'></span> Charger Plus que {lastPage} colomne <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/> </Button>
            </div>
            <br />
            <br />
        </div>
    </>);
}

export default NotificationPage;