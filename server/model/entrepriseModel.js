const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getEntreprise = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const Selectquery = `select bv_marche.mantant_ht as mo ,bv_entreprise_realisation.libelle,bv_entreprise_realisation.id_marche,
        bv_entreprise_realisation.ID_entreprise, sum(bv_sous_traitance.montant) as montant_total from bv_entreprise_realisation
        join bv_marche on bv_marche.IDMarche=bv_entreprise_realisation.id_marche 
        left join bv_sous_traitance on bv_entreprise_realisation.ID_entreprise=bv_sous_traitance.id_entreprise_realisation 
        where bv_entreprise_realisation.id_marche=? 
        group by bv_entreprise_realisation.ID_entreprise `;
        const valuesS = [req.body.idmarche];
        const [select] = await db.promise().query(Selectquery, valuesS);
        res.json(select);
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
const addEntreprise = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
    
        const insertQuery = "INSERT INTO `bv_entreprise_realisation` (`libelle`,id_marche ) VALUES (?,?)";
        const values = [
          req.body.libelle , req.body.idmarche
        ];
        const [insert] = await db.promise().query(insertQuery, values);
        if (insert.affectedRows === 1) {
         res.json('true');
       } else {
         res.json('false');
       }
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }

  const detailEntreprise = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {

        const Selectquery = `select * 
        from bv_entreprise_realisation 
        left join bv_sous_traitance on bv_entreprise_realisation.ID_entreprise=bv_sous_traitance.id_entreprise_realisation 
        where bv_entreprise_realisation.ID_entreprise=? group by bv_sous_traitance.id_soutretance  `;
        const valuesS = [req.body.ID_entreprise];
        const [select] = await db.promise().query(Selectquery, valuesS);
        const sumQuery=`select sum(montant) as total from bv_sous_traitance where bv_sous_traitance.id_entreprise_realisation=?`
        const [sum]=await db.promise().query(sumQuery,valuesS)
        const MontantQuery=`select sum(MONTANT_PREVU_RETENU) as MONTANT_PREVU_RETENU from 
        bv_action_impactee where id_entreprise_realisation=? 
         `
        const [montant]=await db.promise().query(MontantQuery,valuesS)


        const MontantMarche=`select mantant_ht as mo from 
        bv_marche where IDMarche =?`
        const [montantMarche]=await db.promise().query(MontantMarche,[req.body.idmarche])
   
        res.json({list:select, total:sum,montant:montant,montant2:montantMarche});
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
  const insertSousTraitance = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        const InsertQuery = `
          INSERT INTO bv_sous_traitance
          ( entreprise_soutraite, montant, id_entreprise_realisation)
          VALUES ( ?, ?, ?)
        `;
        const valuesI = [
          req.body.addsoustraitant.entreprise_soutraite,
          req.body.addsoustraitant.montant,
          req.body.ID_entreprise
        ];
  
        const[insert]= await db.promise().query(InsertQuery, valuesI);
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
  };
  module.exports={getEntreprise,addEntreprise,detailEntreprise,insertSousTraitance}