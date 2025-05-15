import React, { useState,useEffect,useRef} from "react";
import {getCpt,DeleteCpt,uploadPdf,ReadPdf,getWilaya,getActionProgramme} from '../../utils/APIRoutes';
import AddCpt from "./AddCpt";
import DetailCpt from "./DetailCpt";
import { useNavigate,useParams} from 'react-router-dom'; 
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

import { Toast } from 'primereact/toast';
import { Row, Col } from "reactstrap";
import { Toolbar } from "primereact/toolbar";
import { ProgressSpinner } from 'primereact/progressspinner';
export default function Cpt() {
    const toast = useRef(null);
    const token = localStorage.getItem("token");
    const id_marche = useParams().idmarche;

    const idprog=useParams().idprog
    const [addcpt,setaddcpt]=useState(false)
    const [listCpt,setlistCpt]=useState({})
    const [Cpt,setCpt]=useState({})
    const [showCpt,setshowCpt]=useState(false)
    const [loading,setloading]=useState(false)
    const [wilaya,setwilaya]=useState([]);
    const [search,setsearch]=useState({wilaya:'',action:''})
    const [submittedIm, setSubmittedIm] = useState(false);
    const [intAction,setintAction]=useState([])
    const Navigate=useNavigate()
  const [layout, setLayout] = useState('grid');
  const formData = new FormData();

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
      body: JSON.stringify(search)})
   
      .then((response) => response.json())
      .then((data) => {
        //const wil = data.map(wilaya => wilaya.label);
        setwilaya(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  } 

const rejectt = () => {
  toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: 'Vous avez annuler la supprision', life: 3000 });
}


  const confirmdelete = (cpt) => {
    confirmDialog({
        message: 'Voulez-vous vraiment supprimer ce CPT ? Vous ne pouvez pas revenir en arrière.',
        header: 'Confirmation de suppression',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        footer: (props) => {
            const { accept, reject } = props;
  
            const handleAccept = () => {
             deleteCpt(cpt);
                accept();
            };
            const handlereject = () => {
              rejectt()
                reject();
        
            };
  
            return (
                <>
                    <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="Annuler" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
                    <Button style={{ backgroundColor: 'var(--primary-400)', color: 'var(--primary-color-text)', borderRadius: 'var(--border-radius)'}} label="Confirmer" icon="pi pi-check" className="p-button-text" onClick={()=>handleAccept(cpt)} />
      
              
                </>
            );
        },
    });
  };

    const gridItem = (cpt) => {
        return (
            <div className="col-12 sm:col-12 lg:col-12 xl:col-4 p-2">
                <div className="p-2 border-3 surface-border surface-card border-round" >
                    <div className="flex flex-column align-items-center justify-center gap-1 py-1">
                        <div  style={{ backgroundColor: 'var(--green-50)', borderRadius: 'var(--border-radius)'}}>
                          &nbsp; &nbsp; <b></b>
                       </div>
                       <div>
                       <center className="text-xl "  style={{ backgroundColor: 'var(--red-100)', borderRadius: '10px'}}>Cahier de prescriptions techniques
                     </center>
                        <br/>
                        <center className=" text-xl  " > 
                        <span style={{ backgroundColor: 'var(--primary-100)', borderRadius: 'var(--border-radius)',fontSize:'22px'}}><i>{cpt.action[0].action}</i></span>
                        </center>
                   
                        <div className="text-xl p-2">
                        <b>WILAYA : </b> {cpt.Wilaya} <br/>         
    <b>COMMUNES / LOCALITES : </b> <br/>
    {cpt.LocalitesGroup.split(', ').map((commune, index) => (
        <span key={index}>
            <b>{commune.split(': ')[0]}</b>: {commune.split(': ')[1]}
            {index < cpt.LocalitesGroup.split(', ').length - 1 && ', '}
        </span>
    ))}
</div>

                     
                      
    
                        </div>      
                    </div>
                    <div className="flex flex-col items-end gap-3 sm:gap-2">
  <Button
    raised
    className="p-button-rounded"
    style={{
      backgroundColor: 'var(--green-400)',
      borderColor: 'var(--green-400)',
      borderRadius: 'var(--border-radius)',
      padding: '0px',
      height:"61px",
      fontSize: "15px",
      width: '200px' // Ajout d'une largeur fixe
    }}
    onClick={() => confirmdelete(cpt)}
  >
    Supprimer le cpt
  </Button>
  <Button
    onClick={() => {
      setCpt(cpt);
      setshowCpt(true);
    }}
    style={{
      backgroundColor: 'var(--green-400)',
      borderColor: 'var(--green-400)',
      borderRadius: 'var(--border-radius)',
      padding: '0px',
      height:"61px",
      fontSize: "15px",
      width: '200px' // Ajout d'une largeur fixe
    }}
    label="Consulter le CPT"
    raised
  />
  <label
    className="addfile"
    htmlFor="file-input"
    style={{
      backgroundColor: 'var(--green-400)',
      borderColor: 'var(--green-400)',
      borderRadius: 'var(--border-radius)',
      padding: '11px',
 
      fontSize: "13px",
      display: 'inline-block',
      cursor: 'pointer',
      color: '#fff',
      width: '200px', // Ajout d'une largeur fixe
      textAlign: 'center', // Centrage du texte
    }}
  >
    Uploader la pièce jointe
  </label>
  <input
    className="inputfile"
    id="file-input"
    type="file"
    name="file"
    style={{ display: 'none' }}
    onChange={(event) => handleFileChange(event, cpt.num_cpt)}
  />
  <Button
    style={{
      backgroundColor: 'var(--green-400)',
      borderColor: 'var(--green-400)',
      borderRadius: 'var(--border-radius)',
      padding: '5px',
      height:"61px",
      fontSize: "15px",
      width: '200px' // Ajout d'une largeur fixe
    }}
    raised
    onClick={() => {
      if (cpt.num_cpt !== "") {
        handleFileOpen(cpt.pdf);
      }
    }}
  >
    Consulter la pièce jointe
  </Button>
</div>

                    {/* <div className="flex flex-col items-end gap-3 sm:gap-2">
                       
                            
                            <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '2px', fontSize: "15px" }} onClick={()=>{confirmdelete(cpt)}} >Supprimer le cpt</Button>
                            <Button  onClick={()=>{setCpt(cpt);setshowCpt(true)}} style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} label="Consulter le CPT" raised />
                            <label 
    className="addfile" 
    htmlFor="file-input" 
    style={{ 
        backgroundColor: 'var(--green-400)', 
        borderColor: 'var(--green-400)', 
        borderRadius: 'var(--border-radius)', 
        padding: '5px', 
        fontSize: "15px", 
        display: 'inline-block',
        cursor: 'pointer',color:'#fff'
    }}
>
    Uploader la pièce jointe
</label>
                <input
                    className="inputfile"
             
                    id="file-input"
                    type="file"
                    name="file"
                    style={{ display: 'none' }}
                    onChange={(event)=>handleFileChange(event,cpt.num_cpt)}
                /> 
                <Button 
               style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '2px', fontSize: "15px" }}
                raised
                onClick={()=>{if(cpt.num_cpt!=""){handleFileOpen(cpt.pdf)}}}
            >
        Consulter la pièce jointe
            </Button>
                        </div>
                        */}
                </div>
                
            </div>
        );
    };
    const itemTemplate = (marche, layout) => {
        if (!marche) {
            return;
        }
    
        if (layout === 'list') return null;
        else if (layout === 'grid') return gridItem(marche);
     };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 ">
           
             <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/marche/${idprog}`)}} style={{  marginRight: '10px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
             <Button raised label="Nouveau CPT" onClick={()=>setaddcpt(true)} style={{ backgroundColor: 'var(--green-300)', marginRight: '20px' ,borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  icon="pi pi-plus" />
             <Dropdown options={wilaya} optionLabel="label" 
         value={search.wilaya}
         placeholder="Filltrer par wilaya" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.wilaya })}`}
         onChange={ (e) => {
           onInputChangeIm({ target: { value: e.value } }, 'wilaya');
    
      }}
         style={{  marginTop: '5px' }} 
         />
              <br/>
         {submittedIm && !search.wilaya && <small className="p-error">Champ obligatoire !</small>}
       
             <Dropdown  style={{  marginTop: '5px' }} 
         value={search.action}
         options={intAction} optionLabel="action" 
         onChange={(e) => { onInputChangeIm({ target: { value: e.value } }, 'action');}}
         placeholder="Filltrer par action" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.action })}`} />
                <br/>
            {submittedIm && !search.action && <small className="p-error">Champ obligatoire !</small>}
    

       
           
              
       
           
            </div>
        );
      };
      function deleteCpt(cpt) {
        setloading(true)
        fetch(DeleteCpt, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
           body: JSON.stringify(cpt)})
    
           .then((reponse) => reponse.json())
           .then((data) => {
           if(data.message=="true")
            {
            toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'supprision avec succes', life: 3000 });
            getAllCpt()
            }
            else
            if(data.message==='exist real')
              {
              toast.current.show({ severity: 'warn', summary: 'Attention', detail: 'Vous ne pouvez pas supprimer ce CPT car il y a des réalisations dans ces localités.', life: 3000 });
              }
              else
              {
              toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'Erreur de supprision', life: 3000 });
              }
              setloading(false)
           })
           .catch((error) => {
             console.log("Error:", error);
           });
       }
      function getAllCpt() {
        fetch(getCpt, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, // Initialize 'token' before using it
           },
           body: JSON.stringify({idmarche:id_marche,search:search})})
    
           .then((reponse) => reponse.json())
           .then((data) => {
            setlistCpt(data)
           })
           .catch((error) => {
             console.log("Error:", error);
           });
       }

       function getIntAction() {
        fetch(getActionProgramme, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({idmarche:id_marche})})
          .then((response) => response.json())
          .then((data) => {
            setintAction(data);
           })
          .catch((error) => {
            console.log('Error:', error);
          });
      } 
       useEffect(() => {
        getAllCpt();
    
      }, [search]);

      useEffect(() => {
      
        getListWilaya();
        getIntAction();
      }, []);
      const onInputChangeIm = (e, name) => {
        let _search = { ... search };
        const val = (e.target && e.target.value) || '';
        _search[`${name}`] = val;
        setsearch(_search);
      
      };



      /****************************** */
      const handleFileChange = (event,num_cpt) => {
        formData.append('file', event.target.files[0]);

          sendFile(num_cpt);
       
      };
      const sendFile = (num_cpt) => {
        var path=`${uploadPdf}/6/${num_cpt}`;
     
        try {
          fetch(path, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, // Initialize 'token' before using it
              },
            body: formData,
              }).then((response) => response.json())
               .then((data) => {
              if(data=="update")
              {
               
                toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le fichier PDF a été uploadé avec succès', life: 3000 });
              }
       
               formData.forEach((value, key) => {
               formData.delete(key);
               });
           
             })
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
/*************************************** */
const handleFileOpen = (fileName) => {
  if(!fileName)
    {
      toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: "La pièce jointe n'a pas encore été uploadée", life: 3000 });
    }
    else
   { fetch(ReadPdf, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Initialize 'token' before using it
      },
      body: JSON.stringify({ fileName: fileName }), // Pass the filename in the body
    })
    .then((response) => {
  
      if (!response.ok) {
        throw new Error('Error fetching file');
      }
      return response.blob(); // Get the response as a Blob
    })
    .then((blob) => {
      const fileURL = URL.createObjectURL(blob); // Create a temporary URL for the file
      window.open(fileURL, '_blank'); // Open the PDF in a new tab
    })
    .catch((error) => {
      console.error('Error opening file:', error); // Log the error
    });
  }
  };


      /************************** */
    return<>
       <Toast ref={toast}  position="top-center" />
       {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}>
    <ProgressSpinner   style={{height: "3rem",width: "3rem",}} /> </div>}
    <ConfirmDialog />
    <div className ="content mt-3"  >
    {addcpt && <AddCpt addcpt={addcpt} getAllCpt={getAllCpt} setaddcpt={setaddcpt} id_marche={id_marche} setCpt={setCpt}/>}
    <p style={{  fontSize: '20px'}} > Cahier de Prescriptions Techniques </p>
    <Toolbar className="mb-2 p-2" left={leftToolbarTemplate}></Toolbar>
    {showCpt && <DetailCpt cpt={Cpt} showCpt={showCpt} setshowCpt={setshowCpt} getAllCpt={getAllCpt}/>}
    <Row>
        <Col md="12">
          <DataView value={listCpt} itemTemplate={itemTemplate} layout={layout} />
        </Col>
      </Row>
    </div>
   


    </>
    
}