const GetPID = () =>{
    const pidIsSet = localStorage.getItem('PID');
    return pidIsSet
}

const GetSettingValue = () =>{
    const defaultSetting = {
        Stock :[true,false,20],
        Factures :[true,false,20],
    };
    return defaultSetting
}

const GConf = {

    // main variables
    PID: GetPID(),
    ApiLinkSoket : 'http://localhost:3005', //https://api.system.ansl.tn/API 
    ApiLink : 'https://api.system.ansl.tn/API/Magazin', //https://api.system.ansl.tn/API 
    ApiGerantLink : 'https://api.system.ansl.tn/API/Gerant', //https://api.system.ansl.tn/API 
    ApiCaisseLink : 'https://api.system.ansl.tn/API/Caisse', //https://api.system.ansl.tn/API 
    DefaultTva: 0,
    themeColor : '#6a107a',
    themeColorLigth : '#b8cbd4',
    settingValue : GetSettingValue(),
    TostErrorGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    },
    TostSuucessGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        //className:'toast-bg-card text-success font-bold'
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
    TostCaisseGonf : {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
    },
    TostExpired : {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
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
            {id:5, name:"Caisses", icon:"pc-display-horizontal", link:"ca"},
            {id:6, name:"Clients", icon:"people", link:"cl"},
            {id:7, name:"Fournisseur", icon:"box-seam", link:"fs"},
            {id:8, name:"Equipe", icon:"person-bounding-box", link:"tm"},
            {id:9, name:"Outils", icon:"tools", link:"ot"},
    ],

    //main stat card
    LinkCard: [
        { id: 1, col: 2 , tag:"article", dataTag:'articlesNum',  icon: 'upc-scan', link:'sk/ajouter', smallT: 'Article', desc: 'Nouveaux  ', isFloat : false , stat:'22452'},
        { id: 2, col: 2 , tag:"facture", dataTag:'facturesNum', icon: 'receipt-cutoff', link:'ft/resumer', smallT: 'Factures', desc: 'Resumer', isFloat : false , stat:'22452'},
        { id: 3, col: 2 , tag:"client", dataTag:'clientsNum', icon: 'person', link:'cl/ajouter', smallT: 'Clients', desc: 'Ajouter', isFloat : false , stat:'1235'},
        { id: 4, col: 2 , tag:"Credit", dataTag:'creditTot', icon: 'credit-card-2-back', link:'cl', smallT: 'Credit', desc: 'Reglemment', isFloat : true , stat:'22'},
        { id: 4, col: 2 , tag:"caisse", dataTag:'caisseNum', icon: 'pc-display-horizontal', link:'ca', smallT: 'Caisse', desc: 'Inventaire', isFloat : false , stat:'22'},
        { id: 4, col: 2 , tag:"Equipe", dataTag:'equipeNum', icon: 'microsoft-teams', link:'tm/ajouter', smallT: 'Equipe', desc: 'Presence', isFloat : false , stat:'22'},
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
        FournisseurAdd: [
            {id:1, name:'Fournisseur', linkable:true, link:"/S/fs"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
        FournisseurCalendar: [
            {id:1, name:'Fournisseur', linkable:true, link:"/S/fs"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
        FournisseurSearch: [
            {id:1, name:'Fournisseur', linkable:true, link:"/S/fs"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
        FournisseurInfo: [
            {id:1, name:'Fournisseur', linkable:true, link:"/S/fs"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
        TeamAdd: [
            {id:1, name:'Equipe', linkable:true, link:"/S/tm"},
            {id:2, name:'Ajouter', linkable:false}
        ],
        TeamInfo: [
            {id:1, name:'Equipe', linkable:true, link:"/S/tm"},
            {id:2, name:'Info', linkable:false}
        ],
        TeamPoste: [
            {id:1, name:'Equipe', linkable:true, link:"/S/tm"},
            {id:2, name:'Avances', linkable:false}
        ],
        TeamDemande: [
            {id:1, name:'Equipe', linkable:true, link:"/S/tm"},
            {id:2, name:'Presences', linkable:false}
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
            {id:1,  icon: 'plus-circle', text: 'Ajouter Caisse', link: 'ajouter-c', dropD: false},
            {id:2,  icon: 'ticket-detailed-fill', text: 'Bons', link: 'bons', dropD: false},
            // {id:3,  icon: 'sliders', text: 'Inventaire', link: 'inventaire', dropD: false},
        ],
        Stock: [
            {id:1,  icon: 'bookmark-plus', text: 'Nouveaux article', link: 'ajouter', dropD: false},
            {id:2, icon: 'tags', text: 'Famille', link: 'famille', dropD: false },
            {id:3, icon: 'box-arrow-in-up', text: 'Bond entre', link: 'be', dropD: false },
            {id:4, icon: 'box-arrow-up', text: 'Bond Sortie', link: 'bs', dropD: false },
        ],
        facture: [
            // {id:1,  icon: 'receipt', text: 'Nouveaux Facture', link: 'ajouter', dropD: false},
            {id:1,  icon: 'file-earmark-medical-fill', text: 'Retour Controlée', link: 'resumer', dropD: false},
        ],
        client: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Client', link: 'ajouter', dropD: false},
            // {id:2,  icon: 'map-fill', text: 'Régions', link: 'regions', dropD: false},
            {id:2,  icon: 'balloon-heart', text: 'Fidelité', link: 'fidelite', dropD: false},
            // {id:3 ,  icon: 'bar-chart-line-fill', text: 'Statistique', link: 'statistics', dropD: false},
        ],
        Commande: [
            {id:1,  icon: 'person-plus-fill', text: 'Comptes', link: 'comptes', dropD: false},
            {id:2,  icon: 'calendar-fill', text: 'Calendrier', link: 'calendrier', dropD: false},
        ],
        Fournisseur: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Fornisseur', link: 'ajouter', dropD: false},
            {id:2,  icon: 'calendar-week-fill', text: 'Calendrier', link: 'calendrier', dropD: false},
            // {id:3,  icon: 'search-heart', text: 'Recherche', link: 'recherche', dropD: false},
        ],
        Equipe: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Membre', link: 'ajouter', dropD: false},
            {id:2,  icon: 'stars', text: 'Avance', link: 'postes', dropD: false},
            {id:3,  icon: 'calendar2-week', text: 'Presence', link: 'presence', dropD: false},
        ],
    },
    
    //TableHead
    TableHead:{
        facture:['*','ID','Caisse','Client','Jour','Temps','Totale','Etat','X','Voir'],
        request:['*','ID','Client', 'Passé le','Volu le','Etat','X','Voir'],
        stock:['*','Code', 'Nom', 'Genre','Stock','P.achat','P.vente','X','Voir'],
        camion:['*','Camion','Matricule', 'Chauffeur','Fond','Recette','X','Voir'],
        camionStock:['Code', 'Nom', 'Genre','Stock','Prix','Voir'],
        camionFacture:['ID','Client','Jour','Totale','Voir'],
        camionFond:['ID','Date','Totale', 'SDF','SCF','Voir'],
        client:['*','Nom','CIN', 'Tel', 'Creation','Adresse','Genre','Voir'],
        clientCommande:['ID', 'Passé le','Volu le','Totale','Etat','Voir'],
        clientFacture:['ID','Client','Jour','Temps','Totale','Voir'],
        fournisseurCommande:['Code','Name','Qte','Stock','Voir'],
        clientReglemment:['ID','Jour','Tems','Valeur'],
        clientFactureC:['ID','Client','Jour','Totale','Voir'],
        team:['*','Nom','Tel', 'CIN','Commencé', 'Post','Voir'],
        fournisseur:['*','MF','Nom','Tel', 'Adresse','Genre', 'Jour','Voir']

    },

    //setting
    Setting: [
        // { id: '01', title: "Activation", image: "01", description: "Etat de cabinet, camera, laboratoire ...", link:"activation"},
        { id: '2', title: "Profile", image: "02", description: "moupouhpouhpouhpouhpuohpouhp...", link:"p/Profile",
          items:[
                {id: 1, genre:'C', title:"Ouverture & Fermeture", icon:"bell-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:"Permission des Commentaires", icon:"chat-left-quote-fill", text:"Permettre à des visiteurs de votre profil de poster des commentaires.", state:true},
                {id: 3, genre:'C', title:"Reception des Messages", icon:"envelope-paper-heart-fill", text:"Autorisée les nouveaux messages pour les non-clients ", state:true},
                {id: 4, genre:'C', title:"Visiblité dans l'annuaire", icon:"journal-bookmark-fill", text:"Autorisée la visibilité sur l'annuaire par tous les visiteurs ", state:true},
            ]
        },
        { id: '3', title: "Commandes", image: "04", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Commandes",
            items:[
                {id: 1, genre:'C', title:"Reception des commandes", icon:"calendar4-week", text:"Accepter ou Reffuseé des Commandes", state:'checked'},
                {id: 2, genre:'I', title:"Nombre maximale des commandes", icon:"123", text:"Nombre Maximales des commandes par jour ", state:true},
                {id: 3, genre:'C', title:"Auto-facturation des  commandes", icon:"receipt-cutoff", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        { id: '4', title: "Stock", image: "07", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Stock",
            items:[
                {id: 1, genre:'C', title:"Ajouter des nouveaux articles ", icon:"upc-scan", text:"Autoriseé l'ajout des nouveaux articles", state:'checked'},
                {id: 2, genre:'C', title:"Autoriseé Bon d'entre ", icon:"box-arrow-in-down", text:"Autoriseé l'enregistremment des bons d'entreés", state:true},
                {id: 3, genre:'C', title:"Autoriseé Bon de sortie", icon:"box-arrow-up", text:"Autoriseé l'enregistremment des bons de sortie", state:true},
            ]
        },
        { id: '5', title: "Factures", image: "08", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Factures",
            items:[
                {id: 1, genre:'I', title:" Nombre des Factures", icon:"receipt", text:"Nombre Maximale des factures par jour ", state:'checked'},
                {id: 2, genre:'C', title:" Client Passager", icon:"person-heart", text:"Autoriseé les factures pour client : Passager", state:true},
                {id: 3, genre:'C', title:" Gratuité", icon:"gift", text:"Autoriseé la gratuité pour les articles ", state:true},
            ]
        },
        { id: '6', title: "Caisses", image: "13", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Caisses",
            items:[
                {id: 1, genre:'C', title:" Ajouter nouveaux camions", icon:"truck", text:"Autoriseé l'ajout des nouveaux camions", state:'checked'},
                {id: 2, genre:'C', title:" Ajouter fond aux camions", icon:"basket2", text:"Autoriseé l'ajout des fond aux camions ", state:true},
                {id: 3, genre:'C', title:" Faire Inventaire ", icon:"arrow-repeat", text:"Autoriseé l'inventaire aux camions", state:true},
                {id: 4, genre:'C', title:" Controle des camions", icon:"toggles2", text:"Autoriseé le controle (modifier , supprimer stock , ..) des camions", state:true},
            ]
        },
        { id: '7', title: "Clients", image: "10", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Clients",
            items:[
                {id: 1, genre:'C', title:" Ajouter Clients Par Camions ", icon:"person-heart", text:"Autoriseé L'ajout d'un client par comptes camions", state:'checked'},
                {id: 2, genre:'C', title:" Ajouter Regions Par Camion ", icon:"map-fill", text:"Autoriseé L'ajout des regiuons par comptes camions", state:true},
                {id: 3, genre:'C', title:" Fixer Posistion Clients Par Camions", icon:"geo-alt-fill", text:"Autoriseé le modification du position clients par comptes camions", state:true},
            ]
        },
        { id: '8', title: "Fournisseur", image: "12", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Fournisseur",
            items:[
                {id: 1, genre:'C', title:" Ajouter Fournisseur ", icon:"person-heart", text:"Autoriseé L'ajout d'un client par comptes camions", state:'checked'},
                {id: 2, genre:'C', title:" Ajouter Regions Par Camion ", icon:"map-fill", text:"Autoriseé L'ajout des regiuons par comptes camions", state:true},
                {id: 3, genre:'C', title:" Fixer Posistion Clients Par Camions", icon:"geo-alt-fill", text:"Autoriseé le modification du position clients par comptes camions", state:true},
            ]
        },
        { id: '9', title: "Equipe", image: "11", description: "Etat de cabinet, camera, laboratoire ...", link:"p/Equipe",
            items:[
                {id: 1, genre:'C', title:" Recéptions des exigence d'emploi", icon:"file-earmark-person", text:"Recevoire des demmandes de travaille", state:'checked'},
                {id: 4, genre:'I', title:" Nombre maximale des missions", icon:"check2-square", text:"Npmbre maximale des mission pour membre par jour ", state:true},
            ]
        },
    ]

}
 
export default GConf 