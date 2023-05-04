const express = require('express')
const CamionPtvGros = express.Router()

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

/*####################################[LOGIN & LANDING ]###########################*/

	/*log in*/
	CamionPtvGros.post('/LogIn', (req, res) => {
		  const TAG = req.body.tag;
		  const logInD = req.body.LoginData;

		  let sql = `SELECT * FROM ${TAG}_camion WHERE Identifiant = '${logInD.Log}' AND Pasword  = '${logInD.Pwd}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    if (rows.length == 0 ) {
			    let tokenTable = [Exist = 'false', CID = 'null', Name = 'null']; 
			    res.send(JSON.stringify(tokenTable));
		    } 
			else {
				let tokenTable = [Exist = 'true', CID = rows[0].Cam_ID , Data = JSON.stringify(rows[0])];
	     	    res.send(JSON.stringify(tokenTable));	
			}

		  }); 
	})

	CamionPtvGros.post('/main/position', (req, res) => {
		  	    let TAG = req.body.tag;
				let camId = req.body.camId;
				let position = JSON.stringify(req.body.position);
				let Today = new Date().toISOString().split('T')[0]
				let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
				let sql = `INSERT INTO ${TAG}_camion_position(Camion_ID,jour,heur,Position) VALUES ('${camId}','${Today}','${ToTime}','${position}') ON DUPLICATE KEY UPDATE jour = '${Today}',  heur = '${ToTime}' , Position = '${position}' ;`;
				connection.query(sql, (err, rows, fields) => {
					if (err) throw err
					res.json(rows);
				}); 
	})

/*####################################[NOUVEAUX F]#################################*/

	/* selectioner mes articles */
	CamionPtvGros.post('/nv/stock', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;

		  let sql = `SELECT  ${TAG}_camion_stock.Qte, ${TAG}_article.*
		  			 FROM ${TAG}_camion_stock
		  			 LEFT JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
		  			 WHERE ${TAG}_camion_stock.Camion = ${camId}` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* enregister une facture */ 
	CamionPtvGros.post('/nv/ajouter', (req, res) => {
		(async() => {
		  	    let TAG = req.body.tag;
				let factureD = req.body.factureD;
				let FID = await GenerateID(1111111111,`${TAG}_camion_facture`,'F_ID');
				let articleL = JSON.stringify(factureD.articles)
				let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
				let sql = `INSERT INTO ${TAG}_camion_facture (F_ID,Cre_Date,Camion,C_Name,Tota,Lat,Lng,Chauffeur,Articles,Prix_Grox) 
				         VALUES ('${FID}','${Today}','${factureD.Camion}','${factureD.client}','${factureD.totale}','null','null','null','${articleL}','${factureD.prixGros}')`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json({FID:FID});
				}); 
		})() 
	})

/*####################################[MES FACT]###################################*/

	/* selctioner mes factures [in between] */
	CamionPtvGros.post('/mf', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  let sql = `SELECT * 
		  			 FROM ${TAG}_camion_facture 
		  			 LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
		  			 WHERE ${TAG}_camion_facture.Camion = ${camId} ORDER BY ${TAG}_camion_facture.Cre_Date DESC LIMIT 50` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner une factures */
	CamionPtvGros.post('/mf/select', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  const FID = req.body.fid;
		  let sql = `SELECT *
		  			 FROM ${TAG}_camion_facture 
		  			 LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
		  			 WHERE ${TAG}_camion_facture.Camion =  ${camId}  AND ${TAG}_camion_facture.F_ID = ${FID} ` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* modifier un facture */
	CamionPtvGros.post('/mf/modifier', (req, res) => {
		  let TAG = req.body.tag;
		  let factId = req.body.factD
		  let articleL = JSON.stringify(factId.articles)
		  let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
		  let FID = req.body.fid;
		  let sql = `UPDATE ${TAG}_camion_facture
	       			 SET C_Name = '${factId.client}', Tota = '${factId.totale}', Articles = '${articleL}', Prix_Grox = '${factId.prixGros}'
	                 WHERE F_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})
	
