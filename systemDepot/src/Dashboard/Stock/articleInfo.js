import React, { useEffect, useState } from 'react';
import GConf from '../../AssetsM/generalConf';
import BreadCrumb from '../Assets/breadCrumb'
import { Button, Divider, Form, Icon, Input, Loader, Select, Dropdown, Statistic, Header, TextArea } from 'semantic-ui-react';
import { Tab } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import useGetFamilleArticle from '../Assets/Hooks/fetchArticlesFamille';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import usePrintFunction from '../Assets/Hooks/printFunction';
import FrameForPrint from '../Assets/frameForPrint';
import useSaveNotification from '../Assets/Hooks/saveNotifFunction';
import ReactImageZoom from 'react-image-zoom';

const EditArticle = ({articleD, setArticleD, checkPrixCompatiblite, familles, EditArticleFunction,loaderState,updateQte, setStockFixe, OnKeyPressFunc}) =>{
    return(<>

                <h5 className='mb-1'>Code à barre:</h5>
                <Input icon='barcode' disabled iconPosition='left' type='number' placeholder='code a barre' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.A_Code} onChange={(e) => setArticleD({...articleD, A_Code: e.target.value })} />
                <div className='row'>
                        <div className='col-12 col-lg-10'>
                            <h5 className='mb-1'>Nom: </h5>
                            <Input icon='star' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Nom' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Name} onChange={(e) => setArticleD({...articleD, Name: e.target.value })}/>
                        </div>
                        <div className='col-12 col-lg-2'>
                            <h5 className='mb-1'>Groupage:</h5>
                            <Input icon='box' iconPosition='left' type='number' placeholder='gpge'  className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Groupage} onChange={(e) => setArticleD({...articleD, Groupage: e.target.value })}/>
                        </div>
                </div> 
                <div className='row'>
                            <div className='col-12 col-lg-6'>
                                <h5 className='mb-1'>Genre: </h5>
                               <Select placeholder='Selectionez une Categorie' options={familles} className='w-100 shadow-sm rounded mb-3' defaultValue={articleD.Genre} onChange={(e, data) => setArticleD({...articleD, Genre: data.value })} />  
                            </div>
                            <div className='col-12 col-lg-6'>
                                <h5 className='mb-1'>Fabriquée par: </h5>
                                <Input icon='home' iconPosition='left' onKeyPress={event => OnKeyPressFunc(event)} placeholder='Socité' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Socite} onChange={(e) => setArticleD({...articleD, Socite: e.target.value })}/>
                            </div>
                </div>
                <div className='row'>
                            <div className='col-12 col-lg-4'>
                                <h5 className='mb-1'>Prix Acaht: </h5>
                                <Input icon='dollar' iconPosition='left' type='number' placeholder='achat' defaultValue={articleD.Prix_achat} onBlur={checkPrixCompatiblite} className='w-100 border-0 shadow-sm rounded mb-3' onChange={(e) => setArticleD({...articleD, Prix_achat: e.target.value })}/> 
                            </div>
                            <div className='col-12 col-lg-4'>
                                <h5 className='mb-1'>Prix Vente: </h5>
                                <Input icon='dollar' iconPosition='left' type='number' placeholder='vente' defaultValue={articleD.Prix_vente} onBlur={checkPrixCompatiblite} className='w-100 border-0 shadow-sm rounded mb-3' onChange={(e) => setArticleD({...articleD, Prix_vente: e.target.value })}/>
                            </div>
                            <div className='col-12 col-lg-4'>
                                <h5 className='mb-1'>Prix Promo: </h5>
                                <Input icon='dollar' iconPosition='left' type='number' placeholder='promo' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Prix_gros}  onChange={(e) => setArticleD({...articleD, Prix_gros: e.target.value })}/>
                            </div>
                </div> 
                <div className='row'>
                            <div className='col-12 col-lg-5'>
                                <h5 className='mb-1'>Quantité: </h5>
                                <Input icon='dropbox' iconPosition='left' type='number' disabled={true} placeholder='quantité' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Quantite} onChange={(e) => setArticleD({...articleD, Quantite: e.target.value })}/> 
                            </div>
                            <div className='col-12 col-lg-5'>
                                <h5 className='mb-1'>Repture du stock: </h5>
                                <Input icon='angle double down' iconPosition='left' type='number' placeholder='repture' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.Repture} onChange={(e) => setArticleD({...articleD, Repture: e.target.value })}/>
                            </div>
                            <div className='col-12 col-lg-2'>
                                <h5 className='mb-1'>TVA: </h5>
                                <Input icon='retweet' iconPosition='left' placeholder='TVA' type='number' className='w-100 border-0 shadow-sm rounded mb-3' defaultValue={articleD.TVA} onChange={(e) => setArticleD({...articleD, TVA: e.target.value })}/>
                            </div>
                </div>
                <div className='row'>
                    <h5 className='mb-1'>Description</h5>
                    <Form>
                        <TextArea  rows="3" onKeyPress={event => OnKeyPressFunc(event)} defaultValue={articleD.Details} className='w-100 shadow-sm rounded mb-3' onChange={(e) => setArticleD({...articleD, Details: e.target.value })}/>
                    </Form> 
                </div>
                <div>
                    <h5>Stock est Fixée ? </h5>
                    <div className="form-check form-switch">
                        <input className="form-check-input form-check-input-lg" type="checkbox" defaultChecked={articleD.Stock_Fixe == 'true'}  onChange={() => setStockFixe(articleD.Stock_Fixe)}   />
                    </div>
                </div>
                <div className='text-end mb-5'>
                    <Button onClick={EditArticleFunction} className='text-end rounded-pill bg-system-btn' positive>  <Icon name='edit' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                </div>
    </>)
}

