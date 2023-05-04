const express = require('express')
const MagazinGerant = express.Router()

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
	MagazinGerant.post('/LogIn', (req, res) => {
		  const logInD = req.body.LoginData;
		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
		  let sql = `SELECT * FROM equipe WHERE Identifiant = '${logInD.Log}' AND Password  = '${logInD.Pwd}' AND Poste = 'Gerant'` ;
		  connection.query(sql, (err, rows, fields) => {
		    if (err) throw err
		    res.json(rows[0])

		  }); 
	})

	MagazinGerant.post('/main/position', (req, res) => {
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

/*####################################[STOCK]######################################*/
	/* modifier article  */
    MagazinGerant.post('/stock/modifier', (req, res) => {
          let PID = req.body.PID
          let articleNData = req.body.articleND
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE articles
                     SET Name = '${articleNData.Name}', Prix_vente = '${articleNData.Prix_vente}', Quantite = '${articleNData.Quantite}', Prix_achat = '${articleNData.Prix_achat}', Genre = '${articleNData.Genre}', Socite = '${articleNData.Socite}', Repture = '${articleNData.Repture}', TVA = '${articleNData.TVA}' , Groupage = '${articleNData.Groupage}'
                     WHERE A_Code = '${articleNData.A_Code}'  `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })         
    })

    /* modifier article  */
    MagazinGerant.post('/stock/modifier/raccourci', (req, res) => {
          let TAG= req.body.tag
          let articleNData = req.body.articleND
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE articles
                     SET Fast_Input = '${articleNData.Fast_Input}'
                     WHERE A_Code = '${articleNData.A_Code}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })         
    })

    MagazinGerant.post('/stock/be', async function(req, res, next) {
          let PID = req.body.PID  
          let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
          req.toSaveList = articleList;
          req.fournisseur = req.body.fournisseur;
          let sqlText = ''
          articleList.map( (data) => {
            sqlText = sqlText.concat(" ", `WHEN   ${data.A_Code} THEN Quantite +  ${data.NewQte} `);
         })
         connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
         let sql = `UPDATE articles
                    SET Quantite = CASE A_Code
                              ${sqlText}
                    ELSE Quantite
                    END`;
                    console.log(sql)
         connection.query(sql, (err, rows, fields) => {
          if (err){ res.json(err)}
            //res.json(rows);
          }) 
          next();
    }, async function(req, res) { 
            let BE_ID =  await GenerateID(1111111111,`article_suivie_stock`,'BE_ID');
            let Today = new Date().toISOString().split('T')[0]
            let articleL = JSON.stringify(req.toSaveList)
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `INSERT INTO article_suivie_stock (BE_ID,BE_Date,Genre,Fournisseur,Articles) 
                       VALUES ('${BE_ID}','${Today}','Entre','${req.fournisseur}','${articleL}')`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json({BE_ID:BE_ID});
            }) 
    });


    MagazinGerant.post('/stock/bs', async function(req, res, next) {
          let PID = req.body.PID  
          let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
          req.toSaveList = articleList;
          let sqlText = ''
          articleList.map( (data) => {
            sqlText = sqlText.concat(" ", `WHEN ${data.A_Code} THEN Quantite -  ${data.NewQte} `);
         })
         connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
         let sql = `UPDATE articles
                  SET Quantite = CASE A_Code  
                            ${sqlText}
                  ELSE Quantite
                  END`;
         connection.query(sql, (err, rows, fields) => {
          if (err){ res.json(err)}
            //res.json(rows);
          }) 
          next();
    }, async function(req, res) { 
            let BE_ID =  await GenerateID(1111111111,`article_suivie_stock`,'BE_ID');
            let Today = new Date().toISOString().split('T')[0]
            let articleL = JSON.stringify(req.toSaveList)
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `INSERT INTO article_suivie_stock (BE_ID,BE_Date,Genre,Articles) 
                       VALUES ('${BE_ID}','${Today}','Sortie','${articleL}')`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json({BE_ID:BE_ID});
            }) 
    });

    MagazinGerant.post('/stock/inventaire', async function(req, res, next) {
          let PID = req.body.PID  
          let articleList = req.body.artList; //[['6191513501017','5'],['6191513502212','5']]; //req.body.artList
          req.toSaveList = articleList;
          let sqlText = ''
          articleList.map( (data) => {
            sqlText = sqlText.concat(" ", `WHEN ${data.A_Code} THEN Quantite -  ${data.NewQte} `);
         })
         connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
         let sql = `UPDATE articles
                  SET Quantite = CASE A_Code  
                            ${sqlText}
                  ELSE Quantite
                  END`;
         connection.query(sql, (err, rows, fields) => {
          if (err){ res.json(err)}
            //res.json(rows);
          }) 
          next();
    }, async function(req, res) { 
            let BE_ID =  await GenerateID(1111111111,`article_suivie_stock`,'BE_ID');
            let Today = new Date().toISOString().split('T')[0]
            let articleL = JSON.stringify(req.toSaveList)
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `INSERT INTO article_suivie_stock (BE_ID,BE_Date,Genre,Articles) 
                       VALUES ('${BE_ID}','${Today}','Sortie','${articleL}')`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json({BE_ID:BE_ID});
            }) 
    });

/*####################################[CLIENT]#####################################*/
	/* selectioner tous les client */
    MagazinGerant.post('/client', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT *  FROM clients WHERE 1 `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    /* selectioner un client */
    MagazinGerant.post('/client/info', (req, res) => {
          let PID = req.body.PID;
          let clientID = req.body.clientId
          function FetchClientData() {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM clients WHERE CL_ID = ${clientID}`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
                })
              });
          }
          function SelectCommandes(Name) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM commandes WHERE Client = '${Name}' AND State = 'W'`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
          function SelectFactures(Name) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM factures WHERE Client = '${Name}' AND State = 'Credit'`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
           function SelectReglemment(Name) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM clients_reglement WHERE Client = '${Name}'`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
          function CalculerCredit(Name) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT SUM(Final_Value) AS CRDT FROM factures WHERE Client = '${Name}' AND State = 'Credit' `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    if (!rows[0].CRDT) {resolve('0.000');} else {resolve(rows[0].CRDT.toFixed(3));}
                })
              });
          }


            // Call, Function
          async function query() {
              const clientList = await FetchClientData(); 
              clientList[0].Commandes = await SelectCommandes(clientList[0].CL_ID)
              clientList[0].Facture = await SelectFactures(clientList[0].CL_ID)
              clientList[0].Reglemment = await SelectReglemment(clientList[0].CL_ID)
              clientList[0].Credit = await CalculerCredit(clientList[0].CL_ID)
            res.send(clientList)
          }
          query();               
    })

/*####################################[EQUIPE]#####################################*/
	/* selectioner tous les client */
    MagazinGerant.post('/team/anavce/ajoute', (req, res) => {
        let TAG = req.body.PID;
        let avanceD = req.body.avanceD;
        let Today = new Date().toISOString().split('T')[0]
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO equipe_avance (Team_ID, AV_Date, Valeur)
                     VALUES ('${avanceD.Team_ID}','${Today}','${avanceD.Valeur}');`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })
    MagazinGerant.post('/team/presence/ajoute', (req, res) => {
        let TAG = req.body.PID;
        let presenceD = req.body.presenceD;
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO equipe_presence (Team_ID, PR_Date, Genre)
                     VALUES ('${presenceD.Team_ID}','${presenceD.PR_Date}','');`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

/*####################################[OUTILS]#####################################*/

	MagazinGerant.post('/outils/ticket/prix', (req, res) => {
        let TAG = req.body.PID;
        let presenceD = req.body.presenceD;
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO equipe_presence (Team_ID, PR_Date, Genre)
                     VALUES ('${presenceD.Team_ID}','${presenceD.PR_Date}','');`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    MagazinGerant.post('/outils/dateP', (req, res) => {
        let TAG = req.body.PID;
        let presenceD = req.body.presenceD;
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO equipe_presence (Team_ID, PR_Date, Genre)
                     VALUES ('${presenceD.Team_ID}','${presenceD.PR_Date}','');`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

/*####################################[COMMANDES]##################################*/
	//fetch all article */
	MagazinGerant.post('/stock', (req, res) => {
	      let TAG = req.body.tag
	      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
	      let sql = `SELECT * FROM ${TAG}_article WHERE 1`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ throw err}
	        res.json(rows);
	      })
	          
	})

	/* enregister une Commande */ 
	MagazinGerant.post('/ajouter', (req, res) => {
		(async() => {
		   let TAG = req.body.tag
	       let factId = req.body.commandD
	       let CID = await GenerateID(1111111111,`system_commande`,'C_ID');
	       let articleL = JSON.stringify(factId.articles)
	       let Today = new Date().toLocaleDateString('fr-FR').split( '/' ).reverse( ).join( '-' )
	       connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
	       let sql = `INSERT INTO system_commande (C_ID,Client,Date_Passe,Date_Volu,Totale,PassePar, SystemTag,State,Articles,Comments,Retour,Prix_Grox) 
	                 VALUES ('${CID}','${factId.client}','${Today}','${factId.jour}','${factId.totale}','${factId.UID}','${TAG}','W','${articleL}','${factId.Comments}',0,'${factId.prixGros}')`;
	       connection.query(sql, (err, rows, fields) => {
	        if (err){ res.send(err) }
	        res.send(rows);
	      }) 
	     })()   
	}) 

	/* selctioner mes commandes [in between] */
	MagazinGerant.post('/mescommandes', (req, res) => {
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

module.exports = MagazinGerant