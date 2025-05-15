import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import {AddTask} from '../../utils/APIRoutes';

export default function OdsTache (props) {
    const token = localStorage.getItem('token');
    const [submittedTache, setSubmittedTache] = useState(false);
    const optionDuree=[{label:"MOIS",value:"MOIS"},{label:"JOUR",value:"JOUR"},{label:"ANNE",value:"ANNE"}]
    const optionUnite=[{label:"KM",value:"KM"},{label:"HA",value:"HA"},{label:"M3",value:"M3"},{label:"MI",value:"MI"}]
    const [tache,setTache]=useState({id_phase : props.IdPhase,intituler_tache :"",unite_tache :"",quantiter_tache:"",ods_arret:"",duree_tache:"",unite_duree_tache:"",prix_ht_tache:""});
    const [checked, setChecked] = useState(false);
    const op = useRef(null);
  /****************************************************************************/
  const notificationAlert = React.useRef();
  /***************************************************************************/
    const addTache =()=> {  
        if(!tache.id_phase || !tache.intituler_tache || !tache.unite_tache || !tache.quantiter_tache || !tache.duree_tache || !tache.unite_duree_tache)
        {
          setSubmittedTache(true)
        }else{
          fetch(AddTask, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tache),
          })

            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {
               props.getListTache();
             } 
            })

            .catch((error) => {
              console.error(error);
            });

          }
    } 
    const hideDialogtache = () => {
      setSubmittedTache(false);
      props.settacheDialog(false);
     setTache({id_phase : "",intituler_tache :"",unite_tache :"",quantiter_tache:"",ods_arret:"",duree_tache:"",unite_duree_tache:"",prix_ht_tache:""})
    };
    //..
    const onInputChangeTache = (e, name) => {
      let _tache = {... tache};
      const val = (e.target && e.target.value) || '';
      _tache[`${name}`] = val;
    
      if (name === "ods_arret" && checked==false) {
          setChecked(true);
          _tache[`${name}`] = "true";
      } else {
        if(name === "ods_arret"){
          setChecked(false);
          _tache[`${name}`] = "false";
        }
      }
      setTache(_tache);
    };
    //..
    const tacheDialogFooter = (
      <React.Fragment>
          <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialogtache} />
          <Button label="Ajouter" icon="pi pi-check" onClick={addTache} />
      </React.Fragment>
    );
    //..
    return(
        <>  
        <div className="flex flex-wrap gap-4 p-fluid">
        
              <div className="flex-auto">
                  <label htmlFor="intituler_tache" className="font-bold">
                  INTITULÉ TÂCHE
                  </label>
                  <InputText id="intituler_tache"    value={tache.intituler_tache}
                    onChange={(e) => onInputChangeTache(e, 'intituler_tache')} required
                    className={classNames({ 'p-invalid': submittedTache && !tache.intituler_tache })} />
                  {submittedTache && !tache.intituler_tache && <small className="p-error">Champ obligatoire !</small>}
              </div>  

     
              <div className="flex-auto">
                  <label htmlFor="unite_tache" className="font-bold">
                    UNITÉ TÂCHE
                  </label>
                  <Dropdown
                      id="unite_tache"
                      optionLabel="label" 
                      options={optionUnite} 
                      onChange={(e) => {onInputChangeTache({ target: { value: e.value } }, 'unite_tache');}} 
                      value={tache.unite_tache} // Selected value
                      placeholder="SÉLECTIONNEZ L'UNITÉ" // Placeholder text when nothing is selected
                      className={classNames({ 'p-invalid': submittedTache && !tache.unite_tache})}
                  />
                  {submittedTache && !tache.unite_tache && <small className="p-error">Champ obligatoire !</small>}
              </div>
      
        
              <div className="flex-auto">
             <label htmlFor="quantiter_tache" className="font-bold">
             QUANTITÉ TÂCHE
             </label>
             <InputNumber  id="quantiter_tache" value={tache.quantiter_tache} onValueChange={(e) => onInputChangeTache(e,'quantiter_tache')} className={classNames({ 'p-invalid': submittedTache && !tache.quantiter_tache })} />
             {submittedTache && !tache.quantiter_tache && <small className="p-error">Champ obligatoire !</small>}
          </div> 
          <div className="flex-auto">
                  <label htmlFor="unite_duree_tache" className="font-bold">
                     PÉRIODE TÂCHE
                  </label>
                  <Dropdown
                      id="unite_duree_tache"
                      optionLabel="label" 
                      options={optionDuree} 
                      onChange={(e) => {onInputChangeTache({ target: { value: e.value } }, 'unite_duree_tache');}} 
                      value={tache.unite_duree_tache}
                      placeholder="SÉLECTIONNEZ UNE PÉRIODE"
                      className={classNames({ 'p-invalid': submittedTache && !tache.unite_duree_tache})}
                  />
                  {submittedTache && !tache.unite_duree_tache && <small className="p-error">Champ obligatoire !</small>}
              </div>
              <div className="flex-auto">
              <label htmlFor="duree_tache" className="font-bold">
              DURÉE TÂCHE
              </label>
              <InputNumber  id="duree_tache" value={tache.duree_tache} onValueChange={(e) => onInputChangeTache(e,'duree_tache')} className={classNames({ 'p-invalid': submittedTache && !tache.duree_tache })} />
              {submittedTache && !tache.duree_tache && <small className="p-error">Champ obligatoire !</small>}
            </div> 
            <div className="flex-auto">
              <label htmlFor="prix_ht_tache" className="font-bold">
              PRIX UNITAIRE TÂCHE (HT)
              </label>
              <InputNumber  id="prix_ht_tache" value={tache.prix_ht_tache} onValueChange={(e) => onInputChangeTache(e,'prix_ht_tache')} className={classNames({ 'p-invalid': submittedTache && !tache.prix_ht_tache })} minFractionDigits={2} maxFractionDigits={5}/>
              {submittedTache && !tache.prix_ht_tache && <small className="p-error">Champ obligatoire !</small>}
            </div> 
   </div>
     
     </>)
}