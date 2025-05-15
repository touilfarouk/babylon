import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import { getUserInf } from "./utils/APIRoutes";
import CheckConnection from"./CheckConnection";
import { Button } from "reactstrap";
import Login from "views/Login";
import { useSocket } from './views/SocketProvider';
import "primereact/resources/themes/saga-blue/theme.css";
import "../node_modules/primeflex/primeflex.css";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';


function App() {
  const [isLogged, setIsLogged] = useState(false);
  const token=localStorage.getItem("token");
  const socket = useSocket();
/****************************************************/
useEffect(() => {
  const handleBeforeUnload = (event) => {
    // Disconnect the socket before the page unloads
    socket.emit("log-out");
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [socket]);
/****************************************************/
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
    .then((response) => response.json())
    .then((data) => {
      // Handle the data
    })
    .catch((error) => {
      console.log("Error:", error);
      if(error==`SyntaxError: Unexpected token 'F', "Forbidden" is not valid JSON`) {
        confirmDialog({
          message: "Votre session a expiré, vous devez vous reconnecter",
          header: 'Attention',
          icon: 'pi pi-times-circle',
          acceptClassName: 'p-button-danger',
          className: 'custom-confirm-dialog',
          footer: () => {
            return (
              <Button
                  style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)' }}
                  className="p-button-text"
                  onClick={() => {
                    localStorage.clear();
                    setIsLogged(false);
                  }}
                >
                 Reconnecter
                </Button>
            );
          },
        });
      }
    });

  if (token) {
    setIsLogged(true);
  } else {
    setIsLogged(false);
  }
}, [isLogged]);

  //..
  if (isLogged) {
    return (
  //  <CheckConnection>
    <>
     <ConfirmDialog headerStyle={{background:'var(--red-100)',borderColor:'2px var(--red-100)',padding:'10px',marginBottom:'2px',borderRadius:'10px'}}/>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout setIsLogged={setIsLogged} />} />
          <Route path="*" element={<Navigate to="/admin/programme" replace />} />
        </Routes>
        </>
  // </CheckConnection> 
    );
  } else {
    return (
 // <CheckConnection>   
      <>
        <Routes>
          <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes> 
      </> 
    // </CheckConnection>   
    );
  }
}

export default App;