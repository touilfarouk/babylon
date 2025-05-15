import React from "react";
import { Button } from "reactstrap";
import { useSocket } from './SocketProvider';
import {IoIosPower} from "react-icons/io";
function Logout(props) {
  const socket = useSocket();

  const handleLogout = () => {
    // Emit the disconnect event to the server
    socket.emit("log-out");
    
    // Clear localStorage and set isLoggedIn state to false
    localStorage.clear();
    props.setIsLogged(false);
  };

  // Handle the server's response to the disconnect event


  return (
    
    <Button
      
      className="rounded"
      onClick={handleLogout}
    >
      Déconnexion
    </Button>
  );
}

export default Logout;
