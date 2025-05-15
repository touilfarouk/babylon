import React, { useState, useEffect,useRef  } from "react";
import { allPhases, AddPhase,DeletePhases,getActionProgramme ,getActionCpt} from "../../utils/APIRoutes";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import  AddTache  from "../Tache/AjoutTache";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { RadioButton } from 'primereact/radiobutton';
import Select from "react-select";
function PhaseList(props) {
  const toastTopCenter = useRef(null);
const token = localStorage.getItem("token");

const [tacheDialog, settacheDialog] = useState(null);
 const id_action_impacteee = props.id_action_impactee;
 const [idphase, setidphase] = useState([]);
 const [listPhases, setlistPhases] = useState([]);
 const [expandedRows, setExpandedRows] = useState(listPhases);
const [SelectedOption,setSelectedOption] = useState([])
const [selectedAction,setselectedAction] = useState([])
const [submitted,setsubmitted] = useState(false)
const [loading,setloading] = useState(false)
const [desableaddphase,setdesableaddphase]=useState(false)
const [SelectedImpct, setSelectedImpact] = useState([]);
const [intActionImpact, setintActionImpact] = useState([]);
const [nombrePhase,setnombrePhase]=useState(0);
const [modePaiment,setmodePaiment]=useState(true);

const [options, setoptions] = useState([]);
const toast = useRef(null);
  const accept = (sev,sum,detail) => {
    toast.current.show({ severity: sev, summary:sum, detail: detail, life: 3000 });
    // toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Suppression avec succès', life: 3000 });
}

const confirm1 = () => {
  confirmDialog({
      message: 'Vous ne pouvez pas supprimer cette phase car elle contient des tâches',
      icon: 'pi pi-exclamation-triangle',
      footer: (props) => {
        const { accept, reject } = props;

        const handleAccept = () => {
            accept();
    
        };

        return (
            <>
              
                <Button style={{ color: 'var(--green-600)', borderRadius: 'var(--border-radius)'}} label="OK" icon="pi pi-check" className="p-button-text" onClick={handleAccept} />
            </>
        );
    },
  });
};
const confirm2 = (id) => {
  confirmDialog({
      message: 'Voulez-vous supprimer cette phase ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      footer: (props) => {
          const { accept, reject } = props;

          const handleAccept = () => {
            deletePhase(id);
              accept();
      
          };
          const handlereject = () => {
              reject();
      
          };

          return (
              <>
                  <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="Annuler" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
                  <Button style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)', borderRadius: 'var(--border-radius)'}} label="Confirmer" icon="pi pi-check" className="p-button-text" onClick={handleAccept} />
              </>
          );
      },
  });
};
  function deletePhase(id_phase) {
    fetch(DeletePhases, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_phase:id_phase})
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if(data.rep=="true")
        {getAllPhase()
          accept('success','Confirmé','Suppression avec succès')
         
        }
         else
         {
           if(data.rep=="Cannot delete")
           {
            confirm1()
           }
         }
      
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  function getAllPhase() {
    fetch(allPhases, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_action_impactee:id_action_impacteee})
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setlistPhases(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  useEffect(() => {
   //getAllPhase();
  }, []);
  const handleSelectChange = (selectedOption) => {
    setintActionImpact([])
    setSelectedOption(selectedOption.value);
    setselectedAction({ ...selectedAction, selectedOption });
    
  };
  function getaction() {
    fetch(getActionProgramme, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cpt:"oui",id_marche:props.id_marche}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setoptions(data.map(option => ({
                   value: `${option.id_pro_action_pro}`,
                   label: `${option.action} `})));
      });
  }
  function getactionCpt() {
   // toast.current.show({ severity: 'info', summary: 'out', detail: `${selectedAction.selectedOption?.length}`});
    if((selectedAction?.length==0))
    {
      toast.current.show({ severity: 'info', summary: 'in', detail: `${selectedAction.selectedOption?.length}`});
      setsubmitted(true)
    }
    else{
   
    fetch(getActionCpt, {
      method: "POST",
      credentials: "include",
       headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({selectedAction:selectedAction.selectedOption}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setintActionImpact(data)
      });
    }
  }
  useEffect(() => {
    getaction();
  }, []);
  function addNewPhase() {
    if (SelectedImpct.length === 0) {
        setsubmitted(true);
        toast.current.show({ severity: 'error', summary: 'Rejeté', detail: 'Sélectionner une ou plusieurs actions impactées', life: 3000 });
    } else if (!nombrePhase) {
        setsubmitted(true);
        toast.current.show({ severity: 'error', summary: 'Rejeté', detail: 'Introduire le nombre de phases', life: 3000 });
    } else if (!modePaiment) {
        setsubmitted(true);
        toast.current.show({ severity: 'error', summary: 'Rejeté', detail: 'Introduire le mode de paiement', life: 3000 });
    } else {
        setloading(true);
        setdesableaddphase(true);
        fetch(AddPhase, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ SelectedImpct, nombrePhase ,modePaiment}),
        })
        .then((response) => response.json())
        .then((data) => {
            setlistPhases(data);
            setloading(false);
        })
        .catch((error) => {
            console.error(error);
        });
    }
}

  const rowExpansionTemplate = (data) => {
    return (
      <>
         <DataTable value={data.tache} size={'small'} style={{ marginLeft: "10%", marginRight: "10%", marginTop: "-8px" }}  editMode="row"
         emptyMessage="Aucune tâche dans cette phase" showGridlines>
                  <Column field="intitule_tache" header="Désignation de travaux"    />
                  <Column field="unite_tache" header="Unité" />
                  <Column field="prix_ht_tache" header="Prix unitaire" />
              </DataTable>
      </>
    );
  };
 
  return (
    <>
    {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>}

       <Toast ref={toast} position="top-center" />
       <ConfirmDialog />
    { tacheDialog && <AddTache tacheDialog={tacheDialog} settacheDialog={settacheDialog} listPhases={listPhases} setlistPhases={setlistPhases} IdPhase={idphase} accept={accept}/>}
           {" "}
           <div className="mr-1">
              <label  className="font-bold mt-3 "> Selectionner l'ensemble des action du CPT </label>
               <Select
                          value={SelectedOption}
                          onChange={handleSelectChange}
                          options={options}
                          isMulti
                          className={classNames({ 'p-invalid':submitted && (selectedAction.length===0 )  })}
               />
                     {submitted && (selectedAction.length===0 ) && (
             <small className="p-error">Champ obligatoire !</small>
)}
            </div>
             <div style={{ width: '100%', display: 'block' ,marginTop:'15px'}}>

   
    <Button
        style={{
            width:'100%',
            height:'40px',
            backgroundColor:'var(--green-300)',
            borderColor: 'var(--green-300)',
            borderRadius: 'var(--border-radius)'
        }}
        label="SELECTIONNER"
        icon="pi pi-check" raised
        onClick={() => getactionCpt()}
    />
</div>
{intActionImpact.length>0 &&
<>
<label className="mt-3 font-bold">Cocher les localités </label>
<DataTable
              emptyMessage="Aucunne action trouvée"
              paginator
              showGridlines
              rows={6}
              size={'small'}
              value={intActionImpact}
              selection={SelectedImpct}
              onSelectionChange={(e) => setSelectedImpact(e.value)}
              dataKey="id_action_impactee"
              style={{ padding:'10px' ,fontSize: '0.8rem'}}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "1rem" }}     style={{ padding:'5px' }}   
              ></Column>
                 <Column   
                   field="action"
                   header="ACTION"
               
                 ></Column>
                      <Column   
                   field="commune_name_ascii"
                   header="COMMUNE"
               
                 ></Column>
                      <Column   
                   field="localites"
                   header="LOCALITES"
               
                 ></Column>
  </DataTable>


  {/* <div style={{paddingTop:"20px"}}>
           <label htmlFor="cout" className="font-bold">
               Paiment
           </label>
           <div className="flex align-items-center">
        <RadioButton  inputId="ingredient1" value="Phase" checked={modePaiment === 'Phase'} onChange={(e) =>setmodePaiment(e.target.value)} />
        <label htmlFor="ingredient1" className="ml-2"  >Phase</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton  inputId="ingredient2"  value="Tache" checked={modePaiment === 'Tache'} onChange={(e) => setmodePaiment(e.target.value)}/>
        <label htmlFor="ingredient2" className="ml-2" >Tâche</label>
    </div>
        
     </div>  */}

   <div style={{ width: '100%', marginBottom: '20px',marginTop: '10px' }}>
        <label htmlFor="num_phase" className="font-bold">
            Nombre des phases
        </label>
        <InputNumber
            value={nombrePhase}
            id="num_phase"
            onValueChange={(e) => setnombrePhase(e.target.value)}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !nombrePhase })}
            style={{ width: '100%' }} // Définit la largeur de l'InputNumber à 100%
        />
        {submitted && !nombrePhase && <small className="p-error">Champ obligatoire !</small>}
        <Button
        disabled={listPhases.length>0}
       raised
        style={{
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--primary-300)',
            borderColor: 'var(--primary-300)',
            borderRadius: 'var(--border-radius)',
            marginTop: '10px',
            marginBottom: '10px',
        }}
        label="APPLIQUER"
        icon="pi pi-check"
        onClick={() => addNewPhase()}
    />
    </div>

   </>}

  {listPhases.length>0 && <DataTable
      style={{ marginLeft: "10%", marginRight: "10%", marginTop: "10px",backgroundColor:"#000" }}
      onRowToggle={(e) => setExpandedRows(e.data)}
      expandedRows={expandedRows}
       rowExpansionTemplate={rowExpansionTemplate}
      size="small"
      editMode="row"
      value={listPhases}
    >
     <Column expander={true} style={{ width: "3rem" }} />
      <Column
        header="LA PHASE"
        body={(rowData) => <span>PHASE - {rowData.phaseNum}</span>}
      />
      <Column   style={{ width: '200px' }} 
        header="AJOUTER UNE TÂCHE"
        body={(rowData) => (
          <>
            <Button
              size="small"
              style={{
                backgroundColor: 'var(--orange-100)',
                borderColor:'var(--purple-100)',
                color: 'var(--green-800-color-text)',
                borderRadius: '50%',
                width: '50px',
                padding: '5px',
                marginLeft:'30%'
              }}
              icon="pi pi-plus"
              className="p-button"
              onClick={() => {
                setidphase(rowData.rows);
                settacheDialog(true);
              }}
            />
           
          </>
        )}
      />
    </DataTable>} 
    
          
  
     

    </>
  );
}

export default PhaseList;
