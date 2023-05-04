const express = require('express')
const multer = require('multer')
const PtVenteGros = express.Router()
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const connection = require('../connection.js')

//Multer.js
//en server : C:/Users/Administrator/Desktop/Anaslouma/Assets/Images/Articles
const DIR = 'C:/Users/Administrator/Desktop/Anaslouma/Assets/Images/Articles';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  DIR );
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-'  + Math.floor(Math.random() * 9999999999999) + '.'+ file.mimetype.split('/')[1])
    }
});
const upload = multer({  storage: storage });


//connection.end()

/*####################################[USEFUL]####################################*/
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
    
/*####################################[LOGIN]#####################################*/
	/* Login */
	PtVenteGros.post('/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;

		  let sql = `SELECT * FROM admin_log_in WHERE Log = '${logInD.Log}' AND Pwd  = '${logInD.Pwd}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    if (rows.length == 0 ) {
			    let tokenTable = [Exist = 'false', KEY = 'null']; 
			    res.send(JSON.stringify(tokenTable));
		    } 
			else {
				let tokenTable = [Exist = 'true', KEY = rows[0].Permission_Key];
	     	    res.send(JSON.stringify(tokenTable));	
			}

		  }); 
	}) 

	/* Check autorisation */
	PtVenteGros.post('/Permission', (req, res) => {
		  const TAG = req.body.tag;
		  let sql = `SELECT * FROM admin_setting WHERE SystemTag  = '${TAG}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.send(rows);
		  }); 
	})
	/* Check autorisation */
	PtVenteGros.post('/Auth/Demande', (req, res) => {
		  const TAG = req.body.tag;
		  const User = req.body.authUser;
		  const position = JSON.stringify(req.body.position);
		  const device = req.body.device;
		  let AuthKey = Math.floor(Math.random() * 99999999)
		  let Today = new Date().toISOString().split('T')[0]
		  let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
		  let sql = `INSERT INTO admin_system_auth(System_Tag, Auth_Date, Auth_Key, Auth_Name, Auth_Time,Auth_Validite, Auth_Device, Auth_Position) 
		  			 VALUES ('${TAG}','${Today}','${AuthKey}','${User}','${ToTime}','true','${device}','${position}')` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.send(rows);
		  }); 
	}) 
	/* Check autorisation */
	PtVenteGros.post('/Auth/Check', (req, res) => {
		  const TAG = req.body.tag;
		  const User = req.body.authUser;
		  const key = req.body.authKey;
		  let sql = `SELECT * FROM admin_system_auth WHERE System_Tag  = '${TAG}' AND Auth_Name  = '${User}' AND Auth_Key  = '${key}' AND Auth_Validite  = 'true'  ` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    	if (rows.length == 0 ) {
			    let tokenTable = [Exist = 'false', KEY = 'null']; 
			    res.send(JSON.stringify(tokenTable));
		    } 
			else {
				let tokenTable = [Exist = 'true', KEY = rows];
	     	    res.send(JSON.stringify(tokenTable));	
			}
		  }); 
	})
	/* Check autorisation */
	PtVenteGros.post('/Auth/Invalidate', (req, res) => {
		  const PK = req.body.authKeyID;
		  let sql = `UPDATE admin_system_auth SET Auth_Validite = 'false' WHERE PK = ${PK} ` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.send(rows);
		  }); 
	})

/*####################################[MAIN]######################################*/

	/* statistics */
	PtVenteGros.post('/ma/stat', (req, res) => {
	    let TAG = req.body.TAG;
	   	let Today = new Date().toISOString().split('T')[0]
	    function NumRowsTable(start,table) {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT PK FROM ${start}_${table} WHERE 1`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows.length);
	              })
	      });
	    }
	    function ClientDistrubition() {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT Gouv,COUNT(1) as Totale FROM system_clients GROUP BY Gouv ORDER BY Gouv;`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows);
	              })
	      });
	    }
	    function GenreDistrubition() {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT Genre,COUNT(1) as Totale FROM ${TAG}_article GROUP BY Genre ORDER BY Genre;`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows);
	              })
	      });
	    }
	    function CommandeDistrubition() {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT State,COUNT(1) as Totale FROM system_commande GROUP BY State ORDER BY State;`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows);
	              })
	      });
	    }
	    function RecetteDepo() {
	      return new Promise((resolve, reject) => {
	              let sql = `SELECT Cre_Date,SUM(Tota) as Totale FROM ${TAG}_facture GROUP BY Cre_Date ORDER BY Cre_Date LIMIT 10;`;
	               connection.query(sql, (err, rows, fields) => {
	                if(err) return reject(err);
	                resolve(rows);
	              })
	      });
	    }
		function FetchAllCamion() {
		      return new Promise((resolve, reject) => {
		      	let sql = `SELECT Cam_ID, Cam_Name, Matricule, Chauffeur
		                 FROM ${TAG}_camion `;
			       connection.query(sql, (err, rows, fields) => {
			          if (err) return reject(err);
			          resolve(rows);
			      })
		      });
	    }
	    function CalculateRecette(camId) {
		      return new Promise((resolve, reject) => {
		      	let sql = `SELECT SUM(Tota) AS RCT
		                  FROM ${TAG}_camion_facture WHERE Camion = ${camId} AND Cre_Date = '${Today}'`;
			       connection.query(sql, (err, rows, fields) => {
			          if (err) return reject(err);
			          if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
			          
			      })
		      });
	    }
	    function KeyForAutoLogOut() {
		      return new Promise((resolve, reject) => {
		      	let sql = `SELECT * FROM admin_log_in WHERE Genre  = '${TAG}'`;
			       connection.query(sql, (err, rows, fields) => {
			          if (err) return reject(err);
			           resolve(rows);
			          
			      })
		      });
	    }

	    // Call, Function
	    async function query() {
	    	const camionList = await FetchAllCamion(); 
		        for (var i = 0; i < camionList.length; i++) {
		      		camionList[i].Recette = await CalculateRecette(camionList[i].Cam_ID)
		        }
	      	let main = [{}];
	      	  main[0].clientsNum = await NumRowsTable('system','clients'); 
	      	  main[0].articlesNum = await NumRowsTable(TAG,'article'); 
	      	  main[0].camionsNum = await NumRowsTable(TAG,'camion'); 
	      	  main[0].facturesNum = await NumRowsTable(TAG,'facture'); 
	      	  main[0].clientDistro = await  ClientDistrubition(); 
	      	  main[0].genreDistro = await  GenreDistrubition(); 
	      	  main[0].commandeDistro = await  CommandeDistrubition(); 
	      	  main[0].RecetteDepo = await  RecetteDepo(); 
	      	  main[0].camionStat = camionList; 
	      	  main[0].autoLogOut = await KeyForAutoLogOut(); 

	      //client = [stock= articlesNum, facture= facturesNum ,client= clientsNum,  camion= camionsNum]
	      res.send(main)
	    }
	    query(); 
	}) 

