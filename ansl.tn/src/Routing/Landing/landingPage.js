import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import AvatarGroup from '@atlaskit/avatar-group';

function LandingPage() {
    /* ############### Const #################*/
    const alimentaire = [
        {id:1, col: 4, codeABarre:'619',  link:'TOMATE', genre:'TOMATE', text:'SABRA', img:'sabra.gif',state:'', 
        list: [
            { key: 1, name: 'Comocap', src: 'https://assets.ansl.tn/Images/Socite/compcap.png'},
            { key: 2, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/abida.png'},
            { key: 3, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/jouda.jpg'},
            { key: 4, name: 'Tucal', src: 'https://assets.ansl.tn/Images/Socite/tucal.jpg'},
        ]},

        {id:2, col: 4, codeABarre:'619',  link:'CONFITURE', genre:'Pattes', text:'SMART CHEF', img:'smart-chef.gif',state:'',
        list: [
            { key: 1, name: 'Comocap', src: 'https://assets.ansl.tn/Images/Socite/compcap.png'},
            { key: 2, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/abida.png'},
            { key: 3, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/jouda.jpg'},
            { key: 4, name: 'Tucal', src: 'https://assets.ansl.tn/Images/Socite/tucal.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'HARISSA', genre:'Pattes', text:'ARTISTO', img:'artisto.gif',state:'',
        list: [
            { key: 1, name: 'Comocap', src: 'https://assets.ansl.tn/Images/Socite/compcap.png'},
            { key: 2, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/abida.png'},
            { key: 3, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/jouda.jpg'},
            { key: 4, name: 'Tucal', src: 'https://assets.ansl.tn/Images/Socite/tucal.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'CHOCOLAT', genre:'Pattes', text:'SAIDA', img:'saida.gif',state:'',
        list: [
            { key: 1, name: 'Saiid', src: 'https://assets.ansl.tn/Images/Socite/saiid.png'},
            { key: 2, name: 'Saida', src: 'https://assets.ansl.tn/Images/Socite/artisto.gif'},
            { key: 3, name: 'SmartChef', src: 'https://assets.ansl.tn/Images/Socite/smart-chef.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'BISCUIT', genre:'LAIT', text:'PRESIDENT', img:'president.gif',state:'',
        list: [
            { key: 1, name: 'Iffco', src: 'https://assets.ansl.tn/Images/Socite/iffco.gif'},
            { key: 2, name: 'Saida', src: 'https://assets.ansl.tn/Images/Socite/saida.gif'},
            { key: 3, name: 'LBM', src: 'https://assets.ansl.tn/Images/Socite/lbm.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'PATTES', genre:'Pattes', text:'SMAG', img:'smag.gif',state:'',
        list: [
            { key: 1, name: 'Warda', src: 'https://assets.ansl.tn/Images/Socite/warda.jpg'},
            { key: 2, name: 'sanabel', src: 'https://assets.ansl.tn/Images/Socite/sanabel.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'SARDINE', genre:'Pattes', text:'LAND\'OR', img:'landor.gif',state:'',
        list: [
            { key: 1, name: 'sidiDaoud', src: 'https://assets.ansl.tn/Images/Socite/sidiDaoud.png'},
            { key: 2, name: 'laGoulette', src: 'https://assets.ansl.tn/Images/Socite/laGoulette.jpg'},
            { key: 3, name: 'smag', src: 'https://assets.ansl.tn/Images/Socite/smag.gif'},
            { key: 4, name: 'ThonManar', src: 'https://assets.ansl.tn/Images/Socite/ThonManar.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'LAIT', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'President', src: 'https://assets.ansl.tn/Images/Socite/president.gif'},
            { key: 2, name: 'Landor', src: 'https://assets.ansl.tn/Images/Socite/landor.gif'},
            { key: 3, name: 'dailyPr', src: 'https://assets.ansl.tn/Images/Socite/dailyPr.jpg'},
            { key: 4, name: 'jadida', src: 'https://assets.ansl.tn/Images/Socite/jadida.jpg'},
            { key: 5, name: 'goldina', src: 'https://assets.ansl.tn/Images/Socite/goldina.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'BOISSON', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'coca', src: 'https://assets.ansl.tn/Images/Socite/coca.jpg'},
            { key: 2, name: 'Still', src: 'https://assets.ansl.tn/Images/Socite/still.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'CAFE', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'nebli', src: 'https://assets.ansl.tn/Images/Socite/nebli.png'},
            { key: 2, name: 'goldenCoffe', src: 'https://assets.ansl.tn/Images/Socite/goldenCoffe.png'},
            { key: 3, name: 'MAXwelHs', src: 'https://assets.ansl.tn/Images/Socite/MAXwelHs.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'PREPARATION', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/smart-chef.gif'},
            { key: 2, name: 'Jouda', src: 'https://assets.ansl.tn/Images/Socite/smag.gif'},
            { key: 3, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/vanoise.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'EPICES', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/smaoui.png'},
            { key: 2, name: 'Jouda', src: 'https://assets.ansl.tn/Images/Socite/balsam.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'CHAMIA', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/moulin.jpg'},
            { key: 2, name: 'Jouda', src: 'https://assets.ansl.tn/Images/Socite/papillion.jpg'},
            { key: 3, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/shehrazed.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'MAIS', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'mami garden', src: 'https://assets.ansl.tn/Images/Socite/mamigarden.jpg'},
            { key: 2, name: 'smag', src: 'https://assets.ansl.tn/Images/Socite/smag.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'SMARTCHEF', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/smart-chef.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'DIVERS', genre:'Pattes', text:'IFFCO', img:'iffco.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
    
    ]
    const cosmetique = [
        {id:1, col: 4, codeABarre:'619',  link:'PEAUDOUCE', genre:'PEAUDOICE', text:'PEAUDOUCE', img:'peaudouce.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/peaudouce.gif'},
        ]},
        {id:2, col: 4, codeABarre:'619',  link:'Judy', genre:'Pattes', text:'JUDY', img:'judy.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/judy.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'Heinkel', genre:'Pattes', text:'HENKEL', img:'henkel.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/henkel.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'BSP', genre:'Pattes', text:'BSP', img:'bsp.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/bsp.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'Produits Jmal', genre:'Pattes', text:'EJM', img:'ejm.png',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ejm.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'UNILEVRE', genre:'Pattes', text:'UNULEVRE', img:'sunsilk.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/sunsilk.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'Lingettes Softy', genre:'Pattes', text:'Lingettes Softy', img:'softy.jpg',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/softy.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'Choc', genre:'Pattes', text:'NIHEL', img:'choc.jpg',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/choc.jpg'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'Odéo', genre:'Pattes', text:'NIHEL', img:'ansl-logo-last.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'SATEM', genre:'Pattes', text:'NIHEL', img:'satem.png',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/satem.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'MOVARTIS', genre:'Pattes', text:'NIHEL', img:'ansl-logo-last.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'PLASTIQUE', genre:'Pattes', text:'NIHEL', img:'ansl-logo-last.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'KACHMIR', genre:'Pattes', text:'NIHEL', img:'ansl-logo-last.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'SODET', genre:'Pattes', text:'NIHEL', img:'sodet.png',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/sodet.png'},
        ]},
        {id:3, col: 4, codeABarre:'619',  link:'DIVERS', genre:'Pattes', text:'NIHEL', img:'ansl-logo-last.gif',state:'',
        list: [
            { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/ansl-logo-last.gif'},
        ]},
        
    ]
    /* ############### UseEffect #################*/

    /* ############### Functions #################*/
    const ReturnAvatarList = () =>{
        return (
                [
                    { key: 1, name: 'Sabra', src: 'https://assets.ansl.tn/Images/Socite/sabra.gif'},
                    { key: 2, name: 'Jouda', src: 'https://assets.ansl.tn/Images/Socite/abida.png'},
                    { key: 2, name: 'Abida', src: 'https://assets.ansl.tn/Images/Socite/jouda.jpg'},
                ]
        )
    }
    /* ############### Card #################*/
    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm text-end bg-dark rounded-0 fixed-top'>
                    <NavLink to='User'>
                        <Button size='mini'  className='rounded-pill'> CONNEXTION <span className='bi bi-box-arrow-in-right'></span> </Button>
                    </NavLink>
                </div>
                <div className='mb-4' style={{marginTop:'58px'}}>
                    <img src='https://anaslouma.tn/Assets/images/caroussel/anaslouma.gif' className='img-responsive' width='100%' height='280px' />
                </div>
            </>)
    }

    const BottomCard = () =>{
        return(<>
                <div className='card card-body shadow-sm mb-4 bg-dark ' style={{borderRadius:'30px 30px 0 0'}}>
                    <div className='row'>
                        <div className="col-lg-6 col-12 text-left align-self-center text-white">
                            <div className="p-3">
                                <h6 className="this-font">
                                    Société <b className='text-danger'> ANASLOUMA distribution </b> spécialisé à la distribution des produit cosmétique et hygiène tel que les produit <small className="text-warning"> JUDY , PEAUDOUCE , JEMAL </small> ...
                                    et produit alimentaire tel que <small className="text-warning">SABRA , SMAG, SMART CHEF </small> et divres
                                </h6>
                                <br />
                                <h6><span className="bi bi-telephone-fill"></span>  97913906, 97913068 , 97913914</h6>
                                <h6><span className="bi bi-geo-alt-fill"></span>   ste anaslouma , a cote de l'Hopital regional , sidi bourouis , siliana 6113</h6>
                                <a href="https://www.facebook.com/profile.php?id=100074777238055s" className="text-white"><span className="bi bi-facebook "></span> Anaslouma Distribution</a>
                            </div>   
                        </div>
                        <div className="col-lg-6 col-12 align-self-center">
                            <div className="p-3">
                                <iframe width="100%" height="200" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" className="rounded" 
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=9.097194671630861%2C36.16195863769561%2C9.145088195800783%2C36.18170539608309&amp;layer=mapnik&amp;marker=36.171832638869326%2C9.12114143371582" 
                                    >
                                </iframe>
                                <a className="btn btn-block btn-danger btn-sm" target="c_blank" href="https://www.google.com/maps/@36.1732849,9.1224642,602m/data=!3m1!1e3"> <span className="fa fa-map"></span> Voir Sur Google Map <span className="fa fa-angle-double-right float-right"></span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </>)
    }
    const GenreCard = (props) =>{
        const ItemCard = (props) =>{
            return(<>
                    <div className={`col-12 col-lg-${props.data.col} mb-3`}>
                        <NavLink to={`/List/${props.tag}/${props.data.link}`}>
                        <div className='card card-body shadow-sm mb-4 text-center border-div  h-100'>
                            <div className='d-flex justify-content-center mt-3'>
                                <AvatarGroup className='text-center' appearance="stack" maxCount={5} data={props.data.list} size={props.tag == 'cosmetique' ? 'large' : 'large'} borderColor="#cfcecc" />
                            </div>
                            <h5> {props.data.link} </h5>
                        </div>
                        </NavLink>
                    </div>
            </>)
        }
        return(<>
                <div className='row'>
                    {props.list.map( (itemData,index) => <ItemCard key={index} data={itemData} tag={props.tag}/>)}
                </div>
        </>)
    }
    return ( <>
            <TopCard />
            <br /> 
            
            <div className='container'>
                <h3>Produit Alimentaire</h3> 
                <GenreCard list={alimentaire} tag='alimentaire' />
                <h3>Produit Cosemetique</h3> 
                <GenreCard list={cosmetique} tag='cosmetique'/>
            </div>
            <br />
            <BottomCard />
        </> );
}

export default LandingPage;