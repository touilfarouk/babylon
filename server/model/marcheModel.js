const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getMarche = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const wilaya=req.wilaya;
        const structure=req.structure
        const marche_list = [];
        if(req.body.fillter)
        {
          const Selectquery = 'select *,  DATE_FORMAT(bv_programme.date_debut, "%Y" ) as debut,DATE_FORMAT(bv_programme.date_fin, "%Y" ) as fin from bv_marche join bv_programme on bv_programme.IDProgramme =bv_marche.IDProgramme where bv_marche.IDProgramme = ? and type_marche=?';
          const valuesS = [req.body.idprog,req.body.type_marche];
          const [select] = await db.promise().query(Selectquery, valuesS);
        
          for (const marche of select)
          {
            if(marche.echelle == "National")
            {
              const mar = {
                value: marche.IDMarche,
                label: `Marche N° ${marche.num_marche}`,
            };    
          marche_list.push(mar);
            }
            else{
              if(marche.code_wilaya==wilaya)
              {
                const mar = {
                  value: marche.IDMarche,
                  label: `Marche N° ${marche.num_marche}`,
              };    
            marche_list.push(mar);
              }
            }
       
      
          }
          res.json(marche_list);
        }
        else{
          if(req.body.numMarcheFilltre==0)
          {
            const Selectquery = 'select *,  DATE_FORMAT(bv_programme.date_debut, "%Y" ) as debut,DATE_FORMAT(bv_programme.date_fin, "%Y" ) as fin from bv_marche join bv_programme on bv_programme.IDProgramme =bv_marche.IDProgramme where bv_marche.IDProgramme = ? ';
            const valuesS = [req.body.idprog];
            const [select] = await db.promise().query(Selectquery, valuesS);
            if(structure === 'DGF')
            {
             res.json(select)
            }
            else{
              for (const marche of select)
              {
                if(marche.echelle == "National")
                {
                
              marche_list.push(marche);
                }
                else{
                  if(marche.code_wilaya==wilaya)
                  {
                marche_list.push(marche);
                  }
                }
           
          
              }
              res.json(marche_list);
            }
          }
          else{
            const Selectquery = 'select *,  DATE_FORMAT(bv_programme.date_debut, "%Y" ) as debut,DATE_FORMAT(bv_programme.date_fin, "%Y" ) as fin from bv_marche join bv_programme on bv_programme.IDProgramme =bv_marche.IDProgramme where bv_marche.IDProgramme = ? and bv_marche.num_marche=?';
            const valuesS = [req.body.idprog,req.body.numMarcheFilltre];
            const [select] = await db.promise().query(Selectquery, valuesS);
            if(structure === 'DGF')
            {
             res.json(select)
            }
            else{
              for (const marche of select)
              {
                if(marche.echelle == "National")
                {
                
              marche_list.push(marche);
                }
                else{
                  if(marche.code_wilaya==wilaya)
                  {
                marche_list.push(marche);
                  }
                }
           
          
              }
              res.json(marche_list);
            }
          }
         
    
        
        }
       
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
  const getDetailMarche = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const Selectquery = `select *,  DATE_FORMAT(date_appeloffre, "%d/%m/%Y") as date_appeloffree,
               DATE_FORMAT(date_cahiercharge, "%d/%m/%Y") as date_cahierchargee,
               DATE_FORMAT(date_attribution, "%d/%m/%Y") as date_attributionn,
               DATE_FORMAT(date_contrat, "%d/%m/%Y") as date_contratt 
               from bv_marche where IDMarche =? `;
        const valuesS = [req.body.id_marche];
        const [select] = await db.promise().query(Selectquery, valuesS);
        res.json(select);
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
  const addMarche = async (req, res) => {
    try {
        await verifyJWT(req, res, async () => {
            const marche = req.body.marche;
            const idprog = req.body.idprog;
            const insertQueryCommon = `INSERT INTO bv_marche (IDProgramme, type_marche, num_marche,intitule_marche, contractant, cocontractant, delais_execution, objet, mantant_ht, montant_ttc, avance_for, avance_appro, date_notification_ods, retenu_garantie, modalite_restitution_avance_forf, modalite_restitution_avance_appro, soutretence, echelle
            ,rais_soc_add_cocotract,regitre_commerce_cocotra,matricul_fiscal_cocontr,compte_bancaire_cocontr,mode_passation,visa_commission,Cotation`;
            let values = [
                idprog,
                marche.type_marche,
                marche.num_marche,
                marche.intitule_marche,
                marche.contractant,
                marche.cocontractant,
                marche.delais_execution,
                marche.objet,
                marche.mantant_ht,
                marche.mantant_ht + (marche.mantant_ht * 19 / 100),
                marche.avance_for,
                marche.avance_appro,
                marche.date_notification_ods,
                marche.retenu_garantie,
                marche.modalite_restitution_avance_forf,
                marche.modalite_restitution_avance_appro,
                marche.soutretence,
                marche.echelle,
                marche.rais_soc_add_cocotract,
                marche.regitre_commerce_cocotra,
                marche.matricul_fiscal_cocontr,
                marche.compte_bancaire_cocontr,
                marche.mode_passation,
                marche.visa_commission,
                marche.Cotation
            ];

            let insertQuery;
            if (marche.echelle === "National") {
                insertQuery = `${insertQueryCommon}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            } else {
                const wilaya = req.wilaya;
                insertQuery = `${insertQueryCommon}, code_wilaya) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                values.push(wilaya);
            }

            const [insert] = await db.promise().query(insertQuery, values);
            if (insert.affectedRows === 1) {
                res.json('true');
            } else {
                res.json('false');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


const updateMarche = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        if(req.body.date)
        {
          const updateQuery = `UPDATE bv_marche SET ${req.body.type}=? WHERE IDMarche =? `;
          const values = [req.body.date,req.body.id_marche];
          
          const [update] = await db.promise().query(updateQuery, values);
          if (update.affectedRows === 1) {
              res.json('true');
            } else {
              res.json('false');
            }
        }
        else{
        const updateQuery = "UPDATE `bv_marche` SET Cotation=?, `type_marche`=?,`contractant`=?, `cocontractant`=?, `delais_execution`=?, `objet`=?, `mantant_ht`=?, `tva`=?, `montant_ttc`=?, `avance_for`=?, `avance_appro`=?, `date_notification_ods`=?, `retenu_garantie`=?, `modalite_restitution_avance_forf`=?, `modalite_restitution_avance_appro`=?, `soutretence`=? ,`num_marche`=? WHERE IDMarche =? ";
        const values = [
          req.body.Cotation,
          req.body.type_marche,
          req.body.contractant,
          req.body.cocontractant,
          req.body.delais_execution,
          req.body.objet,
          req.body.mantant_ht,
          req.body.tva,
          req.body.mantant_ht + req.body.mantant_ht * req.body.tva / 100,
          req.body.avance_for,
          req.body.avance_appro,
          req.body.date_notification_ods,
          req.body.retenu_garantie,
          req.body.modalite_restitution_avance_forf,
          req.body.modalite_restitution_avance_appro,
          req.body.soutretence,
          req.body.num_marche, // Assuming `num_marche` is the primary key
          req.body.IDMarche 
        ];
        
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

  module.exports={updateMarche,addMarche,getMarche,getDetailMarche}