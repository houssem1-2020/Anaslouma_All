const NG  = {
    commandeAjouter : {
        icon:'bi-check-circle-fill text-success',
        title:'Commande Enregistré',
        titleIcon:'bi-receipt-cutoff',
        GenFunction : function(table){
            return ('Une Commande est enregistre pour : ' + table.client + ' en totale ' + table.totale)
        }
    },  
    commandeEdit : {
        icon:'bi-pencil-square text-info',
        title:'Commande Modifieé',
        titleIcon:'receipt-cutoff',
        GenFunction : function(table){
            return ('La Commande  pour : ' + table.C_Name + ' en totale ' + table.Tota + 'a ete modifier ')
        }

    },
    commandeDelete : {
        icon:'bi-trash-fill text-danger',
        title:'Commande Supprimer',
        titleIcon:'receipt-cutoff',
        GenFunction : function(table){
            return ('Vous avez modifier l article suivant : ' + table.Name + ' par :')
        }
    },
    commandeAnnuler : {
        icon:'bi-check-circle-fill text-success',
        title:'Commande Enregistré',
        titleIcon:'bi-receipt-cutoff',
        GenFunction : function(table){
            return ('Une Commande est enregistre pour : ' + table.client + ' en totale ' + table.totale)
        }
    },
    commandeFacturer : {
        icon:'bi-check-circle-fill text-success',
        title:'Commande Enregistré',
        titleIcon:'bi-receipt-cutoff',
        GenFunction : function(table){
            return ('Une Commande est enregistre pour : ' + table.client + ' en totale ' + table.totale)
        }
    },

    stockSaveArticle : {
        icon:'bi-check-circle-fill text-success',
        title:'Article Enregistré ',
        titleIcon:'bi-upc-scan',
        GenFunction : function(table){
            return ('Vous avez ajouter l article suivant  : ' + table.Name)
        }
    },
    stockEditArticle : {
        icon:'bi-pencil-square text-info',
        title:'Article Modifieé',
        titleIcon:'bi-upc-scan',
        GenFunction : function(table){
            return ('Vous avez modifier l article suivant : ' + table.Name + ' par :  Nom ( ' + table.Name + ') ,Prix achat : ( ' + table.Prix_achat + ') ,Prix Vente: ( ' + table.Prix_vente + ') ,Genre: ( ' + table.Genre + ' )' )
        }
    },
    stockDeleteArticle : {
        icon:'bi-trash-fill text-danger',
        title:'Article Supprimer',
        titleIcon:'bi-upc-scan',
        GenFunction : function(table){
            return ('Vous avez modifier l article suivant : ' + table.Name + ' par :')
        }
    },
    stockSaveFamille : {
        icon:'bi-check-circle-fill text-success',
        title:'Famille Enregistré ',
        titleIcon:'bi-tags',
        GenFunction : function(table){
            return ('Vous avez ajouter Cette Famille des articles: ' + table.Name +' avec Desc : ' + table.Description)
        }
    },
    stockEditFamille : {
        icon:'bi-pencil-square text-info',
        title:'Famille Modifieé',
        titleIcon:'bi-tags',
        GenFunction : function(table){
            return ('Vous avez modifier Une  Famille  Avec ID : ' + table.PK +' Par : ' + table.Name + ' et Desc : ' + table.Description)
        }
    },
    stockSaveBE : {
        icon:'bi-arrow-up-circle-fill text-success',
        title:'Bon Entre Enregistré ',
        titleIcon:'bi-box-arrow-in-up-right',
        GenFunction : function(table){
            return ('Vous avez ajouter Un Bon Entre avec cette ID  : ' + table)
        }
    },
    stockSaveBS : {
        icon:'bi-arrow-down-circle-fill text-danger',
        title:'Bon Sortie Enregistré ',
        titleIcon:'bi-box-arrow-up-right',
        GenFunction : function(table){
            return ('Vous avez ajouter Un Bon Entre avec cette ID  : ' + table)
        }
    },


    factureAjouter : {
        icon:'bi-check-circle-fill text-success',
        title:'Facture Enregistré',
        titleIcon:'bi-receipt-cutoff',
        GenFunction : function(table){
            return ('Vous avez ajouter une facture pour : ' + table.client + ' en totale ' + table.totale)
        }
    },  
    factureEdit : {
        icon:'bi-pencil-square text-info',
        title:'Facture Modifieé',
        titleIcon:'bi-receipt-cutoff',
        GenFunction : function(table){
            return ('Vous avez modifier la  facture Avec ID  : ' + table.fid + ' Pour ' + table.data.client + ' en totale ' + table.data.totale)
        }

    },
    factureDelete : {
        icon:'bi-trash-fill text-danger',
        title:'Facture Supprimer',
        titleIcon:'receipt-cutoff',
        GenFunction : function(table){
            return ('Vous avez modifier l article suivant : ' + table.Name + ' par :')
        }
    },


    camionAjouter : {
        icon:'bi-check-circle-fill text-success',
        title:'Camion Enregistré',
        titleIcon:'bi-truck',
        GenFunction : function(table){
            return ('Vous avez ajouter un Camion : ' + table.Cam_Name + ' de Matricule ' + table.Matricule)
        }
    },  
    camionEdit : {
        icon:'bi-pencil-square text-info',
        title:'Camion Modifieé',
        titleIcon:'bi-truck',
        GenFunction : function(table){
            return ('Vous avez modifier le Camion : ' + table.Cam_Name)
        }

    },
    camionDelete : {
        icon:'bi-trash-fill text-danger',
        title:'Camion Supprimer',
        titleIcon:'receipt-cutoff',
        GenFunction : function(table){
            return ('Vous avez modifier l article suivant : ' + table.Name + ' par :')
        }
    },
    camionFondAjouter : {
        icon:'bi-check-circle-fill text-success',
        title:'Fond Du Camion Ajouter',
        titleIcon:'bi-truck',
        GenFunction : function(table){
            return ('Vous avez ajouter un Fond aux  Camion : ' + table.camion + ' en totale ' + table.totale)
        }
    },
    camionFondModifier : {
        icon:'bi-check-circle-fill text-success',
        title:'Fond Du Camion Modifier',
        titleIcon:'bi-truck',
        GenFunction : function(table){
            return ('Vous avez modifer le fond avec ID : ' + table.Bon_id + ' Du Camion ' + table.camion + ' a la somme ' + table.totale)
        }
    },
    camionInventaire : {
        icon:'bi-check-circle-fill text-success',
        title:'Inventaire Enregistré',
        titleIcon:'bi-truck',
        GenFunction : function(table){
            return ('Inventaire du camion  : ' + table.camion  + ' effectueé avec success avec ID ' + table.id)
        }
    },
    camionSupprimerArticleZero : {
        icon:'bi-trash3-fill text-danger',
        title:'Ztock zero du camion supprimer ',
        titleIcon:'bi-trash3',
        GenFunction : function(table){
            return ('Vous avez supprimer tous les article a zero du camion  :' + table.Cam_Name)
        }
    },


    clientAjouter : {
        icon:'bi-check-circle-fill text-success',
        title:'Client Enregistré',
        titleIcon:'bi-people',
        GenFunction : function(table){
            return ('Vous avez ajouter Ce Client pour : ' + table.Name)
        }
    },  
    clientEdit : {
        icon:'bi-pencil-square text-info',
        title:'Client Modifieé',
        titleIcon:'bi-people',
        GenFunction : function(table){
            return ('Vous avez modifier Ce Client  : ' + table.Name + ' par :  Nom ( ' + table.Name + ') , Telephone : ( ' + table.Phone + ') ,Position: ( ' + table.Gouv + ') ,Adresse: ( ' + table.Adress + ' )' )
        }

    },
    clientMapAjouter : {
        icon:'bi-geo-alt-fill text-warning',
        title:'Region Ajouter',
        titleIcon:'bi-geo-fill',
        GenFunction : function(table){
            return ('Vous avez ajouter Cette Region : ' + table.Localisation + ' Dans ' + table.Gouv)
        }
    },  


}
export default NG