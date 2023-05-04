import React, { useEffect, useState } from 'react';
import { Bounce } from 'react-reveal';
import { Tab, Divider, Icon, Statistic, Comment, Input, Button, Form, TextArea, Select, Loader, Dropdown, Checkbox} from 'semantic-ui-react';
import QRCode from "react-qr-code";
import { Rating } from 'semantic-ui-react'
import GConf from '../../AssetsM/generalConf';
import axios from 'axios';
import { toast } from 'react-toastify';
import SKLT from '../../AssetsM/usedSlk';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import AvatarGroup from '@atlaskit/avatar-group';
import FrameForPrint from '../Assets/frameForPrint';
import usePrintFunction from '../Assets/Hooks/printFunction';
import TunMap from '../../AssetsM/tunMap';

const EditProfile = ({generalData, setGeneralData, UpdateGeneralDataFunc, delegList,GetDelegList,loaderState}) =>{
    const genreOptions = [
        { key: 1 , value: 'Alimentaire', text: 'Alimentaire' },
        { key: 2 , value: 'cosmetique', text: 'cosmetique' },
        { key: 3 , value: 'habillemment', text: 'habillemment' },
        { key: 4 , value: 'medicamment', text: 'medicamment' },
        { key: 5 , value: 'educuatif', text: 'educuatif' },
        { key: 6 , value: 'construction', text: 'construction' },
        { key: 7 , value: 'Boisson', text: 'Boisson' },
        
      ]
    return ( <>
        <h3>Information Génerale</h3> 
        <h5 className='mb-1'>Matricule Fiscale</h5>
        <Input icon='key' iconPosition='left' placeholder='Mtricule Fiscale' value={generalData.Matricule_F} onChange={(e) => setGeneralData({...generalData, Matricule_F: e.target.value })} fluid />
        
        <h5 className='mb-1'>Nom et Prenon</h5>
        <Input icon='user' iconPosition='left' placeholder='Nom' value={generalData.Name} onChange={(e) => setGeneralData({...generalData, Name: e.target.value })} fluid />
        
        <h5 className='mb-1'>Telephone</h5>
        <Input icon='phone' iconPosition='left' placeholder='telephone' value={generalData.Phone} onChange={(e) => setGeneralData({...generalData, Phone: e.target.value })} fluid />
        <h5 className='mb-1'>Geolocation</h5>
        <div className='mb-2'>
            <Select placeholder='Selectionnez Gouvernorat' fluid className='mb-2' options={TunMap.Gouv} value={generalData.Gouv} onChange={(e, { value }) => GetDelegList(value)} />
            <Select placeholder='Selectionnez Delegation ' fluid value={generalData.Deleg} options={delegList} onChange={(e, { value }) => setGeneralData({...generalData, Deleg: value })} />
        </div>
        <h5 className='mb-1'>Adresse</h5>
        <Form>
             <TextArea  rows="3" placeholder='Adresse' className='w-100'  value={generalData.Adress} onChange={(e) => setGeneralData({...generalData, Adress: e.target.value })} />
        </Form>
        <h5 className='mb-1'>Genre</h5>
        <Dropdown
            search
            selection
            fluid
            wrapSelection={false}
            options={genreOptions}
            placeholder='Selectionnez Client'
            className='mb-1'
            onChange={(e, { value }) => setGeneralData({...generalData, Genre: value })}
            value={generalData.Genre}
        />
        <br />
        <div className='text-end'>
            <Button  className='rounded-pill bg-system-btn' onClick={() => UpdateGeneralDataFunc()} ><Icon name='save' /> Modifier <Loader active={loaderState} inverted  inline size='tiny' className='ms-2'/></Button>
        </div>

    </> );
}
const EditPassword = ({passwordData, setPasswordData, UpdatePasswordFunc,loaderState}) =>{
    return(<>
        <h3>Modification de la mot de passe</h3>
        <h5 className='mb-1'>Idenbtifiant</h5>
        <Input icon='user' iconPosition='left' placeholder='Nom' value={passwordData.Identification} onChange={(e) => setPasswordData({...passwordData, Identification: e.target.value })}   fluid />
        <h5 className='mb-1'>Mot de passe</h5>
        <Input icon='eye' iconPosition='left' placeholder='telephone' value={passwordData.PasswordSalt} onChange={(e) => setPasswordData({...passwordData, PasswordSalt: e.target.value })}   fluid />
        <br />
        <div className='text-end'>
            <Button  className='rounded-pill bg-system-btn' onClick={() => UpdatePasswordFunc()} ><Icon name='save' /> Modifier <Loader active={loaderState} inverted  inline size='tiny' className='ms-2'/></Button>
        </div>
    </>)
}


