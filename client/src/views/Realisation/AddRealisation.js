import React, { useState, useEffect ,useRef } from "react";
import { getPhases } from "../../utils/APIRoutes";
import { addRealisation,uploadImageRealisation,getListTach,getDetailTach} from "../../utils/APIRoutes";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { InputText } from "primereact/inputtext";
import { Row, Col } from "reactstrap";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { InputTextarea } from "primereact/inputtextarea";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import UpdateTache from "views/Tache/UpdateTache";

function AddRealisation(props) {
  const token = localStorage.getItem("token");
  const [submittedIm, setSubmittedIm] = useState(false);
  const [phase, setphase] = useState([]);
  const [tache, settache] = useState([]);
  const [id_tache, setid_tache] = useState(null);
  const [id_phase, setid_phase] = useState({});                           
  const [detailleTache, setdetailleTache] = useState({});
  const [loading,setloading]=useState(false)
  const [disableAdd,setdisableAdd]=useState(false)
  const [newRealisationData, setNewRealisationData] = useState({
    date_visite: "",
    volume_realise: "",
    recommandation: "",
  });

  const [showcpt,setshowcpt]=useState(false);
  const [casee,setcasee]=useState("")
  const toast = useRef(null);
  /*************************************************** */
  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: "L'ajout de la réalisation a été effectué avec succès.", life: 3000 });
}
const formData = new FormData();
  const id_action_impactee = props.id_action_impactee;

  const getphases = () => {
      fetch(getPhases, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id_action_impactee:id_action_impactee}),
      })
        .then((response) => response.json())
        .then((data) => {
            setphase(data)
        })
        .catch((error) => {
          console.log("Error:", error);
        });
  };
  const gettache = (id_phase) => {
    fetch(getListTach, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_phase:id_phase}),
    })
      .then((response) => response.json())
      .then((data) => {
        settache(data)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
};
function getdettache () {
  fetch(getDetailTach, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({id_tache:id_tache}),
  })
    .then((response) => response.json())
    .then((data) => {
        setdetailleTache(data)
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
  useEffect(() => {
    getphases();
  }, []); 
  useEffect(() => {
    getdettache()
  }, [id_tache]); 
  const confirm = () => {
    confirmDialog({
        message: "Le volume que vous avez saisi dépasse le volume total prévu pour cette tâche",
        header: 'Attention',
        icon: 'pi pi-times-circle',
        acceptClassName: 'p-button-danger',
        footer: (props) => {
            const { accept, reject } = props;
  
            const handlereject = () => {
        
            };
  
            return (
                <>
                    <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="ok" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
                </>
            );
        },
    });
  };
  const addNewRealisation = () => {
 
    if (!newRealisationData.date_visite || !newRealisationData.volume_realise || !newRealisationData.recommandation) {
  
      setSubmittedIm(true);
    } else {
      setloading(true)
        fetch(`${addRealisation}/${id_tache}`, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newRealisationData),
        })
          .then((response) => response.json())
          .then((data) => {
            if(data.message==="exist")
              {
                toast.current.show({ severity:'error', summary: "Erreur d'ajout", detail: "Cet enregistrement existe déjà dans les réalisations de cette tâche", life: 5000 });
                setdisableAdd(false)
              }
            if(data.message ==="Volume réalisé dépasse la quantité de tâche")
              {
                toast.current.show({ severity:'error', summary: "Erreur d'ajout", detail: "Le volume total réalisé dépasse la quantité prévue pour cette tâche", life: 5000 });
                setdisableAdd(false)
              }
            if (data.message == "true") {
            
            uploadRealisation(data.id_realisation);
            setNewRealisationData(prevState => ({
              ...prevState,
              volume_realise: ""
            }));
            setid_tache(null)
            setloading(true)
            setdisableAdd(false)
            toast.current.show({severity:'success', summary: 'Succès', detail:"L'ajout de la réalisation a été effectué avec succès", life: 3000});
            }
            if(data.message==="first")
              { 
                setloading(true)
                setdisableAdd(false)
                toast.current.show({severity:'success', summary: 'Succès', detail:"L'ajout de la réalisation a été effectué avec succès", life: 3000});
                setcasee("first")
                setshowcpt(true)
      
              }
            if(data.message==="last")
              {
                setcasee("last")
                setshowcpt(true)
                setloading(true)
                setdisableAdd(false)
                toast.current.show({severity:'success', summary: 'Succès', detail:"L'ajout de la réalisation a été effectué avec succès", life: 3000});
              //  props.setaddrealisation(false);
              }
              if(data.message==="first last")
                {
                  setcasee("first last")
                  setshowcpt(true)
                  setloading(true)
                  setdisableAdd(false)
                  toast.current.show({severity:'success', summary: 'Succès', detail:"L'ajout de la réalisation a été effectué avec succès", life: 3000});
                //  props.setaddrealisation(false);
                }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
    

    }
  };
  
  function uploadRealisation(id) {

    const  path = `${uploadImageRealisation}/${id}`
  try {
    if(formData) 
    {fetch(path, {
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
  }} catch (error) {
    console.error('Error uploading file:', error);
  }
     }

  const actionImDialogFooter = (
    <React.Fragment>
    <Button
      label="Retour" raised
      icon="pi pi-replay"
      onClick={()=>props.setaddrealisation(false)}

      style={{ backgroundColor: 'var(--red-400)',borderColor:'var(--red-400)' , borderRadius: '20px'}}
    />
    <Button disabled={disableAdd} label="Ajouter" icon="pi pi-check" className="ml-2 " raised onClick={()=>{setdisableAdd(true);addNewRealisation();}} style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: '20px'}} />
  </React.Fragment>
);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRealisationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    formData.append('file', event.target.files[0]);
  };


  return (
    <>
      {showcpt && <UpdateTache action_imp={props.action_imp} id_action_impactee={id_action_impactee} setshowcpt={setshowcpt} id_tache={id_tache} case={casee}/>}
<Toast ref={toast}  position="top-center"/>
{loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>}
<Dialog
  visible={props.addrealisation}
  headerStyle={{ backgroundColor: 'var(--green-400)', height:"4rem",borderRadius:'20px',color:'#fff',marginBottom:'7px'}}
  breakpoints={{ '960px': '75vw', '641px': '90vw' }}
  header="Ajouter Nouvelle Realisation"
  modal
  className="p-fluid"style={{ width: '50rem'}} 
  footer={actionImDialogFooter}
  onHide={() => props.setaddrealisation(false)}
>

<ConfirmDialog     group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center pr-2 pl-2 pt-6 pb-3 surface-overlay border-round">
                        <div className="border-circle inline-flex justify-content-center align-items-center h-5rem w-5rem -mt-8" style={{ backgroundColor: 'var(--red-600)',color: 'var(--primary-color-text)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}>
                            <i className="pi pi-times-circle text-5xl" ></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-2" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                          {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-3" ref={footerRef}>
                            <Button
                            style={{ backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}
                             
                                onClick={(event) => {
                                    hide(event);
                                    
                                }}
                                label="OK"
                                className="w-8rem"
                            ></Button>
                       
                      
                        </div>
                    </div>
                )} />
  <Row>
    <Col>
    <label htmlFor="action" className="font-bold">
             PHASE
             </label>
             <Dropdown
                 id="action"
                 optionLabel="label" 
                 options={phase}
                 value={id_phase} 
                 placeholder="Selectionner la phase" 
                onChange={(e)=>{setid_phase(e.target.value);gettache(e.target.value)}}
             />
         
             </Col>

             <Col>
    <label htmlFor="action" className="font-bold">
          TÄCHE
             </label>
             <Dropdown
                 id="action"
                 optionLabel="label" 
                 options={tache}
                 value={id_tache} 
                 placeholder="Selectionner la tâche" 
                 onChange={(e)=>{setid_tache(e.target.value)}}
             />
            
             </Col>

  </Row>
  {(id_tache != null ) &&
  <Row>
    <Col md="12">
      <form>
      <div className="p-field">
          <label htmlFor="date_visite" className="font-bold" >DATE VISITE</label>
          <br />
          <InputText
            id="date_visite"
            name="date_visite"
            type="date"
            value={newRealisationData.date_visite}
            onChange={handleInputChange}
            className={classNames({ 'p-invalid': submittedIm && !newRealisationData.date_visite})}
          />
           {submittedIm && !newRealisationData.date_visite && <small className="p-error">Champ obligatoire !</small>}
        </div>

        <div className="p-field">
          <label htmlFor="volume_realise" className="font-bold">VOLUME REALISE ({detailleTache.unite_tache})</label>
          <br />
          <InputText
        
            id="volume_realise"
            type="number"
            name="volume_realise"
            className={classNames({ 'p-invalid': submittedIm && !newRealisationData.volume_realise})}
            value={newRealisationData.volume_realise}
            onChange={handleInputChange}
          
          />
          {submittedIm && !newRealisationData.volume_realise && <small className="p-error">Champ obligatoire !</small>}
        </div>
        <div className="p-field">
          <label htmlFor="recommandation" className="font-bold">RECOMMANDATION</label>
          <br />
          <InputTextarea
            id="recommandation"
            name="recommandation"
            value={newRealisationData.recommandation}
            onChange={handleInputChange}
            className={classNames({ 'p-invalid': submittedIm && !newRealisationData.recommandation})}
          />
           {submittedIm && !newRealisationData.recommandation && <small className="p-error">Champ obligatoire !</small>}
        </div>
      </form>
    </Col>

    <Col md="12 mt-1">
    
    <label htmlFor="file-input" className="font-bold">IMPORTER UNE PHOTO DU CHANTIER</label>
      <form>
   
    <input 
       required
      id="file-input"
      type="file"
      name="file"
      style={{backgroundColor:"#E76F51",fontSizesize:"20px",padding:"8px",color:"white"}}
      className="inputfile pi pi-paperclip ml-2"
       onChange={(e)=>handleImageChange(e)}
      /> 
      </form>
   
    </Col>

  </Row>}
</Dialog>


  </>

  );
}

export default AddRealisation;
