import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { toast } from 'react-toastify';

function ArticleInfo() {
    /*#########################[Const]##################################*/
    let {tag, code} = useParams()
    let [articleD, setArticleD] = useState([]); 
    let [loading, setLOD] = useState(true); 

    /* ############### UseEffect #################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/list/article`, {
            tag: tag,
            code:code
          })
          .then(function (response) {
            if (response.data) {
                setArticleD(response.data)
                setLOD(false)
            } else {
                setLOD(false)
                toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
            }
          })
      }, [])
    /* ############### Functions #################*/
    /* ############### Card #################*/
        const TopCard = () =>{
                return(<>
                        <div className='card card-body shadow-sm bg-dark rounded-0 fixed-top'>
                        <NavLink exact='true' to='/'>
                        <span className='bi bi-arrow-left-circle bi-sm text-white'></span>
                        </NavLink>
                        </div>
                </>)
        }
        const ArticlePhoto = () =>{
                return(<>
                <div className='card card-body shadow-sm border-div mb-3 sticky-top' style={{top:'70px'}}>
                        <div className='text-center'>
                                <img src={`https://assets.ansl.tn/Images/Articles/${articleD.Photo_Path ? articleD.Photo_Path : 'default_img.jpg'}`}  className='img-responsive' width='80%'  height='350px'  />
                        </div> 
                        <h5 className='text-center'>
                                {articleD.Name ? articleD.Name : ''}
                        </h5>  
                </div>
                </>)
        }
        const ArticleData = () =>{
                return(<>
                <div className='card card-body   border-div mb-3 ' >
                       <div className='text-secondary '><span className='bi bi-star-fill'></span> Code A barre  : {articleD.A_Code ? articleD.A_Code : ''}</div>
                       <div className='text-secondary '><span className='bi bi-star-fill'></span> Nom : {articleD.Name ? articleD.Name : ''}</div>
                </div>
                </>)
        }
    return ( <>
            <TopCard />
            <br />
            <br />
            <br />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-lg-4'>
                        <ArticlePhoto />
                    </div>
                    <div className='col-12 col-lg-8'>
                        <ArticleData />
                    </div>
                </div>
                
            </div>
            <br />
        </> );
}

export default ArticleInfo;