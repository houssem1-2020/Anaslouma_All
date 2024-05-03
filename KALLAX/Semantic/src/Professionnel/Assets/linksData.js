const InputLinks = {
    themeColor: '#2f8d99',
    main : [
        {id:1, link:'camion', icon:'receipt-cutoff', text:'Journier', desc:''},
        {id:2, link:'camion-r', icon:'folder2-open', text:'Resumer', desc:''},
        {id:3, link:'Stock', icon:'box2-heart-fill', text:'Stock', desc:''},
        {id:4, link:'Repture', icon:'file-arrow-down', text:'Repture', desc:''},
        {id:5, link:'Stat-g', icon:'bar-chart-line', text:'Generale', desc:''},
        {id:6, link:'Stat-r', icon:'map-fill', text:'Regionale', desc:''},
    ],

    //return back card 
    backCard:{
        cliste : {id:1, text:'Liste des Demmandes', link:'/Prof/L'}, 
        cr : {id:1, text:'Demmande Action', link:'/Prof/L'}, 
        cl : {id:1, text:'Calendrier', link:'/Prof/L'}, 
        cm : {id:1, text:'Communauteé', link:'/Prof/L'}, 
        pm : {id:1, text:'Portefeuille', link:'/Prof/L'}, 
        ai : {id:1, text:'Article', link:'/Prof/L'}, 
        rp : {id:1, text:'Paymment', link:'/Prof/L'}, 
        sg : {id:1, text:'Stat Génerale', link:'/Prof/L'}, 
        sr : {id:1, text:'Stat Régionale', link:'/Prof/L'}, 
        pig : {id:1, text:'Paramétres Genérale', link:'/Prof/L'}, 
        pph : {id:1, text:'Paramétres Des Photoes', link:'/Prof/L'}, 
        hs : {id:1, text:'Paramétres D\'horaire', link:'/Prof/L'}, 
        ps : {id:1, text:'Paramétres du Positions', link:'/Prof/L'}, 
        pt : {id:1, text:'Paramétres des Tarif', link:'/Prof/L'}, 
        pf : {id:1, text:'Paramétres Financiére', link:'/Prof/L'}, 
    }
}
export default InputLinks