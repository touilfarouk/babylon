
import React ,{useState,useEffect}from "react";
import { Form, FormGroup, Label, Input, Button,Collapse ,Row,Col} from "reactstrap";
import { loginRoute,updatePassWord } from "../utils/APIRoutes";
import NotificationAlert from "react-notification-alert";
import BV from'./BV.jpg'
import logodgf from './logo_dgf_0.png'
import logomadr from'./Asset-1Logo-madr.svg'

import './Login.css';
function Login(props) {
  const notificationAlert = React.useRef();
  const showNotification = (data) => {
    notificationAlert.current.notificationAlert({
      place: data["place"],
      message: <div>{data["message"]}</div>,
      type: data["type"],
      icon: data["icon"],
      autoDismiss: data["autoDismiss"],
    });
  };

  const [values, setValues] = useState({
    username: "",
    password: "",   
  });
  const [changepass, setchangepass] = useState({})
  const [collapse, setCollapse] = useState(false);
  const [isComponentVisible, setComponentVisible] = useState(true);
  const ChangeInputValue = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
 
  };
  const handleSubmit = () => {
  
fetch(loginRoute, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
         if(data.success==true)
         localStorage.setItem('token', data.accessToken);
         props.setIsLogged(true)
      }).catch((error) => {
        console.log("Error:", error);
    
      });;  
  }
  const changePassWord = () => {  
    fetch(updatePassWord, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changepass),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
           if(data=="notexist")
           { var obj = {place: 'tc',message:`Erreur ,cet utilisateur n'existe pas !`,type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 5};
             showNotification(obj);}
           if(data=="alreadychanged")
           {  { var obj = {place: 'tc',message:`Erreur ,Le mot de passe a déjà été modifié.!`,type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
           showNotification(obj);}}
           if(data=="true")
           {
            var obj = {place: 'tc',message: 'Mot de passe a été modifié avec succès.',type: "success",icon: "nc-icon nc-check-2",autoDismiss: 4};
            showNotification(obj);
            setComponentVisible(true);
            setCollapse(false);
           }
           if(data=="erreur")
           {  { var obj = {place: 'tc',message: 'Erreur , Essayez ultérieurement!',type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
           showNotification(obj);}}
          });  
      }
   
  return (
    <div>
     
      <NotificationAlert ref={notificationAlert} />
      <img className="imgBg" />
      <div className="login">
        {isComponentVisible && 
       <>
       <Row>
        <Col md='2'>
          <img src={logodgf}></img>
        </Col>
      <Col md='8'><div style={{ textAlign: 'center' }}>
                  <h6 style={{ fontSize: '18px', paddingBottom: '4px' }}>REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</h6>
                  <h6 style={{ fontSize: '18px', paddingBottom: '4px' }}>MINISTERE DE L'AGRICULTURE ET DU DEVELOPPEMENT RURAL</h6>
                  <h6 style={{ fontSize: '18px' }}><strong>DIRECTION GÉNÉRALE DES FORÊTS</strong></h6>
      </div></Col> 
      <Col md='2'>
        <img  style={{ maxWidth: '100px', minWidth: '100px', height: '90px', marginLeft: '10px' }} src={logomadr}></img>
      </Col>
       </Row>
       <Row>
       <Col>
       <img style={{ maxWidth: '500px', minWidth: '250px', height: '350px' }} src={BV} alt="IMG" />
       </Col>
       <Col><div>
    <h3 className="loginTitle">CONNECETEZ-VOUS</h3>
      <Form>
        <FormGroup>
          <Label className="label" for="username">
            Nom d'utilisateur:
          </Label>
          <Input
           
            className="login_input"
            id="username"
            name="username"
            placeholder="Nom d'utilisateur"
            type="text"
            onChange={ChangeInputValue}
          />
        </FormGroup>
        <FormGroup>
          <Label className="label" for="password">
            Mot de Passe
          </Label>
          <Input
            className="login_input"
            id="password"
            name="password"
            placeholder="Mot de passe"
            type="password"
            onChange={ChangeInputValue}
          />
        </FormGroup>
        <Button
          size="lg"
          block
          className="login_btn"
          id="login"
          onClick={handleSubmit}
        >
          CONNECETEZ
        </Button>
      </Form>
    </div></Col>
   
    </Row></> 
        
        }
        {/*<Button className="change" onClick={()=> {setCollapse(true);setComponentVisible(false);}}><u><b>Changer le mot de passe ?</b></u></Button>*/}
        <div>
        <Collapse isOpen={collapse === true}>
          <Form>
          <FormGroup>
              <Label className="label" for="password">
               Non d'utilisateur
              </Label>
              <Input
                style={{ background: "#fff" }}
                name="username"
                placeholder="Votre nom d'utilisateur"
                type="text"
                onChange={(e)=> setchangepass({ ...changepass, [e.target.name]: e.target.value })}
              />
            </FormGroup>  

            <FormGroup>
              <Label className="label" for="password">
               Ancien mot de Passe
              </Label>
              <Input
                style={{ background: "#fff" }}
                name="oldpassword"
                placeholder="Votre ancien mot de passe"
                type="password"
                onChange={(e)=> setchangepass({ ...changepass, [e.target.name]: e.target.value })}
              />
            </FormGroup>   
            <FormGroup>
              <Label className="label" for="password">
               Nouveau mot de Passe
              </Label>
              <Input
                style={{ background: "#fff" }}
                name="newpassword"
                placeholder="Votre nouveau mot de passe"
                type="password"
                onChange={(e)=> {setchangepass({ ...changepass, [e.target.name]: e.target.value });}}
              />
            </FormGroup>
          </Form>
      
            <Button
              size="lg"
              block
              className="login_btn"
              id="login"
              onClick={()=>changePassWord()}
            >
             Envoyez
            </Button>
            </Collapse>
        </div>
      </div>
    </div>
  );
 }

export default Login;