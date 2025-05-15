import React, { useState, useEffect } from "react";
import { Row, Col,CardGroup,Card,CardImg,CardBody ,CardTitle,CardSubtitle,CardText} from "reactstrap";
import tb from "./image/tb1.png"
import { Button } from 'primereact/button';
import marche from './image/marche.webp'
import impact from './image/travaux.webp'
import etude from'./image/etude.png'
import {getUserInf} from '../../utils/APIRoutes';
import { useNavigate,useParams} from 'react-router-dom'; 
export default function ComposantProgramme() { 
  const Navigate  = useNavigate ();
  const idProgramme  = useParams().idprog;
  const [userinf,setuserinf]=useState({})
  const token = localStorage.getItem('token');
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
  }, [])
return<>
    <div className ="content mt-3"  >
      <p style={{  fontSize: '20px'}} > Détail du programme { idProgramme}</p>

<Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/programme`)}} style={{  marginRight: '10px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
<Row className="mb-0" >
  
  <Col className="col-md-6 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={tb}
        top
        style={{ objectFit: "cover", height: "55%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Tableau de Bord</CardTitle>
        <CardSubtitle className="mb-4 text-muted" tag="h5"></CardSubtitle>
        <Button style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)'}} raised onClick={() => Navigate(`/admin/dashboard/${idProgramme}`)}>Consulter</Button>
      </CardBody>
    </Card>
  </Col>
  <Col className="col-md-6 d-flex">
 
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
        <CardImg
          alt="Card image cap"
          src={marche}
          top
          style={{ objectFit: "cover", height: "50%" }}
        />
        <CardBody>
          <CardTitle tag="h5">Contrats</CardTitle>
          <CardSubtitle className="mb-4 text-muted" tag="h5"></CardSubtitle>
          <Button raised style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)'}} onClick={() => Navigate(`/admin/marche/${idProgramme}`)}>Consulter</Button>
        </CardBody>
      </Card>
   
  </Col>

</Row>

<Row className="mt-0">
  <Col className="col-md-6 d-flex">
  <Card className="ml-2 w-100" style={{height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={impact}
        top
        style={{ objectFit: "cover", height: "55%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Réalisations</CardTitle>
        <Button raised style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)'}} onClick={() => Navigate(`/admin/Composantrealisation/${idProgramme}`)}>Consulter</Button>
      </CardBody>
    </Card>
  </Col>

  <Col className="col-md-6 d-flex">
 
      <Card className="ml-2 w-100" style={{height:"300px"}}>
        <CardImg
          alt="Card image cap"
          src={etude}
          top
          style={{ objectFit: "cover", height: "55%" }}
        />
        <CardBody>
          <CardTitle tag="h5">Etudes</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
          <Button raised style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)'}} onClick={() => Navigate(`/admin/ComposantEtude/${idProgramme}`)}>Consulter</Button>
        </CardBody>
      </Card>
    
  </Col>
</Row>
</div>
</>
}
