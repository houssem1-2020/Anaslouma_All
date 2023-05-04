const express = require('express')
const AdminAPI = express.Router()

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
	AdminAPI.post('/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;
		  let sql = `SELECT * FROM admin_log_in WHERE Log = '${logInD.Log}' AND Pwd  = '${logInD.Pwd}' AND  Genre = 'admin' ` ;
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

	AdminAPI.post('/check-permission', (req, res) => {
		  let sql = `SELECT * FROM admin_log_in  WHERE Genre = 'admin' ` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.send(rows[0]);
		  });  
	})

/*####################################[ANASLOUMA ]#################################*/
	/* anaslouma Promiseage */
	AdminAPI.post('/anaslouma', (req, res) => {
		 	        const TAG = req.body.TAG;
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
				    function MotDePasse() {
				      return new Promise((resolve, reject) => {
				              let sql = `SELECT * FROM admin_log_in WHERE Genre = '${TAG}';`;
				               connection.query(sql, (err, rows, fields) => {
				                if(err) return reject(err);
				                resolve(rows[0])
				              })
				      });
				    }
				    function Autorisation() {
				      return new Promise((resolve, reject) => {
				              let sql = `SELECT * FROM admin_setting WHERE SystemTag = '${TAG}';`;
				               connection.query(sql, (err, rows, fields) => {
				                if(err) return reject(err);
				                resolve(rows[0])
				              })
				      });
				    }
				    function RecetteDepo() {
				      return new Promise((resolve, reject) => {
				              let sql = `SELECT SUM(Tota) as Totale FROM ${TAG}_facture WHERE Cre_Date = '${Today}';`;
				               connection.query(sql, (err, rows, fields) => {
				                if(err) return reject(err);
				                if (rows[0].Totale == null) {resolve('0.000');} else {resolve(rows[0].Totale.toFixed(3));}
				              })
				      });
				    }
				    function FondDepo(achatvente) {
				      return new Promise((resolve, reject) => {
				              let sql = `SELECT SUM(${TAG}_article.Quantite * ${TAG}_article.${achatvente}) as Totale FROM ${TAG}_article;`;
				               connection.query(sql, (err, rows, fields) => {
				                if(err) return reject(err);
				                if (rows[0].Totale == null) {resolve('0.000');} else {resolve(rows[0].Totale.toFixed(3));}
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
				    function CalculateFonds(camId) {
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
				    function GetPositions(camId) {
					      return new Promise((resolve, reject) => {
						      	let sql = `SELECT * FROM ${TAG}_camion_position WHERE Camion_ID = ${camId} LIMIT 1 `;
							       connection.query(sql, (err, rows, fields) => {
							          if (err) return reject(err);
							         if (rows[0] == null) {resolve({lat:36.17720, lng: 9.12337});} else {resolve(JSON.parse(rows[0].Position));}
							      })
						      });
				    }


				    // Call, Function
				    async function query() {
				    	const camionList = await FetchAllCamion(); 
					        for (var i = 0; i < camionList.length; i++) {
					      		camionList[i].Recette = await CalculateRecette(camionList[i].Cam_ID)
					      		camionList[i].Fonds = await CalculateFonds(camionList[i].Cam_ID)
					      		camionList[i].Positions = await GetPositions(camionList[i].Cam_ID)
					        }
				      	let main = [{}];
				      	  main[0].clientsNum = await NumRowsTable('system','clients'); 
				      	  main[0].articlesNum = await NumRowsTable(TAG,'article'); 
				      	  main[0].camionsNum = await NumRowsTable(TAG,'camion'); 
				      	  main[0].facturesNum = await NumRowsTable(TAG,'facture');  
				      	  main[0].RecetteDepo = await  RecetteDepo();
				      	  main[0].FondDepoAchat = await  FondDepo('Prix_achat');  
				      	  main[0].FondDepoVente = await  FondDepo('Prix_vente');  
				      	  main[0].Password = await  MotDePasse();  
				      	  main[0].autorisation = await  Autorisation();  
				      	  main[0].camionStat = camionList; 

				      //client = [stock= articlesNum, facture= facturesNum ,client= clientsNum,  camion= camionsNum]
				      res.send(main)
				    }
				    query();
	})
	
	//fetch all article */
	AdminAPI.post('/anaslouma/update-pwd', (req, res) => {
	      let TAG = req.body.tag
	      let PwdD = req.body.PwdData
	      let sql = `UPDATE admin_log_in
	      			 SET Log = '${PwdD.Log}', Pwd = '${PwdD.Pwd}' , Permission_Key = '${Date.now() + '-'  + new Date().toLocaleDateString('fr-FR').split( '/' ).join( '-' )}'
	      			 WHERE Genre = '${TAG}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	//fetch all article */
	AdminAPI.post('/anaslouma/update-auth', (req, res) => {
	      let TAG = req.body.tag
	      let WTag = req.body.WTag
	      let WValue = req.body.WValue
	      let sql = `UPDATE admin_setting
	      			 SET ${WTag} = '${WValue}'
	      			 WHERE SystemTag = '${TAG}' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	
	//fetch all article */
	AdminAPI.post('/stock', (req, res) => {
	      let TAG = req.body.tag
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* featch tou les camion*/
	AdminAPI.post('/stat-f', (req, res) => {
		    let TAG = req.body.TAG;
		    let Today = new Date().toISOString().split('T')[0]
		    function FetchAllFamille() {
			      return new Promise((resolve, reject) => {
			      	   let sql = `SELECT * FROM system_article_genre WHERE SystemTag = '${TAG}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FondGenre(achatvente,genre) {
		      return new Promise((resolve, reject) => {
		              let sql = `SELECT SUM(${TAG}_article.Quantite * ${TAG}_article.${achatvente}) as Totale FROM ${TAG}_article WHERE GENRE = '${genre}';`;
		               connection.query(sql, (err, rows, fields) => {
		                if(err) return reject(err);
		                if (rows[0].Totale == null) {resolve('0.000');} else {resolve(rows[0].Totale.toFixed(3));}
		              })
		      });
		    }
		    function ArticlesGenres(genre) {
		      return new Promise((resolve, reject) => {
		              let sql = `SELECT * FROM ${TAG}_article WHERE GENRE = '${genre}';`;
		               connection.query(sql, (err, rows, fields) => {
		                if(err) return reject(err);
		                resolve(rows)
		              })
		      });
		    }

	      	// Call, Function
		    async function query() {
		        const famileList = await FetchAllFamille(); 
		        for (var i = 0; i < famileList.length; i++) {
		      		famileList[i].achat = await FondGenre('Prix_achat',famileList[i].Genre)
		      		famileList[i].vente = await FondGenre('Prix_vente',famileList[i].Genre)
		      		famileList[i].articles = await ArticlesGenres(famileList[i].Genre)
		        }
		      res.send(famileList)
		    }
		    query();
	               
	})

/*####################################[Setting ]#################################*/
	//fetch all article */
	AdminAPI.post('/setting', (req, res) => {
	      let sql = `SELECT * FROM admin_log_in WHERE Genre = 'admin' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	AdminAPI.post('/setting/update', (req, res) => {
	      let sql = `UPDATE  admin_log_in 
	      			SET 
	      			WHERE Genre = 'admin' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[Autorisation ]#################################*/
	//fetch all article */
	AdminAPI.post('/autorisation', (req, res) => {
	      let sql = `SELECT * FROM admin_system_auth WHERE Auth_Validite = 'true' `;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})
	
/*####################################[Notification ]#################################*/
	/* selectioner les notification recentte*/
	AdminAPI.post('/notifications', (req, res) => {
	       let sql = `SELECT *  FROM system_notification  ORDER BY N_Date DESC, N_Time DESC LIMIT 80`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

/*####################################[Seeting ]#################################*/
	/* selectioner les notification recentte*/
	AdminAPI.post('/partennaires', (req, res) => {
	       let sql = `SELECT *  FROM admin_partenaire  WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

module.exports = AdminAPI