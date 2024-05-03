import React, { useState } from 'react';
import { NavLink } from 'react-router-dom/dist';
import { toast } from 'react-toastify';
import GConf from '../AssetsM/generalConf';
import { Input } from 'semantic-ui-react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';
import { Select } from 'semantic-ui-react';
import franceMap from '../AssetsM/franceMap';
import {LoginSocialFacebook, LoginSocialGoogle} from 'reactjs-social-login'
import {FacebookLoginButton, GoogleLoginButton} from 'react-social-login-buttons'
import { Icon } from 'semantic-ui-react';
import { Loader } from 'semantic-ui-react';


function SignUpPage() {
    const [articleD, setArticleD] = useState({PictureId: '00',   BirthDay : new Date().toISOString().split('T')[0]});
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [delegList ,setDelegList] = useState([])
    const sexListe = [
            {id:1, text:'Male', value:'Male'},
            {id:2, text:'Female', value:'Female'},
    ]

    /* ############### Functions #################*/
    const GetDelegList = (value) =>{
        setArticleD({...articleD, BirthGouv: value })
        const found = franceMap.Region.filter(element => element.tag === value)
        setDelegList(found) 
      }
       

    const SignUpFunc = (event) => {
        if (!articleD.Name) {toast.error("Code à barre Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.PhoneNum) {toast.error("Genre Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.BirthDay) {toast.error("Groupage Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.BirthGouv) {toast.error("Socite Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.BirthDeleg) {toast.error("Prix Achat Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.Sex) {toast.error("Prix Vente Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.PictureId) {toast.error("Prix Promo Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.Identifiant) {toast.error("Quantite Invalide !", GConf.TostErrorGonf)}
        else if (!articleD.Password) {toast.error("Repture Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            setSaveBtnState(true)
            axios.post(`${GConf.ApiLink}/User/Sign-up`, {
                userData : articleD,
            }).then(function (response) {
                if(response.data.data.affectedRows) {
                    toast.success("User Enregistreé !", GConf.TostSuucessGonf)
                    setLS(false)
                     
                    localStorage.setItem('UserIsLogged', JSON.stringify({UID : response.data.UID , Name: articleD.Name, PhoneNum :articleD.PhoneNum , BirthDay:articleD.BirthDay ,  BirthGouv:articleD.BirthGouv ,  BirthDeleg:articleD.BirthDeleg , Sex:articleD.Sex , PictureId :articleD.PictureId  }));
                    localStorage.setItem('SearchIn', JSON.stringify({depart:response.data.BirthGouv, region:response.data.BirthDeleg}))
                    window.location.href = "/";
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                    setSaveBtnState(false)
                }
            }).catch((error) => {
                if(error.request) {
                  toast.error(<><div><h5>Probleme de Connextion</h5> L'article sera enregistrer sue votre ordinateur </div></>, GConf.TostInternetGonf)   
                  setSaveBtnState(false)
                  setLS(false)
                }
              });
            
        }
        
} 


    const TopCard = () =>{
        return(<>
                <div className='card card-body shadow-sm system-color rounded-0 fixed-top'>
                    <NavLink exact='true' to='/User/Login'>
                    <span className='bi bi-arrow-left bi-sm text-white'></span>
                    </NavLink>
                </div>
        </>)
}

    return ( <>
        <TopCard />
        <br />
        <br />
        <br />
        <br />
        <div className='container-fluid'>
            <div>
            <LoginSocialFacebook
                    className='mb-3'
                    appId='744682274298902'
                    // fieldsProfile={
                    //     'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender,user_location,user_gender,user_birthday'
                    // }
                    onResolve={(response) => {
                        console.log(response);
                        setArticleD({...articleD, Name: response.data.name })
                    }}
                    onReject={err => {
                        console.log(err);
                        }}
                >
                    {/* <FacebookLoginButton /> */}
                    
                    <Button fluid size='large' className='text-white bg-primary '><Icon name='facebook square' /> Utiliser  Facebook </Button>
            </LoginSocialFacebook> 
            </div>
            <div className='card card-body  shadow-sm border-div mb-4'>
                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-person-fill'></span> Nom & Prénon:</h5>
                <Input icon='user' iconPosition='left' placeholder='Nom & Prénon' className='w-100 border-0 shadow-sm rounded mb-3'  value={articleD.Name} onChange={(e) => setArticleD({...articleD, Name: e.target.value })}  />

                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-telephone-fill'></span> Telephone:</h5>
                <Input icon='phone' iconPosition='left' placeholder='+33' className='w-100 border-0 shadow-sm rounded mb-3'  value={articleD.PhoneNum} onChange={(e) => setArticleD({...articleD, PhoneNum: e.target.value })}  />
                
                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-telephone-fill'></span> Date de naissance :</h5>
                <Input icon='phone' type='date' iconPosition='left' defalultvalue={new Date().toISOString().split('T')[0]} className='w-100 border-0 shadow-sm rounded mb-3'  value={articleD.BirthDay} onChange={(e) => setArticleD({...articleD, BirthDay: e.target.value })}  />


                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-gender-ambiguous'></span> Sex:</h5>
                <Select placeholder='Sex'  className='mb-3'  fluid options={sexListe} value={articleD.Sex} onChange={(e, { value }) => setArticleD({...articleD, Sex: value })} />

                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt-fill'></span> Regions:</h5>
                <Select placeholder='Regions'    fluid options={franceMap.Depart} value={articleD.BirthGouv} onChange={(e, { value }) => GetDelegList(value)} />
                
                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-geo-alt'></span> Departements:</h5>
                <Select placeholder='Departements' fluid className='mb-3'  value={articleD.BirthDeleg} options={delegList} onChange={(e, { value }) => setArticleD({...articleD, BirthDeleg: value })} />


                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-key-fill'></span> Identifiant:</h5>
                <Input icon='key' iconPosition='left' placeholder='Identifiant' className='w-100 border-0 shadow-sm rounded mb-3'  value={articleD.Identifiant} onChange={(e) => setArticleD({...articleD, Identifiant: e.target.value })}  />
                
                <h5 className='mb-1 mt-2 text-secondary'><span className='bi bi-eye-slash-fill'></span> Mot de passe:</h5>
                <Input icon='eye slash' iconPosition='left' placeholder='Mot de passe' className='w-100 border-0 shadow-sm rounded mb-3'  value={articleD.Password} onChange={(e) => setArticleD({...articleD, Password: e.target.value })}  />

                <div className='mb-3 mt-4'>
                    <Button onClick={SignUpFunc} disabled={saveBtnState}  style={{backgroundColor:GConf.themeColor, color:'white'}} className='shadow-sm w-100'><Loader active={loaderState} /> S'inscrire </Button>
                </div>
            </div>
            <br />

    </div>
 </> );
}

export default SignUpPage;