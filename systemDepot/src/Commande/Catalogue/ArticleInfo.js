import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Divider, Icon, Input, Popup, Statistic } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import BackCard from '../Assets/backCard';
import InputLinks from '../Assets/linksData';
const PannierCard = ({qteToAdd, setQteTA, AddArticleToList}) =>{
    return(<>
        <div className='card card-body shadow-sm mb-2 border-div'>
            <h5>Ajouter Article aux Pannier : </h5>
            <div className='row'>
                <div className='col-7 align-self-center text-center'>
                <Input type='number' icon='dropbox' value={qteToAdd}   onChange={ (e) =>  setQteTA(e.target.value)}  size="large" iconPosition='left' placeholder='Quantite'  fluid className='mb-1' />
                </div>
                <div className='col-5 align-self-center text-center'>
                <Button  fluid  size="large" className='rounded-pill bg-system-btn' onClick={AddArticleToList}>  <Icon name='shopping basket' /> +  Pannier </Button> 
                </div>
            </div>
        </div>
    </>)
}

function ArticleInfo() {
    /*#########################[Const]##################################*/
    let {AID} = useParams()
    const [articleD, setArticleD] = useState({});
    const [loading , setLoading] = useState(false)
    const [articleNow, setArticleNow] = useState([])
    const [qteToAdd, setQteTA] = useState(1)
    const [qteInCommande, setQteInCommande] = useState([])
    let Offline = JSON.parse(localStorage.getItem(`${GConf.SystemTag}_Cmd_Offline`));

    /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/stock/article`, {
            tag: GConf.SystemTag,
            code: AID, 
          })
          .then(function (response) {
                setArticleD(response.data[0])
                setLoading(true)
                let prix_u = (response.data[0].Prix_vente * response.data[0].Qte).toFixed(3)
                setArticleNow({id: Offline.pannierArticles.length+1 , A_Code: response.data[0].A_Code, Name: response.data[0].Name, Prix: response.data[0].Prix_vente, Qte: qteToAdd, PU: prix_u})
          })

          axios.post(`${GConf.ApiCommandeLink}/ajouter/checkexist/article`, {
            TAG: GConf.SystemTag,
            code: AID,
          }).then(function (response) {
             setQteInCommande(response.data)
             console.log(response.data)
          }).catch((error) => {
            if(error.request) {
              setQteInCommande([])

            }
        });


    }, [])

    /*#########################[Function]##################################*/
    const AddArticleToList = ()=>{

            const searchObject = Offline.pannierArticles.find((article) => article.A_Code == articleNow.A_Code);
            if (searchObject) {
                let IndexOfArticle = Offline.pannierArticles.findIndex((article) => article.A_Code == articleNow.A_Code)
                Offline.pannierArticles[IndexOfArticle].Qte = parseInt(Offline.pannierArticles[IndexOfArticle].Qte) + parseInt(qteToAdd)
                Offline.pannierArticles[IndexOfArticle].PU = ((Offline.pannierArticles[IndexOfArticle].Qte) * Offline.pannierArticles[IndexOfArticle].Prix ).toFixed(3)
                 
                localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
  
                toast.info(`${searchObject.Name} Reajouter Avec Quantite : ${qteToAdd}`, GConf.TostPannier)
            } else {
                let prix_u = (parseFloat(articleD.Prix_vente) * parseInt(qteToAdd)).toFixed(3)
                Offline.pannierArticles.push({id: Offline.pannierArticles.length+1 , A_Code: articleD.A_Code, Name: articleD.Name, Prix: parseFloat(articleD.Prix_vente), Qte: parseFloat(qteToAdd), PU: prix_u})
                localStorage.setItem(`${GConf.SystemTag}_Cmd_Offline`,  JSON.stringify(Offline));
                toast.info(`${articleD.Name}  Ajouter !, La Quantite est : ${qteToAdd}`, GConf.TostPannier)

            }
    }

    const GetQteInCommande = (code) =>{
        const searchQte = qteInCommande.find((article) => article.A_Code == code )
        if(searchQte) {
            return (searchQte.Qte)
        } else {
            return 0
        }
        
    }

    /*#########################[Card]##################################*/
    const ArticleCard = (props) =>{
        return (<>

           
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <div className="mt-5 text-center">
                            <h1 className='mt-2'>{loading ? props.data.Name : SKLT.BarreSkl } </h1> 
                            <h6 className="text-secondary">  {loading ? <><span className="bi bi-bookmark-star-fill"></span> { props.data.Genre } </>: SKLT.BarreSkl} </h6>
                            <h6 className="text-secondary"> {loading ? <><span className="bi bi-house-heart-fill"></span> { props.data.Socite } </>: SKLT.BarreSkl } </h6>

                            <Divider horizontal className='text-secondary mt-4'>Prix & STOCK </Divider>
                            <div className='row text-center'>
                                <div className='col-6'>
                                    <Popup 
                                        content={<h1>{loading ? props.data.Quantite : ''}</h1>}
                                        trigger={<Button className='huge' icon='add'>Stock</Button>} 
                                    />
                                    <Popup 
                                        content={<h1>{loading ? GetQteInCommande(AID) : ''}</h1>}
                                        trigger={<Button className='huge bg-warning text-white' >En attent </Button>} 
                                    />
                                    
                                </div>
                                <div className='col-3'>
                                    <Statistic color='red' size='tiny'>
                                        {loading ?  
                                        <Statistic.Value>
                                            {props.data.Prix_vente.toFixed(3)} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }
                                        <Statistic.Label>Vente</Statistic.Label>
                                    </Statistic>
                                </div>
                                <div className='col-3'>
                                    <Statistic color='red' size='tiny'>
                                        {loading ?  
                                        <Statistic.Value>
                                            {props.data.Prix_gros.toFixed(3)} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }
                                        <Statistic.Label>Grox</Statistic.Label>
                                    </Statistic>
                                </div>
                            </div>
                    </div>
                </div>

        </>);
    }
    const ImgCard = (props) =>{
        return (<>
                <div className='card card-body shadow-sm mb-2 border-div'>
                   <div className='text-center'>
                        <img src={`https://assets.ansl.tn/Images/Articles/${props.Photo}`} className="img-responsive" width="80%" />
                    </div> 
                </div>
        </>);
    }
    
    return ( <>
        <BackCard data={InputLinks.backCard.cgInfo}/>
        <br />
         <div className='container-fluid'>
            <PannierCard qteToAdd={qteToAdd} setQteTA={setQteTA} AddArticleToList={AddArticleToList} />
            <ImgCard Photo={articleD.Photo_Path} />
            <ArticleCard data={articleD}/>
         </div>
        </> );
}

export default ArticleInfo