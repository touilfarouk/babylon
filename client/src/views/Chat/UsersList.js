import React, { useState, useEffect } from "react";
import { allUsersRoutes, AddNewUser,updateUser,deleteUser} from '../../utils/APIRoutes';
import NotificationAlert from "react-notification-alert";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Form, FormGroup, Label, Input, Button, CustomInput } from "reactstrap";
import { IoIosBrush, IoIosCut,IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import { Dropdown } from 'primereact/dropdown';
import {getWilaya} from '../../utils/APIRoutes';
import Swal from 'sweetalert2'
function UsersList() {
  const [wilaya,setwilaya]=useState([]);
  const token = localStorage.getItem('token');
  const [editedUser, setEditedUser] = useState(null);
  const [listUsers, setlistUsers] = useState([]);
  const [addUser, setaddUser] = useState({
    username: "",
    familyname: "",
    email: "",
    password: "",
    roles: "",
    structure:"",
    fonction:"",
    phone_number:"",
    wilaya:""
  });


  /****************************************************************************/
  const notificationAlert = React.useRef();

  const showNotification = (data) => {
    var options = {};
    options = {
      place: data["place"],
      message: <div>{data["message"]}</div>,
      type: data["type"],
      icon: data["icon"],
      autoDismiss: data["autoDismiss"],
    };
    notificationAlert.current.notificationAlert(options);
  };
  function getListWilaya() {
    fetch(getWilaya, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setwilaya(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  }  
  /***************************************************************************/
  function change(e) {
    const { name, value } = e.target;
    setaddUser(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function getallusers() {
    fetch(allUsersRoutes, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ all: "all" }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setlistUsers(data.allPosts);
        setaddUser({
          username: "",
          familyname: "",
          email: "",
          password: "",
          roles: "",
          structure:"",
          fonction:"",
          phone_number:""
        });
      });
  }
  useEffect(() => {
    getallusers();
  }, []);
  /****************************************add user****************************************/
  function addNewUser() {
    fetch(AddNewUser, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "true") {
           getallusers();
          var obj = {place: 'tc',message: 'Utilisateur ajouté avec succès.',type: "success",icon: "nc-icon nc-check-2",autoDismiss: 4};
          showNotification(obj);
          setaddUser({username: "",familyname: "",email: "", password: "",roles: "",  fonction:"",phone_number:""});
        } else if (data === "exist") {
          var obj = { place: 'tc',message: 'Cet utilisateur existe déjà !',type: "warning",icon: "nc-icon nc-alert-circle-i",autoDismiss: 4};
          showNotification(obj);
        } else if (data === "false") {
          var obj = {place: 'tc',message: 'Essaie à nouveau !',type: "danger",icon: "nc-icon nc-simple-remove",autoDismiss: 6};
          showNotification(obj);
        }
         
        if (data === "empty") {
          var obj = { place: 'tc',message: 'Remplir tous les champs !',type: "danger",icon: "nc-icon nc-simple-remove",autoDismiss: 4};
          showNotification(obj);
        }
     
      })
      .catch((error) => {
        console.error(error);
      });
  }
  /*********************************************edit user************************************************/
  function editUser(user) {
    setEditedUser({ ...user });
  }

  function updateEditedUser() {
   fetch(updateUser, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedUser),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
     if(data="true")
        setEditedUser({});
        getallusers();
      });
  }
  /****************************delete****************************************/
  function DeleteUser(del) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Voulez-vous supprimer cet utilisateur ?',
      icon: 'question',
      iconHtml: '?',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      showCancelButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(deleteUser, {
          method: "POST",
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(del),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
         if(data="true")
            getallusers();
            swalWithBootstrapButtons.fire(
              "Supprimé !",
              "Utilisateur a été supprimé.",
              "Succès"
            )
          });
      
      }})
  
   }
  /*********************************************************************** */
  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">TABLE DES UTILISATEURS</CardTitle>
              </CardHeader>
              <CardBody>
                <Table >
                  <thead className="text-primary">
                    <tr>
                      <th>prenom</th>
                      <th>nom</th>
                      <th>email</th>
                      <th>téléphone</th>
                      <th >role</th>
                      <th>FONCTION</th>
                      <th>strecture</th>
                      <th className="text-right"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUsers.map((value, index) => {
                    const isEditedUser = editedUser && value.id_user === editedUser.id_user;
                      return (
                        <tr key={index} style={isEditedUser ? { backgroundColor: 'aliceblue' } : {}}>
                               <td>
                            {isEditedUser ? (
                              <input
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="username"
                                value={editedUser.username}
                                onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                              />
                            ) : (
                              value.username
                            )}
                          </td>
                             <td>
                            {isEditedUser ? (
                              <input
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="familyname"
                                value={editedUser.familyname}
                                onChange={(e) => setEditedUser({ ...editedUser, familyname: e.target.value })}
                              />
                            ) : (
                              value.familyname
                            )}
                          </td>
                          <td>
                            {isEditedUser ? (
                              <input
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="email"
                                value={editedUser.email}
                                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                              />
                            ) : (
                              value.email
                            )}
                          </td>
                          <td>
                            {isEditedUser ? (
                              <input
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="phone_number"
                                value={editedUser.phone_number}
                                onChange={(e) => setEditedUser({ ...editedUser, phone_number: e.target.value })}
                              />
                            ) : (
                              value.phone_number
                            )}
                          </td>
                          <td>
                            {isEditedUser ? (
                              <CustomInput
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                id="roles"
                                name="roles"
                                type="select"
                                value={editedUser.roles}
                                onChange={(e) => setEditedUser({ ...editedUser, roles: e.target.value })}
                              >
                                <option value="" disabled>
                                  --Sélectionner--
                                </option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="UTILISATEUR">UTILISATEUR</option>
                              </CustomInput>
                            ) : (
                              value.roles
                            )}
                          </td>
                          <td>
                            {isEditedUser ? (
                              <input
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                type="text"
                                name="fonction"
                                value={editedUser.fonction}
                                onChange={(e) => setEditedUser({ ...editedUser, fonction: e.target.value })}
                              />
                            ) : (
                              value.fonction
                            )}
                          </td>
                          <td>
                            {isEditedUser ? (
                              <CustomInput
                              style={{border:'none', backgroundColor: 'aliceblue'}}
                                id="structure"
                                name="structure"
                                type="select"
                                value={editedUser.structure}
                                onChange={(e) => setEditedUser({ ...editedUser, structure: e.target.value })}
                              >
                                <option value="" disabled>
                                  --Sélectionner--
                                </option>
                                <option value="DGPA">DGF</option>
                                <option value="BNEDER">BNEDER</option>
                                <option value="HCDS">HCDS</option>
                                <option value="DSA">DSA</option>
                                <option value="CF">CF</option>
                               
                              </CustomInput>
                            ) : (
                              value.structure
                            )}
                          </td>
                          <td className="text-right">
                          {isEditedUser ? (
                              <>
                                <button
                                  type="button"
                                  className="btn-round"
                                  style={{ padding: "6px 7px", fontSize: "12px", background: "#2A9D8F", cursor: "pointer", border: "none", color: "white" }}
                                  onClick={() => updateEditedUser()}
                                >
                                  <IoIosCheckmarkCircle />
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn-round"
                                  style={{ padding: "6px 7px", fontSize: "12px", background: "#DE2E4B", cursor: "pointer", border: "none", color: "white" }}
                                  onClick={() => setEditedUser(null)}
                                >
                                  <IoIosCloseCircle />
                                </button>{" "}
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn-round"
                                style={{ padding: "6px 7px", fontSize: "12px", background: "#2A9D8F", cursor: "pointer", border: "none", color: "white" }}
                                onClick={() => editUser(value)}
                              >
                                <IoIosBrush />
                              </button>)}

                            <button
                              type="button" className="btn-round"
                              style={{ padding: "6px 7px", fontSize: "12px", background: "#DE2E4B", cursor: "pointer", border: "none", color: "white" }}
                              onClick={()=> DeleteUser(value)}
                            >
                              <IoIosCut />
                            </button>{" "}

                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader>
                <CardTitle tag="h4">AJOUTER UN NOUVEAU UTILISATEUR</CardTitle>
                <p className="card-category">
                  Remplir les champs suivants et cliquer sur ajouter
                </p>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label for="familyname">NOM</Label>
                    <Input
                      type="text"
                      name="familyname"
                      id="familyname"
                      required
                      value={addUser.familyname}
                      onChange={change}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="username">PRENOM</Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={addUser.username}
                      onChange={change}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">EMAIL</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={addUser.email}
                      onChange={change}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone_number">TELEPHONE</Label>
                    <Input
                   type="number"
                   name="phone_number"
                   id="phone_number"
                   required
                   maxLength="10"
                   pattern="[0-9]{10}"
                   value={addUser.phone_number}
                   onChange={change} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="fonction">FONCTION</Label>
                    <Input
                      type="text"
                      name="fonction"
                      id="fonction"
                      required
                      value={addUser.fonction}
                      onChange={change}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="strecture">STRUCTURE</Label>
                    <CustomInput
                      id="structure"
                      name="structure"
                      type="select"
                      required
                      value={addUser.structure}
                      onChange={change}
                    >
                      <option value="" selected disabled>
                        --Séléctionner--
                      </option>
                      <option value="DGF">DGF</option>
                      <option value="BNEDER">BNEDER</option>
                      <option value="DGPA">FORETS</option>
                      <option value="CF">CF</option>
                      <option value="DSA">DSA</option>
                      <option value="HCDS">HCDS</option>
                    </CustomInput>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">MOT DE PASSE</Label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Input
                        type="text"
                        name="password"
                        id="password"
                        required
                        value={addUser.password}
                        onChange={change}
                      />
              
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="roles">ROLE</Label>
                    <CustomInput
                      id="roles"
                      name="roles"
                      type="select"
                      required
                      value={addUser.roles}
                      onChange={change}
                    >
                      <option value="" selected disabled>
                        --Séléctionner--
                      </option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="UTILISATEUR">UTILISATEUR</option>
                    </CustomInput>
                  </FormGroup>
                  <FormGroup>
                    <Label for="wilaya">WILAYA</Label>
                    <CustomInput
                      id="wilaya"
                      name="wilaya"
                      type="select"
                      required
                      value={addUser.wilaya}
                      onChange={change}
                    >
                      <option value="" selected disabled>
                        --Séléctionner--
                      </option>
                      <option value="03">LAGHOUAT</option>
                      <option value="05">BATNA</option>
                      <option value="07">BISKRA</option>
                      <option value="10">BOUIRA</option>
                      <option value="12">TEBESSA</option>
                      <option value="17">DJELFA</option>
                      <option value="19">SETIF</option>
                      <option value="26">MEDEA</option>
                      <option value="28">M'SILA</option>
                      <option value="32">EL BAYADH</option>
                      <option value="34">BORDJ BOU ARRERIDJ</option>
                      <option value="40">KHENCHELA</option>
                      <option value="45">NAAMA</option>
                    </CustomInput>
                  </FormGroup>
          

   
  

                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '18px', padding: '12px 24px' }}>
                    <Button color="primary" onClick={addNewUser}>
                      AJOUTER
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UsersList;