/*####################################[STOCK]######################################*/
	/*Suivie un article */
	CamionPtvGros.post('/sk/suivie', (req, res) => {
		    let TAG = req.body.tag;
		    let camionID = req.body.camId;
		    let article = req.body.article;
		    let Today = new Date().toISOString().split('T')[0]
		    
		    function GetLastInventaire() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_fond WHERE Camion = ${camionID} AND Articles LIKE '%${article}%' AND Genre = 'Inventaire' ORDER BY Jour DESC LIMIT 1`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0]) {resolve([{PK: 0 , Articles:'[{}]' , Jour: null}]);} else {resolve(rows);}
				      })
			      });
		    }
		    function GetArticleData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT  ${TAG}_camion_stock.Qte, ${TAG}_article.*
					  			 FROM ${TAG}_camion_stock
					  			 LEFT JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
					  			 WHERE ${TAG}_camion_stock.Camion = ${camionID} AND ${TAG}_camion_stock.Article = ${article}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchArticleFromFond(date,last) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_fond WHERE Camion = ${camionID} AND Genre = 'Fonds' AND PK > ${last} AND Jour >= '${date}' AND Articles LIKE '%${article}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchArticleInFacture(date) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_facture 
			      			   LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
			      			   WHERE ${TAG}_camion_facture.Camion = ${camionID} AND ${TAG}_camion_facture.Cre_Date  >= '${date}' AND ${TAG}_camion_facture.Articles LIKE '%${article}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchSuivieArticle(date) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_stock_fixed WHERE Camion = ${camionID} AND Jour >= '${date}' AND Articles LIKE '%${article}%'`;

				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function GenerateDate(str, days) {
		    	var myDate = new Date(str);
		        myDate.setDate(myDate.getDate() + parseInt(days));
		        return myDate.toISOString().split('T')[0];
		    }

	      	// Call, Function
		    async function query() {
		        const camionArtData = [{}];
		        const LastInv = await GetLastInventaire();  
		        const LastInvDate = GenerateDate(LastInv[0].Jour, 1) 
		        camionArtData[0].LastInv = await GetLastInventaire(); 
		        camionArtData[0].ArtData = await GetArticleData(); 
		        camionArtData[0].InFact = await FetchArticleInFacture(LastInvDate); 
		      	camionArtData[0].InFond = await FetchArticleFromFond(LastInvDate, LastInv[0].PK)
		      	camionArtData[0].FromSuivie = await FetchSuivieArticle(LastInvDate)
		      	res.send(camionArtData[0])
		    }
		    query(); 
	})

	/*Selectionner Fonds */
	CamionPtvGros.post('/sk/fonds', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  let sql = `SELECT * FROM ${TAG}_camion_fond WHERE Camion = ${camId} AND Genre = 'Fonds' ORDER BY Jour DESC LIMIT 50` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Selectionner Fonds info*/
	CamionPtvGros.post('/sk/fonds/info', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  const FID = req.body.fid;
		  let sql = `SELECT * FROM ${TAG}_camion_fond WHERE Camion = ${camId} AND F_ID = ${FID}` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Regler Ventes*/
	CamionPtvGros.post('/sk/reglemment', (req, res) => {
		  let TAG = req.body.tag  
		  let camion = req.body.camId
	      let articleList = req.body.artList; 
	      let sqlText = ''
	      for (let i = 0; i < articleList.length; i++) {
			    sqlText = sqlText.concat(" ", `WHEN ${parseInt(articleList[i][0]) + parseInt(camion)} THEN Qte -  ${articleList[i][2]} `);    
		   }
	      let sql = `UPDATE ${TAG}_camion_stock
				   	SET Qte = CASE Ultra_Unique 
			                      ${sqlText}
			       	ELSE Qte
			       	END`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json(rows);
	      	})  
	})

	/*check if stock is fixed */
	CamionPtvGros.post('/sk/reglemment/check', (req, res) => {
		  let TAG = req.body.tag;
		  let camId = req.body.camId;
		  let Today = req.body.jour;
		  //let Today = new Date().toISOString().split('T')[0]
		  let sql = `SELECT * FROM ${TAG}_camion_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Regler Ventes*/
	CamionPtvGros.post('/sk/reglemment/enregistrer', (req, res) => {
		  	    let TAG = req.body.tag;
				let Camion = req.body.camId;
				let today = req.body.jour;
				//let today =  new Date().toISOString().split('T')[0]
				let articleL = JSON.stringify(req.body.artList)
				let sql = `INSERT INTO ${TAG}_camion_stock_fixed
				         (Camion,Jour,Articles) 
				         VALUES ('${Camion}','${today}','${articleL}')`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json({saved:true});

				}); 
	})

/*####################################[VENTES]#####################################*/
	/* selctioner mes vente auhoudhui */
	CamionPtvGros.post('/mv/resumer', (req, res) => {
				let TAG = req.body.tag
				let camId = req.body.camId
				let Today =  new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
				function FetchStock() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT  ${TAG}_camion_stock.Qte, ${TAG}_article.*
					  			 FROM ${TAG}_camion_stock
					  			 LEFT JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
					  			 WHERE ${TAG}_camion_stock.Camion = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function CheckReglemment() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT * FROM ${TAG}_camion_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		 				 connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function FetchVente() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT Articles  FROM ${TAG}_camion_facture  WHERE Camion = ${camId} AND Cre_Date = '${Today}'`; 
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

					        resolve(result);
					   }) 
				  	})
				}
				// Call, Function
				async function query() {
				        const resumerData = [{}]; 
				  		resumerData[0].stock = await FetchStock()
				  		resumerData[0].vente = await FetchVente()
				  		resumerData[0].regler = await CheckReglemment()
				      res.send(resumerData)
				 }
				query();    
		       
	})

	/* selctioner mes vente auhoudhui */
	CamionPtvGros.post('/mv/resumer/jour', (req, res) => {
				let TAG = req.body.tag
				let camId = req.body.camId
				let Jour = req.body.jour
				let Today =  new Date(Jour).toISOString().split('T')[0]
				function FetchStock() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT  ${TAG}_camion_stock.Qte, ${TAG}_article.*
					  			 FROM ${TAG}_camion_stock
					  			 LEFT JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
					  			 WHERE ${TAG}_camion_stock.Camion = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function CheckReglemment() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT * FROM ${TAG}_camion_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		 				 connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function FetchVente() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT Articles  FROM ${TAG}_camion_facture  WHERE Camion = ${camId} AND Cre_Date = '${Today}'`; // AND Cre_Date = '${Today}' 
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

				        resolve(result);
				   }) 
				  	})
				}
				// Call, Function
				async function query() {
				        const resumerData = [{}]; 
				  		resumerData[0].stock = await FetchStock()
				  		resumerData[0].vente = await FetchVente()
				  		resumerData[0].regler = await CheckReglemment()
				      res.send(resumerData)
				 }
				query();    
		       
	})

	/* selctioner mes vente auhoudhui */
	CamionPtvGros.post('/mv/article', (req, res) => {
		   let TAG = req.body.tag
	       let camId = req.body.camId
	       let article = req.body.code
	       let Today = new Date().toISOString().split('T')[0]
	       let sql = `SELECT *  FROM ${TAG}_camion_facture  
	       			 LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
	       			 WHERE ${TAG}_camion_facture.Camion = '${camId}' AND ${TAG}_camion_facture.Articles LIKE '%${article}%' AND ${TAG}_camion_facture.Cre_Date = '${Today}'`; // AND Cre_Date = '${Today}'
	       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json(rows);
	      }) 
	})

/*####################################[CLIENT]#####################################*/

/*####################################[RECETTE]####################################*/
	/* Ajouter Depense */
	CamionPtvGros.post('/rt/depense/list', (req, res) => {   
		  	    let TAG = req.body.tag;
				let Today = new Date().toISOString().split('T')[0]
				let camId = req.body.camId;
				let sql = `SELECT * FROM ${TAG}_camion_depenses WHERE Camion = ${camId} AND Jour = '${Today}'`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json(rows);

				}); 
	})

	/* Ajouter Depense */
	CamionPtvGros.post('/rt/depense/ajouter', (req, res) => {
		  	    let TAG = req.body.tag;
				let depD = req.body.depenseD;
				let Today = new Date().toISOString().split('T')[0]
				let camId = req.body.camId;
				let sql = `INSERT INTO ${TAG}_camion_depenses (Camion,Depenses,Valeur,Jour) 
				         VALUES ('${camId}','${depD.genre}','${depD.valeur}','${Today}')`;
				connection.query(sql, (err, rows, fields) => {
					if (err) throw err
					res.json({camId:camId});
				}); 
	})

	/* Supprimer Depense */
	CamionPtvGros.post('/rt/depense/supprimer', (req, res) => {
		  	    let TAG = req.body.tag;
				let ID = req.body.depId;
				let sql = `DELETE FROM ${TAG}_camion_depenses WHERE PK = ${ID}`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json({ID:ID});

				}); 
	})

	/*Imprimer Recette */
	CamionPtvGros.post('/rt/imprimer', (req, res) => {
		    let TAG = req.body.tag;
		    let camionID = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]

		    function CalculateRecette() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Tota) AS RCT
			                  FROM ${TAG}_camion_facture WHERE Camion = ${camionID} AND Cre_Date = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
				          
				      })
			      });
		    }

		    function CalculateDepense() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Valeur) AS DEP
			                  FROM ${TAG}_camion_depenses WHERE Camion = ${camionID} AND Jour = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].DEP == null) {resolve('0.000');} else {resolve(rows[0].DEP.toFixed(3));}
				          
				      })
			      });
		    }

	      	// Call, Function
		    async function query() {
		        const recetteData = [{}]; 
		        recetteData[0].Totale = await CalculateRecette(); 
		      	recetteData[0].TotDepense = await CalculateDepense()
		      	res.send(recetteData)
		    }
		    query(); 
	})

/*####################################[COMMANDES]####################################*/
	/* selectionner tous les factures */
	CamionPtvGros.post('/cmd', (req, res) => {
	        const TAG = req.body.tag;
		    const camId = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]
	        let sql = `SELECT *  FROM ${TAG}_facture 
	       			   LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID  
	       			   WHERE ${TAG}_facture.Fournisseurs = ${camId} AND ${TAG}_facture.Cre_Date = '${Today}'`;
	        connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*&&&&&&&&&&&&&&&&&[Mettre A Jour]&&&&&&&&&&&&&&*/
  /* fetch main Tools */
	CamionPtvGros.post('/update', (req, res) => {
	       let TAG = req.body.tag
	       const camId = req.body.camId;
	       let Today = new Date().toISOString().split('T')[0]
	        function FetchStock() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT  ${TAG}_camion_stock.Qte, ${TAG}_article.*
				  			 FROM ${TAG}_camion_stock
				  			 LEFT JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
				  			 WHERE ${TAG}_camion_stock.Camion = ${camId}`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchFacture() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_facture WHERE Camion = ${camId}`;
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
		      		updateData[0].facture = await FetchFacture()
		      		updateData[0].client = await FetchClient()
			      res.send(updateData)
			 }
		    query();
	})


module.exports = CamionPtvGros