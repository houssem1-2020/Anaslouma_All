const express = require('express')
const AnasloumaAPI = express.Router()

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

/*####################################[	Landing  ]###########################*/

	/* selectioner mes articles */
	AnasloumaAPI.post('/list', (req, res) => {
		  const TAG = req.body.tag;
		  const genre = req.body.genre;
		  let sql = `SELECT * FROM ${TAG}_article  WHERE Genre = '${genre}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/list/article', (req, res) => {
		  const TAG = req.body.tag;
		  const code = req.body.code;
		  let sql = `SELECT * FROM ${TAG}_article  WHERE A_Code = '${code}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows[0]);

		  }); 
	})

	/* Article Info */
	AnasloumaAPI.post('/list/commande', (req, res) => {
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

	/* Commandes */
	AnasloumaAPI.post('/list', (req, res) => {
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

/*####################################[ User ]#################################*/
	/*log in*/
	AnasloumaAPI.post('/User/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;
		  let sql = `SELECT * FROM admin_partenaire WHERE LogIn = '${logInD.Log}' AND PWD  = '${logInD.Pwd}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    if (rows.length == 0 ) {
			    let tokenTable = [Exist = 'false', CID = 'null', Name = 'null']; 
			    res.send(JSON.stringify(tokenTable));
			    console.log(logInD)
		    } 
			else {
				let tokenTable = [Exist = 'true', Name = rows[0].Partenaire,  Genre = rows[0].ID_F , Tag = rows[0].DataB];
	     	    res.send(JSON.stringify(tokenTable));	
			}

		  }); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Camion/List', (req, res) => {
		  const TAG = req.body.tag;
		  const genre = req.body.genre;

		  let sql = `SELECT * FROM ${TAG}_camion WHERE 1` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Camion/Journier', (req, res) => {
		   let TAG = req.body.tag
	       let camId = req.body.camId
	       let Today =  new Date().toISOString().split('T')[0]
	       let end = new Date().toISOString().split('T')[0]
	       let sql = `SELECT Articles  FROM ${TAG}_camion_facture  WHERE Camion = ${camId}`; // AND Cre_Date = '${Today}' 
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

		        res.json(result);
	      })
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Camion/resumer', (req, res) => {
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

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Stock', (req, res) => {
		  const TAG = req.body.tag;
		  const genre = req.body.genre;

		  let sql = `SELECT * FROM ${TAG}_article WHERE Genre = '${genre}'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Stock/article', (req, res) => {
		    let TAG = req.body.tag
	        let Code = req.body.code
	        function ArticleInfo() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT * FROM ${TAG}_article WHERE A_Code = '${Code}'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchFromBE(genre) {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                   FROM ${TAG}_article_suivie_stock WHERE Genre = '${genre}' AND  Articles LIKE '%${Code}%' `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchInFacture() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_facture WHERE  Articles LIKE '%${Code}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function FetchForCamion() {
			      return new Promise((resolve, reject) => {
			      	let sql = `SELECT *
			                  FROM ${TAG}_camion_fond WHERE  Articles LIKE '%${Code}%'`;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }


	       // Call, Function
		    async function query() {
		        const articleCalendar = [{}]; 
		      	articleCalendar[0].info = await ArticleInfo()
		      	articleCalendar[0].bonE = await FetchFromBE('Entre')
		      	articleCalendar[0].bonS = await FetchFromBE('Sortie')
		      	articleCalendar[0].InFacture = await FetchInFacture()
		      	articleCalendar[0].ForCamion = await FetchForCamion()
		      res.send(articleCalendar)
		    }
		    query(); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Stock/repture', (req, res) => {
		  const TAG = req.body.tag;
		  const genre = req.body.genre;

		  let sql = `SELECT * FROM ${TAG}_article WHERE Genre = '${genre}' AND Quantite = 0` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows);

		  }); 
	})

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Stat-g', (req, res) => {
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

	/* selectioner mes articles */
	AnasloumaAPI.post('/User/Stat-r', (req, res) => {
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


module.exports = AnasloumaAPI