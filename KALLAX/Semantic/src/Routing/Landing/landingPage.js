import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon, ModalHeader, Placeholder } from 'semantic-ui-react';
import AvatarGroup from '@atlaskit/avatar-group';
import { Grid, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import 'swiper/css/pagination';
import { Select } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';
import franceMap from '../../AssetsM/franceMap';
import { Modal } from 'semantic-ui-react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import { ReactTyped } from "react-typed";


function LandingPage() {
    /* ############### Const #################*/
    
    const navigate = useNavigate();
    
    const [gouv ,setGouv] = useState('Souuse')
    const [deleg ,setDeleg] = useState('fddfgfd')
    const [defaultSearch, setDefaultSearch] = useState({depart:'', region:''})
    const [delegList ,setDelegList] = useState([])

    const [openD, setOpenD] = useState(false)
    const [selectModal, setOpenMSelect] = useState(false)
    const [selectedTag ,setSelectedTag] = useState('Plombier')

    const [suggestionListe , setSuggestionListe] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
     
    // const proffListe = [
    //     {id:1, color:'#ccdafc', tag:'Plombier',  link:'Plombier', genre:'Plombier', text:'Plombier', imageSrc:'Plombier.gif'},
    //     {id:2, color:'#f8fccc', tag:'Électricien',  link:'Électricien', genre:'Électricien', text:'Électricien', imageSrc:'Électricien.gif'},
    //     {id:3, color:'#e3e3e3', tag:'Serrurier',  link:'Serrurier', genre:'Serrurier', text:'Serrurier', imageSrc:'Serrurier.gif'},
    //     {id:3, color:'#f799ff', tag:'Chauffagiste',  link:'Chauffagiste', genre:'Chauffagiste', text:'Chauffagiste', imageSrc:'Chauffagiste.gif'},
    //     {id:3, color:'#bcf7be', tag:'Vitrier',  link:'Vitrier', genre:'Vitrier', text:'Vitrier', imageSrc:'Vitrier.gif'},
    //     {id:3, color:'#b5bcf7', tag:'Électroménager',  link:'Électroménager', genre:'Électroménager', text:'Électroménager', imageSrc:'Électroménager.gif'},
    //     {id:3, color:'#4fff61', tag:'Jardinier',  link:'Jardinier', genre:'Jardinier', text:'Jardinier', imageSrc:'Jardinier.gif'},
    //     {id:3, color:'#ffe278', tag:'Couvreur',  link:'Couvreur', genre:'Couvreur', text:'Couvreur', imageSrc:'Couvreur.gif'},
    //     {id:3, color:'#deb4fa', tag:'Menuisier',  link:'Menuisier', genre:'Menuisier', text:'Menuisier', imageSrc:'Menuisier.gif'},
    //     {id:3, color:'#fcffbd', tag:'Forgeron',  link:'Forgeron', genre:'Forgeron', text:'Forgeron', imageSrc:'Forgeron.gif'},
    //     {id:3, color:'#f5a87f', tag:'Peinture',  link:'Peinture', genre:'Peinture', text:'Peinture', imageSrc:'Peinture.gif'},
    //     {id:3, color:'#e8e8e8', tag:'Plâtrier',  link:'Plâtrier', genre:'Plâtrier', text:'Plâtrier', imageSrc:'Plâtrier.gif'},
    // ]
    
    /* ############### UseEffect #################*/
    useEffect(() => {
        GetDefaultPosition()
        axios.post(`${GConf.ApiLink}/list/suggestion`, {
            UID: false,
          })
          .then(function (response) {
            setSuggestionListe(response.data)
            setPageLoading(false)
        })

    }, [])

    

    /* ############### Functions #################*/
    const GetDefaultPosition = () =>{
        const SearchIn = (localStorage.getItem('SearchIn') !== null);
        if (SearchIn)  { 
            setDefaultSearch(JSON.parse(localStorage.getItem('SearchIn')))
        } 
        //else { return {Logged:false, UData : {} }}
    
    }
    const SetGouvSelected = (value) =>{
        setDefaultSearch({...defaultSearch, depart: value })
        setGouv(value)
        const found = franceMap.Region.filter(element => element.tag === value)
        setDelegList(found)
        localStorage.setItem('SearchIn', JSON.stringify({depart:value, region:''}))
    }
    const SetDelegSelected = (value) =>{
        setDefaultSearch({...defaultSearch, region: value })
        localStorage.setItem('SearchIn', JSON.stringify({depart:defaultSearch.depart, region:value}))
    }
    const CategorySelected = (selectedCateg, subTagSelected) =>{
        if (!GConf.defaultPos) { toast.error("Selectionnez un Position", GConf.TostErrorGonf)} 
        else {
            navigate(`/List/${selectedCateg}/${subTagSelected}`)
        }
    }
    const CreeUpComptePro = () =>{
        if (!GConf.UserData.UData.UID) { setOpenD(true) } 
        else if (localStorage.getItem('ProffAccount')) { navigate('/Prof/L') }
        else { navigate('/User/ComptePro') }
    }
    const OpenToSelectGenre = (genre) =>{
        setSelectedTag(genre)
        setOpenMSelect(true)
    }
    const GetRandomItems = (totalCount) => {
        const allItems = [];

        for (const category in GConf.profTags) {
            const categoryItems = GConf.profTags[category];
            const shuffled = categoryItems.sort(() => 0.5 - Math.random());
            allItems.push(...shuffled);
        }
    
        const shuffledAllItems = allItems.sort(() => 0.5 - Math.random());
        //console.log(shuffledAllItems.slice(0, totalCount).map(item => item.text));
        return shuffledAllItems.slice(0, totalCount).map(item => item.text);
    }

    

    /* ############### Card #################*/
    const TopCard = () =>{
        return(<>
                <div className='card p-3 shadow-sm text-end system-color rounded-0 fixed-top  border-0' style={{zIndex:999}}>
                    <div className='row'>
                        <div className='col-8 align-self-center text-start'><h2> 
                                <span className="badge bg-white system-color-text rounded-pill"> Kallax-s.fr </span>
                        </h2></div>
                        <div className='col-4 align-self-center' > 
                            {
                                GConf.UserData.UData.UID ? 
                                <NavLink to='User/L'>
                                    <img src='https://assets.ansl.tn/Images/kallax/user.gif' className='img-responsive rounded-circle border' width='30px' height='30px' />
                                </NavLink>
                                :
                                <NavLink to='User'>
                                    <span className='text-white'> Connexion  </span>
                                </NavLink>
                            }
                        </div>
                    </div>    
                </div>
                <div className='mb-0 card-body container d-none' style={{marginTop:'58px'}}>
                        <Swiper
                            spaceBetween={30}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            autoplay={{ delay: 2000 }}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper pb-5 mb-0"
                        >
                                <SwiperSlide key={1}>
                                    <div className='card border-big-div'>
                                        <img src='https://assets.ansl.tn/images/kallax/kallax-bg.gif' className='img-responsive border-big-div' width='100%' height='auto' />
                                    </div>  
                                </SwiperSlide>
                                <SwiperSlide key={2}>
                                    <div className='card border-big-div'>
                                        <img src='https://assets.ansl.tn/images/kallax/kallax-bg-2.gif' className='img-responsive border-big-div' width='100%' height='auto' />
                                    </div> 
                                </SwiperSlide>
                                <SwiperSlide key={3}>
                                    <div className='card border-big-div'>
                                        <img src='https://assets.ansl.tn/images/kallax/kallax-bg-3.gif' className='img-responsive border-big-div' width='100%' height='auto' />
                                    </div> 
                                </SwiperSlide>
                        </Swiper>
                </div>
                <div className='mb-0 card-body container mb-4 h5 fw-bold' style={{marginTop:'62px', color:'#c90634'}}>
                        <span className='bi bi-caret-right-fill'></span>
                        <ReactTyped
                            backSpeed={15}
                            // onBegin={function noRefCheck(){}}
                            // onComplete={function noRefCheck(){}}
                            // onDestroy={function noRefCheck(){}}
                            // onLastStringBackspaced={function noRefCheck(){}}
                            // onReset={function noRefCheck(){}}
                            // onStart={function noRefCheck(){}}
                            // onStop={function noRefCheck(){}}
                            // onStringTyped={function noRefCheck(){}}
                            // onTypingPaused={function noRefCheck(){}}
                            // onTypingResumed={function noRefCheck(){}}
                            strings={GetRandomItems(15)}
                            typeSpeed={40}
                            loop
                           // typedRef={function noRefCheck(){}}
                        /> 
                </div>
            </>)
    }
    const SelectPlaceCard = () =>{
        return(<>
            <div className='card card-body mb-4 shadow-sm border-div'>
                    <h5 className='text-secondary'><span className='bi bi-hand-index me-2'></span> Selectionez une Region de recherche ... : </h5>
                    <div className='row'>
                        <div className='col-12 col-lg-6 mb-3'><Select placeholder='Regions'   fluid options={franceMap.Depart} value={gouv} onChange={(e, { value }) => SetGouvSelected(value)} /></div>
                        <div className='col-12 col-lg-6'><Select placeholder='Departements' fluid  value={deleg} options={delegList} onChange={(e, { value }) => SetDelegSelected(value)} /></div>
                    </div>
                    <br />
                    <div>
                         {(defaultSearch.depart != '' && defaultSearch.region != '') ? <><span className='bi bi-check-circle text-success me-2'></span> <b className='text-secondary'> {defaultSearch.depart} , {defaultSearch.region}</b></> : <><span className='bi bi-x-circle text-danger me-2'></span>  Selectionnez Position </> }
                    </div>
                    
            </div>
        </>)
    }
    const GenreCard = (props) =>{
        const ItemCard = (props) =>{
            return(<>
                    <div className={`col-${props.data.colL} col-lg-4 mb-3 text-center`} onClick={() => OpenToSelectGenre(props.data.tag)} >
                        
                        <div className='card p-1 shadow-sm mb-2 text-center border-div border-0' style={{backgroundColor:props.data.color}} >
                            <div className='d-flex justify-content-center mt-2 mb-2'>
                                <img src={`https://assets.ansl.tn/images/kallax/${props.data.imageSrc}`} className='img-responsive' width='50px' height='50px' />
                            </div>
                            
                        </div>
                        <b className='text-secondary mt-3 mb-0'> {props.data.text} </b>
                    </div>
                    
            </>)
        }
        return(<>
                <div className='row'>
                    {props.list.map( (itemData,index) => <ItemCard key={index} data={itemData} tag={props.tag}/>)}
                </div>
        </>)
    }
    const AdsForProffestionnals = () =>{
        return(<>
        <div className='card card-body shadow-sm border-div mb-4'>
                <h5 className='text-info'>Etes vous un professionnel ? </h5>
                <div className='row'>
                    <div className='col-8 text-secondary'>
                        <p>
                            Inscrivez-vous gratuitement et vous pourrez communiquer avec de nouveaux clients potentiels et bien organiser votre entreprise
                        </p>
                        
                    </div>
                    <div className='col-4'>
                        <img src='https://assets.ansl.tn/images/kallax/sign-up.svg' className='img-responsive border-big-div' width='100%' height='80px' />
                    </div>
                </div>
                <div className='col-12 '>
                    <Button className='rounded-pill mb-2 mt-3' fluid style={{backgroundColor:'#f0b000', color : 'white'}} size='small' onClick={() => CreeUpComptePro()}><span className='bi bi-nut me-2'></span> Créer Un compte Professionnel <span className='bi bi-chevron-double-right ms-3'></span></Button>
                </div>
                
        </div>
        </>)
    }
    const SuggestionCard = () =>{
        const SekeltonCard = () =>{
            const PlaceHolderCard = () =>{
                return(<>
                <Placeholder className='mb-0 border-div' style={{ height: 70, width: '100%' }}>
                    <Placeholder.Image />
                </Placeholder>
                </>)
            }
            return(<>
                <div className='row'>
                    <div className='col-8'><PlaceHolderCard /></div>
                    <div className='col-4'><PlaceHolderCard /></div>
                </div>
            </>)
        }

        const ItemCard = (props) =>{
            return(<>
            <NavLink exact='true' to={`/Article/${props.data.Genre}/${GConf.profTags[props.data.Genre][Math.floor(Math.random() * 10)].value}/${props.data.PID}`}>
                <div className='card p-2 shadow-sm mb-2 border-div'>
                    <div className='row '>
                        <div className='col-2 align-self-center'><img src={`https://assets.ansl.tn/images/kallax/${props.data.Genre}.gif`} className='img-responsive ' width='50px'  height='50px' />   </div>
                        <div className='col align-self-center '>
                            <h5 className='mb-0   text-truncate' style={{maxWidth: '115px'}}><b className='mt-0 mb-0 text-secondary'>{props.data.Social_Name} </b></h5>
                            <div className='mt-0 mb-0 text-secondary   text-truncate' style={{maxWidth: '115px'}}>  {GConf.profTags[props.data.Genre][Math.floor(Math.random() * 10)].text} </div>
                            {/* <div className='mt-0 mb-0 text-secondary   text-truncate' style={{maxWidth: '115px'}}> {props.data.UID ? <span> المفظلة <span className='bi bi-star-fill text-warning'> </span></span>   : `${props.data.Gouv}, ${props.data.Deleg}`} </div> */}
                        </div>
                    </div>
                </div>
            </NavLink>
            </>)
        }
        return(<>
            {pageLoading ? <SekeltonCard />
            :
            
            <Swiper
                slidesPerView= {1.8}
                centeredSlides = {false}
                spaceBetween={10}
                loop={true}
                pagination={false}
                modules={[Pagination]}
                className="mySwiper pb-2 mb-0 "
            >
                {suggestionListe.map( (carouselData,index)=> 
                    <SwiperSlide key={index}> <ItemCard  key={index} data={carouselData} index={index} /></SwiperSlide> 
                 )}
            </Swiper>
            }
        </>)
    }
    const BottomCard = () =>{
        return(<>
                <div className='card card-body shadow-sm' style={{borderRadius:'30px 30px 0 0', backgroundColor:'#6f787d'}}>
                    <div className='row'>
                        <div className="col-lg-6 col-12 text-left align-self-center text-white ">
                            <div className="p-3">
                                <h6><span className="bi bi-telephone-fill"></span> +21697913914, +33 6 56 70 89 08</h6>
                                <h6><span className="bi bi-geo-alt-fill"></span>  5, rue oberlin Schiltigheim 67300</h6>   
                            </div>   
                        </div>
                         
                    </div>
                </div>
            </>)
    }
    const ItemCard = (props) =>{
        return(<>
            <div className='col-12 col-lg-6'>
                {/* <NavLink to={`/Request/${selectedTag}/${props.data.value}`}> */}
                    <div className='card card-body shadow-sm mb-2 mb-0 border-div text-secondary' onClick={() => CategorySelected(selectedTag, props.data.value)}>
                        <div className='row'>
                            <div className='col-10 align-self-center text-center'>
                                <img src={`https://assets.ansl.tn/Images/kallax/${props.data.photo ? `itemes/${props.data.photo}` : `${selectedTag}.gif` }`} className='img-responsive' width='60px' heigth='60px' />
                                <h4 className='text-truncate-' style={{maxWidth: '350px'}}>{props.data.text}</h4>
                            </div>

                            <div className='col-2 align-self-center text-center '> <span className='bi bi-arrow-right-short bi-md'></span> </div>
                            {/* <div className='col-8 align-self-center text-center'><h4 className='text-truncate-' style={{maxWidth: '350px'}}>{props.data.text}</h4></div> */}
                        </div>
                        
                    </div>
                {/* </NavLink> */}
            </div>
        </>)
    }

    return ( <>
            <TopCard />
            
            
            <div className='container'>
                {/* <SelectPlaceCard /> */}
                {/* <button onClick={handleClick}>
                    Cliquez ici pour envoyer une notification
                </button> */}
                <h3 className='text-secondary'><span className='bi bi-ui-checks-grid ms-2 me-3'></span> Categories : </h3> 
                <GenreCard list={GConf.proffListe}   />
                
                <br />
                <AdsForProffestionnals />
                
                <h5 className='text-secondary'><span className='bi bi-star'></span> Les Plus Courant  : </h5>
                {/* <SuggestionCard /> */}
            </div>
            
            <br />
            <BottomCard />
            
            
            <Modal
                onClose={() => setOpenMSelect(false)}
                onOpen={() => setOpenMSelect(true)}
                open={selectModal}
                //dimmer= 'blurring'
                className='fullscreen-modal-gouv m-0 p-0'  
                >
                <ModalHeader>
                    <div className='row mb-0 '>
                        <div className='col-11 text-start border-end'>
                             Selectionnez Un Service 
                        </div>
                        <div className='col-1 align-self-center text-end'><Button  className='rounded-circle bg-white   text-danger' size='tiny' icon onClick={() => setOpenMSelect(false)}><Icon name='remove' /></Button></div>
                    </div>                     
                    
                </ModalHeader>    
                <Modal.Content  className=' ' >        
                    <div className='row'   style={{zIndex:1000 , height: '100%', overflowY: 'auto'}}>
                        {GConf.profTags[selectedTag].map( (carouselData,index)=> 
                            <ItemCard  key={index} data={carouselData} index={index} /> 
                        )}
                    </div>
                </Modal.Content>
            </Modal>
            <Modal
                onClose={() => setOpenD(false)}
                onOpen={() => setOpenD(true)}
                open={openD}
                dimmer= 'blurring'
                className=' m-0 p-0'  
                >
                    
                <Modal.Content    >        
                        <div className='card-body mb-4'>
                            <div className='text-center'><img src='https://assets.ansl.tn/images/kallax/log-in-please.svg' width='50%' height='90px' /></div>
                            <h4>Pour avoir un compte Professionnel vous devez connecter avec un compte normale tout d'abord ! </h4>
                            <div className='row mt-4'>
                                <div className='col-6 text-start'><Button className='rounded-pill' onClick={() => navigate('/User/logIn')} ><span className='bi bi-box-arrow-in-left'></span> Connexion</Button></div>
                                <div className='col-6 text-end'><Button className='rounded-pill' onClick={() => navigate('/User/SignUp')} ><span className='bi bi-check-circle'></span> S'inscrire</Button></div>
                            </div>
                            
                        </div> 
                </Modal.Content>
            </Modal>
        </> );
}

export default LandingPage;