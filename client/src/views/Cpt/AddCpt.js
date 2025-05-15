import React, { useState,useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import {getActionProgramme } from "../../utils/APIRoutes";
import Select from "react-select";
import Phase from '../Phase/Phase'
import { Label } from "reactstrap";
export default function AddCpt(props) {
    const footerContent = (
        <div>
            <Button label="Retour" style={{ color: 'white',borderColor:'var(--red-400)',backgroundColor:'var(--red-400)'}} icon="pi pi-arrow-left" onClick={() =>  {props.setaddcpt(false);props.getAllCpt()}} className="p-button-text" />
        </div>
    );
    return(
        <Dialog header="Ajouter un nouveau CPT" visible={props.addcpt} footer={footerContent}  headerStyle={{ backgroundColor: 'var(--green-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}style={{ width: '60vw',height:'60rem' }} onHide={() => props.setaddcpt(false)}>
            <Phase id_marche={props.id_marche} />
       </Dialog>
    )

    
}