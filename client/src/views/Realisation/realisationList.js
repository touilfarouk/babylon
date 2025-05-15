import React, { useState, useEffect } from "react";
import { allRealisations } from "../../utils/APIRoutes";
import { addRealisation, uploadImageRealisation, host,readImage } from "../../utils/APIRoutes";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Row, Col } from "reactstrap";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";

function RealisationsList(props) {
  const token = localStorage.getItem("token");
  const [listRealisations, setlistRealisations] = useState([]);
  const id_action_impactee = props.id_action_impactee;
  const image1 = `${host}/ImageRealisation`;

  function getAllRealisations() {
    fetch(`${allRealisations}/${id_action_impactee}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setlistRealisations(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getAllRealisations();
  }, []);

  const handleFileOpen = (image) => {
    const token = localStorage.getItem("token");
    fetch(readImage, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ namefile: image }), // Pass the filename in the body
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching file');
      }
      return response.blob(); // Get the response as a Blob (image data)
    })
    .then((blob) => {
      const fileURL = URL.createObjectURL(blob); // Create a temporary URL for the file
      window.open(fileURL, '_blank'); // Open the image in a new tab
    })
    .catch((error) => {
      console.error('Error opening file:', error); // Log the error if fetching fails
    });
  };
  

  const actionImDialogFooter = (
    <React.Fragment>
      <Button
        label="Retour" raised
        icon="pi pi-replay"
        outlined
        style={{ backgroundColor: 'var(--red-500)',color:'#fff', borderRadius: '20px', borderColor: 'var(--red-500)' }}
        onClick={() => props.setlistrealisation(false)}
      />
    </React.Fragment>
  );

  return (
    <>
      <Dialog
        headerStyle={{ backgroundColor: 'var(--green-300)', height: "4rem" ,borderRadius:'20px',marginBottom:'8px'}}
        visible={props.listrealisation}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={
          listRealisations.length > 0
            ? `LISTE DES REALISATION POUR L'ACTION ${listRealisations[0].action} LOCALITE ${listRealisations[0].LOCALITES}`
            : "Aucune réalisation disponible"
        }
        modal
        style={{ width: '70rem' }}
        className="p-fluid"
        footer={actionImDialogFooter}
        onHide={() => props.setlistrealisation(false)}
      >
        <Row className="mt-3">  
          <Col md="12">
            <DataTable value={listRealisations} paginator rows={10} responsiveLayout="scroll">
              {/* Define columns using the realisation properties */}
              <Column field="num_phase" header="Phase" />
              <Column field="intitule_tache" header="Tâche" />
              <Column field="datevisite" header="Date Visite" />
              <Column field="volume_realise" header="Volume Réalisé" body={(rowData) => `${rowData.volume_realise} ${rowData.unite_tache}`} />
              <Column field="recommandation" header="Recommandation" />
              <Column
  header="Image"
  body={(rowData) => (
    rowData.image? <Button
      label=""
      icon="pi pi-eye"
      style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: '50%' }}
      onClick={() => handleFileOpen(rowData.image)} // Call handleFileOpen with the image name
    />: <Button
    label=""
    icon="pi pi-times"
    style={{ backgroundColor: 'var(--red-400)', borderColor: 'var(--red-400)', borderRadius: '50%' }}
 
  />
  )}
/>

            </DataTable>
          </Col>
        </Row>
      </Dialog>
    </>
  );
}

export default RealisationsList;
