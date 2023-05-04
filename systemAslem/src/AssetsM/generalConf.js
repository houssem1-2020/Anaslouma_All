import marker from "leaflet/dist/images/position.gif";

const GConf = {

    // main variables
    SystemTag: 'alimentaire', //'cosmetique',
    MainLink : 'http://localhost:3005', //https://api.system.ansl.tn
    ApiLink : 'https://api.system.ansl.tn/API/System', //https://api.system.ansl.tn/API/System 
    ApiCommandeLink : 'https://api.system.ansl.tn/API/Commande', //https://api.system.ansl.tn/API/System 
    ApiCamionLink : 'https://api.system.ansl.tn/API/Camion', //https://api.system.ansl.tn/API/System 
    DefaultTva: 19,
    DefaultTotGros: 5000,
    themeColor : '#2953e8',
    TostErrorGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    },
    TostSuucessGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    },
    TostPannier : {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        //transition:'slide'
    },
    TostInternetGonf : {
        position: "bottom-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
    },
    LeafleftIcon : {
        iconUrl: require("leaflet/dist/images/position.gif"),
        iconRetinaUrl: require("leaflet/dist/images/position.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    },
    LeafleftIconP : {
        iconUrl: require("leaflet/dist/images/position-personal.gif"),
        iconRetinaUrl: require("leaflet/dist/images/position-personal.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    },
    //NavBar Items
    NavsData : [
            {id:1, name:"Acceuil", icon:"house", link:"ma"},
            {id:2, name:"Commandes", icon:"calendar2-check", link:"rq"},
            {id:3, name:"Stock", icon:"upc-scan", link:"sk"},
            {id:4, name:"Factures", icon:"receipt-cutoff", link:"ft"},
            {id:5, name:"Camions", icon:"truck", link:"cm"},
            {id:6, name:"Clients", icon:"people", link:"cl"},
            {id:7, name:"Outils", icon:"tools", link:"ot"},
    ],

    //main stat card
    LinkCard: [
        { id: 1, col: 3 , tag:"article", dataTag:'articlesNum',  icon: 'upc-scan', link:'sk/ajouter', smallT: 'Article', desc: 'Nouveaux Article' , stat:'22452'},
        { id: 2, col: 3 , tag:"facture", dataTag:'facturesNum', icon: 'receipt-cutoff', link:'ft/ajouter', smallT: 'Factures', desc: 'Ajouter Facture' , stat:'22452'},
        { id: 3, col: 3 , tag:"client", dataTag:'clientsNum', icon: 'person', link:'cl/ajouter', smallT: 'Clients', desc: 'Ajouter Clients' , stat:'1235'},
        { id: 4, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'truck', link:'cm/ajouter-f', smallT: 'Camions', desc: 'Ajouter Fond' , stat:'22'},
    ],

    //main chart card
    ChartCard: [
        {id:1, genre: 'b', col:5, text: 'Recette des Camions '},
        {id:2, genre: 'l', col:7, text: 'Evolution de Recette '},
    ],

    //braedCrumb
    BreadCrumb:{
        stockAddArticle: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Ajouter Article', linkable:false}
        ],
        stockFamille: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Familles', linkable:false}
        ],
        stockBE: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Bon d\'entre', linkable:false}
        ],
        stockBS: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Bon de sortie', linkable:false}
        ],
        stockInfo: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Information', linkable:false}
        ],
        factureAjouter:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Ajouter Facture', linkable:false}
        ],
        factureInfo:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Info', linkable:false}
        ],
        factureEdit:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Modification', linkable:false}
        ],
        factureResumer:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Resumer', linkable:false}
        ],
        CamionAdd: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Ajouter Camion', linkable:false}
        ],
        CamionAddFond: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Ajouter Fond', linkable:false}
        ],
        CamionFondInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:"/S/cm"},
            {id:3, name:'Fond', linkable:true, link:"/S/cm"},
            {id:4, name:'Voir', linkable:false}
        ],
        CamionEditFond: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:"/S/cm"},
            {id:3, name:'Fond', linkable:true, link:"/S/cm"},
            {id:4, name:'Modifier', linkable:false}
        ],
        CamionInv: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Inventaire Camion', linkable:false}
        ],
        CamionInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:false}
        ],
        CamionArticleInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:".."},
            {id:3, name:'Article', linkable:false}
        ],
        CamionFactureInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:".."},
            {id:3, name:'Factures', linkable:true, link:".."},
            {id:4, name:'Voir', linkable:false}
        ],
        ClientAdd: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Ajouter Client', linkable:false}
        ],
        ClientInfo: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Info', linkable:false}
        ],
        ClientMap: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Map', linkable:false}
        ],
        ClientRegion: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Regions', linkable:false}
        ],
        RequestInfo: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Info', linkable:false}
        ],
        RequestCalendar: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Calendrier', linkable:false}
        ],
        RequestCompte: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Comptes', linkable:false}
        ],
        RequestReg: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
    },

    //SubNavs
    SubNavs: {
        request: [
            {id:1,  icon: 'check-circle', text: 'Accepté', link: 'g/accepte', dropD: false},
            {id:2,  icon: 'x-circle', text: 'Refusé', link: 'g/refusee', dropD: false},
            {id:3, icon: 'exclamation-circle', text: 'En Attent', link: 'g/en-attent', dropD: false },
        ],
        camion: [
            {id:1,  icon: 'plus-circle', text: 'Ajouter Camion', link: 'ajouter-c', dropD: false},
            {id:2,  icon: 'truck', text: 'Ajouter Fonds', link: 'ajouter-f', dropD: false},
            {id:3,  icon: 'sliders', text: 'Inventaire', link: 'inventaire', dropD: false},
        ],
        Stock: [
            {id:1,  icon: 'bookmark-plus', text: 'Nouveaux article', link: 'ajouter', dropD: false},
            {id:2, icon: 'tags', text: 'Famille', link: 'famille', dropD: false },
            {id:3, icon: 'box-arrow-in-up', text: 'Bond entre', link: 'be', dropD: false },
            {id:4, icon: 'box-arrow-up', text: 'Bond Sortie', link: 'bs', dropD: false },
        ],
        facture: [
            {id:1,  icon: 'receipt', text: 'Nouveaux Facture', link: 'ajouter', dropD: false},
            {id:2,  icon: 'file-earmark-medical-fill', text: 'Resumer', link: 'resumer', dropD: false},
        ],
        client: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Client', link: 'ajouter', dropD: false},
            // {id:2,  icon: 'map-fill', text: 'Régions', link: 'regions', dropD: false},
            {id:2,  icon: 'pin-map-fill', text: 'Clients Map', link: 'map', dropD: false},
            {id:3,  icon: 'bar-chart-line-fill', text: 'Statistique', link: 'map', dropD: false},
        ],
        Commande: [
            {id:1,  icon: 'person-plus-fill', text: 'Comptes', link: 'comptes', dropD: false},
            {id:2,  icon: 'bar-chart-line', text: 'Statistique', link: 'Regroupemment', dropD: false},
            {id:3,  icon: 'calendar-fill', text: 'Calendrier', link: 'calendrier', dropD: false},
        ],
    },
    
    //TableHead
    TableHead:{
        facture:['*','ID','Client','Camion','Jour','Totale','Stock','X','Voir'],
        request:['*','ID','Client', 'Passé le','Volu le','Totale','Etat','X','Voir'],
        stock:['*','Code', 'Nom', 'Genre','Stock','P.achat','P.vente','X','Voir'],
        camion:['*','Camion','Matricule', 'Chauffeur','Fond','Recette','X','Voir'],
        camionStock:['Code', 'Nom', 'Genre','Stock','Prix','Voir'],
        camionFacture:['ID','Client','Jour','Totale','Voir'],
        camionFond:['ID','Date','Totale', 'SDF','SCF','Voir'],
        client:['*','Nom','Matricule', 'Tel', 'Location','Adresse','Voir'],
        clientCommande:['ID', 'Passé le','Volu le','Totale','Etat','Voir'],
        clientFacture:['ID','Client','Jour','Totale','Voir'],
        clientFactureC:['ID','Client','Jour','Totale','Voir'],
        team:['Nom','Etat', 'Post','Commencé']

    },


}
 
export default GConf 