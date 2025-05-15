import React, { useState, useEffect, useRef } from "react";
import { uploadPdf,ReadPdf,getDetMarche ,updateMarche} from '../../utils/APIRoutes';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { IoIosAddCircle } from 'react-icons/io';
import 'primeicons/primeicons.css';
import { Dialog } from "primereact/dialog";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { Toolbar } from "primereact/toolbar";
import { useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import pdf from'./pdf.png';
import x from'./x.webp'
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";

export default function PrecedureConsultation(props) {
    const { idprog } = useParams();
    const type = [{label:'Cahier des charges',value:"1"}, 
                  {label:`L'appel d'offre ou consultation`,value:"2"}, 
                  {label:`L'attribution`,value:"3"}, 
                  {label:`Contrat`,value:"4"}];
    const formData = new FormData();
    const [filetype,setfiletype]=useState("")
    const [detailmarche,setdetailmarche]=useState(null)
    const token = localStorage.getItem("token");
    const toast = useRef(null);
    useEffect(() => {
        getmarche();
      }, []);


    const handleFileChange = (event) => {
        formData.append('file', event.target.files[0]);

          sendFile(filetype,props.idmarche);
       
      };
      const sendFile = (id,idmarche) => {
        var path=`${uploadPdf}/${id}/${idmarche}`;
     
        try {
          fetch(path, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, // Initialize 'token' before using it
              },
            body: formData,
              }).then((response) => response.json())
               .then((data) => {
              if(data=="update")
              {
                getmarche();
                toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le fichier PDF a été uploadé avec succès', life: 3000 });
              }
       
               formData.forEach((value, key) => {
               formData.delete(key);
               });
           
             })
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
/*************************************** */
const handleFileOpen = (fileName) => {
    const token = localStorage.getItem("token");
    if(!fileName)
      {
        toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: "La pièce jointe n'a pas encore été uploadée", life: 3000 });
      }
      else{
    fetch(ReadPdf, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Initialize 'token' before using it
      },
      body: JSON.stringify({ fileName: fileName }), // Pass the filename in the body
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching file');
      }
      return response.blob(); // Get the response as a Blob
    })
    .then((blob) => {
      const fileURL = URL.createObjectURL(blob); // Create a temporary URL for the file
      window.open(fileURL, '_blank'); // Open the PDF in a new tab
    })
    .catch((error) => {
      console.error('Error opening file:', error); // Log the error
    });}
  };
  /********************************** */
  function getmarche() {
  
    fetch(getDetMarche, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_marche:props.idmarche}),
    })
      .then((response) => response.json())
      .then((data) => {
        setdetailmarche(data[0])
      })
      .catch((error) => {
        console.error(error);
      });
    
  }
/************************************ */
function UpdateDateprocedure(date,type) {
  
  fetch(updateMarche, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({id_marche:props.idmarche,date:date,type:type}),
  })
    .then((response) => response.json())
    .then((data) => {
      getmarche()
    })
    .catch((error) => {
      console.error(error);
    });
  
}
/*********************************** */
    const procedureFooter = (
        <React.Fragment>
            <Button 
                label="Retour" 
                icon="pi pi-arrow-left" 
                style={{ color: '#FFF', borderColor: 'var(--red-400)', backgroundColor: 'var(--red-500)', marginRight: '10px' }} 
                outlined 
                onClick={() => props.setprocedure(false)} 
            />
        </React.Fragment>
    );

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-3">
            <Dropdown 
    placeholder="Sélectionner le type du fichier" 
    options={type} 
    value={filetype}
    id="type"  
    required 
    className="p-inputtext p-component"
    style={{ width: '300px', marginRight: '10px' }}
    onChange={(e) => setfiletype(e.value)} // Corrected syntax