/*####################################[REQUEST]###################################*/

	/*fetch all request */
	PtVenteGros.post('/commande', (req, res) => {
	      let TAG = req.body.tag;
	      let sql = `SELECT * FROM 	system_commande 
			         LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
			         WHERE system_commande.SystemTag = '${TAG}'
			         ORDER BY system_commande.Date_Passe DESC LIMIT 250`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* request data */
	PtVenteGros.post('/commande/info', (req, res) => {
	      let TAG = req.body.tag;
	      let CID = req.body.cid;
	      let sql = `SELECT system_commande.* , system_clients.CL_ID, system_clients.Name, system_clients.Adress FROM system_commande 
				      LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
				      WHERE system_commande.C_ID = '${CID}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* modifier un facture */
	PtVenteGros.post('/commande/editr', (req, res) => {
	      let TAG = req.body.tag;
	      let retour = req.body.retourV; 
	      let Com_Id = req.body.Com_Id
	      let sql = `UPDATE system_commande
					SET Retour  = '${retour}'
					WHERE SystemTag = '${TAG}' AND C_ID = ${Com_Id} `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})


	//Selectioner les article dans camion 
	PtVenteGros.post('/commandes/groupes', (req, res) => {
	       let TAG = req.body.tag
	       let slectedDate = req.body.jour
	       let sql = `SELECT *
		  			 FROM system_commande 
		  			 LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID 
		  			 WHERE  system_commande.SystemTag = '${TAG}' AND system_commande.Date_Volu = '${slectedDate}' 
		  			 ORDER BY system_clients.Gouv`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/* request control : Update commande state  */
	PtVenteGros.post('/commande/controle', (req, res) => {
	      let TAG = req.body.tag;
	      let CID = req.body.cid;
	      let State = req.body.state;
	      let sql = `UPDATE system_commande
	      			SET State = '${State}'
				    WHERE C_ID = '${CID}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* comptes */
	PtVenteGros.post('/commande/comptes', (req, res) => {
		  let TAG = req.body.tag
	      let sql = `SELECT * FROM system_commande_comptes WHERE SystemTag = '${TAG}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* comptes Ajouter */
	PtVenteGros.post('/commande/comptes/ajouter', (req, res) => {
		(async() => {
			  let TAG = req.body.tag;
			  let compteData = req.body.compteData
			  let CID = await GenerateID(1111111111,`system_commande_comptes`,'CID');
		      let sql = `INSERT INTO system_commande_comptes(CID,Name,Identifiant, Password, SystemTag) 
		      			VALUES (${CID},'${compteData.Name}','${compteData.Identifiant}','${compteData.Password}','${TAG}')`;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json(rows);
		      })
		 })() 
	          
	})

	/* modifier une location */
	PtVenteGros.post('/commande/comptes/modifier', (req, res) => {
		 let TAG = req.body.tag;
		 let editCompteD = req.body.editCompteD
	      let sql = `UPDATE system_commande_comptes 
	      			SET Name= '${editCompteD.Name}' , Identifiant= '${editCompteD.Identifiant}', Password = '${editCompteD.Password}'
	      			WHERE PK= ${editCompteD.PK} AND CID = ${editCompteD.CID}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})


	/*fetch all request */
	PtVenteGros.post('/commande/stat', (req, res) => {
	      let TAG = req.body.tag;
	      let CID = req.body.CID;
	      let targetDate = req.body.targetDate;
	      let sql = `SELECT * FROM 	system_commande 
			         LEFT JOIN system_clients ON system_commande.Client = system_clients.CL_ID
			         WHERE system_commande.SystemTag = '${TAG}' AND  system_commande.PassePar = '${CID}' AND  system_commande.Date_Passe > '${targetDate.start}' AND  system_commande.Date_Passe <= '${targetDate.end}' 
			         ORDER BY system_commande.Date_Passe DESC `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[STOCK]#####################################*/

	//fetch all article */
	PtVenteGros.post('/stock', (req, res) => {
	      let TAG = req.body.tag
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* fetach article info  */
	PtVenteGros.post('/stock/article', (req, res) => {
	      let TAG = req.body.tag
	      let Code = req.body.code
	      let sql = `SELECT * FROM ${TAG}_article WHERE A_Code = '${Code}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.send(rows);
	      })
	          
	})

	//selectioner calendar articles : ba3ed 7otha m3a elli fou9ha 
	PtVenteGros.post('/stock/article/calendar', (req, res) => {
	        let TAG = req.body.tag
	        let Code = req.body.code
	        function FetchFromBE(genre) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_article_suivie_stock WHERE Genre = '${genre}' AND  Articles LIKE '%${Code}%' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchInFacture() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_facture WHERE  Articles LIKE '%${Code}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchForCamion() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_camion_fond WHERE  Articles LIKE '%${Code}%' AND Genre = 'Fonds'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	       // Call, Function
		    async function query() {
		        const articleCalendar = [{}]; 
		      	articleCalendar[0].bonE = await FetchFromBE('Entre')
		      	articleCalendar[0].bonS = await FetchFromBE('Sortie')
		      	articleCalendar[0].InFacture = await FetchInFacture()
		      	articleCalendar[0].ForCamion = await FetchForCamion()
		      res.send(articleCalendar)
		    }
		    query();
	          
	})


	/* fetach article info  */
	PtVenteGros.post('/stock/article/resumer', (req, res) => {
	        let TAG = req.body.tag
	        let Code = req.body.code
	        let start = req.body.start
	      	let end = req.body.end

	        function FetchFromBE(genre) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                   FROM ${TAG}_article_suivie_stock WHERE Genre = '${genre}' AND  Articles LIKE '%A_Code\":${Code},\"Name\"%' AND BE_Date >= '${start}' AND BE_Date <= '${end}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchInFacture() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_facture
			                  LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
			                  WHERE  ${TAG}_facture.Articles LIKE '%A_Code\":${Code},\"Name\"%' AND ${TAG}_facture.Cre_Date >= '${start}' AND ${TAG}_facture.Cre_Date <= '${end}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchForCamion() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_fond WHERE  Articles LIKE '%A_Code\":${Code},\"Name\"%' AND Jour >= '${start}' AND Jour <= '${end}' AND Genre = 'Fonds'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	       // Call, Function
		    async function query() {
		        const articleCalendar = [{}]; 
		      	articleCalendar[0].bonE = await FetchFromBE('Entre')
		      	articleCalendar[0].bonS = await FetchFromBE('Sortie')
		      	articleCalendar[0].InFacture = await FetchInFacture()
		      	articleCalendar[0].ForCamion = await FetchForCamion()
		      res.send(articleCalendar)
		    }
		    query();
	          
	})

	/* fetach article info  */
	PtVenteGros.post('/stock/article/vente', (req, res) => {
	      let TAG = req.body.tag
	      let Code = req.body.code
	      let start = req.body.start
	      let end = req.body.end
	      let sql = `SELECT * FROM ${TAG}_facture 
	      			LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
	      			WHERE  ${TAG}_facture.Articles LIKE '%A_Code\":${Code},\"Name\"%' AND ${TAG}_facture.Cre_Date >= '${start}' AND ${TAG}_facture.Cre_Date <= '${end}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.send(rows);
	      })
	          
	})

	/* ajouter article */
	PtVenteGros.post('/stock/ajouter', (req, res) => {
	      let TAG = req.body.Tag
	      let articleData = req.body.articleD
	      let sql = `INSERT INTO ${TAG}_article (A_Code,Name, Prix_vente, Prix_achat, Prix_gros, Quantite, Genre, Socite, Repture, TVA,Groupage,facturable,Details,State,Photo_Path,Stock_Fixe) 
	                 VALUES ('${articleData.A_Code}','${articleData.Name}','${articleData.PrixV}','${articleData.PrixA}','${articleData.PrixP}','${articleData.Qte}','${articleData.Genre}','${articleData.Socite}','${articleData.Repture}','${articleData.TVA}','${articleData.Groupage}','','','','default_img.jpg','true') `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){res.json(err)}
	          res.json(rows);
	      })          
	})


	/* modifier article  */
	PtVenteGros.post('/stock/modifier', (req, res) => {
	      let TAG= req.body.tag
	      let articleNData = req.body.articleND
	      let sql = `UPDATE ${TAG}_article
	      			 SET Name = '${articleNData.Name}', Prix_vente = '${articleNData.Prix_vente}', Prix_gros = '${articleNData.Prix_gros}', Quantite = '${articleNData.Quantite}', Prix_achat = '${articleNData.Prix_achat}', Genre = '${articleNData.Genre}', Socite = '${articleNData.Socite}', Repture = '${articleNData.Repture}', TVA = '${articleNData.TVA}' ,Groupage = '${articleNData.Groupage}'
	                 WHERE A_Code = '${articleNData.A_Code}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){res.json(err)}
	          res.json(rows);
	      	})    
	       //res.json(fields)      
	})

	/* modifier article  */
	PtVenteGros.post('/stock/modifier/stockfixe', (req, res) => {
	      let TAG= req.body.tag
	      let articleNData = req.body.articleND
	      let sql = `UPDATE ${TAG}_article
	      			 SET Stock_Fixe = '${articleNData.Stock_Fixe}'
	                 WHERE A_Code = '${articleNData.A_Code}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){res.json(err)}
	          res.json(rows);
	      	})         
	})

	/* modifier Images */
    PtVenteGros.post('/stock/modifier/images', upload.single("ProfileImage"), (req, res) => {
          let TAG = req.body.Tag;
          let Code = req.body.Code;
          let Name = req.file.filename;
          let sql = `UPDATE ${TAG[1]}_article
	      			 SET Photo_Path	 = '${Name}'
	                 WHERE A_Code = '${Code}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(req.body);
          })        
    })

	/* supprimer article */
	PtVenteGros.post('/stock/supprimer', (req, res) => {
	      let TAG = req.body.tag
	      let code = req.body.code
	      let PK = req.body.pk
	      let sql = `DELETE FROM ${TAG}_article WHERE A_Code = ${code} AND PK = ${PK}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){res.json(err)}
	          res.json(rows);
	      })         
	})

	/* fetch familles */
	PtVenteGros.post('/stock/familles', (req, res) => {
	      let TAG = req.body.tag
	      let sql = `SELECT * FROM system_article_genre WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/*ajouter famille */
	PtVenteGros.post('/stock/familles/ajouter', (req, res) => {
	      let Tag = req.body.tag
	      let familleData = req.body.familleD
	      let sql = `INSERT INTO system_article_genre (Genre,Description,SystemTag) 
	                VALUES ('${familleData.Name}','${familleData.Description}','${Tag}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        res.json(rows);
	      })
	          
	})


	/* modifier famille
	PtVenteGros.post('/stock/familles/modifier', (req, res) => {
	      let Tag = req.body.tag
	      let familleData = req.body.familleD
	      let sql = `UPDATE system_article_genre 
	      			SET Genre = '${familleData.Name}' , Description =  '${familleData.Description}'
	      			WHERE PK = ${familleData.PK} AND SystemTag = '${Tag}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        res.json(rows);
	      })
	          
	}) */

	/* modifier famille */
	PtVenteGros.post('/stock/familles/modifier', (req, res) => {
	        let Tag = req.body.tag
	        let familleData = req.body.familleD

	        function FetchFamilleData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_article_genre WHERE PK = ${familleData.PK} AND SystemTag = '${Tag}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows[0]);
				      })
			      });
		    }
		    function UpdateStock(genre,newGenre) {
			      return new Promise((resolve, reject) => {
			      	let sql = `UPDATE ${Tag}_article
	      			 		   SET Genre = '${newGenre}'
	                           WHERE Genre = '${genre}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows)
				          
				      })
			      });
		    }
		    function UpdateFamille(camId) {
			      return new Promise((resolve, reject) => {
			      	let sql = `UPDATE system_article_genre 
	      					   SET Genre = '${familleData.Name}' , Description =  '${familleData.Description}'
	      			           WHERE PK = ${familleData.PK} AND SystemTag = '${Tag}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				         resolve(rows)
				      })
			      });
		    }

	      	// Call, Function
		    async function query() {
		        const oldFamlille = await FetchFamilleData(); 
		        const updatedStock = await UpdateStock(oldFamlille.Genre,familleData.Name); 
		        if (oldFamlille && updatedStock) {
		        	const updateFamille = await UpdateFamille(); 
		       		res.send(updateFamille)
		       }
		    }
		    query();
	          
	})

	/* ajouter be */
	PtVenteGros.post('/stock/be', (req, res) => {
	      let TAG = req.body.tag  
	      let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
	      let sqlText = ''
	      for (let i = 0; i < articleList.length; i++) {
			    sqlText = sqlText.concat(" ", `WHEN ${articleList[i][0]} THEN Quantite +  ${articleList[i][1]} `);    
		   }
	      let sql = `UPDATE ${TAG}_article
				   	SET Quantite = CASE A_Code 
			                      ${sqlText}
			       	ELSE Quantite
			       	END`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json(rows);
	      	})    
	})
	
	/* ajouter bs */
	PtVenteGros.post('/stock/bs', (req, res) => {
	      let TAG = req.body.tag  
	      let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
	      let sqlText = ''
	      for (let i = 0; i < articleList.length; i++) {
			    sqlText = sqlText.concat(" ", `WHEN ${articleList[i][0]} THEN Quantite -  ${articleList[i][1]} `);    
		   }
	      let sql = `UPDATE ${TAG}_article
				   	SET Quantite = CASE A_Code 
			                      ${sqlText}
			       	ELSE Quantite
			       	END`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json(rows);
	      	})    
	})

	/* save bebs */
	PtVenteGros.post('/stock/bebs/save', (req, res) => {
		(async() => {
		      let TAG = req.body.tag  
		      let articleList = req.body.artList; 
		      let BE_ID =  await GenerateID(1111111111,`${TAG}_article_suivie_stock`,'BE_ID');
		      let Today = new Date().toISOString().split('T')[0]
		      let articleL = JSON.stringify(articleList.articles)
		      let sql = `INSERT INTO ${TAG}_article_suivie_stock
		                 (BE_ID,BE_Date,Genre,Articles) 
		                 VALUES ('${BE_ID}','${Today}','${articleList.genre}','${articleL}')`;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json({BE_ID:BE_ID});
		      })
		})()     
	})

	/* Select Bon ES  */
	PtVenteGros.post('/stock/bebs/select', (req, res) => {
		      let TAG = req.body.tag  
		      let bonId = req.body.bonId; 

		      let sql = `SELECT * FROM ${TAG}_article_suivie_stock WHERE BE_ID = ${bonId}`;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json(rows);
		      })   
	})

