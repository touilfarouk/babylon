const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");
const addAsf = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
         const wilaya = req.wilaya;
         const structure=req.structure;
        if (!req.body.selectedattachement || req.body.selectedattachement == []) {
          res.json("empty");
        } else {
       
            [insert] = await db
            .promise()
            .query(`INSERT INTO bv_asf (signataire,conf) VALUES (?,?)`,[null,null]);
          if (insert.affectedRows === 1) {
            var att = req.body.selectedattachement;
            const insertedId = insert.insertId;
            for (i = 0; i < att.length; i++) {
              var AttId = att[i].id_attachement;
              [update] = await db
                .promise()
                .query(
                  `UPDATE bv_attachement SET id_asf=? where id_attachement =?`,
                  [insertedId, AttId]
                );     
            }
            //select the impact of this asf
            const [idimpactRows]= await db.promise().query(`
            select DISTINCT bv_action_impactee.id_action_impactee from bv_action_impactee
            where bv_action_impactee.code_wilaya =? and bv_action_impactee.INSTITUTION_PILOTE=? `,[wilaya,structure]);
           const idimpact = idimpactRows.map(row => row.id_action_impactee);
          
           const resulasf=[]
            for (const id of idimpact)
              {
                const [inforealisation] = await db.promise().query(`
                SELECT bv_action_impactee.id_pro_action_programme, bv_tache.intitule_tache, bv_phase.num_phase, SUM(bv_realisation.volume_realise) AS real_antr_asf 
                FROM bv_attachement 
                 JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
                 JOIN bv_tache ON bv_tache.id_tache = bv_realisation.id_tache 
                 JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase
                JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
                WHERE bv_attachement.id_asf <> ? AND bv_attachement.id_asf IS NOT NULL AND bv_action_impactee.id_action_impactee = ?
                GROUP BY bv_tache.intitule_tache, bv_phase.num_phase
              `, [insertedId, id]);
              
              if (inforealisation.length > 0) 
                {
                resulasf.push(inforealisation);
              }  
              }
          
       const sumByTaskPhase = {};
// Parcourir chaque sous-tableau dans les résultats
resulasf.forEach(subArray => {
  subArray.forEach(task => {
    const { intitule_tache, num_phase, real_antr_asf ,id_pro_action_programme} = task;
    const key = `${intitule_tache}_${num_phase}_${id_pro_action_programme}`;
    // Si la clé n'existe pas encore, l'initialiser avec la valeur de real_antr_asf
    if (!sumByTaskPhase[key]) {
      sumByTaskPhase[key] = real_antr_asf;
    } else {
      // Sinon, ajouter la valeur de real_antr_asf à la somme existante
      sumByTaskPhase[key] += real_antr_asf;
    }
  });
});
console.log('-----------------------------------------')
console.log(sumByTaskPhase)
// Convertir l'objet en tableau d'objets avec intitule_tache, num_phase et somme
const summedResults = Object.keys(sumByTaskPhase).map(key => {
  const [intitule_tache, num_phase,id_pro_action_programme] = key.split('_');
  return {
    intitule_tache,
    num_phase: parseInt(num_phase), // Convertir num_phase en nombre entier
    id_pro_action_programme,
    sum_real_antr_asf: sumByTaskPhase[key]
  };
});
console.log('-----------------------------')
         for (const row of summedResults) {
              const { sum_real_antr_asf, intitule_tache ,num_phase} = row; // Extraire les valeurs de chaque ligne de inforealisation
              const [selectRealisation]=await db.promise().query(`select bv_realisation.id_realisation from  bv_realisation
              JOIN bv_attachement ON bv_attachement.id_attachement = bv_realisation.id_attachement
              JOIN bv_tache ON bv_tache.id_tache = bv_realisation.id_tache
              JOIN bv_phase ON bv_phase.id_phase = bv_tache.id_phase
              JOIN bv_action_impactee on bv_phase.id_action_impactee=bv_action_impactee.id_action_impactee
              where  bv_attachement.id_asf = ? 
              AND bv_tache.intitule_tache = ?
              AND bv_phase.num_phase=?
              AND bv_action_impactee.id_pro_action_programme =?`,[insertedId, intitule_tache, num_phase, row.id_pro_action_programme]);
              if(selectRealisation.length>0){
                for (const row of selectRealisation) {
                  const [setVolumeAsf] = await db.promise().query(`
                  UPDATE bv_realisation
                  SET bv_realisation.volume_realise_antr_asf = ?
                  WHERE id_realisation = ?  
              `, [sum_real_antr_asf,row.id_realisation]);
  
              }}   
          }
            res.json({rep:"true",idAsf:insertedId});
          } else {
            res.json("false");
          }      
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  const getasf = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        // const userId = req.userId;
        let allasf;
        const structure = req.structure;
        const wilaya=req.wilaya;
        if(structure === "DGF")
          {
            [allasf] = await db
            .promise()
            .query(
              `SELECT DISTINCT bv_asf.id_asf,num_asf,date_asf,signataire,num_situation,bv_wilaya.wilaya_name_ascii FROM 
               bv_attachement left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               join bv_asf on bv_asf.id_asf= bv_attachement.id_asf
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
               left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
               left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id 
               left join bv_entreprise_realisation on bv_action_impactee.id_entreprise_realisation  = bv_entreprise_realisation.ID_entreprise  
               where bv_marche.IDMarche=?
               group by bv_asf.id_asf
               order by bv_wilaya.wilaya_name_ascii`,[req.body.IDMarche]);
          res.json( allasf );
          }
          else{
            [allasf] = await db
            .promise()
            .query(
              `SELECT DISTINCT bv_asf.id_asf,num_asf,date_asf,signataire,num_situation FROM 
               bv_attachement left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               join bv_asf on bv_asf.id_asf= bv_attachement.id_asf
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
               left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
               left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id 
               left join bv_entreprise_realisation on bv_action_impactee.id_entreprise_realisation  = bv_entreprise_realisation.ID_entreprise  
               where bv_marche.IDMarche=?
               and bv_action_impactee.INSTITUTION_PILOTE=?
               and bv_wilaya.wilaya_code = ?
               group by bv_asf.id_asf `,[req.body.IDMarche,structure,wilaya]);
          res.json( allasf );
          }
      
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };

  const getDetailAsf = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        // const userId = req.userId;
        let infasf;
        let infoatt
        const structure = req.structure;
        const wilaya=req.wilaya;
        if(structure==='DGF')
          {
            [infasf] = await db
            .promise()
            .query(
              `SELECT DISTINCT bv_marche.num_marche,bv_marche.date_notification_ods,
               bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,
               bv_asf.conf,bv_asf.num_asf,bv_asf.date_asf,bv_asf.signataire,bv_wilaya.wilaya_name_ascii, bv_action_impactee.INSTITUTION_PILOTE
               FROM bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
               left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
               left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
               left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id   
               where bv_marche.IDMarche=?
               and bv_attachement.id_asf=?
               `,[req.body.IDMarche,req.body.id_asf]);
          }
        else{
          [infasf] = await db
          .promise()
          .query(
            `SELECT DISTINCT bv_marche.num_marche,bv_marche.date_notification_ods,
             bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,
             bv_asf.conf,bv_asf.num_asf,bv_asf.date_asf,bv_asf.signataire,bv_wilaya.wilaya_name_ascii, bv_action_impactee.INSTITUTION_PILOTE
             FROM bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
             left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
             left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
             left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
             left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
             INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
             INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
             INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
             left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
             left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id   
             where bv_marche.IDMarche=?
             and bv_action_impactee.INSTITUTION_PILOTE=?
             and bv_wilaya.wilaya_code = ?
             and bv_attachement.id_asf=?
             `,[req.body.IDMarche,structure,wilaya,req.body.id_asf]);
        }


             const [avenantQuery]=await db.promise().query(`SELECT * FROM bv_marche 
                                                            join bv_avenant on bv_marche.IDMarche = bv_avenant.IDMarche 
                                                            where bv_marche.IDMarche=?
                                                            ORDER BY num_avenant DESC LIMIT 1`,[req.body.IDMarche])
        if (infasf.length > 0 && typeof infasf[0] === 'object') {
          if(avenantQuery.length>0)
            {
              infasf[0] = {
                ...infasf[0],
                num_avenant: avenantQuery[0].num_avenant,
                date_notif_ods: avenantQuery[0].date_notif_ods
                };
            }
      
              } else {
             console.error("Error: infasf[0] is not an object");
             }
             const [idimpact] = await db.promise().query(`
             select DISTINCT bv_action_impactee.id_action_impactee 
             FROM bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
             left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
             left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
             left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
             left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee
             where bv_asf.id_asf=?`,[req.body.id_asf]);
           
             const [idattach]= await db.promise().query(`
             select id_attachement from bv_attachement where id_asf=?`,[req.body.id_asf])
             const tableauAtt=[]
             for(const id of idimpact)
             {
             [infoatt]=await db.promise().query(`
             SELECT
             bv_attachement.num_attachement,
             bv_action_programme.action,bv_action_impactee.id_action_impactee,
             ROUND(SUM(bv_realisation.volume_realise), 2) as volume_realise,
             bv_realisation.volume_realise_antr,
             bv_tache.intitule_tache,
             bv_tache.unite_tache,
             bv_tache.quantite_tache,
             bv_phase.num_phase,
             bv_commune.commune_name_ascii,
             bv_action_impactee.LOCALITES
         FROM 
             bv_tache  
         JOIN 
             bv_phase ON bv_tache.id_phase = bv_phase.id_phase
         JOIN  
             bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee 
         JOIN 
             bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
         JOIN 
             bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
         JOIN 
             bv_commune ON bv_action_impactee.code_commune = bv_commune.id 
         LEFT JOIN 
             bv_realisation ON bv_tache.id_tache = bv_realisation.id_tache
         JOIN bv_attachement on bv_realisation.id_attachement = bv_attachement.id_attachement
      
         WHERE 
             bv_action_impactee.id_action_impactee = ? and  bv_attachement.id_asf=${req.body.id_asf}
         GROUP BY 
             bv_tache.id_tache , bv_realisation.id_attachement
         UNION
         SELECT  NULL as num_attachement,
             bv_action_programme.action, bv_action_impactee.id_action_impactee,
             NULL as volume_realise,
             NULL as volume_realise_antr,
             bv_tache.intitule_tache,
             bv_tache.unite_tache,
             bv_tache.quantite_tache,
             bv_phase.num_phase,
             bv_commune.commune_name_ascii,
             bv_action_impactee.LOCALITES
         FROM 
             bv_tache  
         JOIN 
             bv_phase ON bv_tache.id_phase = bv_phase.id_phase
         JOIN  
             bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee 
         JOIN 
             bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
         JOIN 
             bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
         JOIN 
             bv_commune ON bv_action_impactee.code_commune = bv_commune.id 

         WHERE 
             bv_action_impactee.id_action_impactee = ? AND
             bv_tache.id_tache NOT IN (SELECT id_tache FROM bv_realisation)
         GROUP BY 
             bv_tache.id_tache
         
             `,[id.id_action_impactee,id.id_action_impactee])
          
              tableauAtt.push(infoatt)
             }
             const tableauResultats = [];
             for (const det of infasf)
             {
              const [infotache]= await db.promise().query(`select bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase, sum(bv_tache.quantite_tache) as total
              from bv_tache left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
              left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
              left JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
              where bv_action_pro_programme.id_pro_action_pro=? and bv_action_impactee.code_wilaya =?
              group by bv_phase.num_phase,bv_tache.intitule_tache,bv_action_pro_programme.id_pro_action_pro
              `,[det.id_pro_action_pro,wilaya])
  
              const [inforealisation] = await db.promise().query(`
              SELECT
              bv_attachement.num_attachement,
              bv_tache.intitule_tache,
              bv_tache.unite_tache,
              bv_phase.num_phase,
              SUM(bv_realisation.volume_realise) AS totalrealise,
              SUM(max_realisation.max_volume_realise_antr_asf) AS totalrealiseantre,
              volume_realise_antr_asf as totalrealiseantr
          FROM
              bv_attachement
              LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement
              LEFT JOIN bv_tache ON bv_tache.id_tache = bv_realisation.id_tache
              LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase
              LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
              LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
              LEFT JOIN (
                  SELECT
                      bv_realisation.id_tache,
                      MAX(bv_realisation.volume_realise_antr_asf) AS max_volume_realise_antr_asf
                  FROM
                      bv_realisation
                      JOIN bv_attachement ON bv_realisation.id_attachement = bv_attachement.id_attachement
                  WHERE
                      bv_attachement.id_asf = ?
                  GROUP BY
                      bv_realisation.id_tache
              ) AS max_realisation ON bv_tache.id_tache = max_realisation.id_tache
          WHERE
              bv_attachement.id_asf = ? AND
              bv_action_impactee.id_pro_action_programme = ?
          GROUP BY
              bv_phase.num_phase, bv_tache.intitule_tache,bv_action_pro_programme.id_pro_action_pro
          `, [req.body.id_asf, req.body.id_asf, det.id_pro_action_pro]);
             
              const tableauFusionne = fusionnerTableaux(infotache, inforealisation);
              const actionObj = { action: det.action };
              const tableauResultat = [actionObj,...tableauFusionne];
            //  console.log(tableauResultat)
              tableauResultats.push(tableauResultat);
                }
           
             function fusionnerTableaux(tableau1, tableau2) {
              // Créer un objet pour stocker les données fusionnées
              const result = {};
            
              // Fusionner les éléments des deux tableaux
              tableau1.forEach(item => {
                const key = `${item.num_phase}_${item.intitule_tache}`;
                result[key] = result[key] || {num_attachement:null, intitule_tache: item.intitule_tache,totalrealiseantr:null, unite_tache: item.unite_tache, num_phase: item.num_phase, total: null, totalrealise: null };
                result[key].total = item.total;
              });
            
              tableau2.forEach(item => {
                const key = `${item.num_phase}_${item.intitule_tache}`;
                result[key] = result[key] || {num_attachement:null, intitule_tache: item.intitule_tache,totalrealiseantr:null, unite_tache: item.unite_tache, num_phase: item.num_phase, total: null, totalrealise: null };
                result[key].totalrealise = item.totalrealise;
                result[key].totalrealiseantr=item.totalrealiseantr;
                result[key].num_attachement=item.num_attachement;
              });
              // Convertir le résultat en tableau
              return Object.values(result);
            }
            res.json({ infasf: infasf[0], tableauResultats: tableauResultats,tableauAtt:tableauAtt });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  const setsituation = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        const tableauResultats = req.body.detail;
        let totalRealiseSum = 0;
        let volumeRealiseAntrAsfSum = 0;
      
        // Calculate totalRealiseSum and volumeRealiseAntrAsfSum
        tableauResultats.forEach(resultArray => {
          resultArray.forEach(item => {
            if (item.totalrealise !== null && item.totalrealise !== undefined) {
              totalRealiseSum += item.totalrealise * item.prix_ht_tache;
            }
            if (item.volume_realise_antr_asf !== null && item.volume_realise_antr_asf !== undefined) {
              volumeRealiseAntrAsfSum += item.volume_realise_antr_asf * item.prix_ht_tache;
            }
          });
        });
        // Fetch retenu_garantie from bv_marche
        const [marcheQuery] = await db.promise().query(
          `SELECT retenu_garantie FROM bv_marche WHERE IDMarche = ?`,
          [req.body.IDMarche]
        );
        const totalCumule = totalRealiseSum + volumeRealiseAntrAsfSum;
        const retenuGarantie = totalRealiseSum * marcheQuery[0].retenu_garantie / 100;
        // Update bv_asf with calculated values
        const [situationQuery] = await db.promise().query(
          `UPDATE bv_asf SET 
            montant_cumule = ?, 
            montant_precedent = ?, 
            montant_situation = ?, 
            montant_avance_forf = ?, 
            montant_avance_apro = ?, 
            montant_retenue_garanti = ?, 
            montant_retenu_garanti_prec = ? 
            WHERE id_asf = ?`,
          [
            totalCumule,
            volumeRealiseAntrAsfSum,
            totalRealiseSum,
            null, // montant_avance_forf placeholder
            null, // montant_avance_apro placeholder
            retenuGarantie,
            null, // montant_retenu_garantie_pre placeholder
            req.body.id_asf
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
  const getSituation = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        const [getSituation] = await db.promise().query(`
          SELECT
              bv_asf.montant_retenu_garanti_prec,
              bv_asf.pourcentage_apro,
              bv_marche.visa_commission,
              bv_asf.num_situation,
              bv_marche.mode_passation,
              bv_asf.pourcentage_forf,
              bv_asf.montant_retenue_garanti,
              bv_asf.montant_avance_forf,
              bv_asf.montant_situation,
              bv_asf.montant_precedent,
              bv_asf.montant_avance_apro,
              bv_asf.montant_cumule,
              bv_asf.date_asf,
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
          FROM bv_asf
          LEFT JOIN bv_attachement ON bv_attachement.id_asf = bv_asf.id_asf
          LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
          LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache 
          LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
          LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
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
          WHERE bv_asf.id_asf = ?
      `, [req.body.id_asf]);
      
      const [memoire]=  await db.promise().query(`select sum(montant_avance_forf) as cumuleforf,
        sum(montant_avance_apro) as cumuleappro,
        sum(montant_retenue_garanti) as cumuleretenu
   FROM bv_asf
          LEFT JOIN bv_attachement ON bv_attachement.id_asf = bv_asf.id_asf
          LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
          LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache 
          LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
          LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
          LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          LEFT JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche 
where bv_marche.IDMarche=? and bv_asf.date_asf <= ? `,[req.body.IDMarche,getSituation[0].date_asf])
      
      
const result = { ...getSituation[0], ...memoire[0] };

res.json(result);
       
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  const setInfSituation = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
   
        const [montantAsf] = await db.promise().query(`select montant_situation from bv_asf where id_asf=?`,[req.body.id_asf]);
        
        const [situationQuery] = await db.promise().query(
          `UPDATE bv_asf SET 
          num_situation = ?, 
          pourcentage_apro = ?, 
          pourcentage_forf = ?,
          montant_avance_forf=?,
          montant_avance_apro=?
          WHERE id_asf = ?`,
          [
            req.body.num_situation,
            req.body.pourcentage_apro,
            req.body.pourcentage_forf,
            montantAsf[0].montant_situation* req.body.pourcentage_forf/100,
            montantAsf[0].montant_situation* req.body.pourcentage_apro/100,
            req.body.id_asf
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
  const setAsf = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
      
   
        const [asfQuery] = await db.promise().query(
          `UPDATE bv_asf SET 
          num_asf = ?, 
          date_asf = ?, 
          signataire = ?, 
          conf = ?
          WHERE id_asf = ?`,
          [
            req.body.num_asf,
            req.body.date_asf,
            req.body.signataire,
            req.body.conf,
            req.body.id_asf
          ]
        );
        if(asfQuery.affectedRows==1)
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
  module.exports={addAsf,getasf,getDetailAsf,setsituation,getSituation,setAsf,setInfSituation}