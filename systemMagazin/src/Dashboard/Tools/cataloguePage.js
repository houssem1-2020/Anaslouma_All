import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Dropdown, Icon, Input, Loader, Select, Tab } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import AlimDefaultCateg from './alimentaireDefaultCateg'
import CosmoDefaultCateg from './cosmetiqueDefaultCateg'
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';

const AjouterPage = ({catalogueToAdd,setCataToAdd,AjouterAuCatalogue, loaderState}) =>{
    return(<>
        <div className='card card-body shadow-sm mb-2 '>
            <h5>Ajouter Page</h5>
            <div className='mb-0'>Nom </div>
            <Input icon='tags' className='mb-2' iconPosition='left' placeholder='nom' value={catalogueToAdd.genre} onChange={(e) => setCataToAdd({...catalogueToAdd, genre: e.target.value })} />
            
            <div className='mb-0'>nombre de Page</div>
            <Input icon='file' type='number' className='mb-2' iconPosition='left'  value={catalogueToAdd.page} onChange={(e) => setCataToAdd({...catalogueToAdd, page: e.target.value })} />

            <div className='mb-0'>Couleur</div>
            <Input icon='paint brush' type='color' className='mb-2 p-2' iconPosition='left' value={catalogueToAdd.color} onChange={(e) => setCataToAdd({...catalogueToAdd, color: e.target.value })} />
            <br />
            <Button  className='rounded-pill ' color='yellow' onClick={AjouterAuCatalogue} fluid ><Icon name='edit' /> Ajouter <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
        </div>
    </>)
}
const ModifierPage = ({catalogueD, tagName, loaderState, UpdateCatGenData, UpdateCatalogue, pagesList, setTagN}) =>{
    return(<>
        <div className='card card-body shadow-sm mb-2 '>
            <h5>Selectioner</h5>
            <Select placeholder='Selectionnez' options={pagesList} value={tagName} onChange={ (e, data) => setTagN(data.value)} className='w-100 shadow-sm rounded '  />
            <h5>Modifier Page</h5>
            <div className='mb-0'>Nom </div>
            <Input icon='tags' className='mb-2' iconPosition='left' placeholder={catalogueD[tagName].genre} onChange={(e) => UpdateCatGenData(tagName, 'genre', e.target.value)} />
            
            <div className='mb-0'>nombre de Page</div>
            <Input icon='file' className='mb-2' iconPosition='left' placeholder={catalogueD[tagName].page} onChange={(e) => UpdateCatGenData(tagName,'page', e.target.value )} />

            <div className='mb-0'>Couleur</div>
            <Input icon='paint brush' type='color' className='mb-2 p-2' iconPosition='left' placeholder={catalogueD[tagName].color} onChange={(e) => UpdateCatGenData(tagName,'color',e.target.value )} />
            <br />
            <Button  className='rounded-pill bg-system-btn'  fluid onClick={UpdateCatalogue} ><Icon name='edit' /> Modifier <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
        </div>
    </>)
}

