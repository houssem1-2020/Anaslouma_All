import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Icon, Input, Loader } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import SKLT from '../../AssetsM/usedSlk';
import Ripples from 'react-ripples'
import { Link, useParams } from 'react-router-dom';

const InputTextSetting = ({data,setValueItem,setting,index}) =>{
            
    return(<>
        <div className="card card-body mb-2 border-div">
            <h3 style={{color:GConf.themeColor}}><span className={`bi bi-${data.icon}`}></span> {data.title}</h3>
            <div className="row">
                <div className="col-8 col-lg-11 text-secondary align-self-center">
                    {data.text}
                </div>
                <div className="col-4 col-lg-1 align-self-center tex-end">
                    <h2><Input size="mini" transparent className='text-blod w-75'  defaultValue={setting} onChange={ (e) => setValueItem(index, e.target.value)} /></h2>
                </div>
            </div>
        </div>
    </>)
}

function UpdateSettingPage() {
    /*###############################[Const]################################# */
    let {genre} = useParams()
    const [loading , setLoading] = useState(false)
    const [loaderState , setLS] = useState(false)
    const [setting , setSetting] = useState([])

    /*###############################[Const]################################# */
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/parametre`, {
            PID: GConf.PID,
        })
        .then(function (response) {  
            setSetting(JSON.parse(response.data.setting[genre]))
            console.log(response.data.setting[genre])
            setLoading(true)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setSetting([])
            }   
        });
    }, [])

    /*###############################[Functions]################################# */
    const setChekingItem = (index) =>{
        setting[index] = !setting[index]
        setSetting([ ...setting])
        console.log(setting)
    }
    const setValueItem = (index,value) =>{
        if (value != 0) { setting[index] = JSON.parse(value)  } else { setting[index] = 0 }
        setSetting([ ...setting])
        console.log(setting)
    }
    const RenderSettingGenreKey = (genre) =>{
        let Index = GConf.Setting.findIndex((item) => item.title == genre)
        return(Index)
    }

    const SaveChanges = () =>{
        if (!setting) {toast.error("Identifiant est Invalide !", GConf.TostErrorGonf)}
        else{
            console.log(JSON.stringify(setting))
            setLS(true)
            axios.post(`${GConf.ApiLink}/parametre/update`, {
                PID : GConf.PID,
                settingDataSent : JSON.stringify(setting),
                genre : genre
            }).then(function (response) {
                console.log(response.data)
                if(response.data.affectedRows) {
                    toast.success("Modifieé !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            })                
        }
    }

    const CheckBoxSetting = (props) =>{
        return(<>
            <div className="card card-body border-div mb-2">
                <h3 style={{color:GConf.themeColor}}><span className={`bi bi-${props.data.icon}`}></span> {props.data.title}</h3>
                <div className="row">
                    <div className="col-10 col-lg-11 text-secondary">
                    {props.data.text}
                    </div>
                    <div className="col-2 col-lg-1">
                        <div className="form-check form-switch">
                            <input className="form-check-input form-check-input-lg" type="checkbox" onChange={() => setChekingItem(props.index)} defaultChecked={props.setting} />
                        </div>
                    </div>
                </div>
            </div>
        </>)
    }

    return ( <>

        <div className='row justify-content-center'>
            <div className='col-12 col-lg-8'>
                <Link exaxt='true' to='/S/Parametre'><Button className='rounded-circle' icon='arrow left' /></Link>
                <br />
                <br />
                    {loading ?  
                            // <ProfileSetting genre={RenderSettingGenreKey(genre)} setting={setting}/> 
                            <>
                            {GConf.Setting[RenderSettingGenreKey(genre)].items.map( (Sitem,index) => 
                                <>
                                { Sitem.genre == 'C' ?
                                <CheckBoxSetting index={index} setting={setting[index]} data={Sitem} genre={genre}/>
                                :
                                <InputTextSetting index={index} setting={setting[index]} data={Sitem} genre={genre} setValueItem={setValueItem} />
                                }
                                </>
                            )}
                            </>
                            : 
                            SKLT.CardList  }
                    <br />
                    <div className='text-end mt-2'>
                        <Button  className='rounded-pill bg-system-btn'  onClick={ () => SaveChanges()} ><Icon name='save' /> Modifier <Loader inverted active={loaderState}  inline size='tiny' className='ms-2'/></Button>
                    </div>
                    <br />
            </div>
        </div>

        
    
    </> );
}

export default UpdateSettingPage;