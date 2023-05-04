import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlimDefaultCateg from '../../../Dashboard/Tools/alimentaireDefaultCateg'
import CosmoDefaultCateg from '../../../Dashboard/Tools/cosmetiqueDefaultCateg'
import GConf from '../../../AssetsM/generalConf';
function CataloguePrint() {
    /*########################[Const]########################*/
    let {tagNum} = useParams()
    const [loadingPage,setL] = useState(false)
    const [articleList,setArticleL] = useState([])
    const [catalogueD,setCatalogueD] = useState([])
    const OddEvenNumber = {
        Odd : [[40,1],[38,3],[36,5],[34,7],[32,9],[30,11],[28,13],[26,15],[24,17],[22,19]],
        Even : [[2,39],[4,37],[6,35],[8,33],[10,31],[12,29],[14,27],[16,25],[18,23],[20,21]],
    }
    const DefaultCateg = {alimentaire : AlimDefaultCateg , cosmetique : CosmoDefaultCateg }

    /*########################[UseEffect]########################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/catalogue`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
            setCatalogueD(DefaultCateg[GConf.SystemTag])
            //setCatalogueD(JSON.parse(response.data[0].Catalogue.CatValue))
            setArticleL(response.data[0].Articles)
            setL(true)
        })
    }, [])
    /*########################[Function]########################*/
    const GetArticleData = (code) =>{
        const found =  articleList.find((article) => article.A_Code == code);
        return(found)
    }
    /*########################[Card]########################*/
    const SimpleArticleCard = (props) =>{
        return(<>
            <div className='p-2 text-center  h-100'>
                <div className='text-center'><img src={`https://assets.ansl.tn/Images/Articles/${props.data ? props.data.Photo_Path : ''}`} className='img-responsive' width={`${props.widtPhoto}%`} height={`${props.heigPhoto}px`} /> </div>
                </div> 
                <div className='p-1 mt-1 rounded-pill text-start d-inline-block pe-2 ps-2 text-white mb-2' style={{backgroundColor: props.color}} > {props.data ? <b>{(props.data.Prix_vente).toFixed(3)}</b>: ''} D.T</div>
                <div className='col-12 text-start mb-1 '><h6> {props.data ? props.data.Name : ''} </h6></div>
        </>)
    }


    const TempleteCard = (props) =>{
        const MainPage = (props) =>{
            return(<>
                    <div className='bg-about' > 
                        <div className='align-self-center text-center' style={{height:'250px'}}>
                            <div className='row'>
                                <div className='col-3 align-self-center pt-4'><img src='https://assets.ansl.tn/Images/ansl-logo-last-tr.gif' width='100%'  height='150px' /></div>
                                <div className='col-9 align-self-center'><h4 className='display-4 text-black'><b> STE ANASLOUMA DISTRIBUTION </b></h4> </div>
                            </div> 
                        </div>
                    
                    <div className='align-self-center pt-1 text-center' style={{height:'50px', backgroundColor:catalogueD[props.tag].color}}>
                        <h1 className='ms-4 text-white'>97.913.914 / 97.913.813 / 97.913.906 / 97.913.068 </h1>  
                    </div>
                    
                    <div className='bg-transparent ' style={{height:'1015px', width:'100%'}}>
                        
                        <div className='text-center'><img src={`https://assets.ansl.tn/Images/Articles/1665391195733-4382075630848.jpeg`} className='img-responsive' width={`${props.widtPhoto}%`} height={`${props.heigPhoto}px`} /> </div>                     
                        <div className='p-2 mt-2' style={{backgroundColor:'#ffc107', marginLeft:'400px', borderRadius: '20px 0px 0px 20px'}}>
                            <h5 className='p-2 ps-4'> OMO ZED ROSE 300 G </h5>
                        </div>
    
                        </div>
                    </div>    
                    
                
            </>)
        }
        const LastPage = (props) =>{
            return(<>
                    <div className='bg-about' > 
                    <div className='align-self-center text-center' style={{height:'200px', paddingTop:'70px'}}>
                            <h1 className='ms-4 text-white'>STE ANASLOUMA DISTRIBUTION DU NORD</h1>  
                        </div>
                    </div>
    
                    <div className='bg-white ' style={{height:'872px', width:'100%'}}>
                        
                        <div className='text-center'><img src={`https://assets.ansl.tn/Images/Articles/1662375208085-3469021197949.jpeg`} className='img-responsive' width={`${props.widtPhoto}%`} height={`${props.heigPhoto}px`} /> </div>                     
                         <div className='p-2 mt-2' style={{backgroundColor:'#ffc107', marginLeft:'300px'}}>
    
                            <h5> TOMATE JOUDA DOUBLE CONCENTRATION 1KG </h5>
                        </div>
    
                        </div>
                    <div className='align-self-center pt-1 text-center' style={{height:'50px', backgroundColor:catalogueD[props.tag].color}}>
                        <h1 className='ms-4 text-white'>97.913.914 / 97.913.813 / 97.913.906 / 97.913.068 </h1>  
                    </div>
                
            </>)
        }
        const NormalPage = (props) =>{
            return(<>
                <div className='row bg-white' style={{height:'80px'}}>
                        <div className='col-8 top-catalogue' style={{paddingTop:'20px', backgroundColor:catalogueD[props.tag].color}}>
                                <h1 className='ms-4 text-white'>{catalogueD[props.tag].genre}</h1>
                        </div>
                        <div className='col-4 align-self-center align-self-center text-center'> <img src='https://assets.ansl.tn/Images/ansl-logo-last-tr.gif' width='50%'  height='70px' /></div>
                </div>
                <div className='bg-white' style={{height:'35px' , width:'100%'}}></div>
                <div className='bg-white' style={{height:'1148px', width:'100%'}}>
                    <div className='row ms-4'>
                        {catalogueD[props.tag].articles.map((data,index) => 
                                <div className={`col-${data.dim}`} key={index}>
                                    <div className='' style={{height: data.heig}}>
                                        <SimpleArticleCard data={GetArticleData(data.codeAB)} color={catalogueD[props.tag].color} heigPhoto={data.heigPhoto} widtPhoto={data.widtPhoto} />
                                    </div>  
                                </div>
                        )}
                    </div>
                </div>
                <div className='align-self-center bg-white text-end' style={{height:'50px'}}>
                    <h1 className='pe-4 text-white bottom-catalogue p-2 ps-4 d-inline-block' style={{backgroundColor:catalogueD[props.tag].color}}>{catalogueD[props.tag].page}</h1>  
                </div>
            </>)
        }
        return(<>
            { parseInt(props.tag) == 0  ? <MainPage tag={props.tag} /> : <NormalPage tag={props.tag} /> }
        </>)
    }
    
    const AllPages = (props)  =>{

        return(<>
            {OddEvenNumber[props.genre].map( (data,index) => <><TempleteCard tag={data[0] -1} /> <div className='breack-page-here'></div> <TempleteCard tag={data[1] -1} />  <div className='breack-page-here'></div></> )}
        </>)
    }
    return (<>
        {loadingPage ? 
            <>
                <AllPages genre={tagNum} />
                {/* <TempleteCard tag={7} /> */}
                {/* <TempleteCard tag={tagNum} />  */}
            </>
            :
            <></>
        }
       
    </>);
}

export default CataloguePrint;