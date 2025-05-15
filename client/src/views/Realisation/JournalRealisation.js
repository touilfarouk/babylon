import React, { useState, useEffect } from "react";
import { getRealisationsJournal } from "../../utils/APIRoutes";
import { host } from "../../utils/APIRoutes";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Slider } from 'primereact/slider';
import { Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";

function JournalRealisation(props) {
  const token = localStorage.getItem("token");
  const [listRealisations, setlistRealisations] = useState([]);
  const id_action_impactee = props.id_action_impactee;

  const flattenRealisations = (data) => {
    let result = [];
    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            data[date].forEach(task => {
                result.push({ ...task, date_visite: date });
            });
        }
    }
    return result;
  };

  function getAllRealisations() {
    fetch(getRealisationsJournal, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_action_impactee }),
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

  const actionImDialogFooter = (
    <React.Fragment>
      <Button
        label="Retour"
        icon="pi pi-times"
        raised
        style={{ color: 'white', borderColor: 'var(--red-500)', backgroundColor: 'var(--red-500)', borderRadius: 'var(--border-radius)' }}
        onClick={() => props.setshowJournal(false)}
      />
    </React.Fragment>
  );

  const severityTemplate = (rowData) => {
    return (
      <Slider value={rowData.totalrealise * 100 / rowData.total_prevu} disabled />
    );
  };

  const volumeTemplate = (rowData) => {
    return `${rowData.volume_realise} ${rowData.unite_tache}`;
  };

  return (
    <>
      <Dialog
        headerStyle={{ backgroundColor: 'var(--green-200)', color: '#fff', borderRadius: '20px', height: "4rem", marginBottom: '5px' }}
        visible={true}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={"Journal des réalisations"}
        modal
        style={{ width: '70rem' }}
        className="p-fluid"
        footer={actionImDialogFooter}
        onHide={() => props.setshowJournal(false)}
      >
        <Row>
          <Col md="12">
            {Object.keys(listRealisations).map(date => (
              <div key={date}>
                <h4 style={{ backgroundColor: "var(--green-100)", textAlign: "center" }}>{date}</h4>
                <DataTable value={listRealisations[date]} responsiveLayout="scroll">
                  <Column field="num_phase" header="Phase" />
                  <Column field="intitule_tache" header="Tâche" />
                  <Column field="date_visite" header="Date Visite" />
                  <Column field="volume_realise" header="Volume Réalisé" body={volumeTemplate} />
                  <Column header="Taux" body={severityTemplate} />
                
                </DataTable>
              </div>
            ))}
          </Col>
        </Row>
      </Dialog>
    </>
  );
}

export default JournalRealisation;
