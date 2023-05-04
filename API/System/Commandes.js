const express = require('express')
const CommandePtvGros = express.Router()

const connection = require('../connection.js')



/*####################################[USEFUL]#####################################*/

   /*Generate FID, CID, C_ID, ,ID*/    
    const GenerateID = async (length,tabelName,IdName) =>{ 
    	function SelectAllID(ID,table) {
		      return new Promise((resolve, reject) => {
			      	let sql = `SELECT ${ID} FROM ${table} WHERE 1`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		}
	    function Generate(array,IDN,length) {
		     return new Promise((resolve, reject) => {
	   				
				    let acceptable = false;
			    	do {
					  let ID = Math.floor(Math.random() * length);
					  let exist = array.find((article) => article.IDN == ID); 
					  if (!exist) { 
					  	resolve(ID) ;  
					  	acceptable = true; 
					  } else{ acceptable = false; reject(err)}
					}
					while (acceptable = false);
		      });
	    }
		let arrayFromDb = await SelectAllID(IdName,tabelName)
		return await Generate(arrayFromDb,IdName,length);  
    }

/*####################################[LOGIN ]###########################*/

	/*log in*/
	CommandePtvGros.post('/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;

		  let sql = `SELECT * FROM system_commande_comptes WHERE Identifiant = '${logInD.Log}' AND Password  = '${logInD.Pwd}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    if (rows.length == 0 ) {
			    let tokenTable = [Exist = 'false', CID = 'null', Name = 'null']; 
			    res.send(JSON.stringify(tokenTable));		    } 
			else {
				let tokenTable = [Exist = 'true', CID = rows[0].CID , Data = JSON.stringify(rows[0])];
	     	    res.send(JSON.stringify(tokenTable));	
			}

		  }); 
	}) 

/*####################################[LANDING ]###########################*/
	/*Statistics*/
	CommandePtvGros.post('/Landing', (req, res) => {
		let TAG = req.body.tag;
		let UID = req.body.UID;
	    function CommandeDistrubition(genre) {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT COUNT(PK) as Totale FROM system_commande WHERE State = '${genre}' AND PassePar = '${UID}'  AND SystemTag = '${TAG}' ;`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows[0].Totale);
	              })
	      });
	    }

		// Call, Function
	    async function query() {
	    	let main = [{}]
	      	main[0].Accepte = await CommandeDistrubition('A');
	      	main[0].Refuse = await CommandeDistrubition('R');
	      	main[0].Waiting = await CommandeDistrubition('W'); 
	     
	      res.send(main)
	    }
	    query();  
	}) 