function ProfilePage() {
    /*###############################[Const]################################# */
    const [profileData, setProfileData] = useState([])
    const [generalData, setGeneralData] = useState({Name:'',Phone:'', Adress:'',Genre:''})
    const [passwordData, setPasswordData] = useState({Identification:'',PasswordSalt:''})
    const [horaireData, setHoraireData] = useState([])
    const [uploadImageName, setUploadImageName] = useState('')
    const [uploadImage, setUploadImages] = useState()
    const [displayedImage, setDisplayedImage] = useState()
    const [alwaysState , setAlwaysState] = useState(false)
    const [loading , setLoading] = useState(false)
    const [saveBtnState, setSaveBtnState] = useState(false)
    const [loaderState, setLS] = useState(false)
    const [myPosition, setMyPosition] = useState([36.17720,9.12337])
    const [delegList ,setDelegList] = useState([])

    L.Icon.Default.mergeOptions(GConf.LeafleftIcon );
    const panes = [
        {
            menuItem: { key: 'edit', icon: 'edit outline', content: 'Modifier' }, 
            render: () =><><Tab.Pane className='border-div' attached={false}><EditProfile generalData={generalData} setGeneralData={setGeneralData} UpdateGeneralDataFunc={UpdateGeneralDataFunc} delegList={delegList} GetDelegList={GetDelegList} loaderState={loaderState} /></Tab.Pane> <br/></>,
        },
        {
            menuItem: { key: 'mpd', icon: 'eye slash', content: 'MDP' }, 
            render: () =><><Tab.Pane className='border-div' attached={false}><EditPassword passwordData={passwordData} setPasswordData={setPasswordData} UpdatePasswordFunc={UpdatePasswordFunc} loaderState={loaderState} /> </Tab.Pane> <br/></>,
        },
        {
            menuItem: { key: 'comment', icon: 'time', content: 'Horaire' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}><Horaire /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'position', icon: 'map', content: 'Position' },
            render: () => <><Tab.Pane className='border-div' attached={false}><PositionMap  /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'images', icon: 'images', content: 'Images' },
            render: () => <><Tab.Pane className='border-div' attached={false}><ImageCard /></Tab.Pane><br /></>,
        },
        {
            menuItem: { key: 'rate', icon: 'star', content: 'Evaluation' }, 
            render: () => <><RatingProfile /><CommentsProfile /></>,
        }, 
        {
            menuItem: { key: 'print', icon: 'print', content: 'Imprimer' }, 
            render: () => <><Tab.Pane className='border-div' attached={false}><PrintProfile /></Tab.Pane><br /></>,
        },
    ]


    /*###############################[UseEffect]################################# */
    useEffect(() => {
        GetPositionNow();
        axios.post(`${GConf.ApiLink}/profile`, {
            PID: GConf.PID,
        })
        .then(function (response) {
            setProfileData(response.data)
            setPasswordData(response.data.password[0])
            setGeneralData(response.data.general[0])
            setAlwaysState(response.data.horaire[0].ALL_Time)
            setHoraireData(JSON.parse(response.data.horaire[0].WorkingTime))
            setLoading(true)

        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Esseyeé de connecter plus tard</div></>, GConf.TostInternetGonf) 
              setProfileData([])
              //setLoading(true)
            }
        });
    }, [])

    /*###############################[Function]################################# */
    const CalculateRating = (table) =>{
        let tot = 0;
        table.map( data => {
            tot = tot + data.Rating
        })

        return parseFloat(tot / table.length).toFixed(1)
    }
    const CalculateLikes = (table) =>{
        const WantedValue =  table.length ;
        if ( WantedValue / 1000 > 1 && WantedValue / 1000000 < 1) { return parseFloat(WantedValue / 1000 ).toFixed(1) + 'K' }
        else  if (WantedValue / 1000000 > 1) { return parseFloat(WantedValue / 1000000 ).toFixed(1) +'M' }
        else{ return parseInt(WantedValue)  }
    }
    const CalculateReview = (table, value ) =>{
        let filteredArray = table.filter(obj => parseInt(obj.Rating) == value );

        return(parseInt((filteredArray.length / table.length) * 100 ) )
    }
    const UploadImageFunc = (e) => {
        setDisplayedImage(URL.createObjectURL(e.target.files[0]))
        setUploadImages(e.target.files[0])
    }
    const UpdateImageFunc = (genre) =>{
        if (!uploadImage) {toast.error("Image est Invalide !", GConf.TostErrorGonf) } 
        else {
            const formData = new FormData();
            formData.append("Images", uploadImage);
            formData.append("PID", GConf.PID);
            formData.append("Genre", genre);
            setLS(true)
            axios({
                method: 'post',
                url: `${GConf.ApiInputLink}/nouveaux/image`,
                data: formData ,
            }).then(function (response) {
                toast.success("Image Enregistreé !", GConf.TostSuucessGonf)
                setLS(false)
            }).catch((error) => {
                toast.error(<><div><h5>Probleme de Connextion</h5> La commande sera enregisstrer sur votre appareil  </div></>, GConf.TostInternetGonf)
            });  
        } 
    }

    // const UpdateImageFunc = () =>{
    //     if (!uploadImage) { } 
    //     else if (!uploadImageName) { }
    //     else {
    //         const formData = new FormData();
    //         formData.append("ProfileImage", uploadImage);
    //         formData.append("Tag", uploadImageName);
    //         formData.append("PID", GConf.PID);
    //         axios({
    //             method: 'post',
    //             url: `${GConf.ApiLink}/profile/images/ajouter`,
    //             data: formData ,
    //         }).then(function (response) {
    //             console.log(response.data)
    //         }).catch((error) => {
    //             console.log(error)
    //         });  
    //     } 
    // }
    // const UploadImageFunc = (e) => {
    //     setDisplayedImage(URL.createObjectURL(e.target.files[0]))
    //     setUploadImages(e.target.files[0])
    // }
    const PrintFunction = (frameId) =>{usePrintFunction(frameId)}
    const ReturnAvatarGroupList = (list) =>{
        let FinalList = []

        list.map( (data,index) => FinalList.push({ key: index, name: data.Name , src: `https://cdn.abyedh.tn/images/p_pic/${data.PictureId}.gif`},))
        return FinalList
    }
    const GetDelegList = (value) =>{
        setGeneralData({...generalData, Gouv: value })
        const found = TunMap.Deleg.filter(element => element.tag === value)
        setDelegList(found)
    }
    const GetPositionNow = () =>{
        //get position 
        navigator.geolocation.getCurrentPosition(
            function(position) {
                if (!position.coords.latitude) {toast.error(<><div><h5>ENTRE VOTRE POSITION Lat</h5></div></>, GConf.TostInternetGonf)}
                else if (!position.coords.longitude) {toast.error(<><div><h5>ENTRE VOTRE POSITION Lng</h5></div></>, GConf.TostInternetGonf)}
                else{
                    setMyPosition([position.coords.latitude, position.coords.longitude])
                }
            },
            function(error) {
                toast.error(<><div><h5>ENTRE VOTRE POSITION</h5></div></>, GConf.TostInternetGonf)
            }
        );
    }
    const CheckPositions = () =>{
        let LAT = myPosition[0] === JSON.parse(generalData.Lat)
        let LNG = myPosition[1] === JSON.parse(generalData.Lng)
        return (LAT && LNG)
    }

    /* Save */
    const UpdateGeneralDataFunc = () =>{
            if (!generalData.Matricule_F) {toast.error("Matricule est Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Name ) {toast.error("Nom de la ste est  Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Gouv ) {toast.error("Gouv est  Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Deleg ) {toast.error("Delegation est  Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Phone ) {toast.error("Phone est  Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Adress ) {toast.error("Adress est  Invalide !", GConf.TostErrorGonf)}
            else if (!generalData.Genre ) {toast.error("Genre est  Invalide !", GConf.TostErrorGonf)}
            else{
                setLS(true)
                axios.post(`${GConf.ApiLink}/profile/update/general`, {
                    PID : GConf.PID,
                    profileDataSent : generalData,
                }).then(function (response) {
                    console.log(response.data)
                    if(response.data.affectedRows) {
                        toast.success("Profile Modifieé !", GConf.TostSuucessGonf)
                        setLS(false)
                    }
                    else{
                        toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                        setLS(false)
                    }
                })                
            }
    }
    const UpdatePasswordFunc = () =>{
        if (!passwordData.Identification) {toast.error("Identifiant est Invalide !", GConf.TostErrorGonf)}
        else if (!passwordData.PasswordSalt ) {toast.error("Mot de passe est  Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/profile/update/password`, {
                PID : GConf.PID,
                passwordDataSent : passwordData,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Mot de Passe Modifieé !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            })                
        }
    }
    const UpdatePositionFunc = () =>{
        if (!passwordData.Identification) {toast.error("Identifiant est Invalide !", GConf.TostErrorGonf)}
        else if (!passwordData.PasswordSalt ) {toast.error("Mot de passe est  Invalide !", GConf.TostErrorGonf)}
        else{
            setLS(true)
            axios.post(`${GConf.ApiLink}/profile/update/position`, {
                PID : GConf.PID,
                positionDataSent : myPosition,
            }).then(function (response) {
                if(response.data.affectedRows) {
                    toast.success("Position Modifieé !", GConf.TostSuucessGonf)
                    setLS(false)
                }
                else{
                    toast.error('Erreur esseyez de nouveaux', GConf.TostSuucessGonf)
                    setLS(false)
                }
            })                
        }
    }

    /*###############################[Card]################################# */
    const ProfileCard = () =>{
        return(<>
            <div className="card card-body shadow-sm mb-4 sticky-top border-div" style={{top:'70px'}}>
	            <div className="text-center ">
	            	<img className="rounded-circle mb-3" src="https://assets.abyedh.tn/img/system/ads/storage.svg" width="90px" height="90px"/>
	            
	            	 <h6>{loading ? profileData.general[0].Name : SKLT.BarreSkl } </h6>
	            	 <div><small className="text-secondary">Point de Vente En gros ({loading ? profileData.general[0].Genre : SKLT.BarreSkl })</small></div>
	            	<div><small className="text-secondary"><span className="bi bi-geo-alt"></span> {loading ? <> {profileData.general[0].Adress} , {profileData.general[0].Gouv} </> : SKLT.BarreSkl } </small></div>
	            	<div><small className="text-secondary"><span className="bi bi-telephone"></span> +216{loading ? profileData.general[0].Phone : SKLT.BarreSkl } </small></div> 
					<Divider /> 
					<div className='row mt-2'>
						<div className='col-6'>
						    <Statistic color='red' size='small'>
								<Statistic.Value>
                                {loading ? CalculateRating(profileData.review) : SKLT.BarreSkl }
								</Statistic.Value>
								<Statistic.Label>Avis</Statistic.Label>
							</Statistic>
						</div>
						<div className='col-6'>
							<Statistic color='red' size='small'>
								<Statistic.Value>
                                 {loading ? CalculateLikes(profileData.likes) : SKLT.BarreSkl }
								</Statistic.Value>
								<Statistic.Label>J'aimes</Statistic.Label>
							</Statistic>
						</div>
					</div>
					<Divider />
					<div className='row'>
						<div className='col-3'>
							<Icon circular inverted color='red'  name='youtube' />youtube
						</div>
						<div className='col-3'>
							<Icon circular inverted color='blue'  name='facebook square' /> facebook
						</div>
						<div className='col-3'>
							<Icon circular inverted color='pink'  name='instagram' /> instagram
						</div>
						<div className='col-3'>
							<Icon circular inverted color='yellow'  name='snapchat ghost' /> snapchat
						</div>
					</div>
					<br />
					<br />
					<div className='d-grid gap-2'>
						<a className='btn btn-danger btn btn-lg bnt-block rounded-pill text-white ' target="_blank" href={`https://t.abyedh.tn/S/P/storage/${GConf.PID}`}>
							<span className='bi bi-person-circle me-3'></span>    
							 Profile 
						</a>
					</div>
	            </div>
            </div>
        </>)
    }
    const PrintProfile = () =>{ 
        return(<>
            <div className="d-flex">
                <div className="flex-shrink-0">
                <QRCode value={GConf.PID} size={130} />
                </div>
                <div className="flex-grow-1 ms-3">
                        <h1> {GConf.PID} </h1>
                        Cet identifiant vous distinguera des autres inscrits sur la plateforme. Cela peut aussi être un court moyen de faire de la publicité pour vous
                </div>
            </div>
            <Divider />
            <div className="d-flex">
                <div className="flex-shrink-0">
                <QRCode value={`c=docteur&PID=${GConf.PID}`} size={130} />
                </div>
                <div className="flex-grow-1 ms-3">
                    Imprimez ce lien qui peut être accroché à la porte de votre magasin afin que vos clients puissent vous joindre facilement, et il peut également être partagé directement sur les réseaux sociaux
                    <div className='mt-2'>
                        <Button size='mini' positive onClick={(e) => PrintFunction('printPID')}> <Icon name='print'  />Imprimer</Button>
                        <Button size='mini' primary target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://t.abyedh.tn/S/P/storage/${GConf.PID}`} >  <Icon name='facebook f' /> Partager </Button>
                    </div>
                </div>
            </div>
        </>)
    }
    const LikesProfile = () =>{    
        return(<>
        <div className='card card-body shaows-sm mb-2'>
            <h5>J'aimes</h5>
            { loading ?
            
                profileData.likes.map( (data,index) => <span key={index}>{data.Name}</span>)

             : 'fa'
            }
        </div>
       
        </>)
    }
    const PositionMap = () =>{    
        return(<>
            <div className='p-1'>
                    <h5>Location</h5>
                    <div className='row mb-3'>
                        <div className='col-8'> 
                        Lorsque vous cliquer ici la position enregistré sera 'Mon position' 
                        </div>
                        <div className='col-4 text-end'> 
                                <Button  className='rounded-pill bg-system-btn' disabled={CheckPositions()} size='mini' onClick={ () => UpdatePositionFunc()} ><Icon name='save' /> Modifier Position <Loader inverted active={loaderState}  inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>
                    <MapContainer center={[36.071,9.333]} zoom={7} scrollWheelZoom={false} className="map-height">
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[generalData.Lat,generalData.Lng]}>
                            <Popup>Position Enregistrée</Popup>
                        </Marker>
                        <Marker position={[myPosition[0],myPosition[1]]}>
                            <Popup>Mon Position</Popup>
                        </Marker>
                    </MapContainer> 
            </div>
       
        </>)
    }
    const Images = () =>{   
        const imagesGenres = [
            { key: 1 , value: 'Photo de profile', text: 'Photo de profile' },
            { key: 2 , value: 'Image 1', text: 'Image 1' },
            { key: 3 , value: 'Image 2', text: 'Image 2' },
            { key: 4 , value: 'Image 3', text: 'Image 3' },
            { key: 5 , value: 'Image 4', text: 'Image 4' },
            { key: 6 , value: 'Image 5', text: 'Image 5' },
            
        ]

        const ImageCard = (props) =>{
            return(<>
                <div className='card p-1 mb-2 rounded'>
                    <div className='row'>
                        <div className='col-3'>
                            <img className='rounded' src={window.location.origin +  `${GConf.AssetsLink}/${props.data.ImageLink}`}  alt={props.data.Descreption} width='100%' height='80px' />
                        </div>
                        <div className='col-4'>
                            {props.data.ImageTag}
                        </div>
                        <div className='col-5'></div>
                    </div>
                </div>
            </>)
        }
        const UploadImage = () =>{
            return(<>
                <div className='card p-2 mb-2 rounded'>
                {/* <form encType="multipart/form-data"> */}
                    <div className='row'>
                        <div className='col-1 align-self-center text-end'>
                            <label onChange={UploadImageFunc} htmlFor="formId" className='text-info ' role="button">
                               <Input type='file' hidden name="imagez" id="formId"  />
                                <span className='bi bi-cloud-upload-fill bi-md'></span>
                            </label>
                        </div>
                        <div className='col-3'>
                            {displayedImage ? <img src={displayedImage} width='100%' height='50px'  /> : ''}
                        </div>
                        <div className='col-5 align-self-center text-end'>
                        <Dropdown
                            search
                            selection
                            fluid
                            size='mini'
                            wrapSelection={false}
                            options={imagesGenres}
                            placeholder='Selectionnez'
                            className='mb-1 rounded-pill'
                            onChange={(e, { value }) => setUploadImageName(value)}
                            value={uploadImageName}
                        />
                        </div>
                        <div className='col-3 align-self-center text-end'>
                            <Button  className='rounded-pill bg-system-btn' size='tiny' onClick={UpdateImageFunc} ><Icon name='save' /> Modifier <Loader inverted  inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>
                {/* </form> */}
                </div>
            </>)
        }
        return(<>
            <div className='p-2 mb-2'>   
                {profileData.images.map( (data,index) => <ImageCard key={index} data={data} />)}
                <br />
                <UploadImage />
            </div>
       
        </>)
    }
    const ImageCard = () =>{
        const UploadImageCard = () =>{
            return(<>
                <div className='card p-2 shadow-sm mb-2 border-div'>
                    <div className='row'>
                        <div className='col-2 align-self-center text-center'>
                                <label onChange={UploadImageFunc} htmlFor="formId" className='text-info' role="button">
                                    <Input type='file' hidden name="imagez" id="formId"  />
                                    <span className='bi bi-cloud-upload-fill bi-md'> </span> 
                                </label>
                                
                        </div>
                        <div className='col-10'>
                            <div className=' text-center p-4  '>
                                {displayedImage ? <img src={displayedImage} width='300px' height='160px'  /> : 'PaS d\'image'}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </>)
        }
        return(<>
                <UploadImageCard title='Image de Profile' tag='profile' /> 
                <br />
                <div className='row'>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image de profile</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Profile')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image 1</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Image1')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image 2</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Image2')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image 3</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Image3')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image 4</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Image4')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='card p-2 mb-2 border-div'>
                                <h6>En tant que Image 4</h6>
                                <Button disabled={!saveBtnState} className='rounded-pill bg-system-btn' size='tiny' onClick={() => UpdateImageFunc('Image5')} ><Icon name='save' /> Enregistreé <Loader inverted active={loaderState} inline size='tiny' className='ms-2 text-danger'/></Button>
                            </div>
                        </div>     
                </div>
        </>)
    }
    const RatingProfile = () =>{
        const RatingBar = (props) => {
            return (<>
                <div className="row">
                    <div className="col-2"><h3>{props.name}</h3></div>
                    <div className="col-8 align-self-center">
                        <div className="progress" style={{height: "5px"}}>
                            <div className="progress-bar bg-warning" role="progressbar" style={{width: `${props.value}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div> 
                    </div>
                    <div className="col-2"><h6>{props.value} %</h6></div>
                </div>
            </>)
        }
        return (<>
            <div className='card card-body shadow-sm border-div mb-2 text-center'>
                <h5 className='text-start'>Avis</h5>
                <div className='row'>
                    <div className='col-4 align-self-center'>
                        <h1 className='text-warning'>{loading ? <> {CalculateRating(profileData.review)}</>: 0 }</h1>
                        <Rating className='d-inline' maxRating={5} defaultRating={loading ? CalculateRating(profileData.review) : 0 } icon='star' disabled size='massive' />
                        <h6 className="pt-2">{loading ? profileData.review.length : 0 } </h6>
                    </div>
                    <div className='col-8'>
                        <RatingBar name={1} value={loading ? CalculateReview(profileData.review, 1) : 0 } />
                        <RatingBar name={2} value={loading ? CalculateReview(profileData.review, 2) : 0 } />
                        <RatingBar name={3} value={loading ? CalculateReview(profileData.review, 3) : 0 } />
                        <RatingBar name={4} value={loading ? CalculateReview(profileData.review, 4) : 0 } />
                        <RatingBar name={5} value={loading ? CalculateReview(profileData.review, 5) : 0 } />
                    </div>
                </div>                
            </div>
        </>)
    }
    const CommentsProfile = () =>{

        const CommentsCard = (props) => {
            return (<>
                    <div className="d-flex mb-2 border-bottom">
                        <div className="flex-shrink-0">
                            <img src={`https://cdn.abyedh.tn/images/p_pic/${props.data.PictureId}.gif`} className='rounded-circle' width='30px' alt="..." />
                        </div>
                        <div className="flex-grow-1 ms-3 w-100">
                            <div className='row  mb-0'>
                               <div className='col-6 text-start'>{props.data.Name}</div>
                               <div className='col-6 text-end'><small className='text-secondary'> {new Date (props.data.R_Date).toLocaleDateString()}</small></div>
                            </div>
                            <div><b>{props.data.Comment} </b></div>
                        </div>
                    </div>
            </>)
        }

        return(<>
        
                <div className='row '>
                    <div className='col-9 pe-1'>
                        <div className='card card-body shadow-sm mb-2 border-div'>
                        <h5>Commentaires</h5> 
                        <div style={{height:'200px', overflowX:'auto', overflowX:'hidden'}}>
                            { loading ?
                                <Comment.Group>
                                { profileData.review.map( (data,index) =>  <CommentsCard key={index} data={data} /> )}
                                </Comment.Group>
                                : '...'
                            }    
                        </div>  
                        </div>
                    </div>
                    <div className='col-3 ps-1'>
                        <div className='card card-body shadow-sm mb-2 border-div'>
                            <h5>J'aimes</h5>
                            <div style={{height:'200px', overflowX:'auto', overflowX:'hidden'}}>
                                    <h2 className='text-center'>{profileData.likes ? profileData.likes.length : '...'}</h2> 
                                    <AvatarGroup className='text-center' appearance="grid" maxCount={12} data={ReturnAvatarGroupList(profileData.likes)} size='small' borderColor="#cfcecc" />
                                    {/* { loading ?
                                    
                                        profileData.likes.map( (data,index) => <a href='https://www.abyedh.tn' key={index}>{data.Name}</a>)

                                    : 'fa'
                                    } */}
                                    
                            </div>
                        </div>
                    </div>
                </div>
        </>)
    }
    const Horaire = () =>{
        const DayHoraire = (props) =>{
            return(<>
                    <div className='row'>
                        <div  className='col-1 align-self-center'>
                            <b>{props.data.day}</b>
                        </div>
                        <div  className='col-5'>
                            <div className='row'>
                                <div className='col-6'><Input icon='calendar alternate' type='time' size="mini" iconPosition='left' disabled={JSON.parse(props.data.dayOff)}  fluid className='mb-1' value={props.data.matin.start}/></div>
                                <div className='col-6'><Input icon='calendar alternate' type='time' size="mini" iconPosition='left' disabled={JSON.parse(props.data.dayOff)}  fluid className='mb-1' value={props.data.matin.end}/></div>
                            </div>
                        </div>
                        <div  className='col-5'>
                            <div className='row'>
                                <div className='col-6'><Input icon='calendar alternate' type='time' size="mini" iconPosition='left' disabled={JSON.parse(props.data.dayOff)}  fluid className='mb-1' value={props.data.soir.start}/></div>
                                <div className='col-6'><Input icon='calendar alternate' type='time' size="mini" iconPosition='left' disabled={JSON.parse(props.data.dayOff)}  fluid className='mb-1' value={props.data.soir.end}/></div>
                            </div>
                        </div>
                        <div  className='col-1 align-self-center'>
                            <div className="form-check form-switch">
                                <input className="form-check-input form-check-input-lg" type="checkbox"  onChange={() => setAlwaysState(!props.data.dayOff)}  checked={JSON.parse(props.data.dayOff)} />
                            </div>
                        </div>
                    </div>
            </>)
        }
        return(<>
            <div className='card-body '>
                <div className='row'>
                    <div className='col-12 col-lg-11 align-self-center'> 
                        <h5 className='mb-0'>Toujour Overt</h5>  
                        <small>Coucher pour apraitre que vous étes toujour ouvert </small>
                    </div>
                    <div className='col-12 col-lg-1 align-self-center'> 
                        <div className="form-check form-switch">
                            <input className="form-check-input form-check-input-lg" type="checkbox"  onChange={() => setAlwaysState(!alwaysState)}  checked={alwaysState} />
                        </div>
                    </div>
                </div>
                <Divider />
                <div className='row text-danger mb-2'>
                    <div  className='col-1'> <b>Jour</b> </div>
                    <div  className='col-5'> <small>Matin</small> </div>
                    <div  className='col-5'> <small>Soir</small> </div>
                    <div  className='col-1'> <small>Repos</small> </div>
                </div>
                
                {
                    horaireData.map( (data,index) => <DayHoraire key={index} data={data}/>)
                }
                {/* <DayHoraire />
                <DayHoraire />
                <DayHoraire />
                <DayHoraire />
                <DayHoraire />
                <DayHoraire /> */}

                <div className='row mb-2 mt-4'>
                        <div className='col-8'> </div>
                        <div className='col-4 text-end'> 
                                <Button  className='rounded-pill bg-system-btn' size='mini' ><Icon name='save' /> Modifier Horaire <Loader inverted  inline size='tiny' className='ms-2'/></Button>
                        </div>
                    </div>
            </div>

        </>)
    }
    return (<>
        <Bounce bottom>
            <h5><span className="bi bi-person-circle"></span> Profile</h5>
            <br /><br />
            <div className="row">
                    <div className="col-12 col-lg-4">
                        <ProfileCard /> 
                        <p>{uploadImageName}</p>
                    </div>
                    <div className="col-12 col-lg-8">
                        <Tab menu={{ secondary: true, pointing: true ,className: "wrapped"}} panes={panes} />
                    </div>
        </div>
        </Bounce>
        <FrameForPrint frameId='printPID' src={`/Pr/Profile/pid`} />
    </>);
}

export default ProfilePage;