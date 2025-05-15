import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";
import {getSituationDetail,setInfSituationE} from "../../utils/APIRoutes";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button"
import { Toast } from 'primereact/toast';
export default function DetailSituation (props)
{
  const[situationdetail,setsituationdetail]=useState({ id_sit: props.id_sit})
  const [submittedIm, setSubmittedIm] = useState(false);
  const componentRef = useRef();
  const toast = useRef(null);
  const token = localStorage.getItem("token");
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@media print { @page { size: landscape; } }`,
  });
  const headerRight=()=>{
    return( 
      <>
      <Button  label="Imprimer" raised style={{backgroundColor: 'var(--orange-600)',borderColor:'var(--orange-600)'}}  onClick={() => {  handlePrint()  }} className="mr-2" />
      {/* <Button  label="vallider" raised style={{backgroundColor: 'var(--green-600)',borderColor:'var(--green-600)'}}  onClick={() => {   }} className="mr-2" /> */}
      </>)
  }
  const onInputChange = (e, name) => {
    let val = (e.target && e.target.value) || '';
    let situation = { ... situationdetail };
    situation[`${name}`] = val;
    setsituationdetail(situation);
   
  };
  /******************************************** */
  const _updateSituation = () => {
 
    if(!situationdetail.num_situation)
    {
      setSubmittedIm(true)
      
    }
    else
    {
      fetch(setInfSituationE, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(situationdetail),
      })
        .then((reponse) => reponse.json())
        .then((data) => {
          if(data=="true")
           {
            toast.current.show({severity:'success', summary: 'Succès', detail:'Information enregistrée avec succès.', life: 3000});
            getStuationDetail()
           }
        });
    }

  
};
  /******************************************* */
  const getStuationDetail = () => {
    fetch(getSituationDetail, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_sit: props.id_sit,
        IDMarche:props.IDMarche
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setsituationdetail(prevState => ({
          ...prevState,
          ...data
        }));
      });
  };
 
  useEffect(() => {
    getStuationDetail();
  }, []);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #000',
  };

  const cellStyle = {
    padding: '0.75rem',
    fontSize: '16px', 
    textAlign: 'left',
    border: 'none', 
    borderRight: '2px solid #000', 
  };
  const cellStyle2 = {
    padding: '0.75rem',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold', 
    border: 'none', 
    borderRight: '2px solid #000', 
  };
  const headerStyle = {
    ...cellStyle,
    borderBottom: '2px solid #000',
  };

    return(    
    <Dialog  headerStyle={{ backgroundColor: 'var(--orange-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} header="Situation" visible={props.showSituation} style={{ width: '80vw' }} onHide={() => props.setshowSituation(false)}>
        <Toast ref={toast} position="top-center"  />
       <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
       <AccordionTab style={{ backgroundColor: 'var(--orange-200)' }} header="Détail de la situation">
       <div className="flex flex-wrap gap-3 p-fluid pr-3">
        <div className="flex-auto">
          <label htmlFor="num" className="font-bold block mb-2">
             Numéro de la situation
            </label>
            <InputNumber  
            id="num"
            className={classNames({ 'p-invalid': submittedIm && !situationdetail.num_situation})} 
            value={situationdetail.num_situation}
            onValueChange={(e) => onInputChange(e,'num_situation')}
             />
              {submittedIm && !situationdetail.num_situation && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
          <label htmlFor="forf" className="font-bold block mb-2">
          Pourcentage de remboursement de l'avance forfaitaire
            </label>
            <InputNumber  
            id="forf"
            value={situationdetail.pourcentage_forf}
            onValueChange={(e) => {
              const value = e.target.value;
              if (value < 100) {
                onInputChange(e, 'pourcentage_forf');
              }
              else{
                toast.current.show({severity:'warn', summary: 'Warning', detail:'Le pourcentage ne doit pas dépasser 100 %', life: 3000});
              }
            }}
            suffix="%"

             />
            
          </div>
          <div className="flex-auto">
          <label htmlFor="apro" className="font-bold block mb-2">
           Pourcentage de remboursement de l'avance d'approvisionnement
            </label>
            <InputNumber  
            id="apro"
            value={situationdetail.pourcentage_apro}
            onValueChange={(e) => {
              const value = e.target.value;
              if (value < 100) {
                onInputChange(e, 'pourcentage_apro');
              }
              else{
                toast.current.show({severity:'warn', summary: 'Warning', detail:'Le pourcentage ne doit pas dépasser 100 %', life: 3000});
              }
            }}
            suffix="%"

             />
             
          </div>
          
          <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             Date de la situation
            </label>
            <Calendar  
              value={situationdetail.date_situation!== null ? new Date(situationdetail.date_situation) : null} showIcon
             dateFormat="dd/mm/yy"
            onChange={(e) => onInputChange(e,'date_situation')}
            className={classNames({ 'p-invalid': submittedIm && !situationdetail.date_situation})} />
             {submittedIm && !situationdetail.date_situation && <small className="p-error">Champ obligatoire !</small>}
          </div>
         
        </div>
        <div className="flex justify-content-end mt-3">
        <Button
            label="Enregistrer les modifications"            
            icon="pi pi-check" raised    
            style={{ backgroundColor: 'var(--orange-300)', borderColor: 'var(--orange-300)', borderRadius: 'var(--border-radius)' }}
            onClick={(e) => {
              _updateSituation()
            }}
        />
        </div>
       </AccordionTab>
       
        <AccordionTab style={{ backgroundColor: 'var(--orange-300)' }} header="Situation">
        <Toolbar className="mb-2 mt-1" left={headerRight}></Toolbar>
         <div ref={componentRef} className="m-5" >
            <h1 className="text-center ">SITUATION DES TRAVAUX</h1>
          <div style={{ fontSize: '18px' }} className="mb-4 mt-7">
            I-  <u>PARTIE PARTENAIRE CO-CONTRACTANT</u>
          </div>
          <div style={{ fontSize: '18px' }} className="border-1 p-2">
         <ul >
         <li className="mb-2" ><b>Raison Sociale et Adresse :</b> {situationdetail.rais_soc_add_cocotract}</li>  
         <li className="mb-2"><b>Registre de commerce : </b> {situationdetail.regitre_commerce_cocotra}</li>
         <li className="mb-2"><b>Matricule fiscale :</b> {situationdetail.matricul_fiscal_cocontr}</li>
         <li className="mb-2"><b>Compte Bancaire :</b> {situationdetail.compte_bancaire_cocontr}</li> 
         <li className="mb-2"><b>Partenaire Contractant :</b> {situationdetail.dernier_contractant}</li> 
         {situationdetail.dernier_id_avenant && <li className="mb-2"><b>Avenant N° {situationdetail.dernier_num_avenant} du  {situationdetail.dernier_date_notif_ods} au marché: </b>  N° {situationdetail.num_marche}</li>}
         <li className="mb-2"><b>Mode de passation : </b> {situationdetail.mode_passation}</li> 
         <li className="mb-2"><b>Visa de la Commission Sectorielle :</b> {situationdetail.visa_commission} </li> 
         <li className="mb-2"><b>Objet du Marché :</b> {situationdetail.objet	}</li> 
         <li className="mb-2"><b>Montant :</b> {situationdetail.montant_ttc} DA</li> 
         <li className="mb-2"><b>Localisation des travaux :</b> 13 Wilaya </li> 
         </ul>
          </div>
          <div className="col-12   text-center square  mb-3 mt-4">
            <h3>
             SITUATION N° {situationdetail.num_situation}
            </h3>
         
                
     <div className="table-container-att" style={{ marginTop: '1.5rem',fontSize: '16px' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>DESIGNATION</th>
            <th style={headerStyle}>MONTANT (DATTC)</th>
            <th style={headerStyle}>POUR MEMOIRE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}><b>Montant des travaux cumulés-----------(1)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_cumule?situationdetail.montant_cumule.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
            <td style={cellStyle2}> Avance forfaitaire cumulées: <br/>{situationdetail.cumuleforf?situationdetail.cumuleforf.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'} DA TTC</td>
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant des travaux réalisés précédemment---(2)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_precedent?situationdetail.montant_precedent.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
            <td style={cellStyle2}> Avance d'approvisionnement cumulées: <br/>{situationdetail.cumuleappro?situationdetail.cumuleappro.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'} DA TTC</td>
       
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant brut de la situation----------------------(3)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_situation?situationdetail.montant_situation.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
            <td style={cellStyle2}> Retenue de garantie cumulées: <br/>{situationdetail.cumuleretenu?situationdetail.cumuleretenu.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'} DA TTC</td>
           
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant de la Retenue de garantie----------------------(4)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_retenue_garanti?situationdetail.montant_retenue_garanti.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
           
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant de l'avance forfaitaire ({situationdetail.pourcentage_forf} %)----------------------(5)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_avance_forf}</td>
           
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant de l'avance d'aprovisionement ({situationdetail.pourcentage_apro} %)----------------------(6)</b></td>
            <td style={cellStyle2}>{situationdetail.montant_avance_apro}</td>
         
          </tr>
          <tr>
            <td style={cellStyle}><b>Montant net à payer de la situation----------------------(6)</b></td>
            <td style={cellStyle2}>{(situationdetail.montant_situation-(situationdetail.montant_retenue_garanti+situationdetail.montant_avance_apro+situationdetail.montant_avance_forf)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            
          </tr>
        </tbody>
      </table>
      </div> 
         </div>  
        <p>Arrêté la présente situation à la somme de : <b>{tafqitFR((situationdetail.montant_situation-(situationdetail.montant_retenue_garanti+situationdetail.montant_avance_apro+situationdetail.montant_avance_forf)))}</b></p>
      
         </div>
        </AccordionTab>
       </Accordion>

       
        
         
</Dialog>)
function tafqitFR(number) {
  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const unitsd = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
  
  if (number === 0) return "zéro";
  
  let words = [];

  function convert_hundreds(num) {
      let hundred = Math.floor(num / 100);
      let remainder = num % 100;
      let str = "";

      if (hundred > 0) {
          str += (hundred === 1 ? "cent" : units[hundred] + " cent");
          if (remainder > 0) {
              str += " ";
          }
      }

      if (remainder > 0) {
          str += convert_tens(remainder);
      }

      return str.trim();
  }

  function convert_tens(num) {
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];

      let ten = Math.floor(num / 10);
      let unit = num % 10;
      let str = tens[ten];

      if (ten === 7 || ten === 9) {
          str += "-" + teens[unit];
      } else if (unit > 0) {
          str += (ten === 8 && unit === 1 ? "-et-" : "-") + units[unit];
      }
      return str.trim();
  }

  function convert_decimal(decimalStr) {
      // Trim trailing zeros
      decimalStr = decimalStr.replace(/0+$/, '');
      if (decimalStr === "") return "zéro"; // If all zeros, return "zéro"
      if(decimalStr[0] === "0")
        {    let decimalWords = decimalStr.split('').map(digit => unitsd[parseInt(digit, 10)]);
        return decimalWords.join(' ');}
      let decimalNumber = parseInt(decimalStr, 10);
      return convert_hundreds(decimalNumber); // Convert the whole decimal number
  }

  let integerPart = Math.floor(number);
  let decimalPart = number.toFixed(2).split('.')[1]; // Ensure we get two digits after the decimal point
  let remaining = integerPart;
  let chunks = [];
  let chunk_names = ["", "mille", "million", "milliard", "billion"];

  while (remaining > 0) {
      chunks.push(remaining % 1000);
      remaining = Math.floor(remaining / 1000);
  }

  for (let i = chunks.length - 1; i >= 0; i--) {
      if (chunks[i] === 0) continue;
      let chunk_name = chunk_names[i];
      let chunk_str = convert_hundreds(chunks[i]);
      if (chunk_name) {
          chunk_str += " " + chunk_name;
      }
      words.push(chunk_str.trim());
  }

  let result = words.join(" ");

  if (decimalPart > 0) {
      let decimalWords = convert_decimal(decimalPart);
      if (decimalWords) { // Only add if there are decimal words after trimming
          result += ` et ${decimalWords} centime${decimalPart !== "01" ? "s" : ""}`;
      }
  }

  return result.trim();
}


}