/>

                <label className="addfile" htmlFor="file-input" style={{ cursor: 'pointer', fontSize: '1.8rem', color: '#5cb85c' }}>
                    <IoIosAddCircle />
                </label>
                <input
                    className="inputfile"
                    disabled={!filetype}
                    id="file-input"
                    type="file"
                    name="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        );
    };

    return (
        <>
            <Dialog 
                headerStyle={{ backgroundColor: 'var(--green-300)', color: '#fff',marginBottom:"10px" ,borderRadius: '10px', padding: '1rem' }}
                visible={props.procedure} 
                style={{ width: '80rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header={`La procedure de consultation du marché`}  
                modal 
                className="p-fluid" 
                footer={procedureFooter} 
                onHide={() => props.setprocedure(false)}
            >
                  <Toast ref={toast} />
                <Toolbar className="mt-3 p-3" left={leftToolbarTemplate}></Toolbar>
                
                <Row className="mb-4" style={{ gap: '20px' }}>
                    <Col className="col-md-4 d-flex">
                        <Card className="shadow-sm w-100" style={{ minHeight: "320px", borderRadius: '10px' }}>
                            <CardBody>
                                <CardTitle tag="h5">Cahier des charges</CardTitle>
                                <CardSubtitle className="mb-2 text-muted"></CardSubtitle>
                                <CardImg
                                    alt="Card image cap"
                                    src={detailmarche?.cahiercharge!=""?pdf:x}
                                    top
                                    style={{    
                                        objectFit: "contain", 
                                        height: "200px", 
                                        width: "100%", 
                                        borderRadius: "10px",
                                        padding: "10px", 
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"}}
                                />
                                  <div className="p-field">
                        <label htmlFor="date_cahier" className="font-bold" >Date du cahier de charge</label>
      
                          <input
                                id="date_cahier"
                                name="date_cahiercharge" 
                                onChange={(e)=>{UpdateDateprocedure(e.target.value,"date_cahiercharge")}}
                                type="date" 
                                value={
                                  detailmarche?.date_cahierchargee
                                    ? detailmarche.date_cahierchargee.split("/").reverse().join("-") // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
                                    : ""
                                }
                                style={{  color: 'rgba(0, 0, 0, 0.7)', /* Text: Black with 70% opacity */
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)', /* Background: Transparent black */
                                  border: '1px solid rgba(0, 0, 0, 0.2)', /* Border: Black with 50% opacity */
                                  borderRadius:' 5px', /* Optional: Rounded corners */
                                  padding:' 5px' }}
                                />
                              
                         </div>    <br />
                            <Button 
 style={{
    backgroundColor: 'var(--red-600)',
    color: '#fff',
    borderColor: 'var(--red-600)',
    fontSize: '20px',
    borderRadius: '50%',   // Makes the button round
    width: '50px',         // Adjust size for the small button
    height: '50px',        // Adjust size for the small button
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20px' ,    // Add space between buttons
    float: 'right' 
}}
    raised
    onClick={() => { if (detailmarche?.cahiercharge !== "") { handleFileOpen(detailmarche.cahiercharge); } }}
>
<span className="pi pi-eye"  style={{ fontSize: '20px' }} ></span>
</Button>

                            </CardBody>
                        </Card>
                    </Col>

                    <Col className="col-md-4 d-flex">
                        <Card className="shadow-sm w-100" style={{ minHeight: "320px", borderRadius: '10px' }}>
                            <CardBody>
                                <CardTitle tag="h5">L'appel d'offre</CardTitle>
                                <CardSubtitle className="mb-2 text-muted"></CardSubtitle>
                                <CardImg
                                    alt="Card image cap"
                                    src={detailmarche?.appeloffre!=""?pdf:x}
                                    top
                                   
                                    style={{    
                                        objectFit: "contain", 
                                        height: "200px", 
                                        width: "100%", 
                                        borderRadius: "10px",
                                        padding: "10px", 
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"}}
                                />
                                 <div className="p-field">
          <label htmlFor="date_appeloffre" className="font-bold" >Date de l'appel d'offre</label>
      
          <input
            id="date_appeloffre"
            name="date_appeloffre"
            type="date"
            onChange={(e)=>{UpdateDateprocedure(e.target.value,"date_appeloffre")}}
         
            value={
              detailmarche?.date_appeloffree
                ? detailmarche.date_appeloffree.split("/").reverse().join("-") // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
                : ""
            }
            style={{  color: 'rgba(0, 0, 0, 0.7)', /* Text: Black with 70% opacity */
              backgroundColor: 'rgba(0, 0, 0, 0.1)', /* Background: Transparent black */
              border: '1px solid rgba(0, 0, 0, 0.2)', /* Border: Black with 50% opacity */
              borderRadius:' 5px', /* Optional: Rounded corners */
              padding:' 5px' }}
          />
          
        </div>    <br />
                                 <Button 
                                   style={{
                                    backgroundColor: 'var(--red-600)',
                                    color: '#fff',
                                    borderColor: 'var(--red-600)',
                                    fontSize: '20px',
                                    borderRadius: '50%',   // Makes the button round
                                    width: '50px',         // Adjust size for the small button
                                    height: '50px',        // Adjust size for the small button
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: '20px' ,    // Add space between buttons
                                    float: 'right' 
                                }}
                                    raised
                                    onClick={()=>{if(detailmarche?.appeloffre!=""){handleFileOpen(detailmarche.appeloffre)}}}
                                >
                                 <span className="pi pi-eye"  style={{ fontSize: '20px' }} ></span>
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col className="col-md-4 d-flex">
                        <Card className="shadow-sm w-100" style={{ minHeight: "320px", borderRadius: '10px' }}>
                            <CardBody>
                                <CardTitle tag="h5">L'attribution</CardTitle>
                                <CardSubtitle className="mb-2 text-muted"></CardSubtitle>
                                <CardImg
                                    alt="Card image cap"
                                    src={detailmarche?.attribution!=""?pdf:x}
                                    top
                                    style={{    
                                        objectFit: "contain", 
                                        height: "200px", 
                                        width: "100%", 
                                        borderRadius: "10px",
                                        padding: "10px", 
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"}}
                                />
 <div className="p-field">
          <label htmlFor="date_attribution" className="font-bold" >Date de l'attribution</label>
      
          <input
            id="date_attribution"
            name="date_attribution"
            type="date"
           
            value={
              detailmarche?.date_attributionn
                ? detailmarche.date_attributionn.split("/").reverse().join("-") // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
                : ""
            }

            onChange={(e)=>{UpdateDateprocedure(e.target.value,"date_attribution")}}
            style={{  color: 'rgba(0, 0, 0, 0.7)', /* Text: Black with 70% opacity */
              backgroundColor: 'rgba(0, 0, 0, 0.1)', /* Background: Transparent black */
              border: '1px solid rgba(0, 0, 0, 0.2)', /* Border: Black with 50% opacity */
              borderRadius:' 5px', /* Optional: Rounded corners */
              padding:' 5px' }}
          />
          
        </div>    <br />
                                
                                <Button 
                                    style={{
                                        backgroundColor: 'var(--red-600)',
                                        color: '#fff',
                                        borderColor: 'var(--red-600)',
                                        fontSize: '20px',
                                        borderRadius: '50%',   // Makes the button round
                                        width: '50px',         // Adjust size for the small button
                                        height: '50px',        // Adjust size for the small button
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '20px' ,    // Add space between buttons
                                        float: 'right' 
                                    }}
                                    raised
                                    onClick={()=>{if(detailmarche?.attribution!=""){handleFileOpen(detailmarche.attribution)}}}
                                >
                                <span className="pi pi-eye"  style={{ fontSize: '20px' }} ></span>
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col className="col-md-4 d-flex">
                        <Card className="shadow-sm w-100" style={{ minHeight: "320px", borderRadius: '10px' }}>
                            <CardBody>
                                <CardTitle tag="h5">Contrat  

                                </CardTitle>
                                <CardSubtitle className="mb-2 text-muted"></CardSubtitle>
                                <CardImg
                                    alt="Card image cap"
                                    src={detailmarche?.contrat!=""?pdf:x}
                                    top
                                    style={{    
                                        objectFit: "contain", 
                                        height: "200px", 
                                        width: "100%", 
                                        borderRadius: "10px",
                                        padding: "10px", 
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"}}
                                />
                                 <div className="p-field">
          <label htmlFor="date_contrat" className="font-bold" >Date du contrat</label>
            <br/>
          <input
            id="date_contrat"
            name="date_contrat"
            type="date" 
            value={
              detailmarche?.date_contratt
                ? detailmarche.date_contratt.split("/").reverse().join("-") // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
                : ""
            }
            style={{  color: 'rgba(0, 0, 0, 0.7)', /* Text: Black with 70% opacity */
              backgroundColor: 'rgba(0, 0, 0, 0.1)', /* Background: Transparent black */
              border: '1px solid rgba(0, 0, 0, 0.2)', /* Border: Black with 50% opacity */
              borderRadius:' 5px', /* Optional: Rounded corners */
              padding:' 5px' }}
            onChange={(e)=>{UpdateDateprocedure(e.target.value,"date_contrat")}}
          />
          
        </div>   
         <br />
                         <Button 
                             style={{
                                backgroundColor: 'var(--red-600)',
                                color: '#fff',
                                borderColor: 'var(--red-600)',
                                fontSize: '20px',
                                borderRadius: '50%',   // Makes the button round
                                width: '50px',         // Adjust size for the small button
                                height: '50px',        // Adjust size for the small button
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '20px' ,    // Add space between buttons
                                float: 'right' 
                            }}
                                    raised
                                    onClick={()=>{if(detailmarche?.contrat!=""){handleFileOpen(detailmarche.contrat)}}}
                                >
                                    <span className="pi pi-eye"  style={{ fontSize: '20px' }} ></span>
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-0" style={{ gap: '20px' }}>
                   
                </Row>
            </Dialog>
        </>
    );
}
