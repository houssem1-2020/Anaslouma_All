const express = require('express')
const Integration = express.Router()

const connection = require('../connection.js')

/*
	I-Stock: THE PROCESS IS UPDATING OLD TABLE WITH NEW PHOTOES 
		1- a: telecharger from new server (7ajty betsawer) 
		   b: changer ${TAG}_article with ${TAG}_article_new by sublime text
		   c: import dans bgvckelc_integration as ${TAG}_article_new

		2- a: telecharger from old server (7ajty b stock w liste des prix) 
		   b: changer article to ${TAG}_article (sublime text)   
		   c: import sand ${TAG}_article puis ajouter Photo_Path to table (phpmyadmin) 

		3- executer script integ/update (changer tag alimentaire / cosmetique)

		4- export {LAST} :  ${TAG}_article , remove head of sql file leave just inserts statments
		5- empty ${TAG}_article dans bgvckelc_anaslouma [serveur local] and excute sql of  {LAST}
		6- empty ${TAG}_article dans bgvckelc_anaslouma [new server ] and excute sql of  {LAST}

	II-Stock du camion : ADD UNIQUE KEY TO OLD STOCK
		1- get old table and update camion_article to ${TAG}_camion_article the importe it to  bgvckelc_integration as ${TAG}_camion_articles
		2- delete duplicated value 
		2- export result 
		3- import it in new server 

*/
/*####################################[CLIENT]#####################################*/
/* selctioner mes vente auhoudhui */
	Integration.get('/update', (req, res) => {
		   let TAG = 'cosmetique' // cosmetique
	       let sql = `UPDATE ${TAG}_article
			          INNER JOIN ${TAG}_article_new ON ${TAG}_article.A_Code = ${TAG}_article_new.A_Code
					  SET ${TAG}_article.Photo_Path = ${TAG}_article_new.Photo_Path`; // AND Cre_Date = '${Today}'
	       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json(rows);
	      }) 
	})

module.exports = Integration