function CataloguePage() {
    /*########################[Const]########################*/
    const [tagName, setTagN] = useState(0)
    const [pagesSelector, setPageS] = useState('Even')
    const [pagesList, setPagesList] = useState([])
    const [articleList,setArticleL] = useState([])
    const [loaderState, setLS] = useState(false)
    const [catalogueD,setCatalogueD] = useState([{id:0, page:1, genre:'INITIALE', color:'#9430cf', articles:[{id:1, simple:true , dim:4, heig:'612', codeAB:'6191513502212', heigPhoto:'230', widtPhoto:'80'},]}])
    const [catalogueToAdd,setCataToAdd] = useState({genre:'', color:'', page: catalogueD.length + 1})
    const dimensionList = [
        { key: 1, value: 12 , text: '1/1' },
        { key: 2, value: 6 , text: '1/2' },
        { key: 3, value: 4 , text: '1/3' },
        { key: 4 , value: 3 , text: '1/4' },
    ]
    const OddEven = [
        { key: 1, value: 'Even' , text: 'I - Pages Paires : 2-4-6 ...' },
        { key: 2, value: 'Odd' , text: 'II - Pages Impaires : 1-3-5 : ...' },
    ]
    const DefaultCateg = {alimentaire : AlimDefaultCateg , cosmetique : CosmoDefaultCateg }
    const panes = [
        {
          menuItem: 'Modifier',
          render: () => <ModifierPage catalogueD={catalogueD} tagName={tagName} loaderState={loaderState} UpdateCatGenData={UpdateCatGenData} UpdateCatalogue={UpdateCatalogue} pagesList={pagesList}  setTagN={setTagN} />,
        },
        {
          menuItem: 'Imprimer',
          render: () => <ImprimerCard />,
        },
        {
            menuItem: 'Restaurer',
            render: () => <RestaurerCard />,
        },
        // {
        //     menuItem: 'Restaurer',
        //     render: () => <AjouterPage catalogueToAdd={catalogueToAdd} setCataToAdd={setCataToAdd} AjouterAuCatalogue={AjouterAuCatalogue} loaderState={loaderState} />,
        // },
      ]

    /*#######################[UseEffect]#####################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/catalogue`, {
            tag: GConf.SystemTag,
          })
          .then(function (response) {
            //setCatalogueD(JSON.parse(response.data[0].Catalogue.CatValue))
            setCatalogueD(DefaultCateg[GConf.SystemTag])
            setArticleL(response.data[0].Articles)
            let GenTable =[]
            //JSON.parse(response.data[0].Catalogue.CatValue).map( (data,index) => {GenTable.push({value : index, text : <>Page {data.page} : {data.genre}</>, key: index})})
            DefaultCateg[GConf.SystemTag].map( (data,index) => {GenTable.push({value : index, text : <>Page {data.page} : {data.genre}</>, key: index})})
            setPagesList(GenTable)

        })
    }, [])


    /*######################[Functions]###################### */
    const PrintFunction = (frameId) =>{ usePrintFunction(frameId)}
    const GetArticleData = (code) =>{
        const found =  articleList.find((article) => article.A_Code == code);
        if (found) {
            return(found)
        }

    }
    const ReInstalDefault = () =>{
         if (!catalogueD) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
         else {
             setLS(true)
             axios.post(`${GConf.ApiLink}/tools/catalogue/update`, {
                 tag: GConf.SystemTag,
                 catalogue: catalogueD,
             })
             .then(function (response) {
                 if(response.status = 200) {
                     toast.success("Re-Installeé !", GConf.TostSuucessGonf)
                     setLS(false)
                 }
                 else{
                     toast.error('Erreur!  esseyez de nouveaux', GConf.TostSuucessGonf)
                     setLS(false)
                 }
             }).catch((error) => {
                 if(error.request) {
                   toast.error(<><div><h5>Probleme de Connextion</h5></div></>, GConf.TostInternetGonf)  
                   setLS(false) 
                 }
            });

         }       
    }
    const UpdateCatalogue = () =>{
        if (!catalogueD) {toast.error("Client est Invalide !", GConf.TostErrorGonf)}
        else {
            setLS(true)
            axios.post(`${GConf.ApiLink}/tools/catalogue/update`, {
                tag: GConf.SystemTag,
                catalogue: DefaultCateg[GConf.SystemTag],
            })
            .then(function (response) {
                if(response.status = 200) {
                    toast.success("Re-Installeé !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur!  esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5></div></>, GConf.TostInternetGonf)  
                  setLS(false) 
                }
           });

        }       
    }
    const AjouterAuCatalogue = () =>{
        let articlesToAdd = [catalogueD[0].articles[0],catalogueD[0].articles[0],catalogueD[0].articles[0],
                            catalogueD[0].articles[0],catalogueD[0].articles[0],catalogueD[0].articles[0],
                            catalogueD[0].articles[0],catalogueD[0].articles[0],catalogueD[0].articles[0],
                            catalogueD[0].articles[0],catalogueD[0].articles[0],catalogueD[0].articles[0]]
        let tableToAdd = {id:catalogueD.length, page:catalogueToAdd.page, genre:catalogueToAdd.genre, color:catalogueToAdd.color, articles:articlesToAdd}
        catalogueD.push(tableToAdd) 
        let GenTable =[]
        catalogueD.map( (data,index) => {GenTable.push({value : index, text : <>Page {data.page} : {data.genre}</>, key: index})})
        setPagesList(GenTable) 
        UpdateCatalogue()  
    }
    const UpdateCatGenData = (num,gtag,value) => {
        let copyOfCatalogue = catalogueD
        copyOfCatalogue[num][gtag] = value
        setCatalogueD(copyOfCatalogue)
    }
    const UpdateCatArticles = (num,artId,gtag,value) => {
        let copyOfCatalogue = catalogueD
        copyOfCatalogue[num].articles[artId][gtag] = value
        console.log(copyOfCatalogue[num].articles[artId][gtag]) 
        setCatalogueD(copyOfCatalogue)
    }


    /*########################[Card]########################*/
    const SelectCard = () =>{
        return(<>

                    <div className='row'>
                        <div className='col-12 col-lg-7 mb-2'>
                            <div className='card card-body mb-3 shadow-sm h-75'>
                                <h5>Selectioner</h5>
                                <Select placeholder='Selectionnez' options={pagesList} value={tagName} onChange={ (e, data) => setTagN(data.value)} className='w-100 shadow-sm rounded '  />
                            </div>
                        </div>
                        <div className='col-12 col-lg-5 mb-3'>
                            <div className='card card-body mb-3 shadow-sm h-100'>
                                <h5>Imprimer Catalogue </h5>
                                <Select placeholder='Selectionnez' options={pagesList} value={tagName} onChange={ (e, data) => setTagN(data.value)} className='w-100 shadow-sm rounded mb-3'  />
                                <Button  className='rounded-pill btn-imprimer'  fluid onClick={ (e) => PrintFunction('prtinCatalogue')}><Icon name='print' /> Imprimer </Button>
                            </div>
                        </div>
                        <div className='col-12 col-lg-2 mb-3 d-none'>
                            <Button  className='rounded-pill ' color='red'  fluid onClick={ReInstalDefault}><Icon name='retweet' /> Restaurer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>

        </>)
    }
    const RestaurerCard = () =>{
        return(<>
                <div className='card card-body mb-3 shadow-sm h-100'>
                    <h5>Restaurer le catalogie initiale </h5>
                    <Button  className='rounded-pill ' color='red'  fluid onClick={ReInstalDefault}><Icon name='retweet' /> Restaurer <Loader inverted active={loaderState} inline size='tiny' className='ms-2'/></Button>
                </div>
        </>)
    }
    const ImprimerCard = () =>{
        return(<>
            <div className='card card-body mb-3 shadow-sm h-100'>
                <h5>Imprimer Catalogue </h5>
                <Select placeholder='Selectionnez' options={OddEven} value={pagesSelector} onChange={ (e, data) => setPageS(data.value)} className='w-100 shadow-sm rounded mb-3'  />
                <Button  className='rounded-pill btn-imprimer'  fluid onClick={ (e) => PrintFunction('prtinCatalogue')}><Icon name='print' /> Imprimer </Button>
            </div>                
        </>)
    }
    const ConfigCard = (props) =>{
        const ConfItemCard = (props) =>{
            const artData = GetArticleData(props.Itemdata.codeAB) 
            return(<>
                <datalist id='articleList'>
                    {articleList.map((data,index) => <option key={index} value={data.A_Code}>{data.Name}</option>)}
                </datalist>

                <div className='card card-body mb-2 shadow-sm'>
                    <div className='row'>
                        <div className='col-1 align-self-center'>{props.Itemdata.id}</div>
                        <div className='col-5 align-self-center'> <Input list='articleList' fluid placeholder={artData ? artData.Name :  ''} onBlur={ (e) => UpdateCatArticles(tagName, props.Index ,'codeAB', e.target.value )} /></div>
                                
                            {/* <h6 className='mb-1'>{artData ? artData.Name :  ''} </h6> */}
                            
                        <div className='col-2 align-self-center'><Dropdown style={{minWidth:"2.5em"}}  size='large' defaultValue={props.Itemdata.dim} options={dimensionList} onChange={(e, { value }) => UpdateCatArticles(tagName, props.Index ,'dim', value )} /></div>
                        <div className='col-2 align-self-center'><Input type='number' size='mini' className='w-input-catalogue' placeholder={props.Itemdata.heigPhoto} onChange={(e) => UpdateCatArticles(tagName, props.Index ,'heigPhoto', e.target.value)}/> px</div>
                        <div className='col-2 align-self-center'><Input type='number' size='mini' className='w-input-catalogue' placeholder={props.Itemdata.widtPhoto} onChange={(e) => UpdateCatArticles(tagName, props.Index ,'widtPhoto', e.target.value)}/> %</div>
                        <div className='col-1 align-self-center'></div>
                    </div>
                </div>
            </>)
        }
        return(<>
            <div className='row text-secondary mb-2'>
                <div className='col-1 align-self-center'><b>ID</b></div>
                <div className='col-5 align-self-center'><b>Article</b></div>
                <div className='col-2 align-self-center'><b>Dim</b></div>
                <div className='col-2 align-self-center'><b>X</b></div>
                <div className='col-1 align-self-center'><b>Y</b></div>
            </div>

            {props.data.map( (Itemdata,index) => <ConfItemCard key={index} Itemdata={Itemdata} Index={index} />)} 
        </>)
    }

    return ( <>
            <div className='container'>
                <h5>Catalogue </h5> 
                <br /> 
                {/* <SelectCard />  */}
                <br />
                <div className='row'>
                    <div className='col-12 col-lg-8'>{catalogueD[tagName].articles ? <ConfigCard data={catalogueD[tagName].articles} /> : <></> } </div>
                    <div className='col-12 col-lg-4'>
                         <Tab menu={{ secondary: true }} panes={panes} />
                    </div>
                </div>
            </div> 
            <FrameForPrint frameId='prtinCatalogue' src={`/Pr/Tools/catalogue/${pagesSelector}`} />
    </> );
}

export default CataloguePage;