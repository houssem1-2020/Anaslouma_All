const express = require('express')
const MagazinCaisse = express.Router()

const connection = require('../connection-mg.js')


/*####################################[USEFUL]#####################################*/
   /*Generate FID, CID, C_ID, ,ID*/    
    const GenerateID = async (length,tabelName,IdName) =>{ 
    	function SelectAllID(ID,table) {
		      return new Promise((resolve, reject) => {
		      		connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
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
	MagazinCaisse.post('/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `SELECT * FROM caises WHERE Identifiant = '${logInD.Log}' AND Password  = '${logInD.Pwd}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows[0])

		  }); 
	})

	MagazinCaisse.post('/main/position', (req, res) => {
		  	    let PID = req.body.forPID;
				let camId = req.body.camId;
				let position = JSON.stringify(req.body.position);
				let Today = new Date().toISOString().split('T')[0]
				let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
				connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
				let sql = `INSERT INTO caises_position(Camion_ID,jour,heur,Position) VALUES ('${camId}','${Today}','${ToTime}','${position}') ON DUPLICATE KEY UPDATE jour = '${Today}',  heur = '${ToTime}' , Position = '${position}' ;`;
				connection.query(sql, (err, rows, fields) => {
					if (err) throw err
					res.json(rows);
				}); 
	})

/*####################################[NOUVEAUX F]#################################*/

	/* selectioner mes articles */
	MagazinCaisse.post('/nv/stock', (req, res) => {
		  const TAG = req.body.tag;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `SELECT PK, A_Code, Name, Quantite, Prix_vente FROM articles WHERE 1` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})


	MagazinCaisse.post('/nv/ajouter', async function(req, res, next) {
	  	    let PID = req.body.forPID;
			let factureD = req.body.factureD;
			let FID = await GenerateID(1111111111,`factures`,'T_ID');
			req.storedFID = FID
			let articleL = JSON.stringify(factureD.articles)
			req.articleList = factureD.articles
			let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
			let ToTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			let sql = `INSERT INTO factures (T_ID,Caisse_ID,Final_Value,Espece, T_Date, T_Time,Client,State, Paye_Bons, Articles) 
				       VALUES ('${FID}','${factureD.Caisse}','${factureD.totale}','0','${Today}','${ToTime}', 'PASSAGER' ,'Waitting','','${articleL}')`;
			connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				//res.json({FID:FID});
				
			}); 
	        next();
	}, function(req, res) {
		  let listeDesArticle =  req.articleList
	      let sqlText = ''
		   listeDesArticle.map( (data) => {
		   		sqlText = sqlText.concat(" ", `WHEN ${data.A_Code} THEN Quantite -  ${data.Qte} `);
		   })
	      let sql = `UPDATE articles
				   	SET Quantite = CASE A_Code 
			                      ${sqlText}
			       	ELSE Quantite
			       	END`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json({FID: req.storedFID})
	      	}) 
	});



	/* modifier un facture */
	MagazinCaisse.post('/nv/payee/espece', (req, res) => {
		  let PID = req.body.forPID;
		  let espece = req.body.espece
		  let FID = req.body.fid;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `UPDATE factures
	       			 SET Espece = '${espece}', State = 'Payee'
	                 WHERE T_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})

	/* modifier un facture */
	MagazinCaisse.post('/nv/payee/bons', (req, res) => {
		  let PID = req.body.forPID;
		  let bonsL = JSON.stringify(req.body.bons)
		  let FID = req.body.fid;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `UPDATE factures
	       			 SET Paye_Bons = '${bonsL}', State = 'Payee'
	                 WHERE T_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})


	/* modifier un facture */
	MagazinCaisse.post('/nv/client/credit', (req, res) => {
		  let PID = req.body.forPID;
		  let clientId = req.body.clientId
		  let FID = req.body.fid;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `UPDATE factures
	       			 SET Client = '${clientId}', State = 'Credit'
	                 WHERE T_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})

	/* modifier un facture */
	MagazinCaisse.post('/nv/client/fidelite', (req, res) => {
		  let PID = req.body.forPID;
		  let clientId = req.body.clientId
		  let FID = req.body.fid;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `UPDATE factures
	       			 SET Client = '${clientId}' 
	                 WHERE T_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})

