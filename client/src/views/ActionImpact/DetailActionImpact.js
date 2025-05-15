import React, { useState, useEffect,useRef } from "react";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { SplitButton } from 'primereact/splitbutton';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import MapComponent from '../Map/MapComponent';
import {Col,Row} from "reactstrap";
import { useNavigate  } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Phase from "../Phase/Phase"
import {getWilaya,getCommune,getEntreprise,updateActImpct,uploadGeoJson,getDetailActionImpact} from '../../utils/APIRoutes';
import UpdateTache from "views/Tache/UpdateTache";
import AddRealisation from "../Realisation/AddRealisation"
import RealisationsList from "views/Realisation/realisationList";
import Listattachement from "../attachement/Listattachement";
import JournalRealisation from "views/Realisation/JournalRealisation";
import { Toast } from 'primereact/toast';

import '../Tache/Css.css';
export default function DetailActionImpact (){
  const toast = useRef(null);
    const Navigate  = useNavigate ();
    const location = useLocation();
    const objectData = location.state?.objectData;
    const id_action_impacte= useParams().idimpct;  
    const idprog= useParams().idprog; 
    const idmarche=useParams().idmarche;
    const type= useParams().action; 
    const nummarche=useParams().nummarche;
    const token = localStorage.getItem('token');
    const [submittedIm, setSubmittedIm] = useState(false);
    const [disable,setdisable]=useState(true);
    const [wilaya,setwilaya]=useState([]);
    const [commune,setcommune]=useState([]);
    const [entreprise,setentreprise]=useState([]);
    const optionsAxe=[{label:"EXTENSION DU BARRAGE VERT",value:"EXTENSION DU BARRAGE VERT"},{label:"DEVELOPPEMENT DU BARRAGE VERT",value:"DEVELOPPEMENT DU BARRAGE VERT"},{label:"REHABILITATION DU BARRAGE VERT",value:"REHABILITATION DU BARRAGE VERT"}]
    const optionUnite=[{label:"KM",value:"KM"},{label:"HA",value:"HA"},{label:"M3",value:"M3"},{label:"MI",value:"MI"}]
    const optionsInstitution=[{label:"FORETS",value:"FORETS"},{label:"DSA",value:"DSA"},{label:"HCDS",value:"HCDS"}]
    const [action_imp,setaction_imp]=useState({});
    const [chenin,setchemin]=useState(false);
    const [showcpt,setshowcpt]=useState(false);
    const [addcpt,setaddcpt]=useState(false);
    const [showJournal,setshowJournal]=useState(false);
    const [addrealisation,setaddrealisation]=useState(false);
    const [listrealisation,setlistrealisation]=useState(false);
    const [listattachement,setlistattachement]=useState(false);
    const [formData,setformData]=useState(new FormData())
    const [etude,setetude]=useState([]);
    const fileInputRef = useRef(null);
   // const formData = new FormData();
   const navigateWithObject = () => {
   if(type==="real")
    {
      Navigate(`/admin/ActionImp/${idprog}/realisation`, { state: { objectData: objectData } });
    }
   if(type==="updateR")
    {
      Navigate(`/admin/allimp/${idmarche}/${idprog}/${nummarche}/Réalisation`)
    }
    if(type==="updateE")
      {
        Navigate(`/admin/allimp/${idmarche}/${idprog}/${nummarche}/Etude`)
      }
   
  };
    function UpdateActionIm() {
   
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
              setdisable(true)
              } 
            })
            .catch((error) => {
              console.error(error);
            });
          
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
              setetude(data.etude)
              getListCommune(data.action.code_wilaya);
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
            getListCommune(action_imp.code_wilaya);
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
          body: JSON.stringify({idmarche:idmarche}),
        })
          .then((response) => response.json())
          .then((data) => {
            setentreprise(data);
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
   

    const itemsR = [
      {
          label: 'Nouvelle Réalisation',
          icon: 'pi pi-plus',
          command: () => {
            setaddrealisation(true)
          }
      },
      {
          label: 'Voir Réalisations',
          icon: 'pi pi-times',
          command: () => {
            setlistrealisation(true)
        
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
              if(data==="update")
                  {
                    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'La localisation a été modifiée avec succèes', life: 3000 });
                    setformData(new FormData())
                    if (fileInputRef.current) {
                       fileInputRef.current.value = '';
                    }
                    //  formData.forEach((value, key) => {
                    //formData.delete(key);
                    //});
                }
           })
      } catch (error) {
        console.error('Error uploading file:', error);
      }
         }
  const handleFileChange = (event) => {
            formData.append('file', event.target.files[0]);       
          };
          const [actionImpChanged, setActionImpChanged] = useState(0);
          useEffect(() => {
            // Call MapComponent when action_imp changes
            if (action_imp && Object.keys(action_imp).length > 0) {
              setActionImpChanged(((prevKey) => prevKey + 1));  // Increment the key to force re-render
            }
          }, [action_imp]);
        
    return(
      <div className="content m-2">
          <Toast ref={toast} />
     {addcpt && <Phase action_impacte={action_imp} setshowcpt={setaddcpt}/>}
      {showcpt && <UpdateTache action_imp={action_imp} id_action_impactee={action_imp.id_action_impactee} setshowcpt={setshowcpt} case={"null"}/>}
      {addrealisation && <AddRealisation action_imp={action_imp} addrealisation={addrealisation } setaddrealisation ={setaddrealisation} id_action_impactee={action_imp.id_action_impactee}/>}
     {listrealisation && <RealisationsList listrealisation={listrealisation} id_action_impactee={action_imp.id_action_impactee} setlistrealisation={setlistrealisation} />}
     {listattachement && <Listattachement listrealisation={listattachement} id_action_impactee={action_imp.id_action_impactee} setlistattachement={setlistattachement} />}
     {showJournal && <JournalRealisation id_action_impactee={action_imp.id_action_impactee} setshowJournal={setshowJournal}/>}
      {/* {addAttachement && <Attachement id_action_impactee={action_imp.id_action_impactee} addAttachement={addAttachement} setaddAttachement={setaddAttachement} />} */}
        <div >
          {(type ==='updateR' || type ==='updateE')&& <p style={{  marginLeft: '10px',fontSize:'26px'}}>Détail de l'action du marché N° {nummarche}</p>}
          {(type ==='real')&& <p style={{ fontSize:'22px', marginLeft: '10px'}}>Détail de l'action </p>}

        </div>
      
         
         { chenin &&
      <Row>
        <Col xs={12} md={5}>
          <div className="mb-3 detailimp" style={{ display: 'flex' }}>
          <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{navigateWithObject()}} style={{  marginRight: '10px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
         
          {type==='real' &&  <SplitButton label="Realisation" icon="pi pi-check" raised size="small" className="p-button-success mr-2" model={itemsR}  />}
         {  (type ==='updateR' || type==='updateE') && <Button label="Modifier" icon="pi pi-pencil" raised  className="mr-2" size="small" onClick={()=>{setdisable(false) }} />}
            {(type ==='updateR' || type==='real') &&  <Button label="CPT" onClick={()=> setshowcpt(true)} icon="pi pi-list" raised size="small"  className="p-button-secondary mr-2"/>}
            {  (type ==='updateR') && <Button label="Journal chantiers" icon="pi pi-pencil" raised  className="mr-2 " severity="success" size="small" onClick={()=>{setshowJournal(true) }} />}
          </div>
      
         <div className="flex flex-wrap gap-2 p-fluid">
         <div  className="flex-auto">
             <label htmlFor="axe" className="font-bold">
               AXE
             </label>
             <Dropdown
                disabled={disable}
                 id="axe"
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
                disabled={disable}
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
             <Dropdown disabled={disable}
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
                 disabled={disable}
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
            disabled={disable} id="localite"    value={action_imp.LOCALITES}
            onChange={(e) => onInputChangeIm(e, 'LOCALITES')} required
            className={classNames({ 'p-invalid': submittedIm && !action_imp.LOCALITES })} />
           {submittedIm && !action_imp.LOCALITES && <small className="p-error">Champ obligatoire !</small>}
     </div>  
         <div className="flex-auto" >
             <label htmlFor="entreprise" className="font-bold">
              ENTREPRISE DE REALISATION
             </label>
             <Dropdown disabled={disable}
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
          <div className="flex-auto">
             <label htmlFor="institution" className="font-bold">
               INSTITUTION PILOTE
             </label>
             <Dropdown
              disabled={disable}
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
      <div className="flex-auto">
           <label htmlFor="volume" className="font-bold">
           VOLUME VALIDE
           </label>
           <InputNumber 
            disabled={disable} id="volume" value={action_imp.VOLUME_VALIDE} onValueChange={(e) => onInputChangeIm(e,'VOLUME_VALIDE')} className={classNames({ 'p-invalid': submittedIm && !action_imp.VOLUME_VALIDE })} />
           {submittedIm && !action_imp.VOLUME_VALIDE && <small className="p-error">Champ obligatoire !</small>}
     </div> 
     <div className="flex-auto">
             <label htmlFor="unite" className="font-bold">
               UNITE
             </label>
             <Dropdown disabled={disable}
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
          <div className="flex-auto">
           <label htmlFor="cout" className="font-bold">
               COUT UNITAIRE
           </label>
           <InputText
             suffix=" DA"
            disabled={disable} id="cout"  value={action_imp.COUT_UNITAIRE} onValueChange={(e) => onInputChangeIm(e,'COUT_UNITAIRE')} required className={classNames({ 'p-invalid': submittedIm && !action_imp.COUT_UNITAIRE })} />
           {submittedIm && !action_imp.COUT_UNITAIRE && <small className="p-error">Champ obligatoire !</small>}
          </div> 
          <div className="flex-auto">
           <label htmlFor="cout" className="font-bold">
           MONTANT PREVU RETENU	
           </label>
           <InputText   suffix=" DA"
            disabled={true} id="cout"  value={action_imp.MONTANT_PREVU_RETENU} required className={classNames({ 'p-invalid': submittedIm && !action_imp.COUT_UNITAIRE })} />
           {submittedIm && !action_imp.COUT_UNITAIRE && <small className="p-error">Champ obligatoire !</small>}
     </div> 
     {[1,2,5,7,8,10,14,19,28].includes(action_imp.id_action_programme) && <div className="flex-auto">
             <label htmlFor="dencite" className="font-bold">
               DENCITE
             </label>
             <InputText
              disabled={disable} id="dencite" value={action_imp.dancite}onChange={(e) => onInputChangeIm(e,'dancite')} required  className={classNames({ 'p-invalid': submittedIm && !action_imp.dancite })} />
             {submittedIm && !action_imp.dancite && <small className="p-error">Champ obligatoire !</small>}
      </div>}

     {[1,2,5,7,8,10,14,19,28].includes(action_imp.id_action_programme) && <div className="flex-auto">
             <label htmlFor="espese" className="font-bold">
               ESPESE
             </label>
             <InputText
              disabled={disable} id="espese" value={action_imp.Espèces}onChange={(e) => onInputChangeIm(e,'Espèces')} required  className={classNames({ 'p-invalid': submittedIm && !action_imp.Espèces })} />
             {submittedIm && !action_imp.Espèces && <small className="p-error">Champ obligatoire !</small>}
      </div>}
   <br/>
  
</div> 
{ (type ==='updateR' || type ==='updateE' ) && <div className="mt-5" >      
   
   <label style={{fontSize:"20px"}} >
            <b><i className="pi pi-map-marker ml-2" />  Ajouter Fichier GeoJSON </b>  

    </label>
<br/>
    <input disabled={disable}
       ref={fileInputRef}
    style={{backgroundColor:"#E76F51",fontSizesize:"20px",padding:"8px",color:"white"}} 
     className='inputfile'
      id="file-input"
      type="file"
      name="file"
      onChange={(e)=>handleFileChange(e)}
      multiple  
      />
  </div>}
{(type ==='updateR' || type ==='updateE') && <div className="flex-auto mt-5">  
<Button label="Enregistrer les Modification" style={{ backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-check" className="ml-2" disabled={disable} 
onClick={() => {
  UpdateActionIm();
  // Vérifier si un fichier a été sélectionné
  const fileInput = document.getElementById('file-input');
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    // Vérifier si la taille du fichier est supérieure à 0
    if (fileInput.files[0].size > 0) {
      uploadJeson(id_action_impacte);
    }
  }
}} />
</div>}
      </Col>
         <Col xs={7} md={12}>
      
      {action_imp &&  <MapComponent key={actionImpChanged} data={action_imp} type={type} etude={etude} />}
        </Col>   
    </Row>
}
      </div>
     )
}