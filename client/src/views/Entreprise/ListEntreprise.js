
import React, { useState, useEffect,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import {getEntrepriseRealisation,AddEntreprise} from '../../utils/APIRoutes';
import { Column } from 'primereact/column';
import { useNavigate,useParams} from 'react-router-dom'; 
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import image from '../Programme/image/OIP.jpg'
import Soutraitance from "./Soutraitance";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Row, Col } from "reactstrap";
export default function ListEntreprise()
{
    const idmarche = useParams().idmarche;
    const id = useParams().idprog;
    const nummarche=useParams().nummarche
    const Navigate  = useNavigate ();
    const [EntreprisesList, setEntreprisesList] = useState([]);
    const [dialog, setdialog] = useState(false)
    const [adddialog, setadddialog] = useState(false)
    const [libelle,setlibelle]=useState("")  
    const [submitted,setsubmitted]=useState(false)
    const [entreprise, setentreprise] = useState({})
    const token = localStorage.getItem('token');
    const toast = useRef(null);


  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Entreprise ajoutée avec succès', life: 3000 });
}

    useEffect(() => {
        getAllEntreprise();
      }, []);
    function getAllEntreprise() {
        fetch(getEntrepriseRealisation, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, 
           },
           body: JSON.stringify({idmarche:idmarche})})
    
           .then((reponse) => reponse.json())
           .then((data) => {
            setEntreprisesList(data);
           })
           .catch((error) => {
             console.log("Error:", error);
           });
       }
   function addEntrepriseR(libelle) {
    if(libelle=="")
    {setsubmitted(true)}
    else{
        fetch(AddEntreprise, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, // Initialize 'token' before using it
           },
           body: JSON.stringify({idmarche:idmarche,libelle:libelle})})
    
           .then((reponse) => reponse.json())
           .then((data) => {
           if(data==='true')
           {  
            setadddialog(false);
            accept();
            getAllEntreprise();}
       
           })
           .catch((error) => {
             console.log("Error:", error);
           });
          }
       }
       const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="NOUVELLE ENTREPRISE" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-plus" onClick={()=>setadddialog(true)} />
            </div>
        );
      };
      const divStyle = {
        backgroundImage: image,
      
        // Add more styles as needed
      };
      const addentreDialogFooter = (
        <React.Fragment>
     <Button
          label="Retour"
          icon="pi pi-times"
          style={{ color: 'var(--red-500)', borderRadius: 'var(--border-radius)',marginRight:'8px'}}
          onClick={()=>setadddialog(false)}
          outlined
        />
      <Button label="Enregister"style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-check" onClick={()=>addEntrepriseR(libelle)} />
      </React.Fragment>
    );
    return(<>
      <Toast ref={toast} />
     <div className="content mt-3" >
    <p style={{  fontSize: '20px'}} > Entreprises du marché N° {nummarche} programme {id}</p>
      
        <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/marche/${id}`)}} style={{  marginRight: '10px',marginBottom:"10px" , background:'var(--red-500)', borderColor:'var(--yellow-600)'}} raised />
        <div style={{ marginLeft:"150px", marginRight:"200px" , fontSize: '0.9rem'}}>

<Toolbar className="mb-2" left={leftToolbarTemplate}></Toolbar>
<DataTable value={EntreprisesList} size={'small'} paginator  rows={8} editMode="row"  showGridlines
    >
       <Column field="libelle" header="Libellé de l'entreprise"  />
     
       <Column  header="Montant total de soutraitance"   body={(rowData) => (
                 <> {rowData.montant_total?rowData.montant_total:0} DA </>
  
  )}/>
       <Column header="Pourcentage de sous-traitance par rapport au marché" 
             body={(rowData) => (
                 <> {(rowData.montant_total*100/rowData.mo).toFixed(2)} % </>
  
  )}/>
       <Column
           header="Detail"
           body={(rowData) => (
            <button
            style={{
              fontSize: '1.5rem',
              backgroundColor: '#E5E7E6',
              borderRadius: '40%',
              border: 'none',
            }}
            onClick={() => {setdialog(true)
                          setentreprise(rowData)
                          }}
          >
  <i className="pi pi-eye" style={{ fontSize: '1rem'}}></i>
</button>

)}
/>
     
</DataTable>


{dialog && <Soutraitance idmarche={idmarche} ID_entreprise={entreprise.ID_entreprise} setdialog={setdialog}/>}
        </div>
       </div>
       <Dialog visible={adddialog} style={{ width: '50rem' }}  breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter une nouvelle entreprise de réalisation"  modal className="p-fluid" onHide={()=>setadddialog(false)}   footer={addentreDialogFooter}>
        {/* <Dialog visible={adddialog} style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}  onHide={()=>setadddialog(false)} header="Ajouter une nouvelle entreprise de réalisation" footer={addentreDialogFooter}>        */}
      <Row>
      <Col md="12">
 
       <div >
           <label htmlFor="Libellé" className="font-bold">
                    Libellé de l'entreprise 
                    </label>
                    <InputText id="Libellé" onChange={(e)=>setlibelle(e.target.value)}
                        className={` ${classNames({ 'p-invalid': submitted && !libelle })}`}/>
           {submitted && !libelle && <small className="p-error">Champ obligatoire !</small>}
       </div>
  
       
      </Col>
     
      </Row>
   
       
       
        
    
           
  </Dialog>
    </>) 
}