/*####################################[MES FACT]###################################*/

	/* selctioner mes factures [in between] */
	MagazinCaisse.post('/mf', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `SELECT * 
		  			 FROM caises_facture 
		  			 LEFT JOIN 08_vente_en_gros_clients ON caises_facture.C_Name = 08_vente_en_gros_clients.CL_ID
		  			 WHERE caises_facture.Camion = ${camId} ORDER BY caises_facture.Cre_Date DESC LIMIT 50` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner une factures */
	MagazinCaisse.post('/mf/select', (req, res) => {
		  const TAG = req.body.tag;
		  const caisseId = req.body.caisseId;
		  const FID = req.body.ticketId;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name FROM factures 
                     LEFT JOIN clients ON factures.Client = clients.CL_ID 
                     LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
                     WHERE factures.Caisse_ID =  ${caisseId}  AND factures.T_ID = ${FID} ` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* modifier un facture */
	MagazinCaisse.post('/mf/modifier', (req, res) => {
		  let PID = req.body.forPID;
		  let factId = req.body.factD
		  let articleL = JSON.stringify(factId.articles)
		  let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
		  let FID = req.body.fid;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `UPDATE caises_facture
	       			 SET C_Name = '${factId.client}', Tota = '${factId.totale}', Articles = '${articleL}'
	                 WHERE F_ID = '${FID}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json({FID:FID});
		  }); 
	})
	