function ArticleInfo() {
    /*#########################[Const]##################################*/
    let Today = new Date().toISOString().split('T')[0]
    let {code} = useParams();
    const[familles] = useGetFamilleArticle()
    const [loading , setLoading] = useState(false)
    const [articleD, setArticleD] = useState({});
    const [loaderState, setLS] = useState(false)
    const [updateQte, setUpdateQte] = useState(true)
    const [resDay , setResDay] = useState({start:Today, end:Today})
    const [articleEvents , setArticleEvents] = useState([])
    const SaveNotification = (genre,tag,table) =>{ useSaveNotification(genre,tag,table)}
    const props = {width: 400, height: 250, zoomWidth: 500, img: articleD ? articleD.Photo_Path : 'default_img.jpg'};

    const [uploadImageName, setUploadImageName] = useState('')
    const [uploadImage, setUploadImages] = useState()
    const [displayedImage, setDisplayedImage] = useState()


    const panes = [
        {
            menuItem: { key: 'suivie', icon: 'calendar alternate', content: 'Suivie' }, 
            render: () =><><Tab.Pane attached={false}><Calendar /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'resumer', icon: 'file excel', content: 'Resumeé' }, 
            render: () => <><Tab.Pane attached={false}><ResumerArticle /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'edit', icon: 'edit outline', content: 'Modifier' }, 
            render: () => <><Tab.Pane attached={false}><EditArticle articleD={articleD}  setArticleD={setArticleD} checkPrixCompatiblite={checkPrixCompatiblite} familles={familles} EditArticleFunction={EditArticleFunction} loaderState={loaderState} updateQte={updateQte} setStockFixe={setStockFixe} OnKeyPressFunc={OnKeyPressFunc} /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'image', icon: 'image', content: 'Image' }, 
            render: () => <><Tab.Pane attached={false}><Images /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'delete', icon: 'trash alternate', content: 'Supprimer' }, 
            render: () => <><Tab.Pane attached={false}><DeleteArticleCard  /></Tab.Pane><br /></>,
        },
    ]

   /*#########################[UseEffect]##################################*/
    useEffect(() => {
        // console.log(new Date().toISOString().split('T')[0])
        axios.post(`${GConf.ApiLink}/stock/article`, {
            tag: GConf.SystemTag,
            code: code, 
          })
          .then(function (response) {
            if(!response.data[0]) {
                toast.error('Article Introuvable !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/sk"; }, 2000)
                
            } else {
                setArticleD(response.data[0])
                setLoading(true)
            }
                
          }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de charger l'article  </div></>, GConf.TostInternetGonf)   
              setLoading(true)
              setArticleD([])
            }
          });

        //calendar
        axios.post(`${GConf.ApiLink}/stock/article/calendar`, {
            tag: GConf.SystemTag,
            code: code, 
          })
        .then(function (response) {
            
            let inFactureList = []
            response.data[0].InFacture.map( (factureList) => inFactureList.push( { title: GetTargetArticleQte(factureList.Articles,'Qte'), date: GenerateDate(factureList.Cre_Date, 1), className:'bg-primary border-0 w-25 text-center' }))
            
            let forCamionList = []
            response.data[0].ForCamion.map( (camionData) => forCamionList.push( { title: GetTargetArticleQte(camionData.Articles,'QteAjoute') , date: GenerateDate(camionData.Jour, 1) , className:'bg-danger border-0 w-25 text-center' }))
            
            let fromBonBE = []
            response.data[0].bonE.map( (bonBe) => fromBonBE.push( { title: GetTargetArticleQte(bonBe.Articles,'NewQte'), date:  GenerateDate(bonBe.BE_Date, 1) , className:'bg-success border-0 w-25 text-center'}))
            

            let fromBonBS = []
            response.data[0].bonS.map( (bonBs) => fromBonBE.push( { title: GetTargetArticleQte(bonBs.Articles,'NewQte'), date: GenerateDate(bonBs.BE_Date, 1), className:'bg-warning border-0 w-25 text-center'}))

            //setArticleEvents(inFactureList.concat(forCamionList,fromBonBE,fromBonBS))
            setArticleEvents(ConcatunateResult(inFactureList).concat(ConcatunateResult(forCamionList),ConcatunateResult(fromBonBE),ConcatunateResult(fromBonBS)))
                
        })

        //check Permission
        axios.post(`${GConf.ApiLink}/Permission`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
            if(response.data[0].Edit_Stock === 'true'){setUpdateQte(false)}
          })
    }, [])


    /*#########################[Function]##################################*/
    const EditArticleFunction = (event) => {
        //console.log(articleD)
        setLS(true)
        axios.post(`${GConf.ApiLink}/stock/modifier`, {
            tag :GConf.SystemTag,
            articleND :articleD,
        }).then(function (response) {
            //console.log(response.data)
            if(response.data.affectedRows) {
                toast.success("Article Modifier !", GConf.TostSuucessGonf)
                setLS(false)
                SaveNotification('stockEditArticle',GConf.SystemTag, articleD)
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                setLS(false)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier l'article  </div></>, GConf.TostInternetGonf)   
              setLS(false)
            }
          });
    }
    const DeleteArticle = () =>{
        setLS(true)
        axios.post(`${GConf.ApiLink}/stock/supprimer`, {
            tag :GConf.SystemTag,
            code : code ,
            pk: articleD.PK
        }).then(function (response) {
            if (response.data.affectedRows != 0) {
                toast.error('Article Supprimer  !', GConf.TostSuucessGonf)
                setTimeout(() => {  window.location.href = "/S/sk"; }, 500)
                setLS(false)
            } else {
                setLS(false)
            }
            console.log(response.data)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de supprimer l'article  </div></>, GConf.TostInternetGonf)   
              setLS(false)
            }
          });
    }
    const checkPrixCompatiblite = () =>{
        if(articleD.PrixA && articleD.PrixV){
            if(articleD.PrixA > articleD.PrixV) {
                toast.error("Le Prix d'achat > Prix de Vente", GConf.TostErrorGonf)
                setArticleD({...articleD, PrixV: '', PrixA: '' })
            } 
        }  
    }
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId) }
    const GetTargetArticleQte = (value,column) =>{
        const JsValue = JSON.parse(value)
        const searchObject= JsValue.find((article) => article.A_Code == code);
        return parseInt(searchObject[column]);
    }
    const GenerateDate = function(str, days) {
        var myDate = new Date(str);
        myDate.setDate(myDate.getDate() + parseInt(days));
        return myDate.toISOString().split('T')[0];
    }
    const ConcatunateResult = (targetArray) =>{

        const endresult = Object.values(targetArray.reduce((value, object) => {
            if (value[object.date]) {
              value[object.date].title += object.title; 
              value[object.date].count++;
          
          } else {
              value[object.date] = { ...object , count : 1
              };
            }
            return value;
          }, {}));
          
          return(endresult)
        
    }

    const UpdateImageFunc = () =>{
        if (!uploadImage) { } 
        else {
            const formData = new FormData();
            formData.append("ProfileImage", uploadImage);
            formData.append("Tag", uploadImageName);
            formData.append("Code", code);
            formData.append("Tag", GConf.SystemTag);
            setLS(true)
            axios({
                method: 'post',
                url: `${GConf.ApiLink}/stock/modifier/images`,
                data: formData ,
            }).then(function (response) {
                toast.success("Image Modifier !", GConf.TostSuucessGonf)
                setLS(false)
                console.log(response.data)
            }).catch((error) => {
                console.log(error)
            });  
        } 
    }

    const UploadImageFunc = (e) => {
        setDisplayedImage(URL.createObjectURL(e.target.files[0]))
        setUploadImages(e.target.files[0])
    }
    
    const OnKeyPressFunc = (e) => {
        if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || (e.charCode >= 48 && e.charCode <= 57) || e.charCode == 42 || e.charCode == 32 || e.charCode == 47 )) {
            e.preventDefault();
        }   
    }

    const setStockFixe = (state) =>{
        axios.post(`${GConf.ApiLink}/stock/modifier/stockfixe`, {
            tag :GConf.SystemTag,
            articleND :{A_Code : articleD.A_Code, Stock_Fixe : !JSON.parse(articleD.Stock_Fixe)},
        }).then(function (response) {
            console.log(response.data)
            if(response.data.affectedRows) {
                toast.success("Article Modifier !", GConf.TostSuucessGonf)
                setArticleD({...articleD, Stock_Fixe: JSON.stringify(!JSON.parse(articleD.Stock_Fixe)) })
            }
            else{
                toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
            }
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Impossible de modifier l'article  </div></>, GConf.TostInternetGonf)   
            }
        });

        
    }
   /*#########################[Card]##################################*/
    const ArticleCard = (props) =>{
        const ReptureState = () =>{
            return (
            props.data.Repture >= props.data.Quantite ? <span className='bi bi-exclamation-triangle-fill bi-sm text-danger'></span> : <span className='bi bi-box2-heart-fill bi-sm text-success'></span>
            )
        }
        return (<>

            <div className="sticky-top" style={{top:'70px'}}>
                <div className='card card-body shadow-sm mb-2 border-div'>
                    <div className="upper">
                        <div className="mcbg main-big-card"></div>
                    </div>
                    <div className="img-card-container text-center">
                        <div className="card-container  ">
                            <img src={`https://assets.ansl.tn/Images/Articles/${props.data.Photo_Path}`} className="rounded-circle" width="80px" height="80px" />                    
                        </div>
                    </div>
                    <div className="mt-5 text-center">
                            <h4 className='mt-2 notification'>{loading ? <><span className={`${articleD.Stock_Fixe == 'true' ? ' badged-inside ' : 'd-none'}`}></span> {props.data.Name} </> : SKLT.BarreSkl } </h4> 
                            <h6 className="text-secondary">  {loading ? <><span className="bi bi-bookmark-star-fill"></span> { props.data.Genre } </>: SKLT.BarreSkl} </h6>
                            <h6 className="text-secondary"> {loading ? <><span className="bi bi-house-heart-fill"></span> { props.data.Socite } </>: SKLT.BarreSkl } </h6>
                            <Divider horizontal className='text-secondary mt-4'>Prix</Divider>
                            <div className='row text-center'>
                                <div className='col-6'>
                                    <Statistic color='red' size='tiny'>
                                    {loading ?  
                                        <Statistic.Value>
                                            {parseFloat(props.data.Prix_achat).toFixed(3)} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }  
                                        <Statistic.Label>Achat</Statistic.Label>
                                    </Statistic>
                                </div>
                                <div className='col-6'>
                                    <Statistic color='red' size='tiny'>
                                        {loading ?  
                                        <Statistic.Value>
                                            {parseFloat(props.data.Prix_vente).toFixed(3)} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }
                                        <Statistic.Label>Vente</Statistic.Label>
                                    </Statistic>
                                </div>
                            </div>
                            <Divider horizontal className='text-secondary mt-4'>Quantite</Divider>
                            <div className='row text-center'>
                                <div className='col-12 mb-3'>
                                    <Statistic color='green' size='tiny'>
                                        {loading ?  
                                        <Statistic.Value>
                                            {props.data.Quantite} 
                                        </Statistic.Value>
                                        : SKLT.ProfileSkl }  
                                    </Statistic>
                                </div>
                                <div className='col-6  align-self-center border-end'>
                                    <ReptureState />
                                </div>
                                <div className='col-6 align-self-center'>
                                <h6 className='mb-1'> Repture En: {props.data.Repture}</h6> 
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
    const Calendar = () =>{
        return(<>
        <FullCalendar 
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            locale='fr' 
            events={articleEvents}
            height='420px'
            navLinks ={true}
        />
        <div className='row mt-2'>
        <div className='col'><span className='bi bi-circle-fill text-success '></span> Par Bon entre</div>
            <div className='col'><span className='bi bi-circle-fill text-warning '></span> Par Bon Sortie</div>
            <div className='col'><span className='bi bi-circle-fill text-primary '></span> Dans Factures</div>
            <div className='col'><span className='bi bi-circle-fill text-danger '></span> Vers Camion</div>
        </div>
        </>)
    }
    const DeleteArticleCard = () =>{
        return(<>
            <h3 className="text-secondary">Voulez-Vous Vraimment Supprimer Cett Article ?</h3> 
            <div className='row'>
                <div className='col-9'>
                    <h5 className="text-danger text-left"><b>Lorsque Vous Supprimer L'Article : </b></h5>
                    <ul className="text-info text-left">
                    <li>L'article ne sera pas visible dans la branche 'Stock'</li>
                    <li>Tous les article avec son code a barre se suppriment </li>
                    <li>L'article Soit visible seulemment dans les facture  </li>
                    </ul>
                </div>
                <div className='col-lg-3 d-none d-lg-block align-self-center'>
                    <div className='text-center'>
                            <img src='https://assets.ansl.tn/Images/usful/delete.svg' width='80%'  height='80px' /> 
                    </div> 
                </div>
            </div>
            <div className='text-end'>
                <button type="submit" name="add" className="btn btn-danger rounded-pill" onClick={DeleteArticle}><span className="bi bi-check"></span> Oui, Supprimer <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></button>
            </div>
        </>)
    }
    const ResumerArticle = () =>{
        return(<>
                <h5>Reumer entre deux periodes</h5>
                <div className='mb-2 row'>
                    <div className='col-6 mb-3'><Input size='small' fluid  type='date'  value={resDay.start}  onChange={(e) => setResDay({...resDay, start: e.target.value })}/></div>
                    <div className='col-6 mb-3'><Input size='small' fluid  type='date'  value={resDay.end} onChange={(e) => setResDay({...resDay, end: e.target.value })}/></div>
                    <div className='col-6 self-align-center mb-2'>
                        <h5>Imprimer Resumer </h5>
                        <Button size='small' className='rounded-pill btn-imprimer' fluid onClick={(e) => PrintFunction('printResumer')} icon >  <Icon name='print' /> Imprimer Resumer </Button>
                    </div>
                    <div className='col-6 self-align-center mb-2'>
                        <h5>Suivie Vente </h5>
                        <Button size='small' className='rounded-pill bg-system-btn' fluid onClick={(e) => PrintFunction('printVente')} icon >  <Icon name='print' /> Suivie Vente </Button>
                    </div>
                </div> 
        </>)
    }
    const Images = () =>{   
        const UploadImage = () =>{
            return(<>
                <div className='row'>
                    <div className='col-12 col-lg-7'>
                        <div className='card p-2 mb-2'>
                            <label onChange={UploadImageFunc} htmlFor="formId" className='text-info ' role="button">
                               <Input type='file' hidden name="imagez" id="formId"  />
                                <span className='bi bi-cloud-upload-fill bi-sm'> <span className='mb-2 ms-4'>CHARGER UNE IMAGE </span></span>
                                
                            </label>
                        </div>
                        <div className='text-start mt-2'>
                            <Button  className='rounded-pill bg-system-btn' size='tiny' onClick={UpdateImageFunc} ><Icon name='save' /> Modifier Image <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-5'>
                        <div className='card card-body  text-center p-4 img-container'>
                            {displayedImage ? <img src={displayedImage} width='100%' height='200px'  /> : 'PaS d\'image'}
                        </div>
                    </div>
                </div>
            </>)
        }
        const ImageExist = () =>{
            return(<>
            <div className="card-body text-center">
                    <h5>Image existe déja</h5> 
                    {/* <img src={`https://assets.ansl.tn/Images/Articles/${articleD ? articleD.Photo_Path : 'default_img.jpg'}`} className="rounded-circle" width="300px" />                     */}
                    <ReactImageZoom width={300} height={400}  zoomPosition='original'  img={`https://assets.ansl.tn/Images/Articles/${articleD ? articleD.Photo_Path : 'default_img.jpg'}`} />
            </div>
            </>)
        }
        return(<>
        <div className='p-2 mb-2'>   
            {articleD.Photo_Path == 'default_img.jpg' ? <UploadImage /> : <ImageExist />  } 
        </div>
       
        </>)
    }

    return ( <> 
                <BreadCrumb links={GConf.BreadCrumb.stockInfo} />
                <br />
                <div className="row">
                    <div className="col-12 col-lg-4">
                        <ArticleCard data={articleD}/> 
                    </div>
                    <div className="col-12 col-lg-8">
                        <Tab menu={{ secondary: true, pointing: true ,className: "wrapped"}} panes={panes} />
                    </div>  
                </div>
                <FrameForPrint frameId='printResumer' src={`/Pr/Stock/resumer/${code}/${resDay.start}/${resDay.end}`} />
                <FrameForPrint frameId='printVente' src={`/Pr/Stock/vente/${code}/${resDay.start}/${resDay.end}`} />
     </> );
}

export default ArticleInfo;