/*####################################[CAMION]####################################*/

	/* featch tou les camion*/
	PtVenteGros.post('/camions', (req, res) => {
		    let TAG = req.body.tag;
		    let Today = new Date().toISOString().split('T')[0]
		    function FetchAllCamion() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                 FROM ${TAG}_camion `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function CalculateRecette(camId) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Tota) AS RCT
			                  FROM ${TAG}_camion_facture WHERE Camion = ${camId} AND Cre_Date = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
				          
				      })
			      });
		    }
		    function CalculateFond(camId) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(${TAG}_camion_stock.Qte * (${TAG}_article.Prix_vente/${TAG}_article.Groupage)) AS FND
			                  FROM ${TAG}_camion_stock 
			                  INNER JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
			                  WHERE ${TAG}_camion_stock.Camion = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].FND == null) {resolve('0.000');} else {resolve(rows[0].FND.toFixed(3));}
				      })
			      });
		    }

	      	// Call, Function
		    async function query() {
		        const camionList = await FetchAllCamion(); 
		        for (var i = 0; i < camionList.length; i++) {
		      		camionList[i].Recette = await CalculateRecette(camionList[i].Cam_ID)
		      		camionList[i].Fond = await CalculateFond(camionList[i].Cam_ID)
		        }
		      res.send(camionList)
		    }
		    query();
	               
	})

	/* selectioner un camion */
	PtVenteGros.post('/camions/info', (req, res) => {
		    let TAG = req.body.tag;
		    let camionID = req.body.camId;
		    let Today = new Date().toISOString().split('T')[0]
		    function FetchAllCamionData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                 FROM ${TAG}_camion WHERE Cam_ID = ${camionID}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function CalculateRecette() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Tota) AS RCT
			                  FROM ${TAG}_camion_facture WHERE Camion = ${camionID} AND Cre_Date = '${Today}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0].RCT) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
				      })
			      });
		    }
		    function CalculateFond() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(${TAG}_camion_stock.Qte * (${TAG}_article.Prix_vente / ${TAG}_article.Groupage)) AS FND
			                  FROM ${TAG}_camion_stock 
			                  INNER JOIN ${TAG}_article ON ${TAG}_camion_stock.Article = ${TAG}_article.A_Code
			                  WHERE ${TAG}_camion_stock.Camion = ${camionID}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (rows[0].FND == null) {resolve('0.000');} else {resolve(rows[0].FND.toFixed(3));}
				      })
			      });
		    }
		    function FindPosition() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_camion_position WHERE Camion_ID = ${camionID} ORDER BY jour ASC LIMIT 1 `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				         if (rows[0] == null) {resolve({lat:36.17720, lng: 9.12337});} else {resolve(rows[0]);}
				      })
			      });
		    }
		    function CamionFactures() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_camion_facture 
			                  LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
			                  WHERE ${TAG}_camion_facture.Camion = ${camionID} ORDER BY ${TAG}_camion_facture.Cre_Date ASC LIMIT 100 `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function CamionStock() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT ${TAG}_camion_stock.Camion, ${TAG}_camion_stock.Article, ${TAG}_camion_stock.Qte ,${TAG}_article.A_Code, ${TAG}_article.Name, ${TAG}_article.Genre, ${TAG}_article.Prix_vente
			      			   FROM ${TAG}_camion_stock 
			      			   INNER JOIN ${TAG}_article ON ${TAG}_camion_stock.Article  = ${TAG}_article.A_Code
			      			   WHERE ${TAG}_camion_stock.Camion = ${camionID} `;

				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function CamionFond() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_fond WHERE Camion = ${camionID} AND Genre = 'Fonds'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }

	      	// Call, Function
		    async function query() {
		        const camionList = [{}]  
		      	camionList[0].Data = await FetchAllCamionData();
		      	camionList[0].Recette = await CalculateRecette();
		      	camionList[0].Fond = await CalculateFond();
		      	camionList[0].Position = await FindPosition()
		      	camionList[0].Facture = await CamionFactures()
		      	camionList[0].Stock = await CamionStock()
		      	camionList[0].FondList = await CamionFond()
		      res.send(camionList)
		    }
		    query();
	               
	})
	
	/*Ajouter Camion*/
	PtVenteGros.post('/camions/ajouter', (req, res) => {
	    (async() => {
		      let TAG = req.body.tag
		      let camionData = req.body.camionD
		      let Cam_ID =   await GenerateID(1111111111,`${TAG}_camion`,'Cam_ID');
		      let sql = `INSERT INTO ${TAG}_camion
		                (Cam_ID,Cam_Name, Matricule, Detail, Chauffeur,Pasword,Identifiant) 
		                VALUES (${Cam_ID},'${camionData.Cam_Name}','${camionData.Matricule}','${camionData.Marque}','${camionData.Chauffeur}','${camionData.Password}','${camionData.Identifiant}') `;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){res.json(err)}
		          res.json(rows);
		      })  
		})()             
	})

	/* modifier un camion */
	PtVenteGros.post('/camions/modifier', (req, res) => {
	      let TAG = req.body.tag
	      let camionData = req.body.camionD
	      let sql = `UPDATE ${TAG}_camion
	                SET Cam_Name = '${camionData.Cam_Name}' , Matricule = '${camionData.Matricule}' , Detail = '${camionData.Detail}' , Chauffeur = '${camionData.Chauffeur}' ,Pasword = '${camionData.Pasword}' ,Identifiant = '${camionData.Identifiant}' 
	                WHERE Cam_ID = '${camionData.Cam_ID}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){res.json(err)}
	          res.json(rows);
	      })          
	})

	/* supprimer un camion */

	/* ##### CAMION INFO  ##### */

	/*Info Article */
	PtVenteGros.post('/camions/info/article', (req, res) => {
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
			      	let sql = `SELECT * FROM ${TAG}_camion_facture WHERE Camion = ${camionID} AND Cre_Date  >= '${date}' AND Articles LIKE '%${article}%'`;
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

	/* Info Fond */
	PtVenteGros.post('/camion/fond', (req, res) => {
	       let TAG = req.body.tag
	       let BonID = req.body.fondID
	       let sql = `SELECT ${TAG}_camion_fond.* , ${TAG}_camion.* 
	       			 FROM  ${TAG}_camion_fond
	       			 INNER JOIN ${TAG}_camion ON ${TAG}_camion_fond.Camion = ${TAG}_camion.Cam_ID
	       			 WHERE ${TAG}_camion_fond.Bon_id = ${BonID}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/* Info Facture */
	PtVenteGros.post('/camion/facture', (req, res) => {
	       let TAG = req.body.tag
	       let FID = req.body.fid
	       let sql = `SELECT * FROM  ${TAG}_camion_facture 
	       			  LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
	       			  WHERE ${TAG}_camion_facture.F_ID = ${FID}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/* Info Facture */
	PtVenteGros.post('/camion/facture/info', (req, res) => {
	       let TAG = req.body.tag
	       let FID = req.body.fid
	       let sql = `SELECT * FROM  ${TAG}_camion_facture 
	       			  LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
	       			  WHERE ${TAG}_camion_facture.F_ID = ${FID} `;
	       			 // SELECT * FROM  ${TAG}_camion_facture WHERE F_ID = ${FID} 
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/* ##### CAMION CONTROL &  IMPRIMER   ##### */


	/*CAMION INFO PAGE FUNCTION*/
	// select stock a zero 
	PtVenteGros.post('/camion/info/ztockzero', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let sql = `SELECT * FROM  ${TAG}_camion_stock WHERE Camion = ${camId} AND Qte = 0`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	// delete stock zero 
	PtVenteGros.post('/camion/info/ztockzero/delete', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let sql = `DELETE FROM  ${TAG}_camion_stock WHERE Camion = ${camId} AND Qte = 0 `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	// select vente d'un jour: ou bine entre deux periode  
	PtVenteGros.post('/camion/info/ventes', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let start = req.body.start
	       let end = req.body.end
	       let sql = `SELECT * FROM  ${TAG}_camion_facture WHERE Camion = ${camId} AND Cre_Date >= '${start}' AND Cre_Date < '${end}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	// select fond  entre deux periode  
	PtVenteGros.post('/camion/info/fonds', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let start = req.body.start
	       let end = req.body.end
	       let sql = `SELECT * FROM  ${TAG}_camion_fond WHERE Camion = ${camId} AND Jour >= ${start} AND Jour < ${end}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/*PRINTING*/ 
	//stock et stock zero
	PtVenteGros.post('/camion/info/printing/stock', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let genre = req.body.genre

	       function FetchCamionStock() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT ${TAG}_camion_stock.Camion, ${TAG}_camion_stock.Article, ${TAG}_camion_stock.Qte ,${TAG}_article.A_Code, ${TAG}_article.Name, ${TAG}_article.Genre,${TAG}_article.Groupage,${TAG}_article.Colis, ${TAG}_article.Prix_vente
			      	  		   FROM ${TAG}_camion_stock 
			      	  		   INNER JOIN ${TAG}_article ON ${TAG}_camion_stock.Article  = ${TAG}_article.A_Code
			      	  		   WHERE ${TAG}_camion_stock.Camion = ${camId} AND ${TAG}_camion_stock.Qte ${genre} 0
			      	  		   ORDER BY ${TAG}_article.Genre ASC `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchCamionData() {
			       return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion WHERE Cam_ID = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows[0]);
				      })
			      });
		    }
	      async function query() {
		        const camionData = [{}]; 
		      		camionData[0].Stock = await FetchCamionStock()
		      		camionData[0].Data = await FetchCamionData()
		      		res.send(camionData)
		    }
		    query();     
	})

	//article vendu du jour 
	PtVenteGros.post('/camion/info/printing/venteArticle', (req, res) => {
		   let TAG = req.body.tag
	       let camId = req.body.camId
	       let today =  req.body.date
	       let sql = `SELECT Articles  FROM ${TAG}_camion_facture  
	       			  WHERE Camion = ${camId} AND Cre_Date = '${today}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        let rended = []
        	for (var i = 0; i < rows.length; i++) {
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

	        res.json(result);
	      }) 
	})

	//facture du jour 
	PtVenteGros.post('/camion/info/printing/venteFacture', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let today = req.body.date
	       let sql = `SELECT *  FROM ${TAG}_camion_facture
	       			  LEFT JOIN system_clients ON ${TAG}_camion_facture.C_Name = system_clients.CL_ID
	       	          WHERE ${TAG}_camion_facture.Camion = ${camId} AND ${TAG}_camion_facture.Cre_Date = '${today}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	//facture du jour 
	PtVenteGros.post('/camion/info/printing/venteRecette', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let start = req.body.start
	       let end = req.body.end
	       let sql = `SELECT Cre_Date,SUM(Tota) as Totale FROM ${TAG}_camion_facture WHERE Cre_Date >= '${start}' AND Cre_Date < '${end}' AND Camion = ${camId} GROUP BY Cre_Date ORDER BY Cre_Date ;`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	//facture du jour 
	PtVenteGros.post('/camion/info/printing/fondResumer', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let start = req.body.start
	       let end = req.body.end
	       let sql = `SELECT Jour,SUM(Totale) as Totale FROM ${TAG}_camion_fond WHERE Jour >= '${start}' AND Jour < '${end}' AND Camion = ${camId} GROUP BY Jour ORDER BY Jour ;`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})


	/* ##### CAMION AJOUTER FONDS  ##### */

	/* ajouter fond aux camion*/
	PtVenteGros.post('/camion/ajouterf', (req, res) => {
		(async() => {
		       let TAG = req.body.tag
		       let fondData = req.body.fondD
		       let BonID =  await GenerateID(1111111111,`${TAG}_camion_fond`,'Bon_id');
		       let fiexedTotal = parseFloat(fondData.totale).toFixed(3);
		       let articleL = JSON.stringify(fondData.articles)
		       let sql = `INSERT INTO ${TAG}_camion_fond (Bon_id,Camion,Totale,Jour,SCF,SDF,Articles,Genre) 
		                 VALUES ('${BonID}','${fondData.camion}','${fiexedTotal}','${fondData.jour}','false','false','${articleL}','${fondData.Genre}')`;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){ throw err}
		        res.json({BonID:BonID});
		      }) 
		})()      
	})

	//SELECIONNER ARTICLE LIST
	PtVenteGros.post('/camion/ajouterf/stock', (req, res) => {
	      let TAG = req.body.tag
	      let CamID = req.body.camId
	      let sql = `SELECT ${TAG}_article.*, ${TAG}_camion_stock.Qte 
	      			FROM ${TAG}_article 
	      			LEFT OUTER JOIN (SELECT * FROM ${TAG}_camion_stock WHERE Camion = ${CamID}) ${TAG}_camion_stock 
	      			ON ${TAG}_article.A_Code = ${TAG}_camion_stock.Article AND COALESCE(${TAG}_camion_stock.Qte ) IS NOT NULL;`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	//Modifier Le Stock Du camion [	VERY IMPORTANT]
	PtVenteGros.post('/camion/stock/update', (req, res) => {
	      let TAG = req.body.tag  
	      let CAMION = req.body.camion  
	      let articleList = req.body.artList; //[['6191513501017','6191513501017','5'],['6191513502212','6191513501017','12']]; // req.body.artList
	      let sqlTexts = []

	      for (let i = 0; i < articleList.length; i++) {
			    item = (`(${articleList[i][0]},${articleList[i][1]},${CAMION},${articleList[i][2]} )`);  
			    sqlTexts.push(item)
		   }
		   let LastToSQL = sqlTexts.join(",");
	      let sql = `INSERT INTO ${TAG}_camion_stock (Ultra_Unique, Article, Camion, Qte) VALUES ${LastToSQL} ON DUPLICATE KEY UPDATE Qte = Qte +  VALUES (Qte);`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        	res.json(rows);
	      	}) 
   
	       //res.json(sql);
	})

	// Update Stock  (us) State == true 
	PtVenteGros.post('/camion/fond/us', (req, res) => {
	       let TAG = req.body.tag
	       let BonID = req.body.bonId
	       let State = req.body.state
	       let sql = `UPDATE ${TAG}_camion_fond
	       			  SET ${State} = 'true'
	       			  WHERE Bon_id = '${BonID}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })         
	})

	/* ajouter fond aux camion*/
	PtVenteGros.post('/camion/fond/modifier', (req, res) => {
	       let TAG = req.body.tag
	       let fondData = req.body.editFondD
	       let BonID =  fondData.Bon_id
	       let fiexedTotal = parseFloat(fondData.totale).toFixed(3);
	       let articleL = JSON.stringify(fondData.articles)
	       let sql = `UPDATE ${TAG}_camion_fond
	       			 SET Totale = '${fiexedTotal}', Jour = '${fondData.jour}' , Articles = '${articleL}'
	                 WHERE Bon_id = '${BonID}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json({BonID:BonID});
	      })     
	})


	/* ##### CAMION INVENTAIRE  ##### */

	/* Inventaire camion*/
	PtVenteGros.post('/camion/inventaire', (req, res) => {
	      let TAG = req.body.tag  
	      let camion = req.body.camion  
	      let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
	      let sqlText = ''
	      for (let i = 0; i < articleList.length; i++) {
			    sqlText = sqlText.concat(" ", `WHEN ${articleList[i][0]} THEN  ${articleList[i][2]} `);    
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

	//Selectioner les article dans camion 
	PtVenteGros.post('/camion/inventaire/stock', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let sql = `SELECT ${TAG}_camion_stock.Qte AS Qte, ${TAG}_article.*  
	       			  FROM  ${TAG}_camion_stock 
	       			  LEFT JOIN ${TAG}_article 
	       			  ON ${TAG}_article.A_Code = ${TAG}_camion_stock.Article
	       			  WHERE ${TAG}_camion_stock.Camion = ${camId}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	        
	      })       
	})

	/*########COMMANDES##########*/
	//Selectioner les article dans camion 
	PtVenteGros.post('/camion/commandes/factures', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let slectedDate = req.body.jour
	       let sql = `SELECT *
		  			 FROM ${TAG}_facture 
		  			 LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
		  			 WHERE  ${TAG}_facture.Fournisseurs = '${camId}' AND ${TAG}_facture.Cre_Date = '${slectedDate}' 
		  			 ORDER BY system_clients.Gouv`;
		  			// GROUP BY system_clients.Name`; //AND ${TAG}_facture.Cre_Date = '${slectedDate}'
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        	//console.log(rows)
	        res.json(rows);
	        
	      })       
	})

	//Selectioner les article dans camion 

	PtVenteGros.post('/camion/commandes/bonLS', (req, res) => {
	       let TAG = req.body.tag
	       let camId = req.body.camId
	       let slectedDate = req.body.jour

	       function FetchAllCamionData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                 FROM ${TAG}_camion WHERE Cam_ID = ${camId}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows[0]);
				      })
			      });
		    }

	       function FetchResumer() {
				    return new Promise((resolve, reject) => {
				      	let sql = `SELECT Articles  FROM ${TAG}_facture  WHERE Fournisseurs = ${camId} AND Cre_Date = '${slectedDate}'`; 
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
			  		resumerData[0].camionData = await FetchAllCamionData()
			  		resumerData[0].resumer = await FetchResumer()
			      res.send(resumerData)
			 }
			query();       
	})

