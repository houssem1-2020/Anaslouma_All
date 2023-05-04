import React, { useEffect, useRef, useState } from 'react';
import { _ } from "gridjs-react";
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';


function ArticleList() {
    /*#########################[Const]##################################*/
    let {genre, tag} = useParams()
    let [articleList, setArticleList] = useState([]); 
    let [loading, setLOD] = useState(true); 

    /* ############### UseEffect #################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/list`, {
            tag: tag,
            genre:genre
          })
          .then(function (response) {
            if (!response.data) {
                  toast.error('Probleme de Connextion', GConf.TostSuucessGonf)
            } else {
                setArticleList(response.data)
                setLOD(false)
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
    const ArticleList = (props) =>{
        const ItemCard = (props) =>{
            return(<>
                    <div className='col-6 col-lg-3 mb-3'>
                        <NavLink to={`/Article/${tag}/${props.data.A_Code}`}>
                        <div className='card p-3  text-center h-100 border-div'>
                            <div>
                                <img src={`https://assets.ansl.tn/Images/Articles/${props.data.Photo_Path}`} className='img-responsive' width='50%' heigth='60px' />
                            </div>
                            <h6 className='mt-2 mb-0 text-dark'> {props.data.Name} </h6>
                        </div>
                        </NavLink>
                    </div>
            </>)
        }
        return(<>
                <div className='row'>
                    {props.list.map( (itemData,index) => <ItemCard key={index} data={itemData}/>)}
                </div>
        </>)
    }
    const FilterCard = () =>{
        return(<>
        <div className='card card-body shadow-sm border-div mb-3 sticky-top' style={{top:'70px'}}>
                Filtrer
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
                    <div className='col-12 col-lg-3 d-none d-lg-block'>
                        <FilterCard />
                    </div>
                    <div className='col-12 col-lg-9'>
                        <h3>Selectionneé : {genre} </h3> 
                        { loading ? SKLT.CardList : <ArticleList list={articleList} />}
                    </div>
                </div>
                
            </div>
            <br />
        </> );
}

export default ArticleList;