/*####################################[NOUVEAUX Commande]##########################*/
	//fetch all article */
	CommandePtvGros.post('/stock', (req, res) => {
	      let TAG = req.body.tag
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* enregister une Commande */ 
	CommandePtvGros.post('/ajouter/checkexist', (req, res) => {
	        let TAG = req.body.TAG
		    let sql = `SELECT * FROM system_commande WHERE SystemTag = '${TAG}' AND State = 'W'`; 
	        connection.query(sql, (err, rows, fields) => {
		         if (err){ throw err}

		        let rended = []
		    	for (var i = 0; i < rows.length ; i++) {
		    	  	let item = JSON.parse(rows[i].Articles);
		    	 	for (var k = 0; k < item.length; k++) {
		    	 		rended.push(item[k])
		    	 	}
		    	}

				var result = [];	
				rended.reduce(function(res, value) {
				   if (!res[value.A_Code]) {
				     res[value.A_Code] = { A_Code: value.A_Code, Name: value.Name, Qte: 0 };
				     result.push(res[value.A_Code])
				   }
				   res[value.A_Code].Qte += parseInt(value.Qte);
				   return res;
			    }, {});

		       res.send(result);
		   })    
	})
	
	/* enregister une Commande */ 
	CommandePtvGros.post('/ajouter/checkexist/article', (req, res) => {
	        let TAG = req.body.TAG
	        let code = req.body.code
		    let sql = `SELECT * FROM system_commande WHERE SystemTag = '${TAG}' AND State = 'W' AND  Articles LIKE '%A_Code\":${code},\"Name\"%'`; 
	        connection.query(sql, (err, rows, fields) => {
		         if (err){ throw err}

		        let rended = []
		    	for (var i = 0; i < rows.length ; i++) {
		    	  	let item = JSON.parse(rows[i].Articles);
		    	 	for (var k = 0; k < item.length; k++) {
		    	 		rended.push(item[k])
		    	 	}
		    	}

				var result = [];	
				rended.reduce(function(res, value) {
				   if (!res[value.A_Code]) {
				     res[value.A_Code] = { A_Code: value.A_Code, Name: value.Name, Qte: 0 };
				     result.push(res[value.A_Code])
				   }
				   res[value.A_Code].Qte += parseInt(value.Qte);
				   return res;
			    }, {});

		       res.send(result);
		   })    
	})

	/* enregister une Commande */ 
	CommandePtvGros.post('/ajouter', (req, res) => {
		(async() => {
		   let TAG = req.body.tag
	       let factId = req.body.commandD
	       let CID = await GenerateID(1111111111,`system_commande`,'C_ID');
	       let articleL = JSON.stringify(factId.articles)
	       let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
	       let sql = `INSERT INTO system_commande (C_ID,Client,Date_Passe,Date_Volu,Totale,PassePar, SystemTag,State,Articles,Comments,Retour,Prix_Grox) 
	                 VALUES ('${CID}','${factId.client}','${Today}','${factId.jour}','${factId.totale}','${factId.UID}','${TAG}','W','${articleL}','${factId.Comments}',0,'${factId.prixGros}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.send(err) }
	        res.send(rows);
	      }) 
	     })()   
	}) 

/*####################################[MES COMMANDEQS ]##############################*/

	/* selctioner mes commandes [in between] */
	CommandePtvGros.post('/mescommandes', (req, res) => {
	      let TAG = req.body.tag;
	      let PassePar = req.body.UID;
	      let sql = `SELECT * FROM 	system_commande 
			      	LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
			      	WHERE system_commande.SystemTag = '${TAG}' AND system_commande.PassePar = ${PassePar}
			      	ORDER BY system_commande.Date_Passe DESC`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selctioner mes commandes [in between] */
	CommandePtvGros.post('/mescommandes/bydate', (req, res) => {
	      let TAG = req.body.tag;
	      //let PassePar = req.body.UID;
	      let Today = new Date().toISOString().split('T')[0]
	      let sql = `SELECT * FROM 	system_commande 
			      	LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
			      	WHERE system_commande.SystemTag = '${TAG}' AND system_commande.Date_Passe = '2022-11-10'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner une commnases 
	CommandePtvGros.post('/mescommandes/select', (req, res) => {
	      let TAG = req.body.tag;
	      let PassePar = req.body.UID;
	      let sql = `SELECT * FROM 	system_commande 
				     LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
				     WHERE SystemTag = '${TAG}' AND PassePar = ${PassePar} AND `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})*/

	/* modifier un facture */
	CommandePtvGros.post('/mescommandes/edit', (req, res) => {
	      let TAG = req.body.tag;
	      let commandD = req.body.commandD;
	      let articleL = JSON.stringify(commandD.articles) 
	      let Com_Id = req.body.Com_Id
	      let sql = `UPDATE system_commande
					SET Client = '${commandD.client}', Totale = '${commandD.totale}', Articles = '${articleL}' , Date_Volu ='${commandD.jour}' , Comments ='${commandD.Comments}', Prix_Grox = '${commandD.prixGros}'
					WHERE SystemTag = '${TAG}' AND C_ID = ${Com_Id} `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})	

/*####################################[CATALOGUE]###################################*/
	/*fetch all article */
	CommandePtvGros.post('/stock/all', (req, res) => {
	      let TAG = req.body.tag
	      let genre = req.body.genre
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1 ORDER BY Quantite DESC`; // Genre = ${genre}
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/*fetch all article */
	CommandePtvGros.post('/stock/genre', (req, res) => {
	      let TAG = req.body.tag
	      let genre = req.body.genre
	      let sql = `SELECT * FROM ${TAG}_article WHERE Genre = '${genre}' ORDER BY Quantite DESC `; // 
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/*fetch article */
	CommandePtvGros.post('/stock/articles', (req, res) => {
	      let TAG = req.body.tag;
	      let PassePar = req.body.UID;
	      let sql = `SELECT * FROM 	system_commande WHERE SystemTag = '${TAG}' AND PassePar = ${PassePar}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/*fetch articles by catalogue */
	CommandePtvGros.post('/stock/familles', (req, res) => {
	      let TAG = req.body.tag;
	      let PassePar = req.body.UID;
	      let sql = `SELECT * FROM 	system_commande WHERE SystemTag = '${TAG}' AND PassePar = ${PassePar}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[CLIENT]######################################*/
    /*fetch all article */
	CommandePtvGros.post('/client/uppos', (req, res) => {
	        let TAG = req.body.tag;
			let client = req.body.CID
			let position = req.body.position
		    let sql = `UPDATE system_clients
	       			  SET Lat =${position.latitude} , Lng = ${position.longitude}
	                  WHERE CL_ID = ${client}`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})
	          
	})


/*####################################[RECETTE]#####################################*/
	/*Recette*/
	CommandePtvGros.post('/recette', (req, res) => {
	      let TAG = req.body.tag
	      let UID = req.body.UID
	      let Today = new Date().toISOString().split('T')[0]
	      let sql = `SELECT SUM(Totale) AS Totale FROM system_commande WHERE SystemTag = '${TAG}' AND 	PassePar = '${UID}' AND Date_Passe = '${Today}'`; // Genre = ${genre}
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        if (rows[0].Totale == null) {res.json('0.000');} else {res.json(rows[0].Totale);}
	      })
	          
	})

	/*Statistique*/
	CommandePtvGros.post('/recette/stat', (req, res) => {
	      let TAG = req.body.tag
	      let genre = req.body.genre
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1`; // Genre = ${genre}
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	
/*&&&&&&&&&&&&&&&&&[Mettre A Jour]&&&&&&&&&&&&&&*/
  /* fetch main Tools */
	CommandePtvGros.post('/update', (req, res) => {
	       let TAG = req.body.tag
	       let PassePar = req.body.UID;
	       let Today = new Date().toISOString().split('T')[0]
	        function FetchStock() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchCommande() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM 	system_commande WHERE SystemTag = '${TAG}' AND PassePar = ${PassePar}`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchClient() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_clients WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

  			// Call, Function
		    async function query() {
		            const updateData = [{}]; 
		      		updateData[0].stock = await FetchStock()
		      		updateData[0].commande = await FetchCommande()
		      		updateData[0].client = await FetchClient()
			      res.send(updateData)
			 }
		    query();
	})

module.exports = CommandePtvGros