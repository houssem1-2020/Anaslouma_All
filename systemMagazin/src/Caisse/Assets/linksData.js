const GetForPID = () =>{
    const pidIsSet = JSON.parse(localStorage.getItem('Magazin_Caisse_LocalD'));
    return pidIsSet
}

const GetThemeMode = () =>{
    const theme = localStorage.getItem('Magazin_Caisse_Theme');
    return theme
}

const InputLinks =  {
    forPID: GetForPID(),
    themeColor: '#2f8d99',
    themeMode: GetThemeMode(),
    main : [
        {id:1, link:'nv', icon:'pc-display-horizontal', text:'CAISSES', desc:''},
        {id:2, link:'cr', icon:'cart4', text:'CAISSE RAPIDE', desc:''},
        {id:3, link:'sk', icon:'box2-heart-fill', text:'CAISSE DE STOCK', desc:''},
        {id:4, link:'vt', icon:'cart-check-fill', text:'VENTES', desc:''},
        {id:5, link:'cl', icon:'person-rolodex', text:'CLIENTS', desc:''},
        {id:6, link:'rt', icon:'coin', text:'RECETTE', desc:''},
    ],

    client : [
        {id:1, link:'List', icon:'person-lines-fill', text:'Liste Compléte', desc:''},
        {id:2, link:'Reglemment', icon:'sliders', text:'Reglemment', desc:''},
        // {id:3, link:'pointage', icon:'geo-alt', text:'Pointage', desc:''},
        // {id:4, link:'ajouter', icon:'person-plus-fill', text:'Ajouter Client', desc:''},
    ],
    stock : [
        {id:1, link:'Famille', icon:'box2-heart', text:'Mon Stock', desc:''},
        {id:2, link:'pannier', icon:'basket', text:'PANNIER ', desc:''},
        // {id:3, link:'reglemment/ancien', icon:'calendar-x-fill', text:'Ancien Reglement ', desc:''},
        // {id:4, link:'Fonds', icon:'ui-checks-grid', text:'Fonds', desc:''},
    ],
    recette : [
        {id:1, link:'vente', icon:'receipt-cutoff', text:'Vente', desc:''},
        // {id:2, link:'imprimer', icon:'printer-fill', text:'Reglemment de Stock', desc:''},
        {id:3, link:'depenses', icon:'menu-app', text:'Depenses', desc:''},
        {id:4, link:'imprimer', icon:'printer-fill', text:'Imprimer', desc:''},
    ],

    //return back card 
    backCard:{
        nv : {id:1, text:'Nouveaux Facture', link:'/C/L'},
        pann : {id:1, text:'Nouveaux Facture', link:'/C/L/sk'},

        mf : {id:7, text:'Mes Factures', link:'/C/L/rt'},
        mfInfo : {id:8, text:'Facture Info', link:'/C/L/rt/vente'},
        mfEdit : {id:8, text:'Modifier Facture', link:'/C/L/rt/vente'},
       
        sk : {id:9, text:'Stock', link:'/C/L'},
        skList : {id:10, text:'Mon Stock', link:'/C/L/sk'},
        skInfo : {id:12, text:'Info Sur Article', link:'/C/L/sk'},
        skfamilleList: {id:13, text:'Mon Stock', link:'/C/L/sk/Famille'},
        skFond: {id:13, text:'Fonds', link:'/C/L/sk'},
        skFondD: {id:14, text:'Fonds Info', link:'/C/L/sk'},

        vt : {id:1, text:'Mes Ventes', link:'/C/L'},
        vtRech : {id:1, text:'Recherche', link:'/C/L/vt'},
        vtJour : {id:1, text:'Aujourd\'hui', link:'/C/L/vt'},

        cl : {id:2, text:'Client', link:'/C/L'},
        clAdd : {id:3, text:'Ajouter Client', link:'/C/L/cl'},
        clPtg : {id:4, text:'Pointage des Clients', link:'/C/L/cl'},
        clMap : {id:5, text:'Recherche des Clients', link:'/C/L/cl'},
        clList : {id:6, text:'Liste des Clients', link:'/C/L'},

        rt : {id:1, text:'Recette', link:'/C/L'},
        rtDeps : {id:1, text:'Depenses', link:'/C/L/rt'},
        rtImpr : {id:1, text:'Imprimer', link:'/C/L/rt'},

        up : {id:1, text:'Mettre a jour ', link:'/C/L'},

    },

    listeDesBons : [
        {id:1, value: 2 , pourcentage: 0.10 , text:'2000', cadeaux:false},
        {id:2, value: 3 , pourcentage: 0.10 , text:'3000', cadeaux:false},
        {id:2, value: 3.5 , pourcentage: 0.10 , text:'3500', cadeaux:false},
        {id:3, value: 4 , pourcentage: 0.10 , text:'4000', cadeaux:false},
        {id:3, value: 4.5 , pourcentage: 0.10 , text:'4500', cadeaux:false},
        {id:4, value: 5 , pourcentage: 0.10 , text:'5000', cadeaux:false},
        {id:4, value: 5.5 , pourcentage: 0.10 , text:'5500', cadeaux:false},
        {id:5, value: 6 , pourcentage: 0.10 , text:'6000', cadeaux:false},
        {id:5, value: 6.5 , pourcentage: 0.10 , text:'6500', cadeaux:false},
        {id:6, value: 7 , pourcentage: 0.10 , text:'7000', cadeaux:false},
        {id:6, value: 7.5 , pourcentage: 0.10 , text:'7500', cadeaux:false},
        {id:7, value: 8 , pourcentage: 0.10 , text:'8000', cadeaux:false},
        {id:7, value: 8.5 , pourcentage: 0.10 , text:'8500', cadeaux:false},
        {id:8, value: 9 , pourcentage: 0.10 , text:'9000', cadeaux:false},
        {id:9, value: 10 , pourcentage: 0.10 , text:'10.000', cadeaux:false},
        {id:10, value: 20 , pourcentage: 0.10 , text:'20.000', cadeaux:false},
        {id:11, value: 50 , pourcentage: 0.10 , text:'50.000', cadeaux:false},
    ]

}
export default InputLinks