/*####################################[STOCK]######################################*/
	/*Suivie un article */
	MagazinCaisse.post('/sk/suivie', (req, res) => {
		    let PID = req.body.forPID;
		    let camionID = req.body.camId;
		    let article = req.body.article;
		    let Today = new Date().toISOString().split('T')[0]
		    
		    function GetLastInventaire() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM caises_fond WHERE Camion = ${camionID} AND Articles LIKE '%${article}%' AND Genre = 'Inventaire' ORDER BY Jour DESC LIMIT 1`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0]) {resolve([{PK: 0 , Articles:'[{}]' , Jour: null}]);} else {resolve(rows);}
				      })
			      });
		    }
		    function GetArticleData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT  caises_stock.Qte, 08_vente_en_gros_articles.*
					  			 FROM caises_stock
					  			 LEFT JOIN 08_vente_en_gros_articles ON caises_stock.Article = 08_vente_en_gros_articles.A_Code
					  			 WHERE caises_stock.Camion = ${camionID} AND caises_stock.Article = ${article}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchArticleFromFond(date,last) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM caises_fond WHERE Camion = ${camionID} AND Genre = 'Fonds' AND PK > ${last} AND Jour >= '${date}' AND Articles LIKE '%${article}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchArticleInFacture(date) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM caises_facture 
			      			   LEFT JOIN 08_vente_en_gros_clients ON caises_facture.C_Name = 08_vente_en_gros_clients.CL_ID
			      			   WHERE caises_facture.Camion = ${camionID} AND caises_facture.Cre_Date  >= '${date}' AND caises_facture.Articles LIKE '%${article}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				      })
			      });
		    }
		    function FetchSuivieArticle(date) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM caises_stock_fixed WHERE Camion = ${camionID} AND Jour >= '${date}' AND Articles LIKE '%${article}%'`;

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
	MagazinCaisse.post('/sk/fonds', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  let sql = `SELECT * FROM caises_fond WHERE Camion = ${camId} AND Genre = 'Fonds' ORDER BY Jour DESC LIMIT 50` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Selectionner Fonds info*/
	MagazinCaisse.post('/sk/fonds/info', (req, res) => {
		  const TAG = req.body.tag;
		  const camId = req.body.camId;
		  const FID = req.body.fid;
		  let sql = `SELECT * FROM caises_fond WHERE Camion = ${camId} AND F_ID = ${FID}` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Regler Ventes*/
	MagazinCaisse.post('/sk/reglemment', (req, res) => {
		  let PID = req.body.forPID  
		  let camion = req.body.camId
	      let articleList = req.body.artList; 
	      let sqlText = ''
	      for (let i = 0; i < articleList.length; i++) {
			    sqlText = sqlText.concat(" ", `WHEN ${parseInt(articleList[i][0]) + parseInt(camion)} THEN Qte -  ${articleList[i][2]} `);    
		   }
	      let sql = `UPDATE caises_stock
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
	MagazinCaisse.post('/sk/reglemment/check', (req, res) => {
		  let PID = req.body.forPID;
		  let camId = req.body.camId;
		  let Today = req.body.jour;
		  //let Today = new Date().toISOString().split('T')[0]
		  let sql = `SELECT * FROM caises_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/*Regler Ventes*/
	MagazinCaisse.post('/sk/reglemment/enregistrer', (req, res) => {
		  	    let PID = req.body.forPID;
				let Camion = req.body.camId;
				let today = req.body.jour;
				//let today =  new Date().toISOString().split('T')[0]
				let articleL = JSON.stringify(req.body.artList)
				let sql = `INSERT INTO caises_stock_fixed
				         (Camion,Jour,Articles) 
				         VALUES ('${Camion}','${today}','${articleL}')`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json({saved:true});

				}); 
	})

/*####################################[VENTES]#####################################*/
	/* selctioner mes vente auhoudhui */
	MagazinCaisse.post('/mv/resumer', (req, res) => {
				let PID = req.body.forPID
				let camId = req.body.camId
				let Today =  new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
				function FetchStock() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT  caises_stock.Qte, 08_vente_en_gros_articles.*
					  			 FROM caises_stock
					  			 LEFT JOIN 08_vente_en_gros_articles ON caises_stock.Article = 08_vente_en_gros_articles.A_Code
					  			 WHERE caises_stock.Camion = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function CheckReglemment() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT * FROM caises_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		 				 connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function FetchVente() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT Articles  FROM caises_facture  WHERE Camion = ${camId} AND Cre_Date = '${Today}'`; 
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
	MagazinCaisse.post('/mv/resumer/jour', (req, res) => {
				let PID = req.body.forPID
				let camId = req.body.camId
				let Jour = req.body.jour
				let Today =  new Date(Jour).toISOString().split('T')[0]
				function FetchStock() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT  caises_stock.Qte, 08_vente_en_gros_articles.*
					  			 FROM caises_stock
					  			 LEFT JOIN 08_vente_en_gros_articles ON caises_stock.Article = 08_vente_en_gros_articles.A_Code
					  			 WHERE caises_stock.Camion = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function CheckReglemment() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT * FROM caises_stock_fixed WHERE Camion = '${camId}' AND  Jour = '${Today}'` ;
		 				 connection.query(sql, (err, rows, fields) => {
					       if (err) return reject(err);
					       resolve(rows);
				  		})
				  	})
				}

				function FetchVente() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT Articles  FROM caises_facture  WHERE Camion = ${camId} AND Cre_Date = '${Today}'`; // AND Cre_Date = '${Today}' 
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
	MagazinCaisse.post('/mv/article', (req, res) => {
		   let PID = req.body.forPID
	       let camId = req.body.camId
	       let article = req.body.code
	       let Today = new Date().toISOString().split('T')[0]
	       let sql = `SELECT *  FROM caises_facture  
	       			 LEFT JOIN 08_vente_en_gros_clients ON caises_facture.C_Name = 08_vente_en_gros_clients.CL_ID
	       			 WHERE caises_facture.Camion = '${camId}' AND caises_facture.Articles LIKE '%${article}%' AND caises_facture.Cre_Date = '${Today}'`; // AND Cre_Date = '${Today}'
	       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json(rows);
	      }) 
	})

/*####################################[CLIENT]#####################################*/
	MagazinCaisse.post('/client/reglemment', async function(req, res, next) {
	  	    let PID = req.body.forPID;
			let clientId = req.body.clientId;
			let R_ID = await GenerateID(1111111111,`clients_reglement`,'R_ID');
			let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
			req.totaleRg = req.body.totaleRg
			req.caisseId = req.body.caisseId
			req.clientId = req.body.clientId
			connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			let sql = `INSERT INTO clients_reglement (R_ID,Client,Reglemment,R_Date,Caisse_ID) 
				       VALUES ('${R_ID}','${clientId}','${req.totaleRg}','${Today}','${req.caisseId}')`;
			connection.query(sql, (err, rows, fields) => {
				if (err) throw err				
			}); 
	        next();
	}, function(req, res) {
		  let clientId =  req.clientId
	      let sql = `UPDATE factures
				   	SET State = 'Payee' 
			        WHERE Client = ${clientId}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json({FID: clientId})
	      	}) 
	});
