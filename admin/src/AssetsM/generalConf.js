const GConf = {

    // main variables
    ApiLink : 'https://api.system.ansl.tn/API/Admin', //https://api.anaslouma.tn/System 
    themeColor : '#3acacf',
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
        iconUrl: require('leaflet/dist/images/position.gif'),
        iconRetinaUrl: require("leaflet/dist/images/position.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    },

    //main stat card
    LinkCard: [
        { id: 1, col: 3 , tag:"article", dataTag:'articlesNum',  icon: 'truck-flatbed', link:'alimentaire', smallT: 'Article', desc: 'Alimentaire' },
        { id: 2, col: 3 , tag:"facture", dataTag:'facturesNum', icon: 'truck', link:'cosmetique', smallT: 'Factures', desc: 'Cosmetique' },
        { id: 3, col: 3 , tag:"client", dataTag:'clientsNum', icon: 'cart4', link:'familia', smallT: 'Clients', desc: 'Familia Market'},
        { id: 4, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'tv', link:'electro', smallT: 'Camions', desc: 'Electo'},
        { id: 5, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'pie-chart-fill', link:'partennaire', smallT: 'Camions', desc: 'Partennaires'},
        { id: 6, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'sliders2-vertical', link:'autorisation', smallT: 'Camions', desc: 'Autorisation'},
        { id: 7, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'bell-fill', link:'notification', smallT: 'Camions', desc: 'Notification'},
        { id: 8, col: 3 , tag:"camion", dataTag:'camionsNum', icon: 'journals', link:'https://ansl.tn/', smallT: 'Camions', desc: 'Catalogue', external:true},
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
            {id:1,  icon: 'check-circle', text: 'Accepté', link: '../g/accepte', dropD: false},
            {id:2,  icon: 'x-circle', text: 'Refusé', link: '../g/refusee', dropD: false},
            {id:3, icon: 'exclamation-circle', text: 'En Attent', link: '../g/en-attent', dropD: false },
        ],
        camion: [
            {id:1,  icon: 'plus-circle', text: 'Ajouter Camion', link: '../ajouter-c', dropD: false},
            {id:2,  icon: 'truck', text: 'Ajouter Fonds', link: '../ajouter-f', dropD: false},
            {id:3,  icon: 'sliders', text: 'Inventaire', link: '../inventaire', dropD: false},
        ],
        Stock: [
            {id:1,  icon: 'bookmark-plus', text: 'Nouveaux article', link: 'ajouter', dropD: false},
            {id:2, icon: 'tags', text: 'Famille', link: 'famille', dropD: false },
            {id:3, icon: 'box-arrow-in-up', text: 'Bond entre', link: 'be', dropD: false },
            {id:4, icon: 'box-arrow-up', text: 'Bond Sortie', link: 'bs', dropD: false },
            // {
            //     id: 3, icon: 'person', text: 'Bons', link: '#', dropD: true, dropDD:
            //         [
            //             { id: 1, icon: 'plus-circle', text: "Bon d'entre ", link: 'be' },
            //             { id: 2, icon: 'dash-circle', text: 'Bon de sortie', link: 'bs' }
            //        ]
            // },
        ],
        facture: [
            {id:1,  icon: 'receipt', text: 'Nouveaux Fcature', link: 'ajouter', dropD: false},
            {id:2,  icon: 'file-earmark-medical-fill', text: 'Resumer', link: 'resumer', dropD: false},
        ],
        client: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Client', link: 'ajouter', dropD: false},
            {id:2,  icon: 'map-fill', text: 'Régions', link: 'regions', dropD: false},
            {id:3,  icon: 'pin-map-fill', text: 'Clients Map', link: 'map', dropD: false},
        ],
        Commande: [
            {id:1,  icon: 'person-plus-fill', text: 'Comptes', link: 'comptes', dropD: false},
            {id:2,  icon: 'collection-fill', text: 'Regroupemment', link: 'Regroupemment', dropD: false},
            {id:3,  icon: 'calendar-fill', text: 'Calendrier', link: 'calendrier', dropD: false},
        ],
    },
    
    //TableHead
    TableHead:{
        facture:['*','ID','Client','Jour','Totale','Stock','Voir'],
        request:['*','ID','Client', 'Passé le','Volu le','Totale','Etat','Voir'],
        stock:['*','Code', 'Nom', 'Genre','Stock','P.achat','P.vente','Voir'],
        camion:['*','Camion','Matricule', 'Chauffeur','Fond','Recette','Voir'],
        camionStock:['Code', 'Nom', 'Genre','Stock','Prix','Voir'],
        camionFacture:['ID','Client','Jour','Totale','Voir'],
        camionFond:['ID','Date','Totale', 'SDF','SCF','Voir'],
        client:['*','Nom','Matricule', 'Tel', 'Location','Adresse','Voir'],
        clientCommande:['ID', 'Passé le','Volu le','Totale','Etat','Voir'],
        clientFacture:['ID','Client','Jour','Totale','Voir'],
        clientFactureC:['ID','Client','Jour','Totale','Voir'],
        team:['Nom','Etat', 'Post','Commencé']

    },

    //setting
    Setting: [
        { id: '01', title: "Activation", image: "01", description: "Etat de cabinet, camera, laboratoire ...", link:"activation"},
        { id: '02', title: "Profile", image: "02", description: "moupouhpouhpouhpouhpuohpouhp...", link:"p/1",
          items:[
                {id: 1, genre:'C', title:"Ouverture & Fermeture", icon:"bell-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:"Permission des Commentaires", icon:"chat-left-quote-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 3, genre:'I', title:"Reception des Messages", icon:"envelope-paper-heart-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        { id: '03', title: "Clients", image: "03", description: "Etat de cabinet, camera, laboratoire ...", link:"p/2",
            items:[
                {id: 1, genre:'C', title:"Ouverture & Fermeture", icon:"bell-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:"Permission des Commentaires", icon:"chat-left-quote-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 3, genre:'I', title:"Reception des Messages", icon:"envelope-paper-heart-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        { id: '04', title: "Demandes", image: "04", description: "Etat de cabinet, camera, laboratoire ...", link:"p/3",
            items:[
                {id: 1, genre:'C', title:"Reception des demandes", icon:"calendar3", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:"Retardement Automatique des demandes", icon:"arrow-repeat", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 3, genre:'I', title:"Nombre maximale des demandes", icon:"shuffle", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 4, genre:'C', title:"Autorisation des demandes pour clients", icon:"stars", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        { id: '05', title: "Controle", image: "05", description: "Etat de cabinet, camera, laboratoire ...", link:"p/4",
            items:[
                {id: 1, genre:'I', title:" Compt Bancaire ", icon:"credit-card-2-front-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:" Réception monetique", icon:"currency-dollar", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 3, genre:'C', title:" Auto-paymment des factures", icon:"receipt-cutoff", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        { id: '06', title: "Equipe", image: "06", description: "Etat de cabinet, camera, laboratoire ...", link:"p/5",
            items:[
                {id: 1, genre:'C', title:" Recéptions des exigence d'emploi", icon:"file-earmark-person", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:'checked'},
                {id: 2, genre:'C', title:" Automatisation des systemes de l'equipe", icon:"play-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 3, genre:'C', title:" Communication avec l'equipe", icon:"chat-text-fill", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
                {id: 4, genre:'I', title:" Nombre maximale des missions", icon:"check2-square", text:"Changer l'etat de disponiobilité , Ouvert/Fermé , Cela va changer votre etat sur l'annuaire", state:true},
            ]
        },
        // { id: '07', title: "Données", image: "06", description: "Etat de cabinet, camera, laboratoire ...", link:"ma"},
    ]
}
 
export default GConf 