/*####################################[FACTURES]##################################*/

	/* selectionner tous les factures */
	PtVenteGros.post('/facture', (req, res) => {
	       let TAG = req.body.tag
	        let sql = `SELECT *
		  			   FROM ${TAG}_facture 
		  			   LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
		  			   LEFT JOIN ${TAG}_camion ON ${TAG}_facture.Fournisseurs = ${TAG}_camion.Cam_ID
		  			   WHERE 1 
		  			   ORDER BY ${TAG}_facture.Cre_Date DESC LIMIT 250` ;
	       //let sql = `SELECT *  FROM ${TAG}_facture  WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectionner tous les factures */
	PtVenteGros.post('/facture/resumer', (req, res) => {
	       let TAG = req.body.tag
	       let date = req.body.targetDate
	       let sql = `SELECT *  FROM ${TAG}_facture 
	       			  LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID  
	       			  WHERE ${TAG}_facture.Cre_Date >= '${date.start}' AND ${TAG}_facture.Cre_Date <= '${date.end}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner un facture et ses articles */
	PtVenteGros.post('/facture/select', (req, res) => {
	       let TAG = req.body.tag
	       let FID = req.body.fid
	       let sql = `SELECT ${TAG}_facture.* , system_clients.*,  ${TAG}_camion.Cam_ID, ${TAG}_camion.Cam_Name, ${TAG}_camion.Matricule
		  			 FROM ${TAG}_facture 
		  			 LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
		  			 LEFT JOIN ${TAG}_camion ON ${TAG}_facture.Fournisseurs = ${TAG}_camion.Cam_ID
		  			 WHERE ${TAG}_facture.F_ID = ${FID} ` ;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        	console.log(rows)
	        res.send(rows);
	      })         
	})

	/* enregistrer un factures */
	PtVenteGros.post('/facture/ajouter', (req, res) => {
	    (async() => {
	       let TAG = req.body.tag
	       let factId = req.body.factD
	       let FID = await GenerateID(1111111111,`${TAG}_facture`,'F_ID');
	       let articleL = JSON.stringify(factId.articles)
	       let sql = `INSERT INTO ${TAG}_facture
	                 (F_ID,Cre_Date,C_Name,Tota,De,Vers,Chauffeur,Fournisseurs,SDF,Articles,Prix_Grox) 
	                 VALUES ('${FID}','${factId.jour}','${factId.client}','${factId.totale}','${factId.de}','${factId.vers}','${factId.Chauffeur}','${factId.Fournisseurs}','false','${articleL}','${factId.prixGros}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json({FID:FID});
	      }) 
	    })()        
	})

	/* Update Stock  (us) State == true  */
	PtVenteGros.post('/facture/us', (req, res) => {
	       let TAG = req.body.tag
	       let FID = req.body.fid
	       let sql = `UPDATE ${TAG}_facture
	       			  SET SDF = 'true'
	       			  WHERE F_ID = ${FID} `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })         
	})

	/* modifier un facture */
	PtVenteGros.post('/facture/modifier', (req, res) => {
	       let TAG = req.body.tag
	       let factId = req.body.factD
	       let FID = req.body.fid
	       let articleL = JSON.stringify(factId.articles)
	       let sql = `UPDATE ${TAG}_facture
	       			  SET Cre_Date = '${factId.jour}', C_Name = '${factId.client}', Tota = '${factId.totale}', De = '${factId.de}', Vers ='${factId.vers}' , Chauffeur ='${factId.Chauffeur}' , Fournisseurs ='${factId.Fournisseurs}', Articles = '${articleL}' , Prix_Grox = '${factId.prixGros}'
	                  WHERE F_ID = '${FID}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json({FID:FID});
	      })         
	})

	/* supprimer une facture */

	/*Selectionner Vente */
	PtVenteGros.post('/facture/vente', (req, res) => {
	       let TAG = req.body.tag
	       let sql = `SELECT Articles  FROM ${TAG}_facture  WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        let rended = []
        	for (var i = 0; i < rows.length; i++) {
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

	        res.json(result);
	      })
	          
	})

