import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeicons/primeicons.css';
import {Col,Row} from "reactstrap";
import {AddTask} from '../../utils/APIRoutes';
export default function AddTache (props) {
    const token = localStorage.getItem('token');
    const [submittedTache, setSubmittedTache] = useState(false);
    const optionUnite=[{label:"KM",value:"KM"},{label:"HA",value:"HA"},{label:"M3",value:"M3"},{label:"MI",value:"MI"}]
    const [tache,setTache]=useState({intitule_tache :"",unite_tache :"",quantite_tache:"",prix_ht_tache:0.0});
    const [checked, setChecked] = useState(false);
    const[disableadd,setdisableadd]=useState(false)
    const [loading,setloading]=useState(false)
  /*****************************************************/
  const toast = useRef(null);
  /****************************************************/
  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: "L'ajout de la réalisation a été effectué avec succès.", life: 3000 });
}
  /***************************************************************************/
    const addTache =()=> {  
        if( !tache.intitule_tache || !tache.unite_tache || !tache.prix_ht_tache )
        {
          setSubmittedTache(true)
        }
        else
        {
          setloading(true)
          fetch(AddTask, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({tache:tache,idPhases:props.IdPhase}),
          }).then((response) => response.json())
            .then((data) => {
              setTache({intitule_tache :"",unite_tache :"",quantite_tache:"",prix_ht_tache:0.0});
               hideDialogtache()
               props.accept('success','Confirmé',"L'ajout de la tâche a été effectué avec succès.")
               setloading(false)
               props.setlistPhases((prevPhases) => {
                return prevPhases.map((phase) => {
                  const phaseNum = phase.phaseNum;
                  const matchingPhases = data.idPhases.filter((idPhase) => idPhase.num_phase === phaseNum);
                  if (matchingPhases.length > 0) {
                    const updatedPhase = { ...phase };
                    if (!updatedPhase.tache) {
                      updatedPhase.tache = [];
                    }
                    updatedPhase.tache = [...updatedPhase.tache, { ...data.tache }];
                    return updatedPhase;
                  }
                  return phase;
                });
              });
            }).catch((error) => {
              console.error(error);
            });

          }
    } 
    const hideDialogtache = () => {
      setSubmittedTache(false);
      props.settacheDialog(false);
     setTache({id_phase : "",intitule_tache :"",unite_tache :"",quantite_tache:"",prix_ht_tache:""})
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
          <Button className="mr-2" style={{ color: 'var(--red-400)',borderColor:'var(--red-400)' , borderRadius: 'var(--border-radius)'}} label="Annuler" icon="pi pi-times" outlined onClick={hideDialogtache} />
          <Button label="Ajouter" disabled={disableadd} style={{ backgroundColor: 'var(--orange-300)',borderColor:'var(--orange-200)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-check" onClick={()=>{addTache();setdisableadd(true);}} />
      </React.Fragment>
    );
  
    return(
      <>   
  
        <Dialog visible={true} resizable={true}  style={{ width: '45vw' }}  headerStyle={{ backgroundColor: 'var(--orange-200)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="AJOUTER UNE NOUVELLE TÂCHE CPT" modal className="p-fluid" footer={tacheDialogFooter } onHide={hideDialogtache} 
         >      
                {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>} 
        <Toast ref={toast} />
        <Row>
        <Col>
            <div style={{paddingTop:"20px"}}>
                <label htmlFor="intitule_tache" className="font-bold">
                 Désignation de travaux
                </label>
                <InputText id="intitule_tache"    value={tache.intitule_tache}
                  onChange={(e) => onInputChangeTache(e, 'intitule_tache')} required
                  className={classNames({ 'p-invalid': submittedTache && !tache.intitule_tache })} />
                {submittedTache && !tache.intitule_tache && <small className="p-error">Champ obligatoire !</small>}
            </div>  
         </Col> 
         {/* <Col>
        <div style={{paddingTop:"20px"}}>
           <label htmlFor="quantiter_tache" className="font-bold">
           QUANTITÉ
           </label>
           <InputNumber  id="quantite_tache" value={tache.quantite_tache} onValueChange={(e) => onInputChangeTache(e,'quantite_tache')} className={classNames({ 'p-invalid': submittedTache && !tache.quantite_tache })} />
           {submittedTache && !tache.quantite_tache && <small className="p-error">Champ obligatoire !</small>}
        </div> 
        </Col> */}
       
     
      </Row>
      <Row>
      <Col>
            <div style={{paddingTop:"20px"}}>
                <label htmlFor="unite_tache" className="font-bold">
                  Unité
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
        </Col>
         <Col>
            <div style={{paddingTop:"20px"}}>
            <label htmlFor="prix_ht_tache" className="font-bold">
            Prix unitaire de la tâche (HT)
            </label>
            <InputText type ="number" id="prix_ht_tache" value={tache.prix_ht_tache} onChange={(e) => onInputChangeTache(e,'prix_ht_tache')} className={classNames({ 'p-invalid': submittedTache && !tache.prix_ht_tache })}  minFractionDigits={2}/>
            {submittedTache && !tache.prix_ht_tache && <small className="p-error">Champ obligatoire !</small>}
          </div> 
        </Col>
      </Row>
    </Dialog></>)
}