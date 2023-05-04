import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GConf from '../../AssetsM/generalConf';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
import { Divider, Statistic } from 'semantic-ui-react';
import SKLT from '../../AssetsM/usedSlk';

function ArticleInfo() {
    /*#########################[Const]##################################*/
    let {code} = useParams()
    let userData = JSON.parse(localStorage.getItem("UserData"));
    const [loading , setLoading] = useState(false)
    const [articleD, setArticleD] = useState({});
    /*#########################[Use Effect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/User/Stock/article`, {
            tag: userData.tag,
            genre : userData.genre,
            code: code

          })
          .then(function (response) {
            setArticleD(response.data[0].info[0])
            setLoading(true)
            console.log(response.data[0].info[0])
          })
        }, [])

    /*#########################[Functions]##################################*/
    

    /*#########################[Component]##################################*/ 
    //card
    const ArticleCard = (props) =>{
        return (<>

           
                <div className='card card-body shadow-sm mb-2 border-div'>
                   <div className='text-center mb-0'>
                        <img src={`https://anaslouma.tn/Assets/images/Articles_Images/alimentaire/${props.data.Photo_Path}`} className="img-responsive" width="50%" />
                    </div>
                    <div className="mt-5 text-center">
                            <h3 className='mt-2'>{loading ? props.data.Name : SKLT.BarreSkl } </h3> 
                            <h6 className="text-secondary">  {loading ? <><span className="bi bi-bookmark-star-fill"></span> { props.data.Genre } </>: SKLT.BarreSkl} </h6>
                            <h6 className="text-secondary"> {loading ? <><span className="bi bi-house-heart-fill"></span> { props.data.Socite } </>: SKLT.BarreSkl } </h6>
                            <div className='text-start'>
                                <small>{loading ? props.data.Details : SKLT.BarreSkl } </small> 
                            </div>
                            <Divider horizontal className='text-secondary mt-4'>Prix & STOCK </Divider>
                            <div className='row text-center'>
                                <div className='col-6'>
                                    <Statistic color='green' size='tiny'>
                                    {loading ?  
                                        <Statistic.Value>
                                            {props.data.Quantite}  
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }  
                                        <Statistic.Label>Stock</Statistic.Label>
                                    </Statistic>
                                </div>
                                <div className='col-6'>
                                    <Statistic color='red' size='tiny'>
                                        {loading ?  
                                        <Statistic.Value>
                                            {props.data.Prix_vente.toFixed(3)} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }
                                        <Statistic.Label>Vente</Statistic.Label>
                                    </Statistic>
                                </div>
                            </div>
                    </div>
                </div>

        </>);
    }


    return (  <>
        <BackCard data={InputLinks.backCard.ai}/>
        <br />
        <div className='container-fluid'>
            <ArticleCard data={articleD}/>
        </div>
 
    </>);
}


export default ArticleInfo;