/*####################################[CLIENT]####################################*/

	/* selectioner tous les client */
	PtVenteGros.get('/client', (req, res) => {
	      let sql = "SELECT * FROM system_clients";
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner tous les Position client */
	PtVenteGros.post('/client/position', (req, res) => {
		  let Gouv = req.body.gouv;
	      let sql = `SELECT * FROM system_clients WHERE Gouv = '${Gouv}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner un client */
	PtVenteGros.post('/client/info', (req, res) => {
		    let TAG = req.body.tag;
		    let clientID = req.body.clientId
		    function FetchClientData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_clients WHERE CL_ID = ${clientID}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          //resolve(rows);
				          if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
				      })
			      });
		    }
		    function SelectCommandes(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_commande WHERE Client = '${clientID}' AND State = 'W'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactureCamion(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_facture WHERE C_Name = '${clientID}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactures(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_facture WHERE C_Name = '${clientID}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	      	// Call, Function
		    async function query() {
		        const clientData = await FetchClientData(); 
		      	clientData[0].Commandes = await  SelectCommandes(clientData[0].Name)
		      	clientData[0].FactureCamion = await SelectFactureCamion(clientData[0].Name)
		      	clientData[0].Facture = await SelectFactures(clientData[0].Name)
		      res.send(clientData)
		    }
		    query();               
	})

	/* Ajouter client */
	PtVenteGros.post('/client/ajouter', (req, res) => {
		(async() => {
			let TAG = req.body.tag;
			let clientD = req.body.clientD
			let CID = await GenerateID(1111111111,'system_clients','CL_ID');
			let Today = new Date().toISOString().split('T')[0]
		    let sql = `INSERT INTO system_clients (CL_ID, Name, Cree_Le, Phone, Adress, Code_Fiscale, Client_State, Gouv, Deleg, Lng, Lat, Social_Name) 
		    		   VALUES (${CID},'${clientD.Name}','${Today}','${clientD.Phone}','${clientD.Adress}','${clientD.Code_Fiscale}','null','${clientD.Gouv}','${clientD.Deleg}','0','0','${clientD.Social_Name}');`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})
	    })()      
	})

	/* modifier un client */
	PtVenteGros.post('/client/modifier', (req, res) => {
			let TAG = req.body.tag;
			let clientD = req.body.clientD
		    let sql = `UPDATE system_clients
	       			  SET Name = '${clientD.Name}',  Phone = '${clientD.Phone}' , Adress = '${clientD.Adress}' ,  Gouv = '${clientD.Gouv}' , Deleg = '${clientD.Deleg}' , Social_Name = '${clientD.Social_Name}'
	                  WHERE CL_ID = ${clientD.CL_ID}`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})     
	})

	/* modifier Position client */
	PtVenteGros.post('/client/modifier/position', (req, res) => {
			let TAG = req.body.tag;
			let clientD = req.body.clientD
		    let sql = `UPDATE system_clients
	       			  SET Lng = ${clientD.Lng}, Lat = ${clientD.Lat} 
	                  WHERE CL_ID = ${clientD.C_ID}`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})     
	})

	/* supprimer un client */
	PtVenteGros.post('/client/supprimer', (req, res) => {
		  let TAG = req.body.tag;
		  let clientID = req.body.clientId
	      let sql = `DELETE FROM system_clients WHERE CL_ID = ${clientID}  LIMIT 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* map : liste des location */
	PtVenteGros.post('/client/map', (req, res) => {
	      let sql = "SELECT * FROM system_clients_map WHERE 1";
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* ajouter une localtion */
	PtVenteGros.post('/client/map/ajouter', (req, res) => {
		  let TAG = req.body.tag;
		  let regionD = req.body.regionD
	      let sql = `INSERT INTO system_clients_map(Gouv, Localisation, SystemTag) 
	      			VALUES ('${regionD.Gouv}','${regionD.Localisation}','${TAG}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* modifier une location */
	PtVenteGros.post('/client/map/modifier', (req, res) => {
		 let TAG = req.body.tag;
		 let editRegionD = req.body.editRegionD
	      let sql = `UPDATE system_clients_map 
	      			SET Gouv= '${editRegionD.Gouv}' , Localisation= '${editRegionD.Localisation}'
	      			WHERE PK= ${editRegionD.PK}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[TOOLS]#####################################*/
	
	/* fetch main Tools */
	PtVenteGros.post('/tools', (req, res) => {
	       let TAG = req.body.tag
	       let Today = new Date().toISOString().split('T')[0]
	        function FetchAllNotes() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT *  FROM system_notes  WHERE SystemTag = '${TAG}' ORDER BY N_Date ASC, N_Time ASC`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function Recette() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT SUM(Tota) AS RCTT FROM ${TAG}_facture WHERE Cre_Date = '${Today}'`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0].RCTT);
		      		})
		      	})
		    }
		    function Genres() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_article_genre WHERE SystemTag = '${TAG}'`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function CamionPositions(argument) {
		    	return new Promise((resolve, reject) => {
			      	let sql = `SELECT * 
							 FROM ${TAG}_camion_position
							 WHERE jour IN (SELECT MAX(jour) FROM ${TAG}_camion_position GROUP BY Camion_ID)`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function MaxMinFactures() {
		    	return new Promise((resolve, reject) => {
			      	let sql = `SELECT MAX(CAST(Tota AS INT)) AS MAXF, MIN(CAST(Tota AS INT)) AS MINF FROM ${TAG}_facture;`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0]);
		      		})
		      	})
		    }
		    function MaxMinQte() {
		    	return new Promise((resolve, reject) => {
			      	let sql = `SELECT MAX(CAST(Quantite AS INT)) AS MAXF, MIN(CAST(Quantite AS INT)) AS MINF FROM ${TAG}_article;`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0]);
		      		})
		      	})
		    }
		    function EnRepture() {
		    	return new Promise((resolve, reject) => {
			      	let sql = `SELECT COUNT(A_Code) AS ENREPT FROM ${TAG}_article WHERE Repture >= Quantite;`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0]);
		      		})
		      	})
		    }
		    function TOPClient() {
		    	return new Promise((resolve, reject) => {
			      	let sql = `SELECT C_Name FROM ${TAG}_facture  ORDER BY CAST(Tota AS INT) DESC LIMIT 1;`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0]);
		      		})
		      	})
		    }
		    function TopClientNum() {
		      return new Promise((resolve, reject) => {
		              let sql = `SELECT C_Name,COUNT(1) as Totale FROM ${TAG}_facture GROUP BY C_Name ORDER BY Totale DESC LIMIT 1 ;`;
		               connection.query(sql, (err, rows, fields) => {
		                if(err) return reject(err);
		                resolve(rows[0]);
		              })
		      });
		    }
  			// Call, Function
		    async function query() {
		            const toolsData = [{}]; 
		      		toolsData[0].Notes = await FetchAllNotes()
		      		toolsData[0].Recette = await Recette()
		      		toolsData[0].Genres = await Genres()
		      		toolsData[0].CamionPos = await CamionPositions()
		      		toolsData[0].MMF = await MaxMinFactures()
		      		toolsData[0].MMQte = await MaxMinQte()
		      		toolsData[0].ENREPT = await EnRepture()
		      		toolsData[0].TopClient = await TOPClient()
		      		toolsData[0].TopClientNum = await TopClientNum()
			      res.send(toolsData)
			 }
		    query();
	})

	/* Recette Entre Deux Jours  */
	PtVenteGros.post('/tools/recette', (req, res) => {
	       let TAG = req.body.tag
	       let start = req.body.start
	       let end = req.body.end
	       let sql = `SELECT *  FROM ${TAG}_facture
				      LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID  
				      WHERE ${TAG}_facture.Cre_Date >= '${start}' AND ${TAG}_facture.Cre_Date < '${end}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })   
	})


	/* selectioner les prix des article */
	PtVenteGros.post('/tools/print', (req, res) => {
	       let TAG = req.body.tag
	       let genre = req.body.genre
	       let sql = `SELECT * FROM ${TAG}_article WHERE Genre = '${genre}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })

	})

	/* selectinner le stock des articles */

	/* suivie d'un article  */

	/* Selectionnez les  note 

	/* enregistrer une note */
	PtVenteGros.post('/tools/note/ajouter', (req, res) => {
		(async() => {
		      let Tag = req.body.tag
		      let NID = await GenerateID(1111111111,'system_notes','N_ID');
		      let Today = new Date().toISOString().split('T')[0]
			  let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
		      let NoteD = req.body.noteD
		      let sql = `INSERT INTO system_notes (N_ID,N_Date,N_Time,SystemTag,Genre,Description)  
		      			 VALUES (${NID},'${Today}','${ToTime}','${Tag}','Rapelle','${NoteD}');`;
		       connection.query(sql, (err, rows, fields) => {
		        if (err){ res.json(err)}
		        res.json(rows);
		      })
	    })()      
	})

	/* supprimer une note */
	PtVenteGros.post('/tools/note/supprimer', (req, res) => {
	      let Tag = req.body.tag
	      let NoteID = req.body.noteID
	      let sql = `DELETE  FROM  system_notes WHERE PK = ${NoteID};`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        res.json(rows);
	      })
	          
	})

	/* Catalogue  */
	PtVenteGros.post('/tools/catalogue', (req, res) => {
	       let TAG = req.body.tag 

	       function FetchArticles() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function FetchCatalogue() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT *  FROM system_commande_catalogue  WHERE SystemTag =  '${TAG}'`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows[0]);
		      		})
		      	})
		    }

	       // Call, Function
		    async function query() {
		            const toolsCateg = [{}]; 
		      		toolsCateg[0].Articles = await FetchArticles()
		      		toolsCateg[0].Catalogue = await FetchCatalogue()
			      res.send(toolsCateg)
			 }
		    query();
	})

	/* Catalogue  */
	PtVenteGros.post('/tools/catalogue/update', (req, res) => {
	       let TAG = req.body.tag
	       let catalogue = req.body.catalogue
	       let def = JSON.stringify(catalogue)
	       let Today = new Date().toISOString().split('T')[0]
	       let sql = `UPDATE system_commande_catalogue
	       			  SET CatValue = '${def}'
	       			  WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })   
	})
	/* Catalogue  */
	PtVenteGros.post('/tools/catalogue/reinstal', (req, res) => {
	       let TAG = req.body.tag
	       let catalogue = req.body.catalogue
	       let def = JSON.stringify(catalogue)
	       let Today = new Date().toISOString().split('T')[0]
	       let sql = `UPDATE system_commande_catalogue
	       			  SET CatValue = '${def}'
	       			  WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })     
	})

	/*Export database*/

	PtVenteGros.post('/tools/export/done', (req, res) => {
		let fileName =  req.body.fileName + '-' + new Date().toLocaleDateString('fr-FR').split( '/' ).join( '-' ) + '-' + Date.now()
		let tableName =   req.body.tableName
	    const exportProcess = spawn("C:/xampp/mysql/bin/mysqldump.exe", [
		    '-u',
		    'root',
		    'bgvckelc_anaslouma',
		     tableName,
		    '-r',
		    `C:/Users/Administrator/Desktop/BackUp/${fileName}.sql`
		  ]);
	     exportProcess.stdout.on('data', (data) => {
		    console.log(`stdout: ${data}`);
		  });

		  exportProcess.stderr.on('data', (data) => {
		    console.log(`stderr: ${data}`);
		  });

		  exportProcess.on('close', (code) => {
		    res.send({file:fileName});
		  });
	})

	PtVenteGros.get('/tools/export/download/:file', (req, res) => {
	    res.download(`C:/Users/Administrator/Desktop/BackUp/${req.params.file}.sql`);
	})

	PtVenteGros.post('/tools/export/calclength', (req, res) => {
	    fs.readdir('C:/Users/Administrator/Desktop/BackUp', (err, files) => {
		    if (err) {
		      console.error(err);
		      res.status(500).send('Error reading directory');
		      return;
		    }

		    res.send(`Number of files: ${files.size}`);
		  });
	})

	PtVenteGros.post('/tools/export/calcsize', (req, res) => {
	    let totalSize = 0;
	    fs.readdir('C:/Users/Administrator/Desktop/BackUp', (err, files) => {
		    if (err) {
		      console.error(err);
		      res.status(500).send('Error reading directory');
		      return;
    		}
    		for (const file of files) {
		      const filePath = path.join('C:/Users/Administrator/Desktop/BackUp', file);
		      fs.stat(filePath, (err, stat) => {
		        if (err) {
		          console.error(err);
		          res.status(500).send('Error getting file size');
		          return;
		        }

		        totalSize += stat.size;

		        if (files.indexOf(file) === files.length - 1) {
		          res.send({totSize: totalSize});
		        }
		      });
		    }
		  });
	})

	PtVenteGros.post('/tools/export/clear', (req, res) => {
	    fs.readdir('C:/Users/Administrator/Desktop/BackUp', (err, files) => {
		    if (err) {
		      console.error(err);
		      res.status(500).send('Error reading directory');
		      return;
		    }

		    for (const file of files) {
		      const filePath = path.join('C:/Users/Administrator/Desktop/BackUp', file);
		      fs.unlink(filePath, (err) => {
		        if (err) {
		          console.error(err);
		          res.status(500).send('Error deleting file');
		          return;
		        }

		        if (files.indexOf(file) === files.length - 1) {
		          res.send('All files deleted');
		        }
		      });
		    }
		  });
	})


