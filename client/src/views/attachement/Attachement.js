import React, { useState, useEffect, useRef } from "react";
import { addAttachement, getMarche, getUserInf, getActionFillter, listTache, listAttachement} from "../../utils/APIRoutes";
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import AttachementDetails from './AttachementDetails'
import { Accordion, AccordionTab } from 'primereact/accordion';
import Listattachement from "./Listattachement";
import { InputNumber } from "primereact/inputnumber";
function Attachement() {
  const token = localStorage.getItem("token");
  const idprog = useParams().idprog;
  const type = useParams().type;
  const [visible, setVisible] = useState(false);
  const [selectedtache, setSelectedTache] = useState([]);
  const [attachement, setattachement] = useState([]);
  const [marche, setmarche] = useState([]);
  const [search, setsearch] = useState({});
  const [getatt, setgetatt] = useState(false);
  const [submitted, setsubmitted] = useState(false);
  const [id_attachement, setid_attachement] = useState(0);
  const [listTaches, setlistTache] = useState([]);
  const [intAction, setintAction] = useState([]);
  const Navigate = useNavigate();
  const [userinf, setuserinf] = useState({});
  function checkSameUniteTache(posts) {
    const firstUnite = posts[0].unite_tache; // Prendre l'unité du premier élément
    return posts.every(post => post.unite_tache === firstUnite); // Vérifier si tous ont la même unité
  }
  useEffect(() => {
    fetch(getUserInf, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Initialize 'token' before using it
      },
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setuserinf(data.userinf)
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);


  const footerContent = (
    <div>
        <Button label="Retour" icon="pi pi-times"  style={{ borderColor: 'var(--red-500)',color:'var(--red-500)',marginRight:'10px'}} onClick={() => setVisible(false)} className="p-button-text" />
        <Button label="Enregister" icon="pi pi-check" style={{ backgroundColor: 'var(--green-400)',color:'#fff'}} onClick={(e) =>_addAttachement(e)}  />
    </div>
);

  function getListAttachement() {
    fetch(listAttachement, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setattachement(data.allPosts);
      });
  }

  function getmarche() {
    fetch(getMarche, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fillter: "yes", idprog: idprog, type_marche: type })
    })
      .then((response) => response.json())
      .then((data) => {
        setmarche(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  function getIntAction(IDMarche) {

    fetch(getActionFillter, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ attachement: 'oui', id: IDMarche })
    })
      .then((response) => response.json())
      .then((data) => {
        setintAction(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
  
  function getListTache() {
    const token = localStorage.getItem("token");
    fetch(listTache, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(search),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        var taches = data.allPosts;
        setlistTache(taches);
      });
  }

  useEffect(() => {
    getmarche();
  }, []);

  const showMessage = (event, ref, severity,msg) => {
    const label = "Erreur";
    ref.current.show({
      severity: severity,
      summary: label,
      detail: msg,
      life: 5000,
    });
  };

  const toastTopLeft = useRef(null);
  const _addAttachement = (e) => {
    if (selectedtache.length === 0) {
      showMessage(e, toastTopLeft, "error","Selectionner une ou plusieurs tâches!");
    } else {
      fetch(addAttachement, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ all: "all", selectedtache: selectedtache }),
      })
        .then((reponse) => reponse.json())
        .then((data) => {
          if (data.rep === "true") {
            setSelectedTache([])
            getListTache();
            getListAttachement();
            setid_attachement(data.idAtt);
          }
          if(data=='invalide')
          { 
         showMessage(e, toastTopLeft, "error","Les attachements précédentes des réalisations choisies n'ont pas encore été validées. Veuillez valider ces attachements précédentes!");}
          setSelectedTache([])
        });
    }
  };

  const onInputChangeSearch = (e, name) => {
    let _search = { ...search };
    const val = (e.target && e.target.value) || '';
    _search[`${name}`] = val;
    setsearch(_search);
  };

  const rightToolbarTemplate = (data) => {
    return (
      <>
      <div> <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/Composantrealisation/${idprog}`)}} style={{  marginRight: '5px',marginBottom:'5px' , background:'var(--red-400)', borderColor:'var(--red-400)'}} raised /></div> 
        <div className="mr-1">
        
          <Dropdown
            placeholder="Sélectionner le marché"
            options={marche}
            value={search.IDMarche}
            onChange={(e) => { onInputChangeSearch({ target: { value: e.value } }, 'IDMarche'); getIntAction(e.value) }}
            className={`w-full md:w-12rem ${classNames({ 'p-invalid': submitted && !search.IDMarche })}`}
          />
          {submitted && !search.IDMarche && <small className="p-error">Champ obligatoire !</small>}
        </div>
        <div className="mr-1">
          <Dropdown
            placeholder="Sélectionner l'action"
            value={search.action}
            options={intAction.map(action => ({ label: action.action, value: action.id_pro_action_pro }))}
            onChange={(e) => { onInputChangeSearch({ target: { value: e.value } }, 'action'); }}
            className={`w-full md:w-12rem ${classNames({ 'p-invalid': submitted && !search.IDMarche })}`}
          />
        </div>
        <div className="">
          <Button
            style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', marginLeft: '5px' }}
            raised rounded onClick={() => {
              getListTache(); setgetatt(prev => !prev);
            }}>Afficher</Button>
        </div>
      </>
    );
  };



  /******************** */
  const calculateRowSpans = (data, fields) => {
    const spans = [];

    data.forEach((item, index) => {
      const spanInfo = {};
      fields.forEach((field) => {
        // Initialize rowSpan for each field to 1 by default
        let rowSpan = 1;

        // Loop through subsequent rows to check if they have the same value for this field
        for (let i = index + 1; i < data.length; i++) {
          if (data[i][field] === item[field]) {
            rowSpan++;
          } else {
            break;
          }
        }

        // If the rowSpan is greater than 1, store it; otherwise, set it to 0 for non-first rows
        spanInfo[field] = index === 0 || data[index - 1][field] !== item[field] ? rowSpan : 0;
      });

      spans.push(spanInfo);
    });

    return spans;
  };

  // Define the columns you want to apply row spanning for
  const fields = ['commune_name_ascii', 'LOCALITES'];

  // Calculate row spans for each column
  const rowSpans = calculateRowSpans(listTaches, fields);

  // Create a custom body template for each column that applies rowSpan
  const createBodyTemplate = (field) => (rowData, { rowIndex }) => {
    if (rowSpans[rowIndex][field] > 0) {
      return (
        <td rowSpan={rowSpans[rowIndex][field]}>
          {rowData[field]}
        </td>
      );
    }
    return null;
  };
  /******************** */
  let lastName = null;
  let lastPhase = null;
  return (
    <div className="content mt-3">
      <p style={{ fontSize: '20px' }}>Attachement</p>
      <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
      <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="La liste des tâches réalisées non attachées">
          {id_attachement != 0 && <AttachementDetails getListAttachement={getListAttachement} detail={"add"} id_attachement={id_attachement} setid_attachement={setid_attachement} />}
          <div className="col-12 p-0">
            <Button
              label="Crée un attachement"
              icon="pi pi-check"
              style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)' ,marginBottom:'10px'}}
              onClick={(e) => {
                setVisible(true);
              }}
            />
            <DataTable
              emptyMessage="Aucune Tache trouvée"
              paginator
              rows={10}
              size={'small'}
              value={listTaches}
              selection={selectedtache}
              onSelectionChange={(e) => setSelectedTache(e.value)}
              dataKey="id_tache"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
                  {fields.map((field) => (
        <Column
          key={field}
          field={field}
          header={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
          body={createBodyTemplate(field)}
        />
      ))}
       <Column field="num_phase" header="Phase" />      
       <Column field="intitule_tache" header="Disignation des travaux" />
              <Column field="volume_realiser" header="Volume totale réalisé" />      
              <Column field="unite_tache" header="Unité" />
            </DataTable>
            <br />
          </div>
        </AccordionTab>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="La liste des attachements">
          <RenderListAttachement key={getatt ? 'refresh' : 'initial'} search={search} />
        </AccordionTab>
      </Accordion>
      <Toast ref={toastTopLeft} position="top-center"  />
      <Dialog header="Introduire les volumes de l'attachement" headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent}>
      <div>
      {selectedtache.map((item, index) => 

      { 
        const shouldRenderCommuneAndPhase = item.LOCALITES !== lastName || item.num_phase !== lastPhase;
        const shouldRenderCommune = item.LOCALITES !== lastName ;

        // Update lastName and lastPhase to keep track of last rendered values
        lastName = item.LOCALITES;
        lastPhase = item.num_phase;
        return (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
          {/* Conditionally render the commune and phase together */}
          {shouldRenderCommuneAndPhase && (
          <div>
          {shouldRenderCommune && (
            <p><strong>Commune:</strong> {item.LOCALITES}</p>
          )}
        
          {/* Container for Phase label and Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ margin: 0 }}><strong>Phase:</strong> {item.num_phase}</p>
            
            <InputNumber
             onValueChange={(event) => {
              const newValue = event.value;

              // Update all tasks with the same LOCALITES and num_phase
              const updatedTaches = selectedtache.map(tache => {
                if (tache.LOCALITES === item.LOCALITES && tache.num_phase === item.num_phase) {
                  return {
                    ...tache,
                    quantite_attachement: newValue 
                  };
                }
                return tache;
              });

              // Set the updated tache state
              setSelectedTache(updatedTaches);
            }}
              name={item.LOCALITES+item.num_phase}
            />
          </div>
        </div>
        
          )}
        </div>
      )}
  )}
    </div>
</Dialog>
    </div>
  );
}

// Create a separate component for Listattachement
function RenderListAttachement({ search }) {
  return <Listattachement search={search} />;
}

export default Attachement;
