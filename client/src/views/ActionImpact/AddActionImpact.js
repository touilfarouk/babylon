import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import {Col,Row} from "reactstrap";
import { MultiSelect } from 'primereact/multiselect';

import {getWilaya,getCommune,getEntreprise,addActImpct,getActionMarche,getUserInf} from '../../utils/APIRoutes';
export default function AddActionImpact (props){
 
    const toast = useRef(null);
    const token = localStorage.getItem('token');
    const [submittedIm, setSubmittedIm] = useState(false);
    const [wilaya,setwilaya]=useState([]);
    const [commune,setcommune]=useState([]);
    const [entreprise,setentreprise]=useState([]);
    const [action,setaction]=useState([]);
    const optionsAxe=[{label:"EXTENSION DU BARRAGE VERT",value:"EXTENSION DU BARRAGE VERT"},{label:"DEVELOPPEMENT DU BARRAGE VERT",value:"DEVELOPPEMENT DU BARRAGE VERT"},{label:"REHABILITATION DU BARRAGE VERT",value:"REHABILITATION DU BARRAGE VERT"}]
    const optionUnite=[{label:"KM",value:"KM"},{label:"HA",value:"HA"},{label:"M3",value:"M3"},{label:"MI",value:"MI"}]
    const optionsInstitution=[{label:"FORETS",value:"FORETS"},{label:"DSA",value:"DSA"},{label:"HCDS",value:"HCDS"}]
    const [action_imp,setaction_imp]=useState({idmarche:props.idmarche,id_action_programme:"",id_entreprise_realisation :"",code_wilaya :"",code_commune:"",LOCALITES:"",AXE:"",UNITE:"",COUT_UNITAIRE_VALIDE:"",VOLUME_VALIDE:"",INSTITUTION_PILOTE:"",Espèces:""});
    const [selected, setSelected] = useState(null);
  
    const etudes = [
        { name: 'Préliminaire', code: '5' },
        { name: ' Faisabilité', code: '2' },
        { name: 'Execution', code: '3' },
    ];

    const handleDynamicInputChange = (e, name) => {
      // Mise à jour du champ dynamique pour l'étude spécifiée
      const updatedSelected = selected.map((etude) =>
        etude.name === name ? { ...etude, cout: e.value } : etude
      );
      setSelected(updatedSelected);
    };
    

    function addActionIm() {
      const hasEmptyCout = selected?.some((obj) => !obj.cout);
        if(props.typemarche==="Réalisation" &&( !action_imp.id_action_programme || !action_imp.id_entreprise_realisation  || !action_imp.code_commune || !action_imp.LOCALITES || !action_imp.AXE || !action_imp.UNITE  ||  !action_imp.VOLUME_VALIDE || !action_imp.duree_action ))
        {
          setSubmittedIm(true)
        } 
        else  if(props.typemarche==="Etude" &&( hasEmptyCout ||!action_imp.id_action_programme || !action_imp.id_entreprise_realisation  || !action_imp.code_commune || !action_imp.LOCALITES || !action_imp.AXE || !action_imp.UNITE  || !action_imp.VOLUME_VALIDE || !action_imp.duree_action ))
        {
          setSubmittedIm(true)
        }else
        {
          fetch(addActImpct, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({selected:selected,action_imp:action_imp}),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {
                 props.getAllAction();
                hideDialogIm();
              } 
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
      function getListWilaya() {
        fetch(getWilaya, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setwilaya(data);
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      }  
      function getListCommune(wilaya_code) {
        fetch(getCommune, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({wilaya_code:wilaya_code}),
        })
          .then((response) => response.json())
          .then((data) => {
            setcommune(data);
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      } 
      function getListEntreprise() {
        fetch(getEntreprise, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },   body: JSON.stringify({idmarche:props.idmarche}),
        })
          .then((response) => response.json())
          .then((data) => {
            setentreprise(data);
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      } 
      function getIntAction() {
        fetch(getActionMarche, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({idmarche:props.idmarche})})
          .then((response) => response.json())
          .then((data) => {
            const action_list = data.map(entr => ({
              label: entr.action,
              value: entr.IDaction_programme,
            }));
            setaction(action_list)
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      }  
      const openNewIm = () => {
        getIntAction();
        setSubmittedIm(false);
        getListWilaya();
        getListEntreprise();
      };
    
      const hideDialogIm = () => {
        setSubmittedIm(false);
        props.setaddimp(false);
        setaction_imp({id_action_programme:"",id_entreprise_realisation :"",code_wilaya :"",code_commune:"",LOCALITES:"",AXE:"",UNITE:"",COUT_UNITAIRE_VALIDE:"",VOLUME_VALIDE:"",INSTITUTION_PILOTE:"",Espèces:""})
      };
      useEffect(() => {
        openNewIm();
        if(props.userinf.structure != "DGF")
          {
            getListCommune(props.userinf.wilaya)
          }
      }, []); 
      const onInputChangeIm = (e, name) => {
        let _actionIm = {...action_imp};
        if(name=="code_wilaya")
        { 
          _actionIm[`code_commune`] = "";
        }
        const val = (e.target && e.target.value) || '';
        _actionIm[`${name}`] = val;
        console.log(_actionIm)
        setaction_imp(_actionIm);
      };
      const actionImDialogFooter = (
        <React.Fragment>
            <Button label="Annuler"  style={{ color: '#fff',backgroundColor:'var(--red-400)',borderColor:'var(--red-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-times" outlined onClick={()=>hideDialogIm()} />
            <Button label="Ajouter" className="ml-2 " style={{ backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-check" onClick={()=>addActionIm()} />
        </React.Fragment>
      );
    return (
        <Dialog headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
        visible={props.addimp}  style={{ width: '70rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter une nouvelle action impactee" modal className="p-fluid" footer={actionImDialogFooter } onHide={hideDialogIm} >       
        <Toast ref={toast} />
        <Row>
         <Col>
         <div >
             <label htmlFor="commune" className="font-bold">
               Axe
             </label>
             <Dropdown
                 id="commune"
                 optionLabel="label" 
                 options={optionsAxe} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'AXE');}} 
                 value={action_imp.AXE} // Selected value
                 placeholder="Selectionner l'axe" // Placeholder text when nothing is selected
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.AXE})}
             />
             {submittedIm && !action_imp.AXE && <small className="p-error">Champ obligatoire !</small>}
      </div>
        
          <div style={{paddingTop:"20px"}}>
             <label htmlFor="commune" className="font-bold">
               Commune
             </label>
             <Dropdown
                 id="commune"
                 optionLabel="label" 
                 options={commune} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'code_commune');}} 
                 value={action_imp.code_commune} // Selected value
                 placeholder="Selectionner la commune" // Placeholder text when nothing is selected
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.code_commune})}
             />
             {submittedIm && !action_imp.code_commune && <small className="p-error">Champ obligatoire !</small>}
          </div>
          {props.typemarche==="Réalisation"?     <div style={{paddingTop:"20px"}}>
             <label htmlFor="entreprise" className="font-bold">
              Entreprise de réalisation
             </label>
             <Dropdown
                 id="entreprise"
                 optionLabel="label" 
                 options={entreprise} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'id_entreprise_realisation');}} 
                 value={action_imp.id_entreprise_realisation} 
                 placeholder="Selectionner l'entreprise" 
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.id_entreprise_realisation})}
             />
             {submittedIm && !action_imp.id_entreprise_realisation && <small className="p-error">Champ obligatoire !</small>}
      </div>:   
      <> 
      <div style={{paddingTop:"20px"}}>
      <label htmlFor="entreprise" className="font-bold">
       Bureau d'etude
      </label>
      <Dropdown
          id="entreprise"
          optionLabel="label" 
          options={entreprise} 
          onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'id_entreprise_realisation');}} 
          value={action_imp.id_entreprise_realisation} 
          placeholder="Selectionner l'entreprise" 
          className={classNames({ 'p-invalid': submittedIm && !action_imp.id_entreprise_realisation})}
      />
      {submittedIm && !action_imp.id_entreprise_realisation && <small className="p-error">Champ obligatoire !</small>}
     </div>
      <div style={{paddingTop:"20px"}}>
             <label htmlFor="entreprise" className="font-bold">
             Type d'etude
             </label>
             <MultiSelect value={selected} onChange={(e) => setSelected(e.value)} options={etudes} optionLabel="name" 
                placeholder="Selectionner les études " className={classNames({ 'p-invalid': submittedIm && !selected})} />
             {submittedIm && !selected && <small className="p-error">Champ obligatoire !</small>}
      </div>
      { selected && selected.map((etude, index) => (
        <div key={index} style={{ paddingTop: "20px" }}>
          <label htmlFor={`etude-${index}`} className="font-bold">
            {`Cout unitaire de l'etude ${etude.name}`}
          </label>
          < InputNumber suffix=" DA" minFractionDigits={2} mode="decimal" 
            
            id={`etude-${index}`}
            value={etude.cout || 0} 
            onChange={(e) => handleDynamicInputChange(e, etude.name)}
            placeholder={`Entrez un détail pour ${etude.name}`}
            className={classNames({ 'p-invalid': submittedIm && !etude.cout})} 
          />
            {submittedIm && !etude.cout && <small className="p-error">Champ obligatoire !</small>}
        </div>
      ))}
      </>

      }
 

     
       {[1,2,5,7,8,10,14,19,28].includes(action_imp.id_action_programme) && <div style={{paddingTop:"20px"}}>
             <label htmlFor="espese" className="font-bold">
               Espèse
             </label>
             <InputText id="espese" value={action_imp.Espèces} onChange={(e) => onInputChangeIm(e,'Espèces')} required  className={classNames({ 'p-invalid': submittedIm && !action_imp.Espèces })} />
             {submittedIm && !action_imp.Espèces && <small className="p-error">Champ obligatoire !</small>}
      </div>}
      </Col>
      <Col>
      <div>
             <label htmlFor="action" className="font-bold">
             Action programme
             </label>
             <Dropdown
                 id="action"
                 optionLabel="label" 
                 options={action} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'id_action_programme')}} 
                 value={action_imp.id_action_programme} 
                 placeholder="Selectionner l'action" 
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.id_action_programme})}
             />
             {submittedIm && !action_imp.id_action_programme && <small className="p-error">Champ obligatoire !</small>}
         </div>
      <div style={{paddingTop:"20px"}}>
           <label htmlFor="localite" className="font-bold">
               Localites
           </label>
          
           <InputText id="localite"    value={action_imp.LOCALITES}
            onChange={(e) => onInputChangeIm(e, 'LOCALITES')} required
            className={classNames({ 'p-invalid': submittedIm && !action_imp.LOCALITES })} />
           {submittedIm && !action_imp.LOCALITES && <small className="p-error">Champ obligatoire !</small>}
     </div>  
     <div style={{paddingTop:"20px"}}>
             <label htmlFor="unite" className="font-bold">
               Unite
             </label>
             <Dropdown
                 id="unite"
                 optionLabel="label" 
                 options={optionUnite} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'UNITE');}} 
                 value={action_imp.UNITE} // Selected value
                 placeholder="Selectionner l'unite" // Placeholder text when nothing is selected
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.UNITE})}
             />
             {submittedIm && !action_imp.UNITE && <small className="p-error">Champ obligatoire !</small>}
      </div>
      {[1,2,5,7,8,10,14,19,28].includes(action_imp.id_action_programme) && <div style={{paddingTop:"20px"}}>
             <label htmlFor="nombre" className="font-bold">
             Dencité
             </label>
             <InputNumber id="nombre" value={action_imp.nombre}    onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'nombre');}}  required  className={classNames({ 'p-invalid': submittedIm && !action_imp.nombre })} />
             {submittedIm && !action_imp.nombre && <small className="p-error">Champ obligatoire !</small>}
      </div>}

      </Col>
      <Col>
     { props.userinf.structure === "DGF" && <div>
             <label htmlFor="wilaya" className="font-bold">
               Wilaya
             </label>
             <Dropdown
                 id="wilaya"
                 optionLabel="label" 
                 options={wilaya} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'code_wilaya');getListCommune(e.value)}} 
                 value={action_imp.code_wilaya} 
                 placeholder="Selectionner la wilaya" 
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.code_wilaya})}
             />
             {submittedIm && !action_imp.code_wilaya && <small className="p-error">Champ obligatoire !</small>}
      </div>}
  
    { props.userinf.structure=="DGF" && <div  style={{paddingTop:"20px"}}>
             <label htmlFor="institution" className="font-bold">
               Institution pilote
             </label>
             <Dropdown
                 id="institution"
                 optionLabel="label" 
                 options={optionsInstitution} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'INSTITUTION_PILOTE');}} 
                 value={action_imp.INSTITUTION_PILOTE} // Selected value
                 placeholder="Selectionner l'institution" // Placeholder text when nothing is selected
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.INSTITUTION_PILOTE})}
             />
             {submittedIm && !action_imp.INSTITUTION_PILOTE && <small className="p-error">Champ obligatoire !</small>}
      </div>}
      <div style={{paddingTop:"20px"}}>
           <label htmlFor="volume" className="font-bold">
           Volume validé
           </label>
           <InputNumber   id="volume" value={action_imp.VOLUME_VALIDE} onValueChange={(e) => onInputChangeIm(e,'VOLUME_VALIDE')} className={classNames({ 'p-invalid': submittedIm && !action_imp.VOLUME_VALIDE })} />
           {submittedIm && !action_imp.VOLUME_VALIDE && <small className="p-error">Champ obligatoire !</small>}
     </div> 
    {props.typemarche==="Réalisation" && 
     <div style={{paddingTop:"20px"}}>
     <label htmlFor="cout" className="font-bold">
         Cout unitaire
     </label>
     <InputNumber  minFractionDigits={2} mode="decimal"  id="cout"  value={action_imp.COUT_UNITAIRE_VALIDE} onValueChange={(e) => onInputChangeIm(e,'COUT_UNITAIRE_VALIDE')} required className={classNames({ 'p-invalid': submittedIm && !action_imp.COUT_UNITAIRE_VALIDE })} />
     {submittedIm && !action_imp.COUT_UNITAIRE_VALIDE && <small className="p-error">Champ obligatoire!</small>}
</div> }

     <div style={{paddingTop:"20px"}}>
     <label htmlFor="duree" className="font-bold">
        Durée de l'action
     </label>
     <InputNumber suffix=" Jours"   id="duree"  value={action_imp.duree_action} onValueChange={(e) => onInputChangeIm(e,'duree_action')} required className={classNames({ 'p-invalid': submittedIm && !action_imp.duree_action })} />
     {submittedIm && !action_imp.duree_action && <small className="p-error">Champ obligatoire!</small>}
</div> 
      </Col>
      </Row>
      {/* {props.typemarche==="Réalisation" &&      <Row>
      <div style={{paddingTop:"20px"}}>
           <label htmlFor="cout" className="font-bold">
               Paiment
           </label>
           <div className="flex align-items-center">
        <RadioButton  inputId="ingredient1" value="Phase" checked={action_imp.paiment === 'Phase'} onChange={(e) => onInputChangeIm(e, 'paiment')} className={classNames({ 'p-invalid': submittedIm && !action_imp.echelle })} />
        <label htmlFor="ingredient1" className="ml-2"  >Phase</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton  inputId="ingredient2"  value="Tache" checked={action_imp.paiment === 'Tache'} onChange={(e) => onInputChangeIm(e, 'paiment')} className={classNames({ 'p-invalid': submittedIm && !action_imp.echelle })}/>
        <label htmlFor="ingredient2" className="ml-2" >Tâche</label>
    </div>
           {submittedIm && !action_imp.paiment && <small className="p-error">Champ obligatoire!</small>}
     </div> 
      </Row> } */}
 
    </Dialog>)
}