const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const updateEtude = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        
        const Selectquery = 'select * from bv_etude where id_action_impactee= ? and type_etude=?';
        const valuesS = [req.body.id_action_impactee,req.body.type_etude];
        const [select] = await db.promise().query(Selectquery, valuesS);
       if(select.length>0) 
       {
        const updateQueryBuilder = (reqBody) => {
          let updateQuery = "UPDATE `bv_etude` SET";
          let values = [];
          let fieldsToUpdate = [];
        
          // Check each field if it's not empty, then include it in the update query
          if (reqBody.type_etude !== "") {
            fieldsToUpdate.push("`type_etude`=?");
            values.push(reqBody.type_etude);
          }
          if (reqBody.date_lancement !== "") {
            fieldsToUpdate.push("`date_lancement`=?");
            values.push(reqBody.date_lancement);
          }
          if (reqBody.date_remise_prov !== "") {
            fieldsToUpdate.push("`date_remise_prov`=?");
            values.push(reqBody.date_remise_prov);
          }
          if (reqBody.date_validation !== "") {
            fieldsToUpdate.push("`date_validation`=?");
            values.push(reqBody.date_validation);
          }
          if (reqBody.date_remise_final !== "") {
            fieldsToUpdate.push("`date_remise_final`=?");
            values.push(reqBody.date_remise_final);
          }
          if (reqBody.faisable !== "") {
            fieldsToUpdate.push("`faisable`=?");
            values.push(reqBody.faisable);
          }
          if (reqBody.description !== "") {
            fieldsToUpdate.push("`description`=?");
            values.push(reqBody.description);
          }
          if (reqBody.milieux_physique !== "") {
            fieldsToUpdate.push("`milieux_physique`=?");
            values.push(reqBody.milieux_physique);
          }
          if (reqBody.objectif !== "") {
            fieldsToUpdate.push("`objectif`=?");
            values.push(reqBody.objectif);
          }
          if (reqBody.contrainte_non_fais !== "") {
            fieldsToUpdate.push("`contrainte_non_fais`=?");
            values.push(reqBody.contrainte_non_fais);
          }
          if (reqBody.detail !== "") {
            fieldsToUpdate.push("`detail`=?");
            values.push(reqBody.detail);
          }
        
          // Ensure we have at least one field to update
          if (fieldsToUpdate.length === 0) {
            throw new Error("No valid fields provided for update.");
          }
        
          // Join the fields and complete the query
          updateQuery += ` ${fieldsToUpdate.join(", ")} WHERE id_etude=?`;
          values.push(reqBody.id_etude); // Add the id_etude to the values array
        
          return { updateQuery, values };
        };
        
        // Usage example
        const { updateQuery, values } = updateQueryBuilder(req.body);
        const [update] = await db.promise().query(updateQuery, values);
        
   
        if (update.affectedRows === 1) {
         res.json('true');
       } else {
         res.json('false');
       }
       }
    
    
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }

const getEtude=async(req,res)=>
  {
    try {
      await verifyJWT(req, res, async () => {
        const structure=req.structure
        const wilaya = req.wilaya
        let selectQuery
        if(structure=="DGF")
        {
     [selectQuery] = await db.promise().query(`SELECT id_etude , LOCALITES,type_etude,wilaya_name_ascii,commune_name_ascii,
                           UNITE ,VOLUME_VALIDE,action FROM bv_etude
                          join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                          join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                          join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                          join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                          join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                          WHERE bv_action_pro_programme.id_marche=?
                          and date_remise_prov is not null and date_remise_final is null and id_pv_pro is null `,[req.body.IDMarche])
     }else
     {
      [selectQuery] = await db.promise().query(`SELECT id_etude , LOCALITES,type_etude,wilaya_name_ascii,commune_name_ascii,
        UNITE ,VOLUME_VALIDE,action FROM bv_etude
       join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
       join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
       join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
       join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
       join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
       WHERE bv_action_pro_programme.id_marche=? and bv_action_impactee.INSTITUTION_PILOTE=? and bv_action_impactee.code_wilaya=?
       and date_remise_prov is not null and date_remise_final is null and id_pv_pro is null `,[req.body.IDMarche,structure,wilaya])

     }
     res.json(selectQuery)
    
      })
    }
    catch{
      console.error(error);
      res.status(500).json({ error: error });
    }
  }

