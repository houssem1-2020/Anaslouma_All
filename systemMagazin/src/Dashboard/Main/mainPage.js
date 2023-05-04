import React  , { useEffect, useState } from 'react';
import axios from 'axios';
import GConf from '../../AssetsM/generalConf';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import { Bounce, Slide } from 'react-reveal';
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { Tab } from 'semantic-ui-react';


function MainPage() {
    /*#########################[Const]##################################*/
    const localsystemTag = localStorage.getItem(`Magazin_Secure_key`);
    const [statistique, setStat] = useState([]); 
    const [PieData, setPieData]= useState([])
    const [genreD, setGenreD]= useState([])
    const [commandeD, setCommandeD]= useState([])
    const [dataBar, setDataBar]= useState([])
    const [depoTR, setDepoRT]= useState([])
    const now = new Date();
    date.locale(fr)
    const panes = [
            {
            menuItem: 'Clients',
            render: () => <ChartsContainer chart={<PieChartCard data={PieData}/>} col='4' title='Distrubition des client' />,
            },
            {
            menuItem: 'Articles',
            render: () => <ChartsContainer chart={<PieChartCard data={genreD}/>} col='4' title='Distrubition des articless' />,
            },
            // {
            // menuItem: 'Commandes',
            // render: () => <ChartsContainer chart={<PieChartCard data={commandeD}/>} col='4' title='Distrubition des commandes' />,
            // },
    ]

   /*#########################[UseEffect]##################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/ma/stat`, {
            PID : GConf.PID,
          })
          .then(function (response) {
            console.log(response.data)
            // if(new Date(response.data.activationState.ExpiredThe) < new Date()){
            //     //LogOut()
            //     console.log('Expired ')
            //     toast.error(<><div className='card-body w-100'>
            //                 <h3 className='text-danger'>Votre System est Expiré</h3> 
            //                 vous devez réactiver votre système , Voir <a href='/S/Parametre'> Paramétre </a> pour plus d'info ou bien contactez l'administration ABYEDH
            //                 </div>
            //                 </>, GConf.TostExpired)
            // }

            

            setStat(response.data)   
            if(response.data.autoLogOut[0].Permission_Key != localsystemTag){LogOut()}
                     
            let clientDis = []
            response.data.clientCredit.map((datacld) => clientDis.push({ name: datacld.CL_Name, value: datacld.Totale  }))
            setPieData(clientDis)

            let genreDist = []
            response.data.genreDistro.map((datacld) => genreDist.push({ name: datacld.Genre, value: datacld.Totale }))
            setGenreD(genreDist)

            // let commandeDist = []
            // response.data.commandeDistro.map((datacld) => commandeDist.push({ name: datacld.State, value: datacld.Totale }))
            // setCommandeD(commandeDist)
            
            let camionRT = []
            response.data.caisseStat.map((data) => camionRT.push({ name: data.CA_Name, value: data.Recette }))
            setDataBar(camionRT)

            // let DepoRT = []
            // response.data.RecetteDepo.map((data) => DepoRT.push({ name: data.Cre_Date.split('T')[0],  value: data.Totale.toFixed(3) }))
            // setDepoRT(DepoRT)
        }).catch((error) => {
            if(error.request) {
              toast.error(<><div><h5>Probleme de Connextion</h5> Les Donnée importeé sont les ancien donneé</div></>, GConf.TostInternetGonf) 
            }
          });
         
    }, [])

    /*###########################[Function]############################ */
    const  capitalizeFirstLetter = (string) =>{
        return string.replace(/ .*/,'');
    }
    /*#########################[Card]##################################*/
    const LinkCard =  (props) => {

        return (<>
                
                <div className={`col-12 col-md-${props.data.col} mb-3`}>
                    <div className="card card-body bg-hover-card shadow-sm pb-2 border-div">
                        <NavLink exact="true" to={`../${props.data.link}`}   className="stretched-link" />
                        <div className="row">
                            <div className="col-4 align-self-center p-2">
                            <span className={`bi bi-${props.data.icon} bi-md`} style={{color:GConf.themeColor}}></span>
                            </div>
                            <div className='col-8 align-self-center text-end p-2'>
                                <div className="text-center">
                                <h3 ><CountUp end={statistique[props.data.dataTag]} decimals={props.data.isFloat ? 3 : false} decimal="," duration={3} /></h3>
                                {/* <h3 >{statistique[props.data.dataTag]}</h3> */}
                                    <small>{props.data.smallT}</small>
                                </div>
                            </div>
                        <div className='col-12 border-top pt-1 '>
                            <div className="row p-2" style={{color:GConf.themeColor}}>
                                <div className="col-10 align-self-center">{props.data.desc}</div>
                                <div className="col-2 align-self-center"><span className="bi bi-arrow-right-short bi-sm"></span></div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                
        </>);
    }
    const PieChartCard =  (props) =>{
        
        const COLORS = ['#E53935', '#D81B60', '#8E24AA', '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047', '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00', '#F4511E', '#6D4C41', '#757575', '#546E7A', '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C', '#EF9A9A', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D', '#FFE082'];
        return (
            <PieChart width={300} height={200} >
              <Pie
                data={props.data}
                cx={150}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {PieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          );
    }
    const LineChts = (props) => {
        return (<>
           <ResponsiveContainer width="100%" height={220} >
                <AreaChart
                    width={200}
                    height={60}
                    data={depoTR}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0, }}
                >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GConf.themeColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={GConf.themeColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                    <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={GConf.themeColor} strokeWidth={3} fill="url(#colorUv)" />
                        <XAxis hide  dataKey="name" />
                        <YAxis hide domain={[0, (Math.max(...depoTR.map(o => o.value)) + 10)]} />
          </AreaChart>
            </ResponsiveContainer>
        </>)
    }
    const BarCht = (props) => {

        return (<>
        <ResponsiveContainer  height={200} >
            <BarChart
                layout="vertical"
                data={dataBar} 
            >
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill={GConf.themeColor}  barSize={15}  radius={[0, 10, 10, 0]}/>
                <XAxis type="number" domain={[0, (Math.max(...dataBar.map(o => o.value)) + 10)]} hide  dataKey="value"/>
                <YAxis type="category"   dataKey='name' />
                
            </BarChart>
        </ResponsiveContainer>
        </>)
    }
    const TopCardTime = () =>{
        return(<>
            <div className='card card-body mb-4 rounded-system  main-big-card shaodw-sm'>
                <div className='row'>
                    <div className='col-8'>
                        <h1 className='text-white mb-0'>{date.format(now, 'dddd')}</h1>
                        <h1 className='text-white mt-0'>{date.format(now, ' DD - MMMM - YYYY')}</h1>
                    </div>
                    <div className='col-4 text-end align-self-center'>
                        <h1 style={{color:GConf.themeColor}}>{date.format(now, 'HH:mm')}</h1>
                    </div>
                </div>
            </div>
        </>)
    }
    const LinksCrads = () => {
        return(<>
            <div className="row justify-content-center mb-4">
                {GConf.LinkCard.map((stat,index) =>
                    <LinkCard key={index} data={stat}   />
                )}
            </div>
        </>)
    }
    const ChartsContainer = (props) =>{
        return(<>
                {/* <div className={`col-12 col-lg-${props.col} mb-4`}> */}
                
                    <div className="card p-1  border-div ">
                        <h6 className='card-body'><b>{props.title}</b></h6>
                        {props.chart}
                    </div>
                    
                {/* </div> */}
                </>)
    }

    /*#########################[Functions]##################################*/
    const LogOut = () =>{
        localStorage.clear();
        window.location.href = "/login";
    }
    
    return (<>
        <br />
        <TopCardTime />
        <Slide  bottom > 
            <LinksCrads /> 
            <div className='row p-0'>
                <div className='col-12 col-lg-8 mb-4 '> 
                        <h5 className='mt-3 mb-4'>Evolution de Recette</h5> 
                        {/* <ChartsContainer chart={<LineChts  data={depoTR}/>} col='7' title='' /> */}
                        <ChartsContainer chart={<BarCht />} col='7' title='Recette des Camions' /> 

                </div>
                <div className='col-12 col-lg-4 mb-4'> <Tab menu={{ secondary: true }} panes={panes} /></div>
                {/* <div className='col-12 col-lg-6 mb-4'><ChartsContainer chart={<BarCht />} col='5' title='Recette des Commandant' /> </div> */}

            </div>
            <div className="row justify-content-center mb-4 d-none">
                <ChartsContainer chart={<BarCht />} col='5' title='Recette des Camions' />
                {/* <ChartsContainer chart={<LineChts  data={depoTR}/>} col='7' title='Evolution de Recette' /> */}
                <ChartsContainer chart={<PieChartCard data={commandeD}/>} col='4' title='Evolution de Recette' />
                <ChartsContainer chart={<PieChartCard data={PieData}/>} col='4' title='Distrubition des client' />
                {/* <ChartsContainer chart={<PieChartCard data={genreD}/>} col='4' title='Distrubition des articless' /> */}
            </div>    
        </Slide >    
    </>);
}

export default MainPage;