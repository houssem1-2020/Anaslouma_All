const InputLinks = {
    //themeColor: '#2f8d99',
    main : [
        {id:1, link:'sk/bonE', icon:'cart-plus-fill', text:'B. Entre', desc:''},
        {id:2, link:'sk/BonR', icon:'cart-dash-fill', text:'B. Retour', desc:''},
        {id:3, link:'sk/Modifier', icon:'pencil-square', text:'MODIFER', desc:''},
        {id:4, link:'sk/Inventaire', icon:'check2-square', text:'INVENTAIRE', desc:''},

        {id:5, link:'ot/ticket', icon:'ticket-detailed-fill', text:'Ticket ', desc:''},  
        {id:6, link:'ot/dateP', icon:'calendar', text:'Date Proche', desc:''}, 

        {id:7, link:'tm/presence', icon:'calendar-x', text:'Presence', desc:''},
        {id:8, link:'tm/presence', icon:'cash-coin', text:'Avance', desc:''},


        {id:9, link:'cl/List', icon:'person-lines-fill', text:'Liste Compléte', desc:''},

        {id:10, link:'cm', icon:'receipt-cutoff', text:'CMD Alim', desc:''},  
        {id:11, link:'cm', icon:'receipt-cutoff', text:'CMD Cosmo', desc:''},  
        {id:12, link:'mc', icon:'box2-heart-fill', text:'MES COMMANDES', desc:''},
        
         

        // {id:1, link:'cm', icon:'receipt-cutoff', text:'COMMANDES', desc:''},
        // {id:2, link:'mc', icon:'box2-heart-fill', text:'MES COMMANDES', desc:''},
        // {id:3, link:'cg', icon:'folder2-open', text:'Mon Stock', desc:''},
        // {id:4, link:'cg/familles', icon:'boxes', text:'Familles', desc:''},
        // {id:5, link:'cl/ajouter', icon:'person-plus-fill', text:'Ajouter Client', desc:''},
        // {id:6, link:'cl/recherche', icon:'search', text:'Recherche', desc:''},
        // {id:7, link:'cl/pointage', icon:'geo-alt', text:'Pointage', desc:''},
        // {id:8, link:'cl/List', icon:'person-lines-fill', text:'Liste Compléte', desc:''},  
        // {id:9, link:'rt', icon:'currency-exchange', text:'Recette', desc:''},  
        // {id:10, link:'stat', icon:'bar-chart-line', text:'Statistiques', desc:''},  
    ],

    //return back card 
    backCard:{
        nv : {id:1, text:'Nouveaux Commande', link:'/U/L'},

        cl : {id:2, text:'Client Info', link:'/U/L/cl/List'},
        clAdd : {id:3, text:'Ajouter Client', link:'/U/L'},
        clPtg : {id:4, text:'Pointage des Clients', link:'/U/L'},
        clMap : {id:5, text:'Recherche des Clients', link:'/U/L'},
        clList : {id:6, text:'Liste des Clients', link:'/U/L'},

        mc : {id:7, text:'Mes Commandes', link:'/U/L'},
        mcInfo : {id:8, text:'Commande Info', link:'/U/L'},
        mcInfo : {id:9, text:'Modifier Commande', link:'/U/L'},

        cg : {id:10, text:'Catalogue', link:'/U/L'},
        cgList : {id:11, text:'Liste des Articles', link:'/U/L'},
        cgFamille : {id:12, text:'Liste des Familles', link:'/U/L'},
        cgInfo : {id:13, text:'Info Sur Article', link:'/U/L'},
        cgPhoto: {id:14, text:'Ajoiuter Photo', link:'/U/L'},

        up: {id:15, text:'Mettre A jour', link:'/U/L'},
        rt: {id:15, text:'Resumer', link:'/U/L'},
        stat: {id:15, text:'Statistique', link:'/U/L'},
    }
}
export default InputLinks