const addPvProv=async(req,res)=>
    {
      try {
        await verifyJWT(req, res, async () => {
          if (!req.body.selectedetude || req.body.selectedetude == []) {
            res.json("empty");
          } else {
            var selectedetude = req.body.selectedetude;
            let [insert] = await db
            .promise()
            .query(`INSERT INTO bv_pv_provesoir_etude VALUES ()`);
                 if (insert.affectedRows === 1) {
                 const insertedId = insert.insertId;
                for (let i = 0; i < selectedetude.length; i++) {
                  [update] = await db
                  .promise()
                  .query(
                  `UPDATE bv_etude SET id_pv_pro  = ? where id_etude = ?`,
                  [insertedId, selectedetude[i].id_etude]
                  );
                 }
                 res.json("true");
        }
        }
        })
      }
      catch{
        console.error(error);
        res.status(500).json({ error: error });
      }
    }
 const getPvProvesoire=async(req,res)=>
      {
        try {
          await verifyJWT(req, res, async () => {
            const [selectQuery] = await db.promise().query(`
              SELECT * 
              FROM bv_etude 
              JOIN bv_pv_provesoir_etude 
                ON bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
              JOIN bv_action_impactee 
                ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
              JOIN bv_entreprise_realisation 
                ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise
              JOIN bv_action_pro_programme 
                ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              JOIN bv_commune 
                ON bv_commune.id = bv_action_impactee.code_commune 
              JOIN bv_wilaya 
                ON bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
              JOIN bv_action_programme 
                ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme 
              WHERE bv_action_pro_programme.id_marche = ? 
                AND bv_etude.id_pv_pro IS NOT NULL
            `, [req.body.IDMarche]);
            



                              const result = selectQuery.reduce((acc, curr) => {
                                const existingItem = acc.find(item => item.id_pv_pro === curr.id_pv_pro);
                                if (existingItem) {
                                    const communeIndex = existingItem.liste.findIndex(entry => entry.commune_name_ascii === curr.commune_name_ascii);
                                    if (communeIndex !== -1) {
                                        existingItem.liste[communeIndex].LOCALITES.push(curr.LOCALITES);
                                    } else {
                                        existingItem.liste.push({ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] });
                                    }
                                } else {
                                    acc.push({
                                        id_pv_pro:curr.id_pv_pro,
                                        num_pv:curr.num_pv,
                                        libelle:curr.libelle,
                                        INSTITUTION_PILOTE:curr.INSTITUTION_PILOTE,
                                        action: curr.action,
                                        wilaya_name_ascii: curr.wilaya_name_ascii,
                                        liste: [{ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] }]
                                    });
                                }
                                return acc;
                            }, []);


           
         res.json(result)
        
          })
        }
        catch{
          console.error(error);
          res.status(500).json({ error: error });
        }
      }
  
 const getPvProvesoireDetail=async(req,res)=>
        {
          try {
           await verifyJWT(req, res, async () => {
            const [infopv] = await db.promise().query(`
              SELECT 
                  signataire, num_pv,
                  INSTITUTION_PILOTE, 
                  bv_pv_provesoir_etude.date, 
                  wilaya_name_ascii, 
                  intitule_marche, 
                  num_marche, 
                  bv_marche.date_notification_ods, 
                  bv_marche.cocontractant,
                  latest_avenant.* 
              FROM bv_etude 
              JOIN bv_pv_provesoir_etude ON bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
              JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
              JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              JOIN bv_commune ON bv_commune.id = bv_action_impactee.code_commune 
              JOIN bv_wilaya ON bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
              JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme 
              JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
              JOIN (
                  SELECT * 
                  FROM bv_avenant 
                  WHERE id_Avenant IN (
                      SELECT id_Avenant 
                      FROM bv_avenant 
                      WHERE IDMarche = ?
                  )
              ) AS latest_avenant ON bv_marche.IDMarche = latest_avenant.IDMarche
              WHERE bv_etude.id_pv_pro = ?
          `, [req.body.IDMarche, req.body.id_pv_pro]);
    

           const [detailpv]= await db.promise().query(`
            SELECT * FROM bv_etude 
                   join bv_pv_provesoir_etude on bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
                   join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                   join bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                   join bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                   join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                   join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                   WHERE bv_etude.id_pv_pro =?`,[req.body.id_pv_pro])
                   res.json({infopv:infopv[0],detailpv:detailpv})
            })
          }
          catch{
            console.error(error);
            res.status(500).json({ error: error });
          }
        }
   
  const UpdatePvProvesoire=async(req,res)=>
    {
      try {
        await verifyJWT(req, res, async () => {
         if(req.body.date && req.body.signataire)
          {
         const [update] = await db.promise().query(`UPDATE bv_pv_provesoir_etude set signataire=?,date=? ,num_pv = ? WHERE id_pv_pro=?`,
          [req.body.signataire,req.body.date,req.body.num_pv,req.body.id_pv_pro])
         res.json("true")

          }
        })
      }
      catch
      {
        console.error(error);
        res.status(500).json({ error: error });
      }

    }

    const getEtudePaiment=async(req,res)=>
      {
        try {
          await verifyJWT(req, res, async () => {
            const structure=req.structure
            const wilaya = req.wilaya
            let selectQuery
            if(structure=="DGF")
            {
         [selectQuery] = await db.promise().query(`SELECT id_etude , LOCALITES,type_etude,wilaya_name_ascii,commune_name_ascii,
                               UNITE ,VOLUME_VALIDE,action FROM bv_etude
                              join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                              join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                              join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                              join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                              join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                              WHERE bv_action_pro_programme.id_marche=?
                              and date_remise_prov is not null and date_remise_final is null and id_pv_pro is null
                              and id_sit is null `,[req.body.IDMarche])
         }else
         {
          [selectQuery] = await db.promise().query(`SELECT id_etude , LOCALITES,type_etude,wilaya_name_ascii,commune_name_ascii,
            UNITE ,VOLUME_VALIDE,action FROM bv_etude
           join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
           join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
           join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
           join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
           join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
           WHERE bv_action_pro_programme.id_marche=? and bv_action_impactee.INSTITUTION_PILOTE=? and bv_action_impactee.code_wilaya=?
           and date_remise_prov is not null and date_remise_final is null and id_pv_pro is null
           and id_sit is null `,[req.body.IDMarche,structure,wilaya])
    
         }
         res.json(selectQuery)
        
          })
        }
        catch{
          console.error(error);
          res.status(500).json({ error: error });
        }
      }

  const addSituation=async(req,res)=>
        {
          try {
            await verifyJWT(req, res, async () => {
              if (!req.body.selectedetude || req.body.selectedetude == []) {
                res.json("empty");
              } else {
                var selectedetude = req.body.selectedetude;
                let [insert] = await db
                .promise()
                .query(`INSERT INTO bv_situation VALUES ()`);
                     if (insert.affectedRows === 1) {
                     const insertedId = insert.insertId;
                    for (let i = 0; i < selectedetude.length; i++) {
                      [update] = await db
                      .promise()
                      .query(
                      `UPDATE bv_etude SET id_sit = ? where id_etude = ?`,
                      [insertedId, selectedetude[i].id_etude]
                      );
                     }
                     res.json("true");
            }
            }
            })
          }
          catch{
            console.error(error);
            res.status(500).json({ error: error });
          }
        }
  const getSituation=async(req,res)=>
          {
            try {
              await verifyJWT(req, res, async () => {
             const [selectQuery] = await db.promise().query(`SELECT * FROM bv_etude 
                                  join bv_situation on bv_situation.ID_situation = bv_etude.id_sit
                                  join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                                  join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                                  join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                                  join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                                  join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                                  WHERE bv_action_pro_programme.id_marche=?
                                  and  bv_etude.id_sit is not null `,[req.body.IDMarche])
    
    
    
                                  const result = selectQuery.reduce((acc, curr) => {
                                    const existingItem = acc.find(item => item.id_pv_pro === curr.id_pv_pro);
                                    if (existingItem) {
                                        const communeIndex = existingItem.liste.findIndex(entry => entry.commune_name_ascii === curr.commune_name_ascii);
                                        if (communeIndex !== -1) {
                                            existingItem.liste[communeIndex].LOCALITES.push(curr.LOCALITES);
                                        } else {
                                            existingItem.liste.push({ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] });
                                        }
                                    } else {
                                        acc.push({
                                            id_sit:curr.id_sit,
                                            INSTITUTION_PILOTE:curr.INSTITUTION_PILOTE,
                                            action: curr.action,
                                            wilaya_name_ascii: curr.wilaya_name_ascii,
                                            liste: [{ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] }]
                                        });
                                    }
                                    return acc;
                                }, []);
    
    
               
             res.json(result)
            
              })
            }
            catch{
              console.error(error);
              res.status(500).json({ error: error });
            }
          }

 const getDetailDecompte = async (req, res) => {
          try {
            await verifyJWT(req, res, async () => {
              const [decomptglobal] = await db
              .promise()
              .query(
                `SELECT bv_action_programme.action, 
                        bv_wilaya.wilaya_name_ascii,
                        bv_etude.type_etude,
                        bv_etude.cout,
                        bv_action_impactee.VOLUME_VALIDE,
                        bv_action_impactee.UNITE,
                        bv_action_impactee.id_action_impactee,bv_action_impactee.INSTITUTION_PILOTE
                 from bv_etude 
                 LEFT JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
                  JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                  JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
                  JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                 LEFT JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                 LEFT JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                 WHERE bv_marche.IDMarche = ?`, 
                [req.body.IDMarche]
              );
            
              const [decomptsituation] = await db
              .promise()
              .query(
                `SELECT bv_action_programme.action, 
                        bv_wilaya.wilaya_name_ascii,
                        bv_etude.type_etude,bv_action_impactee.INSTITUTION_PILOTE,
                        bv_etude.cout,
                        bv_action_impactee.VOLUME_VALIDE,
                        bv_action_impactee.UNITE,
                        bv_action_impactee.id_action_impactee
                 from bv_etude 
                 LEFT JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
                  JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                  JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
                  JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                 LEFT JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                 LEFT JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                 WHERE bv_etude.id_sit = ?`, 
                [req.body.id_sit]
              );


              const result = {};

              // Parcourir le tableau pour calculer les volumes totaux et réalisés, puis regrouper par wilaya et type_etude
              decomptglobal.forEach(item => {
                const wilaya = item.wilaya_name_ascii;
                const typeEtude = item.type_etude;
                const volumeValide = parseFloat(item.VOLUME_VALIDE);
              
                // Si la wilaya n'existe pas encore dans result, l'initialiser
                if (!result[wilaya]) {
                  result[wilaya] = [];
                }
              
                // Chercher si un type_etude correspondant existe déjà dans la wilaya
                let etudeEntry = result[wilaya].find(entry => entry.type_etude === typeEtude && entry.UNITE === item.UNITE);
              
                // Si le type_etude n'existe pas, créer une nouvelle entrée
                if (!etudeEntry) {
                  etudeEntry = {
                    type_etude: typeEtude,
                    UNITE: item.UNITE,
                    cout:item.cout,
                    action:item.action,
                    INSTITUTION_PILOTE: item.INSTITUTION_PILOTE,
                    volumeTotal: 0,
                    volumeRealise: 0
                  };
                  result[wilaya].push(etudeEntry);
                }
              
                // Ajouter au volume total
                etudeEntry.volumeTotal += volumeValide;
              
                // Vérifier si l'id_action_impactee est dans decomptsituation pour mettre à jour le volume réalisé
                const isRealise = decomptsituation.some(t2 => t2.id_action_impactee === item.id_action_impactee);
                if (isRealise) {
                  etudeEntry.volumeRealise += volumeValide;
                }
              });
              
              // Afficher les résultats
             // console.log(result);
              res.json(result); // Envoyer le résultat en réponse JSON
              
               
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
          }
        };

  const setsituationEtude = async (req, res) => {
          try {
            await verifyJWT(req, res, async () => {
              const tableauResultats = req.body.detail;
              let totalRealiseSum = 0;

              // Convert `tableauResultats` to an array if it’s an object
              const resultsArray = Array.isArray(tableauResultats) ? tableauResultats : Object.values(tableauResultats);
              
              resultsArray.forEach(resultArray => {
                resultArray.forEach(item => {
                  if (item.volumeRealise !== null && item.volumeRealise !== undefined && item.volumeRealise > 0) {
                    totalRealiseSum += item.volumeRealise * item.cout;
                  }
                });
              });
              
              //Fetch retenu_garantie from bv_marche
              const [marcheQuery] = await db.promise().query(
                `SELECT retenu_garantie FROM bv_marche WHERE IDMarche = ?`,
                [req.body.IDMarche]
              );

              const [montant_antr] = await db.promise().query(
                `SELECT sum(montant_situation) as sum FROM bv_situation 
                join bv_etude on bv_situation.ID_situation=bv_etude.id_sit
                 JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
                  JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                  JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
                 WHERE IDMarche = ? and bv_situation.ID_situation < ?`,
                [req.body.IDMarche,req.body.id_sit]
              );
              const MontantAntrSum = montant_antr[0].sum;  
              const totalCumule = totalRealiseSum + MontantAntrSum;
              const retenuGarantie = totalRealiseSum * marcheQuery[0].retenu_garantie / 100;

              //Update bv_asf with calculated values

              const [situationQuery] = await db.promise().query(
                `UPDATE bv_situation SET 
                  montant_cumule = ?, 
                  montant_precedent = ?, 
                  montant_situation = ?, 
                  montant_avance_forf = ?, 
                  montant_avance_apro = ?, 
                  montant_retenue_garanti = ?, 
                  montant_retenu_garanti_prec = ? 
                  WHERE ID_situation = ?`,
                [
                  totalCumule,
                  MontantAntrSum,
                  totalRealiseSum,
                  null, // montant_avance_forf placeholder
                  null, // montant_avance_apro placeholder
                  retenuGarantie,
                  null, // montant_retenu_garantie_pre placeholder
                  req.body.id_sit
                ]
              );
              if(situationQuery.affectedRows==1)
               { res.json("true");}
             
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
          }
        };

        const setInfSituation = async (req, res) => {
          try {
            await verifyJWT(req, res, async () => {
         
              const [montantAsf] = await db.promise().query(`select montant_situation from bv_situation where ID_situation=?`,[req.body.id_sit]);
              
              const [situationQuery] = await db.promise().query(
                `UPDATE bv_situation SET 
                num_situation = ?, 
                pourcentage_apro = ?, 
                pourcentage_forf = ?,
                montant_avance_forf=?,
                montant_avance_apro=?,
                date_situation=?
                WHERE ID_situation = ?`,
                [
                  req.body.num_situation,
                  req.body.pourcentage_apro,
                  req.body.pourcentage_forf,
                  montantAsf[0].montant_situation* req.body.pourcentage_forf/100,
                  montantAsf[0].montant_situation* req.body.pourcentage_apro/100,
                  req.body.date_situation,
                  req.body.id_sit
                ]
              );
              if(situationQuery.affectedRows==1)
               { res.json("true");}
              else{
                res.json("false");
              }
             
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
          }
        };

        const getSituationDetail = async (req, res) => {
          try {
            await verifyJWT(req, res, async () => {
              const [getSituation] = await db.promise().query(`
                SELECT
                    bv_situation.montant_retenu_garanti_prec,
                    bv_situation.pourcentage_apro,
                    bv_marche.visa_commission,
                    bv_situation.num_situation,
                    bv_marche.mode_passation,
                    bv_situation.pourcentage_forf,
                    bv_situation.date_situation,
                    bv_situation.montant_retenue_garanti,
                    bv_situation.montant_avance_forf,
                    bv_situation.montant_situation,
                    bv_situation.montant_precedent,
                    bv_situation.montant_avance_apro,
                    bv_situation.montant_cumule,
                    bv_marche.compte_bancaire_cocontr,
                    bv_marche.objet,
                    bv_marche.num_marche,
                    bv_marche.montant_ttc,
                    bv_marche.matricul_fiscal_cocontr,
                    bv_marche.regitre_commerce_cocotra,
                    bv_marche.rais_soc_add_cocotract,
                    bv_marche.contractant,
                    bv_marche.cocontractant,
                    bv_marche.date_notification_ods,
                    dernier_avenant.cocontractant AS dernier_cocontractant,
                    dernier_avenant.contractant AS dernier_contractant,
                    dernier_avenant.montant_ttc AS dernier_montant_ttc ,
                    dernier_avenant.date_notif_ods AS dernier_date_notif_ods,
                    dernier_avenant.id_avenant AS dernier_id_avenant,
                   dernier_avenant.num_avenant AS dernier_num_avenant
                FROM bv_situation
                join bv_etude on bv_etude.id_sit = bv_situation.ID_situation
                LEFT JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
                LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                LEFT JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche 
                LEFT JOIN (
                    SELECT
                        *,
                        MAX(id_Avenant) AS dernier_id_Avenant
                    FROM bv_avenant
                    GROUP BY IDMarche
                ) derniers_avenants ON bv_marche.IDMarche = derniers_avenants.IDMarche
                 
                LEFT JOIN bv_avenant dernier_avenant ON derniers_avenants.IDMarche = dernier_avenant.IDMarche 
                    AND derniers_avenants.dernier_id_Avenant = dernier_avenant.id_Avenant
                WHERE bv_situation.ID_situation = ?
            `, [req.body.id_sit]);
            
            const [memoire]=  await db.promise().query(`select sum(montant_avance_forf) as cumuleforf,
                                                               sum(montant_avance_apro) as cumuleappro,
                                                               sum(montant_retenue_garanti) as cumuleretenu
                FROM bv_situation
                join bv_etude on bv_etude.id_sit = bv_situation.ID_situation
                LEFT JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
                LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                LEFT JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche 
                where bv_marche.IDMarche=? and bv_situation.date_situation <= ? `,[req.body.IDMarche,getSituation[0].date_situation])
            
                const result = { ...getSituation[0], ...memoire[0] };

                res.json(result);
          
             
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
          }
        };
  
  module.exports={getSituationDetail,setInfSituation,getSituation,updateEtude,getEtude,addPvProv,getPvProvesoire,getPvProvesoireDetail,UpdatePvProvesoire,getEtudePaiment,addSituation,getDetailDecompte,setsituationEtude}