/*####################################[RECETTE]####################################*/
	/* Ajouter Depense */
	MagazinCaisse.post('/rt/depense/list', (req, res) => {   
		  	    let PID = req.body.forPID;
				let Today = new Date().toISOString().split('T')[0]
				let camId = req.body.camId;
				connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
				let sql = `SELECT * FROM caises_depenses WHERE Caisse_ID = ${camId} AND D_Date = '${Today}'`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json(rows);

				}); 
	})

	/* Ajouter Depense */
	MagazinCaisse.post('/rt/depense/ajouter', (req, res) => {
		  	    let PID = req.body.forPID;
				let depD = req.body.depenseD;
				let Today = new Date().toISOString().split('T')[0]
				let camId = req.body.camId;
				connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
				let sql = `INSERT INTO caises_depenses (Caisse_ID,Depense,Valeur, Description, D_Date) 
				           VALUES ('${camId}','${depD.genre}','${depD.valeur}','${depD.Description}','${Today}')`;
				connection.query(sql, (err, rows, fields) => {
					if (err) throw err
					res.json({camId:camId});
				}); 
	})

	/* Supprimer Depense */
	MagazinCaisse.post('/rt/depense/supprimer', (req, res) => {
		  	    let PID = req.body.forPID;
				let ID = req.body.depId;
				let sql = `DELETE FROM caises_depenses WHERE PK = ${ID}`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json({ID:ID});

				}); 
	})

	/*Imprimer Recette */
	MagazinCaisse.post('/rt/imprimer', (req, res) => {
		    let PID = req.body.forPID;
		    let camionID = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]

		    function CalculateRecette() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Final_Value) AS RCT
			                  FROM  factures WHERE Caisse_ID = ${camionID} AND T_Date = '${Today}' AND State = 'Payee' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
				          
				      })
			      });
		    }

		    function CalculateDepense() {
			      return new Promise((resolve, reject) => {
			      	let sql = `
			      			   SELECT SUM(Valeur) AS DEP
			                   FROM caises_depenses WHERE Caisse_ID = ${camionID} AND D_Date = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].DEP == null) {resolve('0.000');} else {resolve(rows[0].DEP.toFixed(3));}
				          
				      })
			      });
		    }
		    function CalculateBons() {
			      return new Promise((resolve, reject) => {
				      	let sql = `SELECT Paye_Bons  FROM factures WHERE Caisse_ID = ${camionID} AND T_Date = '${Today}' AND Paye_Bons != ''`; 
				        connection.query(sql, (err, rows, fields) => {
					        if (err){ throw err}
					   //      const result = rows.reduce((acc, current) => {
								//   const existing = acc.find(item => item.valeur === current.valeur);
								//   if (existing) {
								//     existing.qte += current.qte;
								//   } else {
								//     acc.push({ qte: current.qte, valeur: current.valeur });
								//   }
								//   return acc;
								// }, []);
					        let rended = []
					    	for (var i = 0; i < rows.length ; i++) {
					    	  	let item = JSON.parse(rows[i].Paye_Bons);
					    	 	//for (var k = 0; k < item.length; k++) {
					    	 		rended.push(item)
					    	 	//}
					    	}
							var result = [];	
							 rended.reduce(function(res, value) {
							   if (!res[value.valeur]) {
							     res[value.valeur] = { valeur: value.valeur, Name: value.Name, qte: 0 };
							     result.push(res[value.valeur])
							   }
							   res[value.valeur].qte += parseInt(value.qte);
							   return res;
							 }, {});

					        resolve(result);
					   }) 
				  	})
		    }

	      	// Call, Function
		    async function query() {
		        const recetteData = [{}]; 
		        recetteData[0].Totale = await CalculateRecette(); 
		      	recetteData[0].TotDepense = await CalculateDepense()
		      	recetteData[0].TotBons = await CalculateBons()
		      	res.send(recetteData)
		    }
		    query(); 
	})

	/*Imprimer Recette */
	MagazinCaisse.post('/rt/imprimer/temp', (req, res) => {
		    let PID = req.body.forPID;
		    let camionID = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]

		    function CalculateRecette() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Final_Value) AS RCT
			                  FROM  factures WHERE Caisse_ID = ${camionID} AND T_Date = '${Today}' AND State = 'Payee' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT);}
				          
				      })
			      });
		    }

		    function CalculateDepense() {
			      return new Promise((resolve, reject) => {
			      	let sql = `
			      			   SELECT * FROM caises_depenses WHERE Caisse_ID = ${camionID} AND D_Date = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				          
				      })
			      });
		    }

		    function CalculateBons() {
			      return new Promise((resolve, reject) => {
				      	let sql = `SELECT Paye_Bons  FROM factures WHERE Caisse_ID = ${camionID} AND T_Date = '${Today}' AND Paye_Bons != ''`; 
				        connection.query(sql, (err, rows, fields) => {
					        if (err){ throw err}
					        let rended = []
					    	for (var i = 0; i < rows.length ; i++) {
					    	  	let item = JSON.parse(rows[i].Paye_Bons);
					    	 	//for (var k = 0; k < item.length; k++) {
					    	 		rended.push(item)
					    	 	//}
					    	}
							var result = [];	
							 rended.reduce(function(res, value) {
							   if (!res[value.valeur]) {
							     res[value.valeur] = { valeur: value.valeur, Name: value.Name, qte: 0 };
							     result.push(res[value.valeur])
							   }
							   res[value.valeur].qte += parseInt(value.qte);
							   return res;
							 }, {});

					        resolve(result);
					   }) 
				  	})
		    }

	      	// Call, Function
		    async function query() {
		        const recetteData = [{}]; 
		        recetteData[0].Totale = await CalculateRecette(); 
		      	recetteData[0].TotDepense = await CalculateDepense()
		      	recetteData[0].TotBons = await CalculateBons()
		      	res.send(recetteData)
		    }
		    query(); 
	})

	/* Ajouter Depense */
	MagazinCaisse.post('/rt/factures', (req, res) => {   
		  	    let PID = req.body.forPID;
				let Today = new Date().toISOString().split('T')[0]
				let caisseId = req.body.caisseId;
				connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
				let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name ,factures.State AS Pay_State FROM factures 
		                     LEFT JOIN clients ON factures.Client = clients.CL_ID 
		                     LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
		                     WHERE Caisse_ID = ${caisseId} AND T_Date = '${Today}'
		                     ORDER BY T_Time DESC `;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json(rows);

				}); 
	})

	/* Ajouter Depense */
	MagazinCaisse.post('/rt/factures/select', (req, res) => {   
		  	    let PID = req.body.forPID;
				let Today = new Date().toISOString().split('T')[0]
				let FID = req.body.fid;
				let caisseId = req.body.caisseId;
				connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
				let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name ,factures.State AS Pay_State FROM factures 
		                     LEFT JOIN clients ON factures.Client = clients.CL_ID 
		                     LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
		                     WHERE Caisse_ID = ${caisseId} AND T_ID = '${FID}'`;
				connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				res.json(rows);

				}); 
	})