/*####################################[EQUIPE]####################################*/

	/* selectioner tous les client */
	PtVenteGros.post('/team', (req, res) => {
		  let TAG = req.body.tag
	      let sql = `SELECT * FROM system_equipe WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner un client */
	PtVenteGros.post('/team/info', (req, res) => {
		    let TAG = req.body.tag;
		    let TID = req.body.Team_ID
		    function FetchClientData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_equipe WHERE T_ID = ${TID}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
				      })
			      });
		    }
		    function SelectCommandes(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_commande WHERE Client = '${TID}' AND State = 'W'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactureCamion(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_facture WHERE C_Name = '${TID}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactures(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_facture WHERE C_Name = '${TID}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	      	// Call, Function
		    async function query() {
		        const clientData = await FetchClientData(); 
		      	//clientData[0].Commandes = await  SelectCommandes(clientData[0].Name)
		      	//clientData[0].FactureCamion = await SelectFactureCamion(clientData[0].Name)
		      	//clientData[0].Facture = await SelectFactures(clientData[0].Name)
		      res.send(clientData)
		    }
		    query();               
	})
	/* selectioner tous les client */
	PtVenteGros.post('/team/poste', (req, res) => {
		  let TAG = req.body.tag
	      let sql = `SELECT * FROM system_equipe_poste WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[FOURNISSEUR]###############################*/

	/* selectioner tous les client */
	PtVenteGros.post('/fournisseur', (req, res) => {
		  let TAG = req.body.tag
	      let sql = `SELECT * FROM system_fournisseur WHERE SystemTag = '${TAG}'`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })          
	})

	/* selectioner un client */
	PtVenteGros.post('/fournisseur/info', (req, res) => {
		    let TAG = req.body.tag;
		    let fourId = req.body.fourId
		    function FetchClientData() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_fournisseur WHERE Four_ID = ${fourId}`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
				      })
			      });
		    }
		    function SelectCommandes(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_commande WHERE Client = '${fourId}' AND State = 'W'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactureCamion(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion_facture WHERE C_Name = '${fourId}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectFactures(Name) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_facture WHERE C_Name = '${fourId}' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	      	// Call, Function
		    async function query() {
		        const clientData = await FetchClientData(); 
		      	//clientData[0].Commandes = await  SelectCommandes(clientData[0].Name)
		      	//clientData[0].FactureCamion = await SelectFactureCamion(clientData[0].Name)
		      	//clientData[0].Facture = await SelectFactures(clientData[0].Name)
		      res.send(clientData)
		    }
		    query();               
	})

	/* Ajouter client */
	PtVenteGros.post('/fournisseur/ajouter', (req, res) => {
		(async() => {
			let TAG = req.body.tag;
			let clientD = req.body.clientD
			let CID = await GenerateID(1111111111,'system_clients','CL_ID');
			let Today = new Date().toISOString().split('T')[0]
		    let sql = `INSERT INTO system_clients (CL_ID, Name, Cree_Le, Phone, Adress, Code_Fiscale, Client_State, Gouv, Deleg, Lng, Lat, Social_Name) 
		    		   VALUES (${CID},'${clientD.Name}','${Today}','${clientD.Phone}','${clientD.Adress}','${clientD.Code_Fiscale}','null','${clientD.Gouv}','${clientD.Deleg}','0','0','${clientD.Social_Name}');`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})
	    })()      
	})

	/* modifier un client */
	PtVenteGros.post('/fournisseur/modifier', (req, res) => {
			let TAG = req.body.tag;
			let clientD = req.body.clientD
		    let sql = `UPDATE system_clients
	       			  SET Name = '${clientD.Name}',  Phone = '${clientD.Phone}' , Adress = '${clientD.Adress}' ,  Gouv = '${clientD.Gouv}' , Deleg = '${clientD.Deleg}' , Social_Name = '${clientD.Social_Name}'
	                  WHERE CL_ID = ${clientD.CL_ID}`;
	       	connection.query(sql, (err, rows, fields) => {
	        	if (err){ throw err}
	       	 res.json(rows);
	      	})     
	})


/*&&&&&&&&&&&&&&&&&[MESSAGES]&&&&&&&&&&&&&&&&&&*/

	/*selectionner message */
	PtVenteGros.post('/message', (req, res) => {
	       let TAG = req.body.tag
	       let sql = `SELECT *  FROM system_messages  WHERE SystemTag = '${TAG}' ORDER BY Sent_Date ASC, Sent_Time ASC`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* ajouter un messages */
	PtVenteGros.post('/message/ajouter', (req, res) => {
		   let Today = new Date().toISOString().split('T')[0]
		   let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
	       let TAG = req.body.tag
	       let MID  = Math.floor(Math.random() * 10000000000);
	       let msgD = req.body.msgC; //JSON.stringify(req.body.msgC)
	       let sql = `INSERT INTO system_messages(M_ID,Sender_Genre,Sender,SystemTag,Content,Sent_Date,Sent_Time)
	       			  VALUES(${MID},'SYSTEM','SYSTEM','${TAG}', '${msgD}' ,'${Today}','${ToTime}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.json(err)}
	        res.json(rows);
	      })
	          
	})

	/* supprimer une message */

