import React,{useState,useEffect} from "react";
import { v4 as uuidv4 } from 'uuid';
import { IoIosPaper} from 'react-icons/io';
import { allUsersRoutes,getAllMessages,download} from '../../utils/APIRoutes';
import { Button,Modal, ModalHeader,ModalBody,Collapse, ModalFooter,Card,CardHeader, CardBody,CardTitle,Row,Col, Form,FormGroup,Label,Input,CustomInput} from "reactstrap";
import './css.css';
import NotificationAlert from "react-notification-alert";
function ViewMessages (props) {
  const token=localStorage.getItem('token');
  const [users, setusers] = useState([]);
  const [val, setval] = useState({id_user2:'',id_user1:''});
  const [messages, setmessages] = useState([]);
  const  change=(e)=> {
    setval({ ...val,[e.target.name]:e.target.value});
  }
    /***********************************************************/
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
    /****************************************************/
  const handleFileOpen = (fileName) => {
    fetch(download, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Initialize 'token' before using it
      },
      body: JSON.stringify({ fileName: fileName }),
    })
    .then((response) => response.blob())
    .then((blob) => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
      })
      .catch((error) => {
        console.error('Error opening file:', error);
      });
  };
useEffect(() => {
  fetch(allUsersRoutes, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      setusers(data.allPosts)
     })
    .catch((error) => {
      console.log("Error:", error);
    });
}, [])
const getAllMsgs=()=> {
  fetch(getAllMessages, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify(val),
  })
    .then((response) => response.json())
    .then((data) => {
      if(data=="empty")
      { { var obj = {place: 'tc',message: 'Erreur ,selectionner les utilisateurs de la conversation !',type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
      showNotification(obj);}}
      else{setmessages(data);}
    
     })
    .catch((error) => {
      console.log('Error:', error);
    });
}
    return(<>
  
      <Modal isOpen={props.open} fullscreen style={{ "max-width": "70%" }}>
      <NotificationAlert ref={notificationAlert} />
        <ModalHeader>
         Messages
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="3">
              <Card style={{ height: "400px" }}>
              <br/>    <br/>    <br/>    <br/>
              <Input type="select" name="id_user1" id="exampleSelect" onChange={(e)=>change(e)} style={{background:"#b3b3b34f"}}>
              <option value="">--Selectionner l'utilisateur 1 --</option>
              {users.map((option) => (
               <option key={option.value} value={option.id_user}>
                {option.username} {option.familyname}
              </option>
        ))}
      </Input>
             
       <br/>
          <Input type="select" name="id_user2" id="exampleSelect" onChange={(e)=>change(e)} style={{background:"#0078b89b"}}>
            <option value="">--Selectionner l'utilisateur 2 --</option>
              {users.map((option) => (
               <option key={option.value} value={option.id_user}>
                {option.username} {option.familyname}
              </option>
        ))}
      </Input>
      <br/>
          <Button  onClick={getAllMsgs}>OK</Button>
          
        
              </Card>
            </Col>
            <Col md="9">
          <Card style={{ height: '400px', overflowY: 'scroll' }}>     <div className="chat-messages" >
          {messages && messages.length>0? messages.map((message, index) => {
            return (
              <div key={uuidv4()} >
                <div className={`message ${message.from1 ? 'sended' : 'recieved'}`}>
                 <div className="content"  onClick={() =>{ if(message.type_message=="file")handleFileOpen(message.message)}}>
                    {message.type_message=="file"?<p><span className='IoIosPaper'><IoIosPaper/></span>{message.message.slice(0, 10)}...</p>
                    :<p>{message.message}</p>}
                     <p id="time">{message.createdAt}</p>
                
                  </div>           
                </div>
              </div>
            );
          }):
          <p className="empty-message" >Aucunne conversation trouvée</p>}        
        </div></Card>
       
            </Col>
         
          </Row>
        </ModalBody>
        <ModalFooter>
          
          <Button
            color="primary"
            onClick={() => props.setviewMsgs(false)}
          >
            Quitter
          </Button>
        </ModalFooter>
      </Modal>
    </>);
}
export default ViewMessages ;