/*####################################[COMMANDES]####################################*/
	/* selectionner tous les factures */
	MagazinCaisse.post('/cmd', (req, res) => {
	        const TAG = req.body.tag;
		    const camId = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]
	        let sql = `SELECT *  FROM 08_vente_en_gros_facture 
	       			   LEFT JOIN 08_vente_en_gros_clients ON 08_vente_en_gros_facture.C_Name = 08_vente_en_gros_clients.CL_ID  
	       			   WHERE 08_vente_en_gros_facture.Fournisseurs = ${camId} AND 08_vente_en_gros_facture.Cre_Date = '${Today}'`;
	        connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*&&&&&&&&&&&&&&&&&[Mettre A Jour]&&&&&&&&&&&&&&*/
  /* fetch main Tools */
	MagazinCaisse.post('/update', (req, res) => {
	       let PID = req.body.forPID
	       const camId = req.body.camId;
	       let Today = new Date().toISOString().split('T')[0]
	        function FetchStock() {
			    return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
              		let sql = `SELECT * FROM articles WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchFacture() {
			    return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                	let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name FROM factures 
                           LEFT JOIN clients ON factures.Client = clients.CL_ID 
                           LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
                           WHERE 1 LIMIT 200`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchClient() {
			    return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                	let sql = `SELECT *  FROM clients WHERE 1 `;
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

	/*save offline facture*/
	MagazinCaisse.post('/update/ajouter/facture', async function(req, res, next) {
	  	    let PID = req.body.forPID;
			let factureD = req.body.factureD;
			let FID = await GenerateID(1111111111,`factures`,'T_ID');
			req.storedFID = FID
			let articleL = JSON.stringify(factureD.articles)
			req.articleList = factureD.articles
			let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
			let ToTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
			connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			let sql = `INSERT INTO factures (T_ID,Caisse_ID,Final_Value,Espece, T_Date, T_Time, Client,State, Paye_Bons, Articles) 
				       VALUES ('${FID}','${factureD.Caisse}','${factureD.totale}','${factureD.Espece}','${Today}','${ToTime}', '${factureD.client}' ,'${factureD.State}','${factureD.Paye_Bons}','${articleL}')`;
			connection.query(sql, (err, rows, fields) => {
				if (err) throw err
				//res.json({FID:FID});
				
			}); 
	        next();
	}, function(req, res) {
		  let listeDesArticle =  req.articleList
	      let sqlText = ''
		   listeDesArticle.map( (data) => {
		   		sqlText = sqlText.concat(" ", `WHEN ${data.A_Code} THEN Quantite -  ${data.Qte} `);
		   })
	      let sql = `UPDATE articles
				   	SET Quantite = CASE A_Code 
			                      ${sqlText}
			       	ELSE Quantite
			       	END`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json({FID: req.storedFID})
	      	}) 
	});

module.exports = MagazinCaisse