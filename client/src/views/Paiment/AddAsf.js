import React , {useState,useEffect,useRef} from "react"
import {listAttachement,AddASF} from '../../utils/APIRoutes';
import { useNavigate,useParams  } from 'react-router-dom';
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
        
export default function AddAsf(props) {
    const Navigate  = useNavigate ()
    const [submittedIm, setSubmittedIm] = useState(false);
    const token = localStorage.getItem('token');
const id= useParams().idprog;
   const [Attachement,setAttachement]=useState([])
   const [addasf,setaddasf]=useState({})
   const [selectedattachement, setselectedattachement] = useState([]);
   function getAttachment() {
    fetch(listAttachement, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({idprog:id,type:"valide"})})
      .then((response) => response.json())
      .then((data) => {
          setAttachement(data.allPosts);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
  /*********************************** */
  const showMessage = (event, ref, severity) => {
    const label ="Erreur";
    ref.current.show({
      severity: severity,
      summary: label,
      detail: "Selectionner un ou plusieurs tache",
      life: 3000,
    });
  };
  const toastTopLeft = useRef(null);
  const _addasf = (e) => {
    if(props.SelectedAtt.length === 0 )
    {
      showMessage(e, toastTopLeft, "error");
    }else{
      if(!addasf.conf || !addasf.signataire)
      {
        setSubmittedIm(true)
      }
      else
      {
        fetch(AddASF, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedattachement: props.SelectedAtt ,addasf:addasf}),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if (data.rep == "true") {
              getAttachment()
              props.getAsfs()
              props.setSelectedAtt([])
           props.setaddasf(false)
            } 
          });
      }
 
    }
  };

  /************************************ */

  useEffect(() => {
    getAttachment()
  }, []); 
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let asf = { ... addasf };
    asf[`${name}`] = val;
    setaddasf(asf);
   
  };
  const rightToolbarTemplate = () => {
    return (
    <>
        <div className="flex flex-wrap gap-3 p-fluid pr-3">
          <div className="flex-auto">
          {Attachement.INSTITUTION_PILOTE=="HCDS" ?<label htmlFor="ssn" className="font-bold block mb-2">
             Haut-commissaire au développement de la steppe 
            </label>:  <label htmlFor="ssn" className="font-bold block mb-2">
            Conservateur des forêts
            </label>}
            <InputText
            value={addasf.signataire}
            onChange={(e) => onInputChange(e,'signataire')}
            className={classNames({ 'p-invalid': submittedIm && !addasf.signataire})}
            />
              {submittedIm && !addasf.signataire && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             conformément
            </label>
            <InputTextarea    value={addasf.conf}
            onChange={(e) => onInputChange(e,'conf')} rows={5} cols={100}
            className={classNames({ 'p-invalid': submittedIm && !addasf.conf})} />
             {submittedIm && !addasf.conf && <small className="p-error">Champ obligatoire !</small>}
          </div>

      
        </div>
    </>
    );
  };
  const footer = () => {
    return (
      <>
         <Button
            style={{ color: 'var(--red-400)',borderColor:'var(--red-400)' ,marginRight:'10px', borderRadius: 'var(--border-radius)'}} label="Annuler" icon="pi pi-times" outlined
            onClick={(e) => {_addasf(e);}}/>
             <Button
            label="Ajouter"
            icon="pi pi-check"
            style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-300)' , borderRadius: 'var(--border-radius)'}}
            onClick={(e) => {
              _addasf(e);
            }}/></>
   
          
    );
  };
    return(

          <Dialog  headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
          footer={footer} onHide={()=> props.setaddasf(false)} visible={true}  style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Compléter les informations liées à l'ASF" modal className="p-fluid" >
            <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
      <Toast ref={toastTopLeft} />
         </Dialog>)
}