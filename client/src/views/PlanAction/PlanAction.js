import React, { useState, useEffect } from "react";
import { getRealisationsJournal } from "../../utils/APIRoutes";
import { host } from "../../utils/APIRoutes";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode} from 'primereact/api';
import { Row, Col } from "reactstrap";
import { Dropdown } from 'primereact/dropdown';
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { locale, addLocale } from 'primereact/api';
function PlanAction() {
  const token = localStorage.getItem("token");
   locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const [planAction, setplanAction] = useState([]);
  const [filters, setFilters] = useState({
    action:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    
});

 

  function getPlanAction() {
    fetch("", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({  }),
    })
      .then((response) => response.json())
      .then((data) => {
        setplanAction(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  useEffect(() => {
    getPlanAction()
  }, []);

  return (
    < div className ="content mt-9">
   
        <Row>
               <div>
                         <label htmlFor="type" className="font-bold">
                               Selectionner la wilaya    
                        </label>
                                <Dropdown id="type"/>
                      
                            </div> 
          <Col md="12">              
            <DataTable size={'small'}  value={planAction} filters={filters}  globalFilterFields={['action']} paginator rows={10} dataKey="id" showGridlines responsiveLayout="scroll">
                  <Column field="action" header="Action" filter />
                  <Column field="nombre" header="Nombre" />
                  <Column field="Volume global" header="volume" />
                  <Column field="Unite" header="Unité" />
                  <Column field="montant" header="Montant global" />
            </DataTable>
        
          </Col>
        </Row>
  
    </div>
  );
}

export default PlanAction;
