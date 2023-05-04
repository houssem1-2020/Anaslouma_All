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
        cv : {id:1, text:'Vente Des Camion', link:'/User/L'}, 
        cr : {id:1, text:'Resumer Des Camion', link:'/User/L'}, 
        sk : {id:1, text:'Stock', link:'/User/L'}, 
        ai : {id:1, text:'Article', link:'/User/L'}, 
        rp : {id:1, text:'Repture', link:'/User/L'}, 
        sg : {id:1, text:'Stat Génerale', link:'/User/L'}, 
        sr : {id:1, text:'Stat Régionale', link:'/User/L'}, 
    }
}
export default InputLinks