const express = require('express')
const multer = require('multer')
const Magazin = express.Router()
const { spawn } = require('child_process');
const connection = require('../connection-mg.js')
const path = require("path");

//Multer.js
const DIR = 'C:/Users/kheli/Desktop/PROJECTS/abyedh/abyedh.system/Magazin/public/houssem';
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

/*####################################[LOGIN]######################################*/
  /* Login */
  Magazin.post('/LogIn', (req, res) => {
      const logInD = req.body.LoginData;
      function Connect(){
          connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
          let sql = `SELECT * FROM admin_log_in WHERE Log = '${logInD.Log}' AND Pwd  = '${logInD.Pwd}' AND Genre = 'magazin'`

          //let sql = `SELECT * FROM system_login WHERE Identification = '${logInD.Log}' AND PasswordSalt   = '${logInD.Pwd}' AND SystemKey ='PTVGros'` ;
          connection.query(sql, (err, rows, fields) => {
            if (err) throw err;
            if (rows.length == 0 ) {
              let tokenTable = [Exist = 'false', KEY = 'null']; 
              res.send(JSON.stringify(tokenTable));
            } 
            else {
                let tokenTable = [Exist = 'true', KEY = rows[0].Permission_Key];
                res.send(JSON.stringify(tokenTable)); 
             }
          }); 
      }

      //render
      Connect()
  })



  /* Check autorisation */
  Magazin.post('/Permission', (req, res) => {
      const TAG = req.body.tag;
      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
      let sql = `SELECT * FROM admin_setting WHERE SystemTag  = '${TAG}'` ;
      connection.query(sql, (err, rows, fields) => {
        if (err) throw err
        res.send(rows);
      }); 
  })
  /* Check autorisation */
  Magazin.post('/Auth/Demande', (req, res) => {
      const TAG = req.body.tag;
      const User = req.body.authUser;
      const position = JSON.stringify(req.body.position);
      const device = req.body.device;
      let AuthKey = Math.floor(Math.random() * 99999999)
      let Today = new Date().toISOString().split('T')[0]
      let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
      let sql = `INSERT INTO admin_system_auth(System_Tag, Auth_Date, Auth_Key, Auth_Name, Auth_Time,Auth_Validite, Auth_Device, Auth_Position) 
             VALUES ('${TAG}','${Today}','${AuthKey}','${User}','${ToTime}','true','${device}','${position}')` ;
      connection.query(sql, (err, rows, fields) => {
        if (err) throw err
        res.send(rows);
      }); 
  }) 
  /* Check autorisation */
  Magazin.post('/Auth/Check', (req, res) => {
      const TAG = req.body.tag;
      const User = req.body.authUser;
      const key = req.body.authKey;
      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
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
  Magazin.post('/Auth/Invalidate', (req, res) => {
      const PK = req.body.authKeyID;
      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
      let sql = `UPDATE admin_system_auth SET Auth_Validite = 'false' WHERE PK = ${PK} ` ;
      connection.query(sql, (err, rows, fields) => {
        if (err) throw err
        res.send(rows);
      }); 
  })

/*####################################[MAIN]#######################################*/
      /* statistics */
      Magazin.post('/ma/stat', (req, res) => {
              let PID =  req.body.PID;
              let Today = new Date().toISOString().split('T')[0]

              function NumRowsTable(table,db) {
                return new Promise((resolve, reject) => {
                        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                        let sql = `SELECT PK FROM ${table} `;
                         connection.query(sql, (err, rows, fields) => {
                          if(err) return reject(err);
                          resolve(rows.length);
                        })
                });
              }
              function ClientCreditDistro() {
                return new Promise((resolve, reject) => {
                        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                        let sql = `SELECT factures.Client, CAST(SUM(factures.Final_Value) AS DECIMAL(10,3))  as Totale , clients.CL_Name
                                   FROM factures 
                                   LEFT JOIN clients ON factures.Client = clients.CL_ID 
                                   WHERE factures.State = 'Credit'
                                   GROUP BY factures.Client ORDER BY factures.Client;`;
                         connection.query(sql, (err, rows, fields) => {
                          if(err) return reject(err);
                          resolve(rows);
                        })
                });
              }
              function GenreDistrubition() {
                return new Promise((resolve, reject) => {
                        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                        let sql = `SELECT Genre,COUNT(1) as Totale FROM articles WHERE Genre != ''  GROUP BY Genre ORDER BY Genre;`;
                         connection.query(sql, (err, rows, fields) => {
                          if(err) return reject(err);
                          resolve(rows);
                        })
                });
              }
              function CommandeDistrubition() {
                return new Promise((resolve, reject) => {
                        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                        let sql = `SELECT State,COUNT(1) as Totale FROM commandes  GROUP BY State ORDER BY State;`;
                         connection.query(sql, (err, rows, fields) => {
                          if(err) return reject(err);
                          resolve(rows);
                        })
                });
              }

              function FetchAllCaisses() {
                  return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `SELECT * FROM caises  `;
                     connection.query(sql, (err, rows, fields) => {
                        if (err) return reject(err);
                        resolve(rows);
                    })
                  });
              }
              function CalculateRecette(camId) {
                  return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `SELECT SUM(Final_Value) AS RCT
                               FROM factures WHERE  Caisse_ID = ${camId} AND T_Date = '${Today}'`;
                     connection.query(sql, (err, rows, fields) => {
                        if (err) return reject(err);
                        if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
                        
                    })
                  });
              }

              function KeyForAutoLogOut() {
                    return new Promise((resolve, reject) => {
                      connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                      let sql = `SELECT * FROM admin_log_in WHERE Genre  = 'magazin'`;
                       connection.query(sql, (err, rows, fields) => {
                          if (err) return reject(err);
                           resolve(rows);
                          
                      })
                    });
                }
              function CalculerCredit(Name) {
                  return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `SELECT SUM(Final_Value) AS CRDT FROM factures WHERE  State = 'Credit' `;
                     connection.query(sql, (err, rows, fields) => {
                        if (err) return reject(err);
                        if (!rows[0].CRDT) {resolve('0.000');} else {resolve(rows[0].CRDT.toFixed(3));}
                    })
                  });
              }

              // Call, Function
              async function StatForMainPage() {
                  const caisseListe = await FetchAllCaisses(); 
                  for (var i = 0; i < caisseListe.length; i++) {
                      caisseListe[i].Recette = await CalculateRecette(caisseListe[i].C_ID)
                  }

                  let main = {};
                    main.clientsNum = await NumRowsTable('clients'); 
                    main.creditTot = await CalculerCredit(); 
                    main.articlesNum = await NumRowsTable('articles'); 
                    main.caisseNum = await NumRowsTable('caises'); 
                    main.facturesNum = await NumRowsTable('factures'); 
                    main.equipeNum = await NumRowsTable('equipe'); 

                    main.clientCredit = await ClientCreditDistro(); 

                    main.genreDistro = await  GenreDistrubition(); 

                    main.commandeDistro = await  CommandeDistrubition(); 

                    main.caisseStat = caisseListe; 

                    main.autoLogOut = await KeyForAutoLogOut();

                    res.send(main)
              }

              //render
              StatForMainPage(); 

      })

