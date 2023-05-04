const InputLinks = {
    //themeColor: '#2f8d99',
    main : [
        {id:1, link:'cm', icon:'receipt-cutoff', text:'COMMANDES', desc:''},
        {id:2, link:'mc', icon:'box2-heart-fill', text:'MES COMMANDES', desc:''},
        {id:3, link:'cg', icon:'folder2-open', text:'Mon Stock', desc:''},
        {id:4, link:'cg/familles', icon:'boxes', text:'Familles', desc:''},
        {id:5, link:'cl/ajouter', icon:'person-plus-fill', text:'Ajouter Client', desc:''},
        {id:6, link:'cl/recherche', icon:'search', text:'Recherche', desc:''},
        {id:7, link:'cl/pointage', icon:'geo-alt', text:'Pointage', desc:''},
        {id:8, link:'cl/List', icon:'person-lines-fill', text:'Liste Compléte', desc:''},  
        {id:9, link:'rt', icon:'currency-exchange', text:'Recette', desc:''},  
        {id:10, link:'stat', icon:'bar-chart-line', text:'Statistiques', desc:''},  
    ],

    //return back card 
    backCard:{
        nv : {id:1, text:'Nouveaux Commande', link:'/C/L'},
        pan : {id:1, text:'Pannier', link:'/C/L'},

        cl : {id:2, text:'Client Info', link:'/C/L/cl/List'},
        clAdd : {id:3, text:'Ajouter Client', link:'/C/L'},
        clPtg : {id:4, text:'Pointage des Clients', link:'/C/L'},
        clMap : {id:5, text:'Recherche des Clients', link:'/C/L'},
        clList : {id:6, text:'Liste des Clients', link:'/C/L'},

        mc : {id:7, text:'Mes Commandes', link:'/C/L'},
        mcInfo : {id:8, text:'Commande Info', link:'/C/L'},
        mcInfo : {id:9, text:'Modifier Commande', link:'/C/L'},

        cg : {id:10, text:'Catalogue', link:'/C/L'},
        cgList : {id:11, text:'Liste des Articles', link:'/C/L'},
        cgFamille : {id:12, text:'Liste des Familles', link:'/C/L'},
        cgInfo : {id:13, text:'Info Sur Article', link:'/C/L'},
        cgPhoto: {id:14, text:'Ajoiuter Photo', link:'/C/L'},

        up: {id:15, text:'Mettre A jour', link:'/C/L'},
        rt: {id:15, text:'Resumer', link:'/C/L'},
        stat: {id:15, text:'Statistique', link:'/C/L'},
    }
}
export default InputLinks