const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");
const getDetailDecompte = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        // const userId = req.userId;
/**selectionner la wilaya et la structure de l'asf */
const [wil_stru_asf] = await db
.promise()
.query(
  `SELECT DISTINCT bv_action_impactee.code_wilaya, bv_action_impactee.INSTITUTION_PILOTE
   FROM bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
   left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
   left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
   left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
   left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
   where bv_attachement.id_asf = ?
   `,[req.body.id_asf]);

        let [infasf] = await db
          .promise()
          .query(
            `SELECT DISTINCT  bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,bv_wilaya.wilaya_name_ascii
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
             and bv_action_impactee.code_wilaya=?
             and  bv_action_impactee.INSTITUTION_PILOTE=?
             and bv_attachement.id_asf <= ?
             `,[req.body.IDMarche,wil_stru_asf[0].code_wilaya,wil_stru_asf[0].INSTITUTION_PILOTE,req.body.id_asf]);
             const tableauResultats = [];
             for (const det of infasf)
             {
              const [infotache]= await db.promise().query(`select bv_tache.intitule_tache,bv_tache.prix_ht_tache ,
                bv_tache.unite_tache, bv_phase.num_phase, sum(bv_tache.quantite_tache) as total
              from bv_tache left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               join bv_realisation on bv_tache.id_tache= bv_realisation.id_tache
               join bv_attachement on bv_attachement.id_attachement=bv_realisation.id_attachement 
              where bv_action_pro_programme.id_pro_action_pro=? 
              and bv_attachement.id_asf = ?
              group by bv_phase.num_phase,bv_tache.intitule_tache
              `,[det.id_pro_action_pro,req.body.id_asf])
             
              const [inforealisationDecompt]= await db.promise().query(`
              select bv_tache.intitule_tache,bv_tache.prix_ht_tache,bv_tache.montant_global,bv_tache.unite_tache,
              bv_phase.num_phase,sum(bv_realisation.volume_realise) as totalrealise,bv_realisation.volume_realise_antr_asf 
              from bv_attachement 
              left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
              left join  bv_tache on bv_tache.id_tache=bv_realisation.id_tache 
              left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
              left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
              left JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
              where bv_attachement.id_asf=?
              and bv_action_impactee.id_pro_action_programme=?
              group by bv_phase.num_phase,bv_tache.intitule_tache
              `,[req.body.id_asf,det.id_pro_action_pro])
              //console.log(inforealisationDecompt)
              if(inforealisationDecompt.length==0)
               {
                const [selectIdAsfQuery] = await db.promise().query(
                  `SELECT DISTINCT bv_asf.id_asf 
                   FROM bv_asf 
                   LEFT JOIN bv_attachement ON bv_attachement.id_asf = bv_asf.id_asf
                   LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
                   LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache 
                   LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
                   LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
                   WHERE bv_action_impactee.code_wilaya = ?
                     AND bv_action_impactee.INSTITUTION_PILOTE = ?
                     AND bv_action_impactee.id_pro_action_programme = ?
                     AND bv_asf.date_asf = (
                       SELECT MAX(date_asf)
                       FROM bv_asf
                       LEFT JOIN bv_attachement ON bv_attachement.id_asf = bv_asf.id_asf
                       LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
                       LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache 
                       LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
                       LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
                       WHERE bv_action_impactee.code_wilaya = ?
                         AND bv_action_impactee.INSTITUTION_PILOTE = ?
                         AND bv_action_impactee.id_pro_action_programme = ?
                         AND bv_asf.id_asf < ?
                     )`, 
                  [ wil_stru_asf[0].code_wilaya,wil_stru_asf[0].INSTITUTION_PILOTE, det.id_pro_action_pro,wil_stru_asf[0].code_wilaya,wil_stru_asf[0].INSTITUTION_PILOTE, det.id_pro_action_pro,req.body.id_asf]
                );
                const [inforealisationDecompt2]= await db.promise().query(`
                select bv_tache.intitule_tache,bv_tache.prix_ht_tache,bv_tache.montant_global,bv_tache.unite_tache,
                bv_phase.num_phase,sum(bv_realisation.volume_realise) as volume_realise_antr_asf,0 as totalrealise
                from bv_attachement 
                left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
                left join  bv_tache on bv_tache.id_tache=bv_realisation.id_tache 
                left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
                left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
                left JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
                where bv_attachement.id_asf=?
                and bv_action_impactee.id_pro_action_programme=?
                group by bv_phase.num_phase,bv_tache.intitule_tache
                `,[selectIdAsfQuery[0].id_asf,det.id_pro_action_pro])
                inforealisationDecompt.push(...inforealisationDecompt2);
               }
              
              const tableauFusionne = fusionnerTableaux(infotache, inforealisationDecompt);
              const actionObj = { action: det.action };
              const tableauResultat = [actionObj,...tableauFusionne];
              tableauResultats.push(tableauResultat);
                }
           function fusionnerTableaux(tableau1, tableau2) {
            const result = {};
            tableau1.forEach(item => {
              const key = `${item.num_phase}_${item.intitule_tache}`;
              result[key] = result[key] || { intitule_tache: item.intitule_tache, unite_tache: item.unite_tache, num_phase: item.num_phase,prix_ht_tache:item.prix_ht_tache,volume_realise_antr_asf:null ,total: null, totalrealise: null };
              result[key].total = item.total;
            });
            tableau2.forEach(item => {
              const key = `${item.num_phase}_${item.intitule_tache}`;
              result[key] = result[key] || { intitule_tache: item.intitule_tache, unite_tache: item.unite_tache, num_phase: item.num_phase, volume_realise_antr_asf:item.volume_realise_antr_asf,prix_ht_tache:item.prix_ht_tache,total: null, totalrealise: null };
              result[key].totalrealise = item.totalrealise;
              result[key].volume_realise_antr_asf=item.volume_realise_antr_asf;
              result[key].prix_ht_tache=item.prix_ht_tache;
            });
            return Object.values(result);
           }
      
            res.json({ infasf: infasf[0], tableauResultats:tableauResultats});
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
module.exports={getDetailDecompte}