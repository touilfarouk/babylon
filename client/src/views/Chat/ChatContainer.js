import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from 'reactstrap';
import { IoMdSend, IoIosAddCircle,IoIosPaper,IoMdTrash,IoIosCloseCircle,IoIosArrowRoundUp} from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { IoIosAttach } from "react-icons/io";
import NotificationAlert from "react-notification-alert";
import { sendMessageRoute, getAllMessageRoute,uploadFile,download ,DeleteMsg} from '../../utils/APIRoutes';
import './css.css';
  const ChatContainer = ({val,setval,currentChat, currentUser, socket,setCurrentSelected ,setCurrentChat}) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [scrolledToTop, setScrolledToTop] = useState(false);
  const token = localStorage.getItem('token');
  const formData = new FormData();
  const msgs=[...messages];
 
/**********************************************************************/
  const handleHideComponent = () => {
    setCurrentChat({id_user:""});
  };
 
/************************************file****************************************/
const handleFileChange = (event) => {

  formData.append('file', event.target.files[0]);
  if( event.target.files[0].size > 0)
  {
    var obj = {place: 'br',message: 'La taille du fichier ne doit pas depassé 10Mb',type: "info",icon: "nc-icon nc-alert-circle-i",autoDismiss: 6};
    showNotification(obj);
    sendFile();}
 
};
/**************************/
const notificationAlert = React.useRef();
const showNotification = (data) => {
  notificationAlert.current.notificationAlert({
    place: data["place"],
    message: <div>{data["message"]}</div>,
    type: data["type"],
    icon: data["icon"],
    autoDismiss: data["autoDismiss"],
  });
}
/****************** */
const sendFile = () => {
  var path;
  if(currentChat.id_user=="groupe")
   path = `${uploadFile}/${currentUser.id_user}/${currentChat.id_user}/${currentChat.id_groupe}`
  else 
  path = `${uploadFile}/${currentUser.id_user}/${currentChat.id_user}`
  try {
    fetch(path, {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`, // Initialize 'token' before using it
        },
      body: formData,
        }).then((response) => response.json())
         .then((data) => {
          msgs.push({fromSelf:true,message:data.fileContent,id_message:data.sendMessages.insertId,createdAt:new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),type_message:"file"})
          setMessages(msgs);
         formData.forEach((value, key) => {
         formData.delete(key);
         });
         if(currentChat.id_user =="groupe")
        { socket.emit('send-msg', {
          to: currentChat.id_user,
          from: currentUser.id_user,
          username:currentUser.username,
          familyname:currentUser.familyname,
          message: data.fileContent,
          id_groupe:currentChat.id_groupe,
          type_message:"file",
        });}
        else 
      {  socket.emit('send-msg',{
          to: currentChat.id_user,
          from: currentUser.id_user,
          username:currentUser.username,
          familyname:currentUser.familyname,
          message: data,
          type_message:"file",
        });}
       })
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
/********************************savefile************************************/
// const handleFileDownload = (fileName) => {
//   fetch(download,{
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // Initialize 'token' before using it
//       },
//     body:JSON.stringify({fileName:fileName}),
//       })
//     .then((response) => response.blob())
//     .then((blob) => {
//       saveAs(blob, fileName);
//     })
//     .catch((error) => {
//       console.error('Error downloading file:', error);
//     });
// };
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
/*****************************************end file ***************************************/
function getAllMsgs() {
  const body = currentChat.id_user === "groupe"
  ?JSON.stringify({ to:currentChat.id_user,id_groupe:currentChat.id_groupe, GET: "currentUser" , limit:val})
  :JSON.stringify({ to: currentChat.id_user, GET: "currentUser" , limit:val});
  if (currentChat) {
    fetch(getAllMessageRoute, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
}  
useEffect(() => {
  getAllMsgs();
  }, [currentChat,val]);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };
/********************************** */
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);
/********************************** */
  const handleSendMsg = async (msg) => {
    const body = currentChat.id_user === "groupe"
  ? JSON.stringify({ from: currentUser.id_user, to: currentChat.id_user,id_groupe:currentChat.id_groupe, message: msg })
  : JSON.stringify({ from: currentUser.id_user, to:currentChat.id_user, message: msg });
  fetch(sendMessageRoute, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body, // Use the 'body' variable for the request body
  }).then((response) => response.json())
    .then((data) => {
        msgs.push({fromSelf:true,id_message:data.insertId,message:msg,createdAt:new Date().toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),})
        setMessages(msgs);
        if(currentChat.id_user != "groupe")
      {  socket.emit('send-msg', {
          to: currentChat.id_user,
          from: currentUser.id_user,
          username:currentUser.username,
          familyname:currentUser.familyname,
          message: msg,
          idMsg:data.insertId,
          type_message:"message"
        });}
        else{  socket.emit('send-msg', {
          to: currentChat.id_user,
          from: currentUser.id_user,
          username:currentUser.username,
          familyname:currentUser.familyname,
          message: msg,
          idMsg:data.insertId,
          type_message:"message",
          id_groupe:currentChat.id_groupe
        });}
      }).catch((error) => {
        console.log('Error:', error);
      });};
  const handledeleteMsg = (id)=>{
    if(currentChat){
    fetch(DeleteMsg, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({idMsg:id})
    }).then((response) => response.json())
      .then((data) => {
          getAllMsgs();
          socket.emit('msg-deleting', {to: currentChat.id_user});
        }).catch((error) => {
          console.log('Error:', error);
        });}}
  useEffect(() => {
    if (socket) {
      socket.on('msg-recieve', (msg) => {
        console.log(msg);
    if(msg.to ==="groupe")
        setArrivalMessage({message: msg.message, type_message:msg.type_message,from:msg.from,username:msg.username,familyname:msg.familyname,to:msg.to,id_groupe:msg.id_groupe,createdAt:new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
     })
     ,});
      else 
      setArrivalMessage({message: msg.message, type_message:msg.type_message,from:msg.from,to:msg.to,createdAt:new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
     })
     ,});
      });
      socket.on('refresh-msgs',(msg)=>{
        getAllMsgs();
      })
  return ()=>{
    socket.off('msg-recieve');};}
  }, [currentChat,socket]);
  useEffect(() => {
    if (arrivalMessage && currentChat && arrivalMessage.from === currentChat.id_user && arrivalMessage.to!="groupe" ) {
    setMessages((prevMessages) => [...prevMessages, arrivalMessage]);}
    if(arrivalMessage && currentChat.id_user==="groupe" && arrivalMessage.to=="groupe" && currentChat.id_groupe==arrivalMessage.id_groupe)
    setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  return (
    <div>
   <NotificationAlert ref={notificationAlert} />
        <button className="btn-round exit"onClick={()=>{handleHideComponent();setCurrentSelected(undefined);setCurrentChat({id_user:""})}} >
        <IoIosCloseCircle />
        </button>
      <Card className="card-user">
        <CardHeader>
          {currentChat.id_user=="groupe"?<div className="chat-card-header">
            <div className="avatar">
              <img
                alt="..."
                className="img-circle img-no-padding img-responsive"
                src={require('assets/img/faces/avatargroupe.png')}
              />
            </div>
            <div className="title">
              <CardTitle tag="h5">{currentChat.name_groupe}</CardTitle>
            </div>
          </div>:<div className="chat-card-header">
            <div className="avatar">
              <img
                alt="..."
                className="img-circle img-no-padding img-responsive"
                src={require('assets/img/faces/avatar.png')}
              />
            </div>
            <div className="title">
              <CardTitle tag="h5">{currentChat.username}</CardTitle>
            </div>
          </div>}
          
        </CardHeader>
        <CardBody className="chat-card-body">
        <button className='more_msg' onClick={()=>{setval(prevCount => prevCount + 20)}} > 
        <IoIosArrowRoundUp/>
        </button>
        <div className="chat-messages" >
          {messages.map((message, index) => {
            return (
              <div key={uuidv4()} ref={index === messages.length - 1 ? scrollRef : null} >
                <div className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}>
                {message.fromSelf && (
                  <button className="trash" onClick={()=>handledeleteMsg(message.id_message)} ><IoMdTrash /></button>
                         )}
                 <div className="content"  onClick={() =>{ if(message.type_message=="file")handleFileOpen(message.message)}}>
                    {message.type_message=="file"?<p><span className='IoIosPaper'><IoIosPaper/></span> {message.message.slice(0, 10)}...</p>
                    :<p>{message.message}</p>}
                     <p id="time">{message.createdAt}</p>
              
            {message.fromSelf && message.vue==1 && (
              <p className="view-status" style={{   marginTop: "5px", fontSize: "10px",color: "red"}}>Vu</p>
            )}
                    {message.sender!=currentUser.id_user && <p id="name"><b>{message.username} {message.familyname}</b></p>}
                  </div>           
                </div>
              </div>
            );
          })}        
        </div>
      </CardBody>
        <CardFooter>
          <Row>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
              <input
                className="input-container"
                type="textarea"
                placeholder="tapez ici!"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button className="btn-round" color="primary" type="submit">
                <IoMdSend />
              </button>
                    <label className='addfile' htmlFor="file-input">
                       <IoIosAttach/>
                     </label>
                     <input
                      className='inputfile'
                       id="file-input"
                       type="file"
                       name="file"
                        onChange={handleFileChange}
                       />
            </form>
          </Row>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ChatContainer;
