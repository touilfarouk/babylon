import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import {Table, Button,Modal, ModalHeader,ModalBody,Collapse, ModalFooter,Card,CardHeader, CardBody,CardTitle,Row,Col, Form,FormGroup,Label,Input,CustomInput} from "reactstrap";
import { getGroups, allUsersRoutes, addGroup,deleteGroup,updateGroup } from "../../utils/APIRoutes";
import { IoIosBrush,IoIosCut,IoIosCheckmarkCircle,IoIosCloseCircle,
} from "react-icons/io";
import Select from "react-select";
import { useSocket } from '../SocketProvider';
import NotificationAlert from "react-notification-alert";
function ChatSettings(props) {
  const socket = useSocket();
  const token = localStorage.getItem("token");
  const [listGroupe, setlistGroupe] = useState([]);
  const [collapse, setCollapse] = useState(true);
  const [collapse2, setCollapse2] = useState(false);
  const [options, setoptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [newgroupe, setnewgroupe] = useState({});
  const [groupename, setgroupename] = useState("");
  const [editedGroupe, setEditedGroupe] = useState({
    id_groupe: null,
    name_groupe: '',
    group_members: [], // Initialize as an empty array
  });
  
  /****************************************** */
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
  /****************************************** */
 
    const [switches, setSwitches] = useState([]);
  
    const toggleSwitch = (index) => {
      const newSwitches = [...switches];
      newSwitches[index] = !newSwitches[index];
      setSwitches(newSwitches);
    };
  /******************************************* */
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption.value);
   
    setnewgroupe({ ...newgroupe, selectedOption });
  };
  const handleInputChange = (event) => {
    const name_groupe = event.target.value;
    setgroupename(name_groupe);
    setnewgroupe({ ...newgroupe, name: name_groupe });
  };
  const toggle = () => {
    setCollapse(!collapse);
    setCollapse2(false);
  };
  const toggle2 = () => {
    setCollapse(false);
    setCollapse2(!collapse2);
  };
  function getallgroupes() {
    fetch(getGroups, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setlistGroupe(data);
      });
  }
  useEffect(() => {
    getallgroupes();
  }, []);
  /******************************** */
  function deleteGroupe(id_groupe) {
    Swal.fire({
      title: 'Voulez-vous supprimer ce groupe ?',
      icon: 'question',
      iconHtml: '?',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      showCancelButton: true,
      showCloseButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
    
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(deleteGroup, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({id_groupe}),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if (data == "true") 
            {
              var obj = {place: 'tc',message: 'Groupe supprimé avec succès.',type: "success",icon: "nc-icon nc-check-2",autoDismiss: 4};
              showNotification(obj);
              getallgroupes();
    
            }
            if(data=='false')
            { var obj = {place: 'tc',message: 'Erreur , Essayez ultérieurement!',type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
            showNotification(obj);}
          });
      }
    })
 
  }
  /***************************************** */
  function addgroupe(groupe) {
    fetch(addGroup, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupe),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setSelectedOption("");
        setgroupename("");
        setnewgroupe({});
        if (data == "true") 
        {
          var obj = {place: 'tc',message: 'Groupe ajouté avec succès.',type: "success",icon: "nc-icon nc-check-2",autoDismiss: 4};
          showNotification(obj);
          getallgroupes();

        }
        if(data=='empty')
        { var obj = {place: 'tc',message: 'Remplir touts les champs!.',type: "warning",icon: "nc-icon nc-alert-circle-i",autoDismiss: 5};
        showNotification(obj);}
        if(data=='exist')
        { var obj = {place: 'tc',message: 'Ce nom de groupe existe déjà ! Veuillez le changer.',type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 5};
        showNotification(obj);}
      });
  }

  /*******************************************/
  const handleSelectupdate = (selectedOption) => {
    setSelectedOption2(selectedOption.value);
    setEditedGroupe({...editedGroupe, group_members: selectedOption });
    console.log(editedGroupe)
  
  };

  function updateGroupe(groupe) {
    fetch(updateGroup, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(groupe),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setSelectedOption2("");
        setEditedGroupe("");
        if (data.rep == "true") 
        {
          var obj = {place: 'tc',message: 'Le groupe a été modifié avec succès.',type: "success",icon: "nc-icon nc-check-2",autoDismiss: 4};
          showNotification(obj);
          getallgroupes();
          socket.emit("refresh-groups",data.notInGroupMembers);
        }
       else
       { var obj = {place: 'tc',message: 'Erreur! Essayez a nouveau',type: "danger",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
       showNotification(obj);}
      });
  }
  /**************************************/
  function getallusers() {
    fetch(allUsersRoutes, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ all: "all" }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setoptions(data.allPosts.map(option => ({
                   value: `${option.id_user}`,
                   label: `${option.username} ${option.familyname} `})));
      });
  }

  useEffect(() => {
    getallusers();
  }, []);
  /***************************************** */
  return (
    <div> 
      <Modal isOpen={props.open} fullscreen style={{ "max-width": "70%" }}>
      <NotificationAlert ref={notificationAlert} />
        <ModalHeader>Paramèttre</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Card style={{ height: "auto" }}>
                <Button
                  onClick={() => toggle()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#52B7BB",
                    fontSize: "15px",
                  }}
                >
                  <u> Liste Des Groupes </u>
                </Button>
                <Collapse isOpen={collapse === true}>
                  <CardBody style={{ height: '350px', overflowY: 'scroll' }}>
                    <Table >
                      <thead className="text-primary">
                        <tr>
                          <th>nom Groupe</th>
                          <th>members</th>
                          <th className="text-right"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listGroupe.map((value, index) => {
                        
                           const isEditedGroupe = editedGroupe && value.id_groupe === editedGroupe.id_groupe;
                          return (
                            <tr key={index} style={isEditedGroupe ? { backgroundColor: 'aliceblue' } : {}}>
                         <td>
                                {isEditedGroupe?
                                (<input  style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="username"
                                value={editedGroupe.name_groupe}
                                onChange={(e) => setEditedGroupe({ ...editedGroupe, name_groupe: e.target.value })}/>)
                                :(value.name_groupe)}
                             </td>
                              <td>
                          {isEditedGroupe ? (
                           <Select
                           style={{border:'none', backgroundColor: 'aliceblue'}}
                           value={editedGroupe.group_members}
                           options={options}
                           onChange={(e)=>handleSelectupdate(e) }
                           isMulti/>
                   ) : (
                   value.group_members.map((member, index) => (
                   <span key={index}>
                   {member.label}
                   {index < value.group_members.length - 1 ? ', ' : ''}
                   </span>
            ))
          )}
        </td>
        <td className="text-right">
  {isEditedGroupe ? (
    <>
      <button
        type="button"
        className="btn-round"
        style={{ padding: "6px 7px", fontSize: "12px", background: "#2A9D8F", cursor: "pointer", border: "none", color: "white" }}
        onClick={() => {
          updateGroupe(editedGroupe)
        }}
      >
        <IoIosCheckmarkCircle />
      </button>{" "}
      <button
        type="button"
        className="btn-round"
        style={{ padding: "6px 7px", fontSize: "12px", background: "#DE2E4B", cursor: "pointer", border: "none", color: "white" }}
        onClick={() => setEditedGroupe(null)}
      >
        <IoIosCloseCircle />
      </button>{" "}
    </>
  ) : (
    <>
      <button
        type="button"
        className="btn-round"
        style={{ padding: "6px 7px", fontSize: "12px", background: "#51cbce", cursor: "pointer", border: "none", color: "white" }}
        onClick={() => setEditedGroupe(value)}
      >
        <IoIosBrush />
      </button>{" "}
      <button
        type="button"
        className="btn-round"
        style={{ padding: "6px 7px", fontSize: "12px", background: "#ef8157", cursor: "pointer", border: "none", color: "white" }}
        onClick={() => deleteGroupe(value.id_groupe)}
      >
        <IoIosCut />
      </button>{" "}
    </>
  )}
</td>
                       </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </CardBody>
                </Collapse>
                <Button
                  onClick={() => {
                    toggle2();
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#52B7BB",
                    fontSize: "15px",
                  }}
                >
                  <u>ajouter un nouveau groupe</u>
                </Button>
                <Collapse isOpen={collapse2 === true}>
                  <CardBody>
                    <Form>
                      <FormGroup>
                        <Label for="groupename">NOM GROUPE</Label>
                        <Input
                          value={groupename}
                          type="text"
                          name="groupename"
                          id="username"
                          required
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Select
                          value={selectedOption}
                          onChange={handleSelectChange}
                          options={options}
                          isMulti
                        />
                      </FormGroup>
                      <Button
                        color="primary"
                        onClick={() => addgroupe(newgroupe)}
                      >
                        Ajouter
                      </Button>{" "}
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          
          </Row>
        </ModalBody>
        <ModalFooter>
          
          <Button
            color="primary"
            onClick={() => props.setchatsettings(false)}
          >
            ok
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ChatSettings;
