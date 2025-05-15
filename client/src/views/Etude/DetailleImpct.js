import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useParams,useNavigate,useLocation } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import MapComponent from '../Map/MapComponent';
import {Col,Row} from "reactstrap";
import {getWilaya,getCommune,getEntreprise,updateActImpct,uploadGeoJson,getDetailActionImpact,updateEtude} from '../../utils/APIRoutes';
export default function DetailleImpct (){
    const id_action_impacte= useParams().idimpct;
    const idprog= useParams().id;
    const location = useLocation();
    const objectData = location.state?.objectData;
    const token = localStorage.getItem('token');
    const [submittedIm, setSubmittedIm] = useState(false);
    const [disablef,setdisablef]=useState(true);
    const [disablep,setdisablep]=useState(true);
    const [disablee,setdisablee]=useState(true);
    const [wilaya,setwilaya]=useState([]);
    const [commune,setcommune]=useState([]);
    const [entreprise,setentreprise]=useState([]);
    const [addfai,setaddfai]=useState(false);
    const optionsAxe=[{label:"EXTENSION DU BARRAGE VERT",value:"EXTENSION DU BARRAGE VERT"},{label:"DEVELOPPEMENT DU BARRAGE VERT",value:"DEVELOPPEMENT DU BARRAGE VERT"},{label:"REHABILITATION DU BARRAGE VERT",value:"REHABILITATION DU BARRAGE VERT"}]
    const optionsInstitution=[{label:"FORETS",value:"FORETS"},{label:"DSA",value:"DSA"},{label:"HCDS",value:"HCDS"}]
    const Faisable=[{label:'NON',value:'0'},{label:'OUI',value:"1"}]
    const [action_imp,setaction_imp]=useState({});
    const [etudepre,setetudepre]=useState({id_action_impactee :id_action_impacte,type_etude:5 ,faisable:"",date_lancement:"",date_remise_prov:"",date_validation:"",date_remise_final:"",description:"",milieux_physique:"",objectif:"",contrainte_non_fais:"",detail:""});
    const [etudefai,setetudefai]=useState({id_action_impactee :id_action_impacte,type_etude:2,faisable:"",date_lancement:"",date_remise_prov:"",date_validation:"",date_remise_final:"",description:"",milieux_physique:"",objectif:"",contrainte_non_fais:""});
    const [etudeexu,setetudeexu]=useState({id_action_impactee :id_action_impacte,type_etude:3,faisable:"",date_lancement:"",date_remise_prov:"",date_validation:"",date_remise_final:"",description:"",milieux_physique:"",objectif:"",contrainte_non_fais:"",detail:""});
    const [chenin,setchemin]=useState(false);
    const Navigate  = useNavigate ();
    const formData = new FormData();
    
    function UpdateActionIm() {
        if(!action_imp.id_entreprise_realisation || !action_imp.code_wilaya || !action_imp.code_commune || !action_imp.LOCALITES || !action_imp.AXE || !action_imp.UNITE || !action_imp.COUT_UNITAIRE_VALIDE || !action_imp.INSTITUTION_PILOTE || !action_imp.VOLUME_VALIDE )
        {
          setSubmittedIm(true)
        }
        else{
          fetch(updateActImpct, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(action_imp),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {
               
            
              } 
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
        function getDetailAction() {
          fetch(getDetailActionImpact, {
            method: 'POST',
            credentials: 'include',
            cache: 'no-cache',
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({id_action_impactee:id_action_impacte})
          })
            .then((response) => response.json())
            .then((data) => {
              setaction_imp(data.action);
              setchemin(true)
              getListCommune(data.action.code_wilaya);
              data.etude.forEach((etudeItem)=> {
                if (etudeItem.type_etude==2) {
                  setetudefai(etudeItem)
                }
                if (etudeItem.type_etude==3) {
                  setetudeexu(etudeItem)
                }
                if (etudeItem.type_etude==5) {
                  setetudepre(etudeItem)
                }
              })
             })
            .catch((error) => {
              console.log('Error:', error);
            });
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
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setentreprise(data);
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      } 
      function setEtude(etude) {
        fetch(updateEtude, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(etude),
        })
          .then((response) => response.json())
          .then((data) => {
            if(data=="true"){
            setdisablef(true)
            setdisablep(true)
            setdisablee(true)
            getDetailAction()}
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      } 
      useEffect(() => {
        getDetailAction();
        getListWilaya();
       
        getListEntreprise();
      }, []); 
      const onInputChangeIm = (e, name) => {
        let _actionIm = { ... action_imp };
        if(name=="code_wilaya")
        { 
          _actionIm[`code_commune`] = "";
        }
        const val = (e.target && e.target.value) || '';
        _actionIm[`${name}`] = val;
        setaction_imp(_actionIm);
       console.log(action_imp)
      };
      
      const onInputChangePre = (e, name) => {
        let value = e.target?.value;
      
        // Handle date fields and add one day
        if (name === 'date_lancement' || name === 'date_remise_prov' || name === 'date_validation' || name === 'date_remise_final') {
          const originalDate = new Date(value);
      
          if (!isNaN(originalDate.getTime())) {
            // Add one day to the date
            const newDate = new Date(originalDate);
            newDate.setDate(newDate.getDate() + 1);
      
            // Format the date to the desired string format (e.g., ISO 8601)
            value = newDate.toISOString().slice(0, 10); 
          } else {
            console.error('Invalid date:', value);
          }
        }
      
        setetudepre((prevState) => ({
          ...prevState,
          [name]: value || '',
        }));

      };
      const onInputChangeFai = (e, name) => {
        console.log(name)
        let value = e.target?.value;
      console.log(name)
      console.log(value,'sofiane')
        if (name === 'date_lancement' || name === 'date_remise_prov' || name === 'date_validation' || name === 'date_remise_final') {
          const originalDate = new Date(value);
      
          if (!isNaN(originalDate.getTime())) {
            // Add one day to the date
            const newDate = new Date(originalDate);
            newDate.setDate(newDate.getDate() + 1);
      
            // Format the date to the desired string format (e.g., ISO 8601)
            value = newDate.toISOString().slice(0, 10); // Adjust the slice based on your desired format
          } else {
            console.error('Invalid date:', value);
          }
        }
      
        setetudefai((prevState) => ({
          ...prevState,
          [name]: value || '',
        }));
      
      };
      const onInputChangeExe = (e, name) => {
        let value = e.target?.value;
      
        // Handle date fields and add one day
        if (name === 'date_lancement' || name === 'date_remise_prov' || name === 'date_validation' || name === 'date_remise_final') {
          const originalDate = new Date(value);
      
          if (!isNaN(originalDate.getTime())) {
            // Add one day to the date
            const newDate = new Date(originalDate);
            newDate.setDate(newDate.getDate() + 1);
      
            // Format the date to the desired string format (e.g., ISO 8601)
            value = newDate.toISOString().slice(0, 10); 
          } else {
            console.error('Invalid date:', value);
          }
        }
      
        setetudeexu((prevState) => ({
          ...prevState,
          [name]: value || '',
        }));
      };
  const itemsA = [
    {
        label: 'Nouveau Attachement',
        icon: 'pi pi-plus',
        command: () => {
         
        }
    },
    {
        label: 'Voir Attachements',
        icon: 'pi pi-eye',
        command: () => {
      
        }
    },
];
const itemsF = [
  {
      label: "Ajouter l'etude",
      icon: 'pi pi-plus',
      command: () => {
       
      }
  },
  {
      label: "Consulter l'etude",
      icon: 'pi pi-eye',
      command: () => {
    
      }
  },
];



   
      function uploadJeson(id) {
        const  path = `${uploadGeoJson}/${id}`
      try {
        fetch(path, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`, // Initialize 'token' before using it
            },
          body: formData,
            }).then((response) => response.json())
             .then((data) => {
            
             formData.forEach((value, key) => {
             formData.delete(key);
             });
        
           })
      } catch (error) {
        console.error('Error uploading file:', error);
      }
         }

         const handleFileChange = (event) => {
            formData.append('file', event.target.files[0]);
            if( event.target.files[0].size > 0)
            { 
              uploadJeson(id_action_impacte);
            }
           
          };
  
    return(
      <div className="content m-2">

        <p style={{fontSize:"26px"}}>Détail de l'etudes de l'action impactée </p>
        <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/ActionImp/${idprog}/etude`, { state: { objectData: objectData } })}} style={{  margin: '10px', background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
         { chenin &&
      <Row>
        <Col md="6">

         <div className="flex flex-wrap gap-2 p-fluid">
         <div  className="flex-auto">
             <label htmlFor="commune" className="font-bold">
               AXE
             </label>
             <Dropdown
                disabled={true}
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
         <div  className="flex-auto">
             <label htmlFor="commune" className="font-bold">
            ACTION
             </label>
             <InputText
                disabled={true}
                 id="commune"
                 optionLabel="label" 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'action');}} 
                 value={action_imp.action} // Selected value
                
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.action})}
             />
             {submittedIm && !action_imp.action && <small className="p-error">Champ obligatoire !</small>}
         </div>
         <div className="flex-auto">
             <label htmlFor="wilaya" className="font-bold">
               WILAYA
             </label>
             <Dropdown disabled={true}
                 id="wilaya"
                 optionLabel="label" 
                 options={wilaya} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'code_wilaya');getListCommune(e.value)}} 
                 value={action_imp.code_wilaya} 
                 placeholder="Selectionner la wilaya" 
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.code_wilaya})}
             />
             {submittedIm && !action_imp.code_wilaya && <small className="p-error">Champ obligatoire !</small>}
      </div>
      <div className="flex-auto">
             <label htmlFor="commune" className="font-bold">
               COMMUNE
             </label>
             <Dropdown
                disabled={true}
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
      <div className="flex-auto">
           <label htmlFor="localite" className="font-bold">
               LOCALITES
           </label>
          
           <InputText
            disabled={true} id="localite"    value={action_imp.LOCALITES}
            onChange={(e) => onInputChangeIm(e, 'LOCALITES')} required
            className={classNames({ 'p-invalid': submittedIm && !action_imp.LOCALITES })} />
           {submittedIm && !action_imp.LOCALITES && <small className="p-error">Champ obligatoire !</small>}
     </div>  
   
          <div className="flex-auto">
             <label htmlFor="institution" className="font-bold">
               INSTITUTION PILOTE
             </label>
             <Dropdown
              disabled={true}
                 id="institution"
                 optionLabel="label" 
                 options={optionsInstitution} 
                 onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'INSTITUTION_PILOTE');}} 
                 value={action_imp.INSTITUTION_PILOTE} // Selected value
                 placeholder="Selectionner l'institution" // Placeholder text when nothing is selected
                 className={classNames({ 'p-invalid': submittedIm && !action_imp.INSTITUTION_PILOTE})}
             />
             {submittedIm && !action_imp.INSTITUTION_PILOTE && <small className="p-error">Champ obligatoire !</small>}
      </div>
    
    
    


     {[1,2,5,7,8,10,14,19,28].includes(action_imp.id_action_programme) && <div className="flex-auto">
             <label htmlFor="espese" className="font-bold">
               ESPESE
             </label>
             <InputText
              disabled={true} id="espese" value={action_imp.Espèces}onChange={(e) => onInputChangeIm(e,'Espèces')} required  className={classNames({ 'p-invalid': submittedIm && !action_imp.Espèces })} />
             {submittedIm && !action_imp.Espèces && <small className="p-error">Champ obligatoire !</small>}
      </div>}

         </div>
{action_imp.Type_étude.includes(5) &&
<div className="flex-auto mt-3">

    <label  className="font-bold">
     ETUDE PRELIMINAIRE   <br/>
    </label>
    <Row>
  <Button   label="Modifier" icon="pi pi-pencil" text raised style={{ color: 'rgb(113, 198, 209)'}} className="ml-3 pl-2 pr-3 pt-1 pb-1"  onClick={() => {setdisablep(false)}} />
  </Row>
    <Row>
      <Col>
      <label htmlFor="datee"><u>Date lancement</u></label>
      <Calendar dateFormat="dd/mm/yy" value={new Date(etudepre.date_lancement)} disabled={disablep} id="datee" showIcon
      onChange={(e)=>onInputChangePre({ target: { value: e.value } }, 'date_lancement')} />
      </Col>
      <Col>
      <label  htmlFor="dater"><u>Date remise provisoire</u></label>
      <Calendar disabled={disablep} id="dater" showIcon dateFormat="dd/mm/yy" value={new Date(etudepre.date_remise_prov)}
        onChange={(e)=>onInputChangePre({ target: { value: e.value } }, 'date_remise_prov')} />
      </Col>
      <Col>
      <label  htmlFor="datev"><u>Date validation</u></label>
      <Calendar onChange={(e)=>onInputChangePre({ target: { value: e.value } }, 'date_validation')}  dateFormat="dd/mm/yy" value={new Date(etudepre.date_validation)}
       disabled={disablep} id="datev" showIcon />
      </Col>
      <Col>
      <label  htmlFor="datef"><u>Date remise final</u></label>
      <Calendar   onChange={(e)=>onInputChangePre({ target: { value: e.value } }, 'date_remise_final')}
       dateFormat="dd/mm/yy" value={new Date(etudepre.date_remise_final)} disabled={disablep} id="datef" showIcon />
      </Col>
    </Row>
    <Row>
 
    {/* <div class="field col">
    <label htmlFor="datee"><u>Milieu biophysique</u></label>
      <InputTextarea
           value={etudepre.milieux_physique}
           onChange={(e) =>
             setetudepre((prevState) => ({
               ...prevState,
               ['milieux_physique']: e.target.value || '',
             }))
           }
      disabled={disablep} rows={4} cols={50} class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
    </div> */}
    <Col>
    <Row><label htmlFor="datee"><u>Déscription de l'impact</u></label></Row>
      <InputTextarea
           value={etudepre.description}
           onChange={(e) =>
             setetudepre((prevState) => ({
               ...prevState,
               ['description']: e.target.value || '',
             }))
           }
      disabled={disablep} rows={5} cols={60} class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" /></Col>
   
    </Row>
    <Row>
    <Col>
    
      <Row><label htmlFor="datee"><u>Objectifs</u></label></Row>
      <InputTextarea     
       value={etudepre.objectif}
      onChange={(e) =>
        setetudepre((prevState) => ({
          ...prevState,
          ['objectif']: e.target.value || '',
        }))
      } class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" disabled={disablep} rows={5} cols={60} />

      {/* <div class="field col md:col-6">
      <label htmlFor="datee"><u>Détail de l'etude</u></label>
      <InputTextarea  
      value={etudepre.detail}
            onChange={(e) =>
              setetudepre((prevState) => ({
                ...prevState,
                ['detail']: e.target.value || '',
              }))
            }
      className="text-base text-color surface-overlay mr-2 p-2 border-1 border-solid surface-border border-round  outline-none focus:border-primary w-full" disabled={disablep} rows={4} cols={50} />
      </div>  */}
         <div class="field col-12 md:col-2">
      <label><u>Faisable</u></label>
      <Dropdown value={etudepre.faisable}    onChange={(e) =>
             setetudepre((prevState) => ({
               ...prevState,
               ['faisable']: e.target.value || '',
             }))
           } 
      options={Faisable}  disabled={disablep} className="ml-1"/>
     </div>
      </Col>
   
    </Row>

       <Row style={{ justifyContent: 'flex-end' }}> 
      <Button  disabled={disablep} label="Enregistrer les modifications" icon="pi pi-pencil"  raised style={{ backgroundColor: 'rgb(113, 198, 209)', border:'none'}} className="m-2 pl-2 pr-3 pt-1 pb-1"  onClick={() => {setEtude(etudepre)}} />
      </Row>
  </div>}
  {action_imp.Type_étude.includes(2) &&
<div className="flex-auto  mt-2">
    <label  className="font-bold">
     ETUDE FAISABILITE   <br/>
    </label>
    <Row>
      <Button   label="Modifier" icon="pi pi-pencil" text raised style={{ color: 'rgb(113, 198, 209)'}} className="ml-3 pl-2 pr-3 pt-1 pb-1"  onClick={() => {setdisablef(false);setdisablee(true)}} />
    </Row>
    <Row>
      <Col>
      <label><u>Date lancement</u></label>
      <Calendar type="date" dateFormat="dd/mm/yy"
      value={etudefai.date_lancement !== null ? new Date(etudefai.date_lancement) : null}
       onChange={(e)=>onInputChangeFai({ target: { value: e.value } }, 'date_lancement')}  
      showIcon 
      disabled={disablef}/>
      </Col>
      <Col>
      <label><u>Date remise provisoire</u></label>
      <Calendar dateFormat="dd/mm/yy" 
      value={etudefai.date_remise_prov !== null ? new Date(etudefai.date_remise_prov) : null}
      onChange={(e)=>onInputChangeFai({ target: { value: e.value } }, 'date_remise_prov')}  disabled={disablef} type="date" showIcon />
      </Col>
      <Col>
      <label><u>Date validation</u></label>
      <Calendar dateFormat="dd/mm/yy" value={new Date(etudefai.date_validation)} onChange={(e)=>onInputChangeFai({ target: { value: e.value } }, 'date_validation')}  disabled={disablef} type="date" showIcon />
      </Col>
      <Col>
      <label><u>Date remise final</u></label>
      <Calendar dateFormat="dd/mm/yy" value={new Date(etudefai.date_remise_final) } onChange={(e)=>onInputChangeFai({ target: { value: e.value } }, 'date_remise_final')}  disabled={disablef} type="date" showIcon />
      </Col>
    </Row>

    <Row>
    <div class="formgrid grid ml-1 mr-2">
    {/* <div class="field col">
  <label htmlFor="datee"><u>Milieu biophysique</u></label>
  <InputTextarea
  value={etudefai.milieux_physique}
    onChange={(e) =>
      setetudefai((prevState) => ({
        ...prevState,
        ['milieux_physique']: e.target.value || '',
      }))
    }
    disabled={disablef}
    rows={4}
    cols={50}
    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
  />
</div> */}
    <div class="field col">
    <label htmlFor="desc"><u>Description de l'impact</u></label>
      <InputTextarea 
      id='desc'
      value={etudefai.description}
      onChange={(e) =>
        setetudefai((prevState) => ({
          ...prevState,
          ['description']: e.target.value || '',
        }))
      }
      disabled={disablef} rows={4} cols={50} 
      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field col-12 md:col-2">
      <label><u>Faisable</u></label>
      <Dropdown value={etudefai.faisable} onChange={(e)=>onInputChangeFai({ target: { value: e.value } }, 'faisable')} 
      options={Faisable}  disabled={disablef} className="ml-1"/>
     </div>
   
     {etudefai.faisable==0 &&   <div class="field  col-12 md:col-5"> <label htmlFor="datee"><u>Contraintes de non-faisabilité</u></label>
      <InputTextarea 
      value={etudefai.contrainte_non_fais}
           onChange={(e) =>
            setetudefai((prevState) => ({
              ...prevState,
              ['contrainte_non_fais']: e.target.value || '',
            }))
          }
      class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" disabled={disablef} rows={5} cols={40} /> </div>
      }
</div>
    </Row>
    <Row>
   
      <label htmlFor="datee"><u>Observations</u></label>
      <InputTextarea  
      value={etudefai.objectif}
            onChange={(e) =>
              setetudefai((prevState) => ({
                ...prevState,
                ['objectif']: e.target.value || '',
              }))
            }
      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round  outline-none focus:border-primary w-full" disabled={disablef} rows={4} cols={40} />
     
   
    </Row>
    <Row>
  
   
    
    </Row>
    <Row style={{ justifyContent: 'flex-end' }}> 
      <Button  disabled={disablef} label="Enregistrer les modifications" icon="pi pi-pencil"  raised style={{ backgroundColor: 'rgb(113, 198, 209)', border:'none'}} className="m-2 pl-2 pr-3 pt-1 pb-1"  onClick={() => {setEtude(etudefai)}} />
      </Row>
  </div>}

  {action_imp.Type_étude.includes(3) &&
<div className="flex-auto">
    <label  className="font-bold">
     ETUDE EXECUTION  <br/>
    </label>
   <Row>
  <Button   label="Modifier" icon="pi pi-pencil" text raised style={{ color: 'rgb(113, 198, 209)'}} className="ml-3 pl-2 pr-3 pt-1 pb-1"  onClick={() =>{ setdisablee(false);setdisablef(true)}} />
  </Row>
    <Row>
      <Col>
      <label htmlFor="datee"> <u>Date lancement</u></label>
      <Calendar onChange={(e)=>onInputChangeExe({ target: { value: e.value } }, 'date_lancement')} 
      dateFormat="dd/mm/yy" value={new Date(etudeexu.date_lancement) } disabled={disablee} id="datee" showIcon />
      </Col>
      <Col>
      <label  htmlFor="dater"><u>Date remise provisoire</u></label>
      <Calendar  onChange={(e)=>onInputChangeExe({ target: { value: e.value } }, 'date_remise_prov')} 
      dateFormat="dd/mm/yy" value={new Date(etudeexu.date_remise_prov) } disabled={disablee} id="dater" showIcon />
      </Col>
      <Col>
      <label  htmlFor="datev"><u>Date validation</u></label>
      <Calendar  onChange={(e)=>onInputChangeExe({ target: { value: e.value } }, 'date_validation')}
      dateFormat="dd/mm/yy" value={new Date(etudeexu.date_validation) } disabled={disablee} id="datev" showIcon />
      </Col>
      <Col>
      <label  htmlFor="datef"><u>Date remise final</u></label>
      <Calendar  onChange={(e)=>onInputChangeExe({ target: { value: e.value } }, 'date_remise_final')} 
      dateFormat="dd/mm/yy" value={new Date(etudeexu.date_remise_final) }disabled={disablee} id="datef" showIcon />
      </Col>
    </Row>
    {/* <Row><div class="field col md:col-12">
      <label htmlFor="datee"><u>Détail de l'etude</u></label>
      <InputTextarea  
      value={etudefai.detail}
            onChange={(e) =>
              setetudefai((prevState) => ({
                ...prevState,
                ['detail']: e.target.value || '',
              }))
            }
      className="text-base text-color surface-overlay mr-2 p-2 border-1 border-solid surface-border border-round  outline-none focus:border-primary w-full" disabled={disablee} rows={4} cols={70} />
      </div> </Row> */}
    <Row style={{ justifyContent: 'flex-end' }}> 
      <Button  disabled={disablee} label="Enregistrer les modifications" icon="pi pi-pencil"  raised style={{ backgroundColor: 'rgb(113, 198, 209)', border:'none'}} className="m-2 pl-2 pr-3 pt-1 pb-1" onClick={() => {setEtude(etudeexu)}} />
      </Row>
  </div>}
  {/* <div className="flex-auto mt-5">       
   <label  style={{backgroundColor:"#E76F51",fontSizesize:"20px",padding:"8px",color:"white"}} className='addfile' htmlFor="file-input">
              <i className="pi pi-map-marker  ml-2" />  Ajouter Fichier GeoJSON 
    </label>
    <input 
     className='inputfile'
      id="file-input"
      type="file"
      name="file"
      style={{ display: 'none' }}
       onChange={(e)=>handleFileChange(e)}
      />
  </div> */}
      {/* <div className="flex-auto mt-5">  
<Button label="Enregistrer les Modification" icon="pi pi-check" className="ml-2" disabled={disable} onClick={UpdateActionIm} />
</div> */}
      </Col>
         <Col md="6">
          <h6>Carte</h6>
  <MapComponent data={action_imp} type={"etude"}/>
        </Col>   
    </Row>
}
      </div>
     )
}