/*####################################[REQUEST]####################################*/

      /*fetch all request */
      Magazin.post('/commande', (req, res) => {
            let PID = req.body.PID;
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `SELECT * FROM commandes WHERE  1 `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      })

      /* request data */
      Magazin.post('/commande/info', (req, res) => {
            let PID = req.body.PID;
            let RID = req.body.CID;
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `SELECT * FROM commandes  WHERE   commandes.R_ID = '${RID}'`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      })

      /* request control : Update commande state  */
      Magazin.post('/commande/controle', (req, res) => {
            let PID = req.body.PID;
            let R_ID = req.body.RID;
            let State = req.body.state;
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `UPDATE commandes
                       SET State = '${State}'
                       WHERE R_ID = '${R_ID}' `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      })

      /* comptes
      Magazin.post('/commande/comptes', (req, res) => {
          let PID = req.body.PID
            let sql = `SELECT * FROM system_commande_comptes  `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      }) */

      /* comptes Ajouter 
      Magazin.post('/commande/comptes/ajouter', (req, res) => {
        (async() => {
            let PID = req.body.PID;
            let compteData = req.body.compteData
            let CID = await GenerateID(1111111111,`system_commande_comptes`,'CID');
              let sql = `INSERT INTO system_commande_comptes(CID,Name,Identifiant, Password, SystemTag) 
                    VALUES (${CID},'${compteData.Name}','${compteData.Identifiant}','${compteData.Password}','${TAG}')`;
               connection.query(sql, (err, rows, fields) => {
                if (err){ throw err}
                res.json(rows);
              })
         })() 
                
      })*/

      /* modifier une location 
      Magazin.post('/commande/comptes/modifier', (req, res) => {
         let PID = req.body.PID;
         let editCompteD = req.body.editCompteD
            let sql = `UPDATE system_commande_comptes 
                  SET Name= '${editCompteD.Name}' , Identifiant= '${editCompteD.Identifiant}', Password = '${editCompteD.Password}'
                  WHERE PK= ${editCompteD.PK} AND CID = ${editCompteD.CID}`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      })*/

/*####################################[STOCK]######################################*/

    //fetch all article */
    Magazin.post('/stock', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * FROM articles `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    //fetch all article */
    Magazin.post('/stock/getfamille', (req, res) => {
          let famille = req.body.famille;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * FROM articles WHERE Genre = '${famille}'`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    //check article in abyedhDB */
    Magazin.post('/stock/checkAbyedhDb', (req, res) => {
          let Code = req.body.Code;
          let SystemTag = req.body.Tag;
          connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
          let sql = `SELECT * FROM alimentaire_article WHERE A_Code = '${Code}'`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows[0]);
          })
              
    })

   /* fetach article info  */
    Magazin.post('/stock/article', (req, res) => {
          let PID = req.body.PID
          let Code = req.body.code
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * FROM articles WHERE A_Code = '${Code}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.send(rows);
          })
              
    })

    //selectioner calendar articles : ba3ed 7otha m3a elli fou9ha 
    Magazin.post('/stock/article/calendar', (req, res) => {
            let PID = req.body.PID
            let Code = req.body.code

            function FetchFromBE(genre) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM article_suivie_stock WHERE Genre = '${genre}'   AND  Articles LIKE '%${Code}%' `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
            }
            function FetchInFacture() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT * FROM factures WHERE  Articles LIKE '%${Code}%' `;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      resolve(rows);
                  })
                });
            }
            // function FetchForCamion() {
            //     return new Promise((resolve, reject) => {
            //       connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            //       let sql = `SELECT * FROM camion_fond WHERE  Articles LIKE '%${Code}%' AND Genre = 'Fonds' `;
            //        connection.query(sql, (err, rows, fields) => {
            //           if (err) return reject(err);
            //           resolve(rows);
            //       })
            //     });
            // }

            // Call, Function
            async function StockArticleCalendar() {
                const articleCalendar = {}; 
                articleCalendar.bonE = await FetchFromBE('Entre')
                articleCalendar.bonS = await FetchFromBE('Sortie')
                articleCalendar.InFacture = await FetchInFacture()
                //articleCalendar.ForCamion = await FetchForCamion()
              res.send(articleCalendar)
            }

            //
            StockArticleCalendar();
              
    })

    /* ajouter article */
    Magazin.post('/stock/ajouter', (req, res) => {
          let PID = req.body.PID;
          let articleData = req.body.articleD;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO articles (PID ,A_Code,Name, Prix_vente, Quantite, Prix_achat, Genre, Socite, Repture, TVA, Groupage,Details,Photo_Path) 
                     VALUES ('${PID}','${articleData.A_Code}','${articleData.Name}','${articleData.PrixV}','${articleData.Qte}','${articleData.PrixA}','${articleData.Genre}','${articleData.Socite}','${articleData.Rept}','${articleData.TVA}','${articleData.Groupage}','', 'default_img.jpg' ) `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              console.log(err)
              res.json(rows);
          })          
    })


    /* modifier article  */
    Magazin.post('/stock/modifier', (req, res) => {
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
    Magazin.post('/stock/modifier/raccourci', (req, res) => {
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

    /* modifier article  */
    Magazin.post('/stock/modifier/image', (req, res) => {
          let PID = req.body.PID
          let path = req.body.path
          let Code = req.body.code
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE articles
                     SET Photo_Path = '${path}'
                     WHERE A_Code = '${Code}'  `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })    
           //res.json(fields)      
    })

    /* supprimer article */
    Magazin.post('/stock/supprimer', (req, res) => {
          let articleData = req.body.articleD
          // let sql = `INSERT INTO alimentaire_article
          //           (A_Code,Name, Prix_vente, Quantite, Prix_achat, Genre, Socite, Repture, TVA,Groupage,facturable) 
          //           VALUES ('${articleData.A_Code}','${articleData.Name}','${articleData.PrixV}','${articleData.Qte}','${articleData.PrixA}','${articleData.Genre}','${articleData.Socite}','${articleData.Repture}','${articleData.TVA}','${articleData.Groupage}','') `;
          //  connection.query(sql, (err, rows, fields) => {
          //   if (err){res.json(err)}
          //     res.json(rows);
          // })    
           res.json(articleData)      
    })

    /* fetch familles */
    Magazin.post('/stock/familles', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * FROM articles_genre `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    /*ajouter famille */
    Magazin.post('/stock/familles/ajouter', (req, res) => {
        let PID = req.body.PID
        let familleData = req.body.familleD
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
        let sql = `INSERT INTO articles_genre (Genre,Description,PID) 
                   VALUES ('${familleData.Name}','${familleData.Description}','${PID}')`;
         connection.query(sql, (err, rows, fields) => {
          if (err){ res.json(err)}
          res.json(rows);
        })
            
    })

    /* modifier famille */
    Magazin.post('/stock/familles/modifier', (req, res) => {
            let PID = req.body.PID
            let familleData = req.body.familleD

            function FetchFamilleData() {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM articles_genre WHERE PK = ${familleData.PK} `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows[0]);
                })
              });
            }
            function UpdateStock(genre,newGenre) {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `UPDATE articles
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
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `UPDATE articles_genre 
                             SET Genre = '${familleData.Name}' , Description =  '${familleData.Description}'
                             WHERE PK = ${familleData.PK} `;
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



    Magazin.post('/stock/be', async function(req, res, next) {
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


    Magazin.post('/stock/bs', async function(req, res, next) {
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


    /* Select Bon ES  */
    Magazin.post('/stock/bebs/select', (req, res) => {
            let PID = req.body.PID  
            let bonId = req.body.bonId; 
            let sql = `SELECT * FROM article_suivie_stock WHERE BE_ID = ${bonId}`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })   
    })

/*####################################[CAISSE]#####################################*/

      /* featch tou les camion*/
      Magazin.post('/caisses', (req, res) => {
            let PID = req.body.PID;
            let Today = new Date().toISOString().split('T')[0]
            function FetchAllCamion() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT * FROM caises WHERE  1`;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      resolve(rows);
                  })
                });
            }
            function CalculateRecette(camId) {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT SUM(Final_Value) AS RCT FROM factures WHERE Caisse_ID = ${camId} AND T_Date = '${Today}' `;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      if (rows[0].RCT == null) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
                      
                  })
                });
            }


            // Call, Function
            async function query() {
                const caisseList = await FetchAllCamion(); 
                for (var i = 0; i < caisseList.length; i++) {
                  caisseList[i].Recette = await CalculateRecette(caisseList[i].C_ID)
                }
              res.send(caisseList)
            }
            query();
                     
      })

      /* selectioner un camion */
      Magazin.post('/caisse/info', (req, res) => {
            let PID = req.body.PID;
            let caisseID = req.body.camId;
            let Today = new Date().toISOString().split('T')[0]
            function FetchAllCaisseData() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT * FROM caises WHERE C_ID = ${caisseID}`;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      resolve(rows[0]);
                  })
                });
            }
            function CalculateRecette() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT SUM(Final_Value) AS RCT FROM factures WHERE Caisse_ID = ${caisseID} AND T_Date = '${Today}' `;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      if (!rows[0].RCT) {resolve('0.000');} else {resolve(rows[0].RCT.toFixed(3));}
                  })
                });
            }
            function CaisseFactures() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name FROM factures 
                             LEFT JOIN clients ON factures.Client = clients.CL_ID 
                             WHERE factures.Caisse_ID = ${caisseID}   LIMIT 200 `;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      resolve(rows);
                  })
                });
            }


              // Call, Function
            async function query() {
                const camionList = [{}]  
                camionList[0].Data = await FetchAllCaisseData();
                camionList[0].Recette = await CalculateRecette();
                camionList[0].Facture = await CaisseFactures()
              res.send(camionList)
            }
            query();
                     
      })
      
      /*Ajouter Camion*/
      Magazin.post('/caisses/ajouter', (req, res) => {
          (async() => {
              let PID = req.body.PID
              let camionData = req.body.camionD
              let Cam_ID =   await GenerateID(1111111111,`camion`,'Cam_ID');
              let sql = `INSERT INTO camion (PID, Cam_ID,Cam_Name, Matricule, Detail, Chauffeur,Pasword,Identifiant) 
                        VALUES (${PID} ,${Cam_ID},'${camionData.Cam_Name}','${camionData.Matricule}','${camionData.Marque}','${camionData.Chauffeur}','${camionData.Password}','${camionData.Identifiant}') `;
               connection.query(sql, (err, rows, fields) => {
                if (err){res.json(err)}
                  res.json(rows);
              })  
        })()             
      })

      /* modifier un camion */
      Magazin.post('/caisses/modifier', (req, res) => {
            let PID = req.body.PID
            let caisseData = req.body.caisseD
            let sql = `UPDATE caises
                      SET CA_Name = '${caisseData.CA_Name}' , Caisse_Fond = '${caisseData.Caisse_Fond}' , Identifiant = '${caisseData.Identifiant}' , Password = '${caisseData.Password}'  
                      WHERE C_ID = '${caisseData.C_ID}' `;
             connection.query(sql, (err, rows, fields) => {
              if (err){res.json(err)}
                res.json(rows);
            })          
      })


      /*PRINTING*/ 

      //facture du jour 
      Magazin.post('/caisse/searchrecette', (req, res) => {
             let PID = req.body.PID
             let caisseID = req.body.camId
             let targetDay = req.body.targetDay
             let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name FROM factures 
                        LEFT JOIN clients ON factures.Client = clients.CL_ID 
                        WHERE factures.Caisse_ID = ${caisseID}  AND factures.T_Date >= '${targetDay.start}' AND factures.T_Date <= '${targetDay.end}' `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
              
            })       
      })

      //facture du jour 
      Magazin.post('/camion/info/printing/fondResumer', (req, res) => {
             let PID = req.body.PID
             let camId = req.body.camId
             let start = req.body.start
             let end = req.body.end
             let sql = `SELECT Jour,SUM(Totale) as Totale FROM camion_fond WHERE Jour >= '${start}' AND Jour < '${end}' AND Camion = ${camId} GROUP BY Jour ORDER BY Jour ;`;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
              
            })       
      })

      /* fetch familles */
      Magazin.post('/caisse/bons', (req, res) => {
            let PID = req.body.PID;
            connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
            let sql = `SELECT * FROM caises_bons `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })
                
      })

      /*ajouter famille */
      Magazin.post('/caisse/bons/ajouter', (req, res) => {
          let PID = req.body.PID
          let familleData = req.body.familleD
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO caises_bons (Genre,Description,PID) 
                     VALUES ('${familleData.Name}','${familleData.Description}','${PID}')`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ res.json(err)}
            res.json(rows);
          })
              
      })

      /* modifier famille */
      Magazin.post('/caisse/bons/modifier', (req, res) => {
              let PID = req.body.PID
              let familleData = req.body.familleD

              function FetchFamilleData() {
                return new Promise((resolve, reject) => {
                  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT * FROM caises_bons WHERE PK = ${familleData.PK} `;
                   connection.query(sql, (err, rows, fields) => {
                      if (err) return reject(err);
                      resolve(rows[0]);
                  })
                });
              }
              function UpdateStock(genre,newGenre) {
                  return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `UPDATE articles
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
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `UPDATE articles_genre 
                               SET Genre = '${familleData.Name}' , Description =  '${familleData.Description}'
                               WHERE PK = ${familleData.PK} `;
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

/*####################################[FACTURES]###################################*/

    /* selectionner tous les factures */
    Magazin.post('/facture', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name ,factures.State AS Pay_State FROM factures 
                     LEFT JOIN clients ON factures.Client = clients.CL_ID 
                     LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
                     WHERE 1 LIMIT 200`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}

            res.json(rows);
          })
              
    })

    /* selectionner tous les factures */
    Magazin.post('/facture/resumer', (req, res) => {
           let PID = req.body.PID
           let date = req.body.targetDate
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `SELECT * , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name ,factures.State AS Pay_State FROM factures 
                     LEFT JOIN clients ON factures.Client = clients.CL_ID 
                     LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID 
                      WHERE factures.T_Date >= '${date.start}' AND factures.T_Date <= '${date.end}' `;
             connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
              res.json(rows);
            })        
      })

    /* selectioner un facture et ses articles */
    Magazin.post('/facture/select', (req, res) => {
           let PID = req.body.PID
           let FID = req.body.fid
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `SELECT factures.* , clients.*,  caises.C_ID, caises.CA_Name, factures.PK AS FACT_ID, factures.State AS Pay_State,  COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name
                      FROM factures
                      LEFT JOIN clients ON factures.Client = clients.CL_ID 
                      LEFT JOIN caises ON factures.Caisse_ID = caises.C_ID
                      WHERE factures.T_ID = ${FID} `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.send(rows);
          })         
    })

    /* modifier un facture */
    Magazin.post('/facture/modifier', (req, res) => {
           let PID = req.body.PID
           let factId = req.body.factD
           let FID = req.body.fid
           let articleL = JSON.stringify(factId.articles)
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `UPDATE factures
                      SET Cre_Date = '${factId.jour}', C_Name = '${factId.client}', Tota = '${factId.totale}', De = '${factId.de}', Vers ='${factId.vers}' , Chauffeur ='${factId.Chauffeur}' ,Fournisseurs ='${factId.Fournisseurs}', Articles = '${articleL}'
                      WHERE F_ID = '${FID}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json({FID:FID});
          })         
    })

    /*Selectionner Vente */
    Magazin.post('/facture/vente', (req, res) => {
           let PID = req.body.PID
           let sql = `SELECT Articles  FROM factures  WHERE 1`;
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

/*####################################[CLIENT]#####################################*/

    /* selectioner tous les client */
    Magazin.post('/client', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT *  FROM clients WHERE 1 `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

  

    /* selectioner un client */
    Magazin.post('/client/info', (req, res) => {
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

    /* Ajouter client */
    Magazin.post('/client/ajouter', (req, res) => {
      (async() => {
        let PID = req.body.PID;
        let clientD = req.body.clientD
        let CID = await GenerateID(1111111111,'clients','CL_ID');
        let Today = new Date().toISOString().split('T')[0]
          let sql = `INSERT INTO clients (CL_ID,  CL_Name, Genre,  Creation_Date, Phone, Adress, CIN, State) 
                 VALUES (${CID},'${clientD.Name}','${clientD.Genre}','${Today}','${clientD.Phone}','${clientD.Adress}','${clientD.CIN}','');`;
            connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
             res.json(rows);
            })
        })()      
    })

    //check article in abyedhDB */
    Magazin.post('/client/checkAbyedhDb', (req, res) => {
          let UID = req.body.UID;
          connection.changeUser({database : 'dszrccqg_profile'}, () => {});
          let sql = `SELECT * FROM user_general_data WHERE UID = '${UID}'`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows[0]);
          })
              
    })


    /* modifier un client */
    Magazin.post('/client/modifier', (req, res) => {
        let PID = req.body.PID;
        let clientD = req.body.clientD
          let sql = `UPDATE clients
                    SET CL_Name = '${clientD.CL_Name}',  Phone = '${clientD.Phone}' , Adress = '${clientD.Adress}' ,  Genre = '${clientD.Genre}'  
                    WHERE CL_ID = ${clientD.CL_ID}`;
            connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
             res.json(rows);
            })     
    })

  

    /* supprimer un client */


    /* map : liste des location */
    Magazin.post('/client/fidelite', (req, res) => {
           let PID = req.body.PID;
           let genre = req.body.genre
           let start = req.body.start
           let finish = req.body.finish
           let top = req.body.Top
           let sql1 = `SELECT  factures.Client, SUM(Final_Value) as Totale, factures.T_Date ,clients.CL_Name, COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name
                      FROM factures 
                      LEFT JOIN clients ON factures.Client = clients.CL_ID
                      WHERE factures.T_Date > '${start}' AND factures.T_Date < '${finish}' 
                      GROUP BY factures.Client ORDER BY SUM(Final_Value) DESC LIMIT ${top};`

           let sql2 = `SELECT COUNT(1) as Totale , factures.Client , clients.Cl_Name , COALESCE(clients.CL_Name, 'PASSAGER') AS CL_Name
                      FROM factures  
                      LEFT JOIN clients ON factures.Client = clients.CL_ID
                      WHERE factures.T_Date > '${start}' AND factures.T_Date < '${finish}'  
                      GROUP BY factures.Client ORDER BY COUNT(1) DESC LIMIT ${top};`

           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           connection.query(genre == 'Totale' ? sql1 : sql2 , (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

 
/*####################################[TEAM]#####################################*/

    /* selectioner tous l'equipe */
    Magazin.post('/team', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT *  FROM equipe WHERE 1 `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.send(rows);
          })         
    })

    /* Ajouter client */
    Magazin.post('/team/ajouter', (req, res) => {
      (async() => {
        let PID = req.body.PID;
        let teamD = req.body.teamD
        let CID = await GenerateID(1111111111,'equipe','T_ID');
        let Today = new Date().toISOString().split('T')[0]
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
        let sql = `INSERT INTO equipe (T_ID, T_Name, T_CIN, T_Phone, T_Adresse, Poste,  Started_At, Finish_at)
                     VALUES (${CID},'${teamD.Name}','${teamD.T_CIN}','${teamD.Phone}','${teamD.Adress}','${teamD.Poste}','${Today}','');`;
            connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
             res.json(rows);
            })
        })()      
    })

    /* selectioner un client */
	  Magazin.post('/team/info', (req, res) => {
		    let PID = req.body.PID;
		    let TID = req.body.Team_ID
		    function FetchTeamData() {
			      return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			      	let sql = `SELECT * FROM equipe WHERE T_ID = ${TID} `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
				      })
			      });
		    }
		    function SelectPresence(Name) {
			      return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			      	let sql = `SELECT * FROM equipe_presence WHERE Team_ID = ${TID} `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    function SelectAvances(Name) {
			      return new Promise((resolve, reject) => {
			      	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			      	let sql = `SELECT * FROM equipe_avance WHERE Team_ID = ${TID} `;
				       connection.query(sql, (err, rows, fields) => {
				          if (err) return reject(err);
				          resolve(rows);
				      })
			      });
		    }
		    // function SelectFactures(Name) {
			   //    return new Promise((resolve, reject) => {
			   //    	connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
			   //    	let sql = `SELECT * FROM ${TAG}_facture WHERE C_Name = '${TID}' `;
				  //      connection.query(sql, (err, rows, fields) => {
				  //         if (err) return reject(err);
				  //         resolve(rows);
				  //     })
			   //    });
		    // }


	      	// Call, Function
		    async function query() {
		        const teamData = await FetchTeamData(); 
		      	teamData[0].Presence = await  SelectPresence(teamData[0].T_ID)
		      	teamData[0].Avances = await SelectAvances(teamData[0].T_ID)
		      	//teamData[0].Facture = await SelectFactures(teamData[0].Name)
		      res.send(teamData)
		    }
		    query();               
	  })

  	/* selectioner tous les client */
  	Magazin.post('/team/anavce', (req, res) => {
  		  let TAG = req.body.PID;
  		  connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
  	      let sql = `SELECT * 
                     FROM equipe_avance 
                     LEFT JOIN equipe ON equipe.T_ID =  equipe_avance.Team_ID 
                     WHERE 1`;
  	       connection.query(sql, (err, rows, fields) => {
  	        if (err){ throw err}
  	        res.json(rows);
  	      })
  	          
  	})

    /* selectioner tous les client */
    Magazin.post('/team/anavce/ajoute', (req, res) => {
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

    /* selectioner tous les client */
    Magazin.post('/team/presence', (req, res) => {
        let TAG = req.body.PID;
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * 
                     FROM equipe_presence 
                     LEFT JOIN equipe ON equipe.T_ID =  equipe_presence.Team_ID 
                     WHERE 1`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    Magazin.post('/team/presence/ajoute', (req, res) => {
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

  	/*ajouter famille */
    Magazin.post('/team/poste/ajouter', (req, res) => {
          let PID = req.body.PID
          let posteD = req.body.posteD
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `INSERT INTO team_poste (PID, Poste ,Description,Salaire,Experience_Target) 
                     VALUES ('${PID}', '${posteD.Poste}','${posteD.Description}','${posteD.Salaire}','${posteD.Description}')`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ res.json(err)}
            res.json(rows);
          })
              
    })

    /* modifier famille */
    Magazin.post('/team/poste/modifier', (req, res) => {
          let PID = req.body.PID
          let posteD = req.body.posteD
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE team_poste 
                     SET Genre = '${posteD.Name}' , Description =  '${posteD.Description}'
                     WHERE PK = ${posteD.PK} `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ res.json(err)}
            res.json(rows);
          })
              
    })

/*####################################[FOURNISSEUR]###############################*/

    /* selectioner tous les client */
    Magazin.post('/fournisseur', (req, res) => {
          let PID = req.body.PID
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * FROM fournisseur `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })          
    })

    /* selectioner un client */
    Magazin.post('/fournisseur/info', (req, res) => {
          let PID = req.body.PID;
          let fourId = req.body.fourId
          let genre = req.body.genre
          function FetchClientData() {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM fournisseur WHERE Four_ID = ${fourId}`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    if (!rows[0]) {resolve([{ Name:null , }]);} else {resolve(rows);}
                })
              });
          }
          function SelectFactureBE(Name) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM article_suivie_stock WHERE Fournisseur = '${fourId}'`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
          function SelectFactureCamion(Name, genre) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                let sql = `SELECT *
                           FROM ${genre}_camion_facture 
                           LEFT JOIN system_clients ON ${genre}_camion_facture.C_Name = system_clients.CL_ID
                           LEFT JOIN ${genre}_camion ON ${genre}_camion_facture.Camion = ${genre}_camion.Cam_ID
                           WHERE C_Name = '9235684701' OR C_Name = '7042398165' 
                           ORDER BY ${genre}_camion_facture.Cre_Date DESC LIMIT 250  `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
          function SelectFacturesDepot(Name, genre) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                let sql = `SELECT *
                           FROM ${genre}_facture 
                           LEFT JOIN system_clients ON ${genre}_facture.C_Name = system_clients.CL_ID 
                           LEFT JOIN ${genre}_camion ON ${genre}_facture.Fournisseurs = ${genre}_camion.Cam_ID
                           WHERE C_Name = '9235684701' OR C_Name = '7042398165'  
                           ORDER BY ${genre}_facture.Cre_Date DESC LIMIT 250 `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }
          function FetchCommandeListe(fourID) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                  let sql = `SELECT Articles FROM article_suivie_stock WHERE Fournisseur = '${fourId}' ORDER BY BE_ID DESC LIMIT 10`; 
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
                   res[value.A_Code].Qte += parseInt(value.NewQte);
                   return res;
                 }, {});

                    resolve(result);
               }) 
              })
          }

            // Call, Function
          async function query() {
              const clientData = await FetchClientData(); 
              clientData[0].commandeData = await FetchCommandeListe(fourId) 
              switch(clientData[0].Articles_Genre) {
                  case 'depotAlim':
                    clientData[0].Facture = await SelectFacturesDepot(clientData[0].Name, 'alimentaire')
                    break;
                  case 'depotCosmo':
                    clientData[0].Facture = await SelectFacturesDepot(clientData[0].Name, 'cosmetique')
                    break;
                  case 'camionAlim':
                    clientData[0].Facture = await SelectFactureCamion(clientData[0].Name, 'alimentaire')
                    break;
                  case 'camionCosmo':
                    clientData[0].Facture = await SelectFactureCamion(clientData[0].Name, 'cosmetique')
                    break;

                  default:
                    clientData[0].Facture = await SelectFactureBE(clientData[0].Name)
              }


            res.send(clientData)
          }
          query();               
    })

   /* selectioner un client */
    Magazin.post('/fournisseur/facture/info', (req, res) => {
          let PID = req.body.PID;
          let factId = req.body.fid
          let genre = req.body.genre

          

          function SelectFactureBE(factID) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM article_suivie_stock WHERE Fournisseur = '${fourId}'`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }

          function SelectFactureCamion(factID, genre) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                let sql = `SELECT *
                           FROM ${genre}_camion_facture 
                           LEFT JOIN system_clients ON ${genre}_camion_facture.C_Name = system_clients.CL_ID
                           LEFT JOIN ${genre}_camion ON ${genre}_camion_facture.Camion = ${genre}_camion.Cam_ID
                           WHERE  ${genre}_camion_facture.F_ID = ${factID} `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }

          function SelectFacturesDepot(factID, genre) {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                let sql = `SELECT *
                           FROM ${genre}_facture 
                           LEFT JOIN system_clients ON ${genre}_facture.C_Name = system_clients.CL_ID 
                           LEFT JOIN ${genre}_camion ON ${genre}_facture.Fournisseurs = ${genre}_camion.Cam_ID
                           WHERE  ${genre}_facture.F_ID = ${factID}`;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }

          function FetchStock(Liste) {
              let namesArray = JSON.parse(Liste).map(obj => obj.A_Code); 
              let renderedNames = `(${namesArray.join(", ")})`;
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT *
                            FROM articles
                            WHERE A_Code IN ${renderedNames}; `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }

          function FetchAnasloumaStock(Liste,genre) {
              let namesArray = JSON.parse(Liste).map(obj => obj.A_Code); 
              let renderedNames = `(${namesArray.join(", ")})`;
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_anaslouma'}, () => {});
                let sql = `SELECT A_Code, Colis
                            FROM ${genre}_article
                            WHERE A_Code IN ${renderedNames}; `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }


          // Call, Function
          async function query() {
              const clientData = {};
              switch(genre) {
                  case 'depotAlim':
                    clientData.data = await SelectFacturesDepot(factId, 'alimentaire')
                    clientData.stock = await FetchStock(clientData.data[0].Articles)
                    clientData.Depotstock = await FetchAnasloumaStock(clientData.data[0].Articles,'alimentaire')
                    break;
                  case 'depotCosmo':
                    clientData.data = await SelectFacturesDepot(factId, 'cosmetique')
                    clientData.stock = await FetchStock(clientData.data[0].Articles)
                    clientData.Depotstock = await FetchAnasloumaStock(clientData.data[0].Articles,'cosmetique')
                    break;
                  case 'camionAlim':
                    clientData.data = await SelectFactureCamion(factId, 'alimentaire')
                    clientData.stock = await FetchStock(clientData.data[0].Articles)
                    clientData.Depotstock = await FetchAnasloumaStock(clientData.data[0].Articles,'alimentaire')
                    break;
                  case 'camionCosmo':
                    clientData.data = await SelectFactureCamion(factId, 'cosmetique')
                    clientData.stock = await FetchStock(clientData.data[0].Articles)
                    clientData.Depotstock = await FetchAnasloumaStock(clientData.data[0].Articles,'cosmetique')
                    break;

                  default:
                    clientData.data = await SelectFactureBE(factId)
                    clientData.stock = await FetchStock(clientData.data[0].Articles)
                    clientData.Depotstock = await FetchAnasloumaStock(clientData.data[0].Articles,'cosmetique')
              }


            res.send(clientData)
          }
          query();               
    })

    /* Ajouter client */
    Magazin.post('/fournisseur/ajouter', (req, res) => {
      (async() => {
        let PID = req.body.PID;
        let frsD = req.body.fournisseurData
        let CID = await GenerateID(1111111111,'fournisseur','Four_ID');
        let Today = new Date().toISOString().split('T')[0]
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
        let sql = `INSERT INTO fournisseur (PID, Releted_PID, Four_ID, Four_Code_Fiscale, Four_Name, Four_Phone, Articles_Genre, Four_Gouv, Four_Deleg, Four_Adress, Jour_Periodique, Four_State, Four_Lng, Four_Lat)
                   VALUES (${PID},'${frsD.Releted_PID}', ${CID},'${frsD.Code_Fiscale}','${frsD.Name}','${frsD.Phone}', '', '${frsD.Gouv}','${frsD.Deleg}','${frsD.Adress}','Lundi','','0','0');`;
            connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
             res.json(rows);
            })
        })()      
    })

    //check article in abyedhDB */
    Magazin.post('/fournisseur/checkAbyedhDb', (req, res) => {
          let PID = req.body.PID;
          connection.changeUser({database : 'dszrccqg_directory'}, () => {});
          let sql = `SELECT * FROM 08_vente_en_gros `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows[0]);
          })
              
    })

    /* modifier un client */
    Magazin.post('/fournisseur/modifier', (req, res) => {
        let PID = req.body.PID;
        let frsD = req.body.fournisseurData
        connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE clients
                  SET Name = '${frsD.Name}',  Phone = '${frsD.Phone}' , Adress = '${frsD.Adress}' ,  Gouv = '${frsD.Gouv}' , Deleg = '${frsD.Deleg}' , Social_Name = '${frsD.Social_Name}'
                      WHERE CL_ID = ${frsD.CL_ID}`;
            connection.query(sql, (err, rows, fields) => {
              if (err){ throw err}
             res.json(rows);
            })     
    })

/*####################################[TOOLS]######################################*/

    /* selectioner les prix des article */
    Magazin.post('/tools/ticket/prix', (req, res) => {
          //let PID = req.body.PID;
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `SELECT * 
                     FROM outils_ticket_prix 
                     INNER JOIN articles ON outils_ticket_prix.Code = articles.A_Code `;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    /* selectinner le stock des articles */

    /* suivie d'un article  */

    /* enregistrer une note */

    /**/
    Magazin.post('/tools/export/done', (req, res) => {
      let fileName =  req.body.fileName + '-' + new Date().toLocaleDateString('fr-FR').split( '/' ).join( '-' ) + '-' + Date.now()
      let tableName =   req.body.tableName
      let conditionState =   req.body.conditionState
      const exportProcess = spawn("C:/xampp/mysql/bin/mysqldump.exe", [
        '-u',
        'root',
        'bgvckelc_magazin',
         tableName,
         '--where',
         conditionState, // Replace with your condition
        '-r',
        `C:/Users/hp/Desktop/BackUp/NouvBCK/${fileName}.sql` //C:/Users/Administrator/Desktop/BackUp/
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


/*&&&&&&&&&&&&&&&&&[PROFILE]&&&&&&&&&&&&&&&&&*/

  /* Profile Data  */
  Magazin.post('/profile', (req, res) => {
          let PID = req.body.PID;
          let Today = new Date().toISOString().split('T')[0]
          function GetGeneralData() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                    let sql = `SELECT * FROM 08_vente_en_gros `;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows);
                    })
            });
          }
          function GetPasswordData() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_registration'}, () => {});
                    let sql = `SELECT * FROM system_login  ;`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows);
                    })
            });
          }
          function GetRating() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                    let sql = `SELECT * FROM dszrccqg_directory.000_abyedh_profile_avis 
                               INNER JOIN dszrccqg_profile.user_general_data ON dszrccqg_directory.000_abyedh_profile_avis.UID = dszrccqg_profile.user_general_data.UID 
                               WHERE  dszrccqg_directory.000_abyedh_profile_avis.PID = '${PID}';`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows);
                    })
            });
          }
          function GetImages() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                    let sql = `SELECT * FROM 000_abyedh_profile_photoes  ;`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows);
                    })
            });
          }
          function GetLikes() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                    let sql = `SELECT * FROM dszrccqg_profile.dash_favorite  
                               INNER JOIN dszrccqg_profile.user_general_data ON dszrccqg_profile.dash_favorite.UID = dszrccqg_profile.user_general_data.UID 
                                WHERE  dszrccqg_profile.dash_favorite.PID = '${PID}';`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows);
                    })
            });
          }
          function GetHoraire() {
              return new Promise((resolve, reject) => {
                connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                let sql = `SELECT * FROM 000_abyedh_profile_horaires  `;
                 connection.query(sql, (err, rows, fields) => {
                    if (err) return reject(err);
                    resolve(rows);
                })
              });
          }

          // Call, Function
          async function query() {
                let main = {};
                main.general = await GetGeneralData(); 
                main.password = await GetPasswordData(); 
                main.review = await GetRating(); 
                main.images = await GetImages(); 
                main.likes = await GetLikes(); 
                main.horaire = await  GetHoraire(); 
            res.send(main)
          }
          query(); 
  })

  Magazin.post('/profile/print', (req, res) => {
        let PID = req.body.PID;
        connection.changeUser({database : 'dszrccqg_directory'}, () => {});
        let sql = `SELECT * FROM 08_vente_en_gros `;
         connection.query(sql, (err, rows, fields) => {
          if (err){ res.json(err)}
          res.json(rows);
        })
  })

  /* modifier Images */
  Magazin.post('/profile/images/ajouter', upload.single("ProfileImage"), (req, res) => {
          let PID = req.body.PID;
          let ImgPID = req.body.PID
          let link = req.file.filename;
          let dest = JSON.stringify(req.file.destination);
          connection.changeUser({database : 'dszrccqg_directory'}, () => {});
          let sql = `UPDATE profile_photoes
                     SET ImageLink = '${link}'
                      AND ImageTag = '${ImgTag}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(req.body);
          })        
  })


  /* Modifier Profle Data  */
  Magazin.post('/profile/update/general', (req, res) => {
        let PID = req.body.PID
        let profileD = req.body.profileDataSent
        connection.changeUser({database : 'dszrccqg_directory'}, () => {});
        let sql = `UPDATE 08_vente_en_gros
                   SET Genre = '${profileD.Genre}', Gouv = '${profileD.Gouv}' ,  Deleg = '${profileD.Deleg}' ,  Phone = '${profileD.Phone}' , Matricule_F  = '${profileD.Matricule_F}', Name = '${profileD.Name}' , Localite = '${profileD.Adress}' ,  Adress = '${profileD.Adress}' 
                   WHERE  PID = '${PID}' `;
         connection.query(sql, (err, rows, fields) => {
          if (err){res.json(err)}
            res.json(rows);
          })         
  })

  /* Modifier Password   */
  Magazin.post('/profile/update/password', (req, res) => {
          let PID = req.body.PID
          let passwordD = req.body.passwordDataSent
          connection.changeUser({database : 'dszrccqg_registration'}, () => {});
          let sql = `UPDATE system_login
                     SET Identification = '${passwordD.Identification}', PasswordSalt = '${passwordD.PasswordSalt}'
                      AND SystemKey = 'PTVGros' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })         
  })

  /* Modifier Horaire   */
  Magazin.post('/profile/update/position', (req, res) => {
          let PID = req.body.PID
          let positionD = req.body.positionDataSent
          connection.changeUser({database : 'dszrccqg_directory'}, () => {});
          let sql = `UPDATE 08_vente_en_gros
                     SET Lat = '${positionD[0]}', Lng = '${positionD[1]}' 
                     WHERE  PID = '${PID}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })         
  })

  /* Modifier Images   */
  /* Repler Comment   */
  /* Modifier Tarife  */

/*&&&&&&&&&&&&&&&&&[SETTING]&&&&&&&&&&&&&&&&&*/

  Magazin.post('/parametre', (req, res) => {
          let PID = req.body.PID;
          let Today = new Date().toISOString().split('T')[0]
          function GetConfirmation() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_directory'}, () => {});
                    let sql = `SELECT * FROM 08_vente_en_gros `;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows[0]);
                    })
            });
          }
          function GetActivation() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'dszrccqg_registration'}, () => {});
                    let sql = `SELECT * FROM system_activation  ;`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows[0]);
                    })
            });
          }
          function GetSetting() {
            return new Promise((resolve, reject) => {
                    connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                    let sql = `SELECT * FROM  setting ;`;
                     connection.query(sql, (err, rows, fields) => {
                      if(err) return reject(err);
                      resolve(rows[0]);
                    })
            });
          }

          // Call, Function
          async function query() {
                let main = {};
                main.confirmation = await  GetConfirmation(); 
                main.activation = await GetActivation(); 
                main.setting = await GetSetting(); 
            res.send(main)
          }
          query(); 
  })

  /* Update Setting   */
  Magazin.post('/parametre/update', (req, res) => {
          let PID = req.body.PID
          let settingD = req.body.settingDataSent
          let genre = req.body.genre
          connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
          let sql = `UPDATE setting
                     SET ${genre} = '${settingD}' 
                     WHERE  PID = '${PID}' `;
           connection.query(sql, (err, rows, fields) => {
            if (err){res.json(err)}
              res.json(rows);
            })         
  })

/*&&&&&&&&&&&&&&&&&[MESSAGES]&&&&&&&&&&&&&&&&*/

    //*selectionner message */
    Magazin.post('/messages', (req, res) => {
           let PID = req.body.PID
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `SELECT *  FROM message_conversations   ORDER BY StartedAt ASC`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    //*selectionner message */
    Magazin.post('/message', (req, res) => {
           let PID = req.body.PID
           let MID = req.body.MID
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `SELECT *  FROM message_conversations   ORDER BY Sent_Date ASC, Sent_Time ASC`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ throw err}
            res.json(rows);
          })
              
    })

    /* ajouter un messages */
    Magazin.post('/message/ajouter', (req, res) => {
         let Today = new Date().toISOString().split('T')[0]
         let ToTime = new Date().toLocaleTimeString([],{ hourCycle: 'h23'})
           let PID = req.body.PID
           let MID  = Math.floor(Math.random() * 10000000000);
           let msgD = req.body.msgC; //JSON.stringify(req.body.msgC)
           connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
           let sql = `INSERT INTO system_messages(M_ID,Sender_Genre,Sender,SystemTag,Content,Sent_Date,Sent_Time)
                  VALUES(${MID},'SYSTEM','SYSTEM','${TAG}', '${msgD}' ,'${Today}','${ToTime}')`;
           connection.query(sql, (err, rows, fields) => {
            if (err){ res.json(err)}
            res.json(rows);
          })
              
    })

/*&&&&&&&&&&&&&&&&&[NOTIFICATION]&&&&&&&&&&&&*/

/* selectioner les notification recentte*/

/*&&&&&&&&&&&&&&&&&[Mettre A Jour]&&&&&&&&&&&&&&*/
    /* fetch main Tools */
    Magazin.post('/update', (req, res) => {
         let PID = req.body.PID
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
          function FetchStockFamille() {
            return new Promise((resolve, reject) => {
                connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM articles_genre  WHERE 1 `;
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
          function FetchCommande() {
            return new Promise((resolve, reject) => {
              connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM commandes WHERE  1 `;
               connection.query(sql, (err, rows, fields) => {
                 if (err) return reject(err);
                 resolve(rows);
                })
              })
          }
          function FetchCamion() {
            return new Promise((resolve, reject) => {
              connection.changeUser({database : 'bgvckelc_magazin'}, () => {});
                let sql = `SELECT * FROM caises WHERE  1 `;
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

module.exports = Magazin