/*&&&&&&&&&&&&&&&&&[NOTIFICATION]&&&&&&&&&&&&&&*/

	/* selectioner les notification recentte*/
	PtVenteGros.post('/notifications', (req, res) => {
	       let TAG = req.body.tag
	       let sql = `SELECT *  FROM system_notification  WHERE SystemTag = '${TAG}' ORDER BY N_Date DESC, N_Time DESC LIMIT 10`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	/* selectioner les notification recentte*/
	PtVenteGros.post('/notifications/selected', (req, res) => {
	       let TAG = req.body.tag
	       let start = req.body.start
	       let sql = `SELECT *  FROM system_notification  WHERE SystemTag = '${TAG}' ORDER BY N_Date DESC, N_Time DESC LIMIT ${start + 5}`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner les notification par Date */
	PtVenteGros.post('/notifications/date', (req, res) => {
	       let TAG = req.body.tag
	       let ThisDate = req.body.dateN
	       let sql = `SELECT *  FROM system_notification  WHERE SystemTag = '${TAG}' AND N_Date = '${ThisDate}' ORDER BY N_Date DESC, N_Time DESC`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner les notification par Date */
	PtVenteGros.post('/notifications/genre', (req, res) => {
	       let TAG = req.body.tag
	       let Genre = req.body.genre
	       let sql = `SELECT *  FROM system_notification  WHERE SystemTag = '${TAG}' AND Genre = '${Genre}' ORDER BY N_Date DESC, N_Time DESC LIMIT 20`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* selectioner les notification recentte*/
	PtVenteGros.post('/notifications/ajouter', (req, res) => {
	    (async() => {
	       let TAG = req.body.Tag
	       let genre = req.body.genre
	       let text = req.body.text
	       let Today = new Date().toISOString().split('T')[0]
		   let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
	       let NID = await GenerateID(1111111111,'system_notification','N_ID');

	       let sql = `INSERT INTO system_notification (N_ID,N_Date,N_Time,SystemTag,Genre,Description)  
		      		  VALUES (${NID},'${Today}','${ToTime}','${TAG}','${genre}','${text}');`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })

	    })()         
	})

/*&&&&&&&&&&&&&&&&&[Mettre A Jour]&&&&&&&&&&&&&&*/
    /* fetch main Tools */
	PtVenteGros.post('/update', (req, res) => {
	       let TAG = req.body.tag
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
		    function FetchStockFamille() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_article_genre WHERE SystemTag = '${TAG}'`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

		    function FetchFacture() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
				  			   FROM ${TAG}_facture 
				  			   LEFT JOIN system_clients ON ${TAG}_facture.C_Name = system_clients.CL_ID 
				  			   LEFT JOIN ${TAG}_camion ON ${TAG}_facture.Fournisseurs = ${TAG}_camion.Cam_ID
				  			   WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function FetchCommande() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_commande WHERE SystemTag = '${TAG}'`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function FetchCamion() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_camion  WHERE 1`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }
		    function FetchClient() {
			    return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM system_clients`;
			       connection.query(sql, (err, rows, fields) => {
				       if (err) return reject(err);
				       resolve(rows);
		      		})
		      	})
		    }

  			// Call, Function
		    async function query() {
		            const updateData = [{}]; 
		      		updateData[0].commande = await FetchCommande()
		      		updateData[0].stock = await FetchStock()
		      		updateData[0].stockFamille = await FetchStockFamille()
		      		updateData[0].facture = await FetchFacture()
		      		updateData[0].camion = await FetchCamion()
		      		updateData[0].client = await FetchClient()
			      res.send(updateData)
			 }
		    query();
	})


module.exports = PtVenteGros
