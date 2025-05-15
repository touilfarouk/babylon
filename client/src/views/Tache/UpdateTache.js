import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import './Css.css';
import { Toast } from 'primereact/toast';
import { IoIosBrush } from 'react-icons/io';
import {allPhases,editTask,updateActImpct} from '../../utils/APIRoutes';

export default function UpdateTache (props) {
  const toastTopCenter = useRef(null);
    const token = localStorage.getItem('token');
    const [submittedTache, setSubmittedTache] = useState(false);
    const optionUnite=[{label:"KM",value:"KM"},{label:"HA",value:"HA"},{label:"M3",value:"M3"},{label:"MI",value:"MI"},{label:"U",value:"U"}]
    const [tache,setTache]=useState({});
    const [datatache,setdatatache]=useState([]);
    const [detailleCpt, setdetailleCpt] = useState({
      dencite:"",
      VOLUME_VALIDE:"",
      volume_pv: ""
    });
    const [disable, setdisable] = useState(null);
    const [disableReturn, setdisableReturn] = useState(false);
  /****************************************************************************/
  
  const getTache =()=> {  
      fetch(allPhases, {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id_action_impactee:props.id_action_impactee}),
      })

        .then((response) => response.json())
        .then((data) => {
          if(data.length>0)
          {
            setdatatache(data)
            setdetailleCpt({
              dencite: data[0].dencite,
              VOLUME_VALIDE: data[0].VOLUME_VALIDE,
              volume_pv:data[0].volume_pv
            });
          }
          else{
          showMessage(toastTopCenter, 'info');
          }
        })
        .catch((error) => {
          console.error(error);
        });
} 
useEffect(() => {
  getTache();
  if(props.case.includes('first')  || props.case.includes('last') )
    {
      setdisableReturn(true)
    }
}, []); 

const UpdateTache =()=> {  
  fetch(editTask, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tache),
  }).then((response) => response.json())
    .then((data) => {
      if(data==="true")
        {
          if(props.case=='first' && props.id_tache == tache.id_tache && tache.date_debut_realisation) 
            {
              setdisableReturn(false)
            }
            if(props.case=='last'  && props.id_tache == tache.id_tache && tache.date_fin_realisation) 
              {
                setdisableReturn(false)
              }
              if(props.case=='first last'  && props.id_tache == tache.id_tache && tache.date_fin_realisation && tache.date_debut_realisation) 
                {
                  setdisableReturn(false)
                }
          getTache()
        }
    
    })

    .catch((error) => {
      console.error(error);
    });

  
} 
const UpdateImpact =()=> {  
 
  fetch(updateActImpct, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(detailleCpt),
  })

    .then((response) => response.json())
    .then((data) => {
     
    })

    .catch((error) => {
      console.error(error);
    });
} 

