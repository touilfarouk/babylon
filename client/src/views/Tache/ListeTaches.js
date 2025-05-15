import React, { useState, useEffect,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
export default function ListeTaches(props) {


     const token = localStorage.getItem('token');
console.log(props)
     
      
          /****************************************************** */
    return (
         <div className="content" style={{ marginLeft:"70px", marginRight:"70px" ,fontSize: '0.9rem'}}>
        
         
           <DataTable value={props.tache} size={'small'}   rows={10} editMode="row"  showGridlines
               >
                  <Column field="intitule_tache" header="Désignation de travaux"  />
                  <Column field="unite_tache" header="Unité" />
                  <Column field="quantite_tache" header="Quantité"/>
              </DataTable>

        
             
          </div>
        
    )
}