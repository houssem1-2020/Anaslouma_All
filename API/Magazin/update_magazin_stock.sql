-- GET FILE FROM OLD CSERVER 
  -- a get codea, desig, prix_a_ttc, prix2 
  -- b export from 1 to 6550 , and from 6551 to 13100
  -- c 

  
-- EMPTY NOW articles TABLE 
-- CHANGE TYPE TO varchar of Prix_achat AND Prix_vente
-- IMPORT THE TABLE 

-- CONVERT 3,14 to 3.14 
UPDATE articles SET `Prix_vente` = REPLACE(CAST(`Prix_vente` AS CHAR), ',', '.') WHERE `Prix_vente` LIKE '%,%';
UPDATE articles SET `Prix_achat` = REPLACE(CAST(`Prix_achat` AS CHAR), ',', '.') WHERE `Prix_achat` LIKE '%,%';

-- ADD NEW Prix_achat_new Prix_vente_new [float]
ALTER TABLE articles ADD COLUMN Prix_vente_new FLOAT;
ALTER TABLE articles ADD COLUMN Prix_achat_new FLOAT;

-- UPDATE NEW FROM OLD 
UPDATE articles SET Prix_vente_new = CAST(Prix_vente AS DOUBLE);
UPDATE articles SET Prix_achat_new = CAST(Prix_achat AS DOUBLE);

-- ADD GENRES 
UPDATE articles
JOIN articles_old ON articles.A_Code = articles_old.A_Code
SET articles.Genre = articles_old.Genre;

-- EXPORT AND IMPORT TO SERVER 


-- remove all (')
UPDATE articles SET `Name` = REPLACE(`Name`, "'", "");