const onInputChangeTache = (e, name) => {
  let _tache = { ...tache };
  const val = (e.target && e.target.value) || '';
  if (name==='date_debut_realisation' || name==='date_fin_realisation') {
    const originalDate = new Date(val);
    if (!isNaN(originalDate.getTime())) {
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + 1);
      _tache[`${name}`] = newDate.toISOString().slice(0, 10);
    } else {
      console.error('Date invalide :', val);
    }
  } else {
    _tache[`${name}`] = val;
  }
  setTache(_tache);
};
    const tacheFooter = (
      <React.Fragment>
          <Button disabled={disableReturn} raised
           label="Retour" style={{ backgroundColor: 'var(--red-500)',borderColor:'var(--red-500)' , borderRadius: '20px'}} icon="pi pi-replay" onClick={()=>{UpdateImpact();props.setshowcpt(false)}} />
      </React.Fragment>
    );
    const showMessage = (ref) => {

      ref.current.show({severity: 'error',  summary: 'info', detail: 'Aucunne inforamation liee au CPT introduite', life: 7000 });
    };
    const handleModifierClick = (tachee) => {
      setTache(tachee);
    };
    return(
    <>  

   <Toast ref={toastTopCenter} position="top-center" />
   <Dialog 
  headerStyle={{ backgroundColor: 'var(--green-400)', height: "4rem", borderRadius: '20px', color: '#fff', marginBottom: '7px' }}
  visible={true}  
  style={{ width: '80rem', height: '100%' }} 
  breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
  header={datatache.length !== 0 ? `DETAILLE CPT DE L'ACTION ${props.action_imp.action} LOCALITE ${props.action_imp.LOCALITES}` : null} 
  modal 
  className="p-fluid" 
  footer={tacheFooter}
  onHide={() => {}}
>
  {datatache.length !== 0 && (
    <table className="p-datatable" style={{ borderSpacing: '0px 10px' }}>
      <thead>
        <tr>
          <th style={{ padding: '10px' }}>Phase</th>
          <th style={{ padding: '10px' }}>Modifier</th>
          <th style={{ padding: '10px' }}>Désignation</th>
          <th style={{ padding: '10px' }}>Unité</th>
          <th style={{ padding: '10px' }}>Prix</th>
          <th style={{ padding: '10px' }}>Quantité</th>
          <th style={{ padding: '10px' }}>Montant</th>
          <th style={{ padding: '10px' }}>Date Début</th>
          <th style={{ padding: '10px' }}>Date Fin</th>
          <th style={{ padding: '10px' }}>Enregistrer</th>
        </tr>
      </thead>
      <tbody>
        {datatache.map((phase, phaseIndex) => (
          <>
            {phase.tache.map((tachee, tacheIndex) => (
              <tr key={`${phase.id_phase}-${tacheIndex}`} style={{ height: '50px' }}> {/* Sets row height */}
                {tacheIndex === 0 && (
                  <td rowSpan={phase.tache.length} style={{ textAlign: 'center', backgroundColor: 'var(--green-50)', padding: '10px' }}>
                    Phase {phase.num_phase}
                  </td>
                )}
                <td style={{ padding: '10px' }}>
                  <button
                    text
                    type="button"
              
                    style={{borderRadius:'50%', padding: '6px 7px', fontSize: '18px', backgroundColor: 'var(--red-500)', marginRight: '5px', cursor: 'pointer', border: 'none', color: 'white' }}
                    onClick={() => { setdisable(tachee.id_tache); setTache(tachee); }}
                  >
                    <IoIosBrush />
                  </button>
                </td>
                <td style={{ padding: '10px' }}>
                  <InputText
                    // disabled={disable !== tachee.id_tache}
                    disabled
                    value={tachee.intitule_tache}
                    onChange={(e) => onInputChangeTache(e, 'intitule_tache')}
                    required
                    className={classNames({ 'p-invalid': submittedTache && !tachee.intitule_tache })}
                  />
                  {submittedTache && !tachee.intitule_tache && <small className="p-error">Champ obligatoire !</small>}
                </td>
                <td style={{ padding: '10px' }}>
                  <Dropdown
                    // disabled={disable !== tachee.id_tache}
                    disabled
                    options={optionUnite}
                    onChange={(e) => onInputChangeTache({ target: { value: e.value } }, 'unite_tache')}
                    value={tachee.unite_tache}
                    placeholder="Sélectionnez l'unité"
                    className={classNames({ 'p-invalid': submittedTache && !tachee.unite_tache })}
                  />
                  {submittedTache && !tachee.unite_tache && <small className="p-error">Champ obligatoire !</small>}
                </td>
                <td style={{ padding: '10px' }}>
                  <InputNumber
                    // disabled={disable !== tachee.id_tache}
                    disabled
                    value={tachee.prix_ht_tache}
                    onValueChange={(e) => onInputChangeTache(e, 'prix_ht_tache')}
                    suffix=" DA"
                    minFractionDigits={2}
                    mode="decimal"
                    className={classNames({ 'p-invalid': submittedTache && !tachee.prix_ht_tache })}
                  />
                  {submittedTache && !tachee.prix_ht_tache && <small className="p-error">Champ obligatoire !</small>}
                </td>
                <td style={{ padding: '10px' }}>
                  <InputNumber
                    disabled
                  //  disabled={disable !== tachee.id_tache}
                    value={tachee.quantite_tache}
                    onValueChange={(e) => onInputChangeTache(e, 'quantite_tache')}
                    className={classNames({ 'p-invalid': submittedTache && !tachee.quantite_tache })}
                  />
                  {submittedTache && !tachee.quantite_tache && <small className="p-error">Champ obligatoire !</small>}
                </td>
                <td style={{ padding: '10px' }}>
                  <InputNumber
                    disabled
                    value={tachee.montant_global}
                    suffix=" DA"
                    minFractionDigits={2}
                    mode="decimal"
                    className={classNames({ 'p-invalid': submittedTache && !tachee.unite_duree_tache })}
                  />
                  {submittedTache && !tachee.unite_duree_tache && <small className="p-error">Champ obligatoire !</small>}
                </td>
                <td style={{ padding: '10px' }}>
                  <Calendar
                    disabled={disable !== tachee.id_tache}
                    value={tachee.date_debut_realisation ? new Date(tachee.date_debut_realisation) : null}
                    dateFormat="dd/mm/yy"
                    className={classNames({ 'p-invalid': props.case.includes('first') && props.id_tache == tachee.id_tache && !tachee.date_debut_realisation })}
                    onChange={(e) => onInputChangeTache({ target: { value: e.value } }, 'date_debut_realisation')}
                  />
                      { props.case.includes('first') && props.id_tache == tachee.id_tache && !tachee.date_debut_realisation && (
                    <small className="p-error">Veuillez introduire la date de début de la tâche, s'il vous plaît!</small>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <Calendar
                    disabled={disable !== tachee.id_tache}
                    value={tachee.date_fin_realisation ? new Date(tachee.date_fin_realisation) : null}
                    dateFormat="dd/mm/yy"
                    className={classNames({ 'p-invalid': props.case.includes('last') && props.id_tache == tachee.id_tache && !tachee.date_debut_realisation })}
                    onChange={(e) => onInputChangeTache({ target: { value: e.value } }, 'date_fin_realisation')}
                  />
                  { props.case.includes('last') && props.id_tache == tachee.id_tache && !tachee.date_fin_realisation && (
                    <small className="p-error">Veuillez introduire la date de fin de la tâche, s'il vous plaît!</small>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <Button
                    onClick={() => { UpdateTache(); setdisable(null); }}
                    disabled={disable !== tachee.id_tache} raised
                    icon="pi pi-check"
                    style={{ padding: '6px 7px', fontSize: '20px', backgroundColor: 'var(--green-300)', marginRight: '5px', cursor: 'pointer', border: 'none', color: 'white' ,borderRadius:'50%'}}
                  />
                </td>
              </tr>
            ))}
            {/* Add line after each phase */}
            <tr>
              <td colSpan="10"><hr style={{ border: '1px solid var(--gray-300)' }} /></td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )}
</Dialog>



     </>)
}