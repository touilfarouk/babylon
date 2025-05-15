import React, { useState, useEffect, useRef }  from "react";
import {getEntrepriseDetail,AddSoutraitant} from '../../utils/APIRoutes';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import { DataTable } from 'primereact/datatable';
import { Toolbar } from "primereact/toolbar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { Column } from 'primereact/column';
import { InputNumber } from "primereact/inputnumber";
import { color } from "@mui/system";
export default function Soutraitance(props) {
    const [DetailEntreprises, setDetailEntreprises] = useState([]);
    const [addsoustraitant, setaddsoustraitant] = useState({entreprise_soutraite:"",montant:""})
    const [adddialog, setadddialog] = useState(false)
    const token = localStorage.getItem('token');
    function getEntreprise() {
        fetch(getEntrepriseDetail, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, // Initialize 'token' before using it
           },
           body: JSON.stringify({ID_entreprise: props.ID_entreprise,idmarche:props.idmarche})})
    
           .then((reponse) => reponse.json())
           .then((data) => {
            setDetailEntreprises(data);
           })
           .catch((error) => {
             console.log("Error:", error);
           });
       }
       useEffect(() => {
        getEntreprise();
      }, []);

      function addsoutraitant() {
        fetch(AddSoutraitant, {
           method: "POST",
           credentials: "include",
           headers: {
             Accept: "application/json",
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
           body: JSON.stringify({addsoustraitant,ID_entreprise: props.ID_entreprise})})
    
           .then((reponse) => reponse.json())
           .then((data) => {
            if(data=="true")
            getEntreprise()
            setadddialog(false)
            setaddsoustraitant({entreprise_soutraite:"",montant:""})
           })
           .catch((error) => {
             console.log("Error:", error);
           });
       }
       const onInputChangeUpdate = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _sout = { ... addsoustraitant };
        _sout[`${name}`] = val;
        setaddsoustraitant(_sout);
      };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button className="m-1 p-2" label="NOUVEAU SOUS-TRAITANT" raised style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)'}}icon="pi pi-plus" onClick={()=>setadddialog(true)} />
                
            </div>
        );
      };
      const soutraitanceDialogFooter = (
        <React.Fragment>
     <Button
          label="Retour"
          icon="pi pi-times"
          onClick={()=>setadddialog(false)}
          outlined
          style={{ borderColor: 'var(--red-400)',color:'var(--red-400)',marginRight:"5px", borderRadius: 'var(--border-radius)'}}
        />
      <Button label="Enregister" icon="pi pi-check" onClick={()=>addsoutraitant()} style={{ backgroundColor: 'var(--green-300)', borderColor: 'var(--green-300)', borderRadius: 'var(--border-radius)'}} />
      </React.Fragment>
    );
    return(
        <>
  <Dialog visible={true} headerStyle={{ backgroundColor: 'var(--green-400)', height:"4rem",marginBottom:'5px',color:"#fff"}} style={{ width: '65rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={DetailEntreprises?.list?.length > 0 ? `LA LISTE DES ENTREPRISES SOUS-TRAITEES PAR ${DetailEntreprises.list[0].libelle}` : ''} onHide={()=>props.setdialog(false)} >       
            
           
              <Toolbar className="mb-2 p-1" left={leftToolbarTemplate}></Toolbar>
              <DataTable value={DetailEntreprises.list} size={'small'}   rows={10} editMode="row"  showGridlines >
       <Column field="entreprise_soutraite" header="L'intitulé de sous-traitant"  />
     
       <Column field="montant" header="Montant de sous-traitance DA"/>
       {/* <Column field="montant_total" header="Pourcentage de soutraitance par rapport aux marché %"/> */}
       <Column
           header="Detail"
           body={(rowData) => (

            <button
            style={{
              fontSize: '1.5rem',
              backgroundColor: 'red',
              borderRadius: '40%',
              border: 'none',
            }}
      
          >
  <i className="pi pi-trash" style={{ fontSize: '1rem'}}></i>
</button>

)}
/>
     
   </DataTable>

             
  </Dialog>
  <Dialog visible={adddialog} style={{ width: '45rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}   footer={soutraitanceDialogFooter} header={DetailEntreprises?.list?.length > 0 ? `Ajouter un nouveau sous-traitant pour l'entreprise ${DetailEntreprises.list[0].libelle}` : ''} onHide={()=>setadddialog(false)} >       
              <Row>
               <Col>

                    <label htmlFor="entreprise_soutraite" className="font-bold">
                    L'intitulé du sous-traitant
                    </label>
                 
                    <InputText
                      id="entreprise_soutraite"
                      value={addsoustraitant.entreprise_soutraite}
                      onChange={(e) => onInputChangeUpdate(e, 'entreprise_soutraite')} 
                   />

       
                </Col>
          
                <Col>
                <div >
                    <label htmlFor="montant" className="font-bold">
                    Montant sous-traitance (DA)
                    </label>
                    <InputNumber
                      style={{padding:'4px',marginLeft:'10px'}}
                      id="montant"
                      value={addsoustraitant.montant}
                      suffix=" DA"
                      onValueChange={(e) => onInputChangeUpdate(e, 'montant')}
                      minFractionDigits={2}
/>
                </div>   
                </Col>  
              </Row>
              <div className="d-flex justify-content-end mt-3">
   
  </div>
      
  </Dialog>
        </>
    )
}