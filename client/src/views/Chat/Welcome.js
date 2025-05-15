import React, { useState, useEffect } from "react";
import Robot from "../../assets/robot.gif";
import { IoIosSettings,IoIosEye } from "react-icons/io";
import {VscEye} from "react-icons/vsc";
import './css.css'
import ChatSettings from "./ChatSettings";
import ViewMessages from'./ViewMessages'
export default function Welcome({currentUser}) {
const [chatsettings, setchatsettings] = useState(false)
const [viewMsgs,setviewMsgs] = useState(false)
let role
if(currentUser!=undefined){
 role=currentUser.role
}

  return (
    
    <div className="welcome-containe">
         {chatsettings && <ChatSettings open={chatsettings} setchatsettings={setchatsettings}/>}
      {role=='ADMIN' && <button color="info" style={{ marginLeft: "90%", border:'none',fontSize: "35px",backgroundColor:'transparent'}}
        onClick={()=>setchatsettings(true)}>
          <IoIosSettings /> 
         </button>}
      {viewMsgs && <ViewMessages open={viewMsgs} setviewMsgs={setviewMsgs}/>}
      {role=='ADMIN' && <button color="info" style={{ marginLeft: "90%", border:'none',fontSize: "35px",backgroundColor:'transparent'}}
        onClick={()=>setviewMsgs(true)}>
          <VscEye /> 
         </button>}
      <img src={Robot} alt="" />
      <h1>
      Bienvenue <span>{}</span>
      </h1>
      <h3>Sélectionnez un utilisateur pour commencer à discuter</h3>
    </div>
  );
}