
import React,{useState,useEffect,useRef} from "react";
import {Button,Card,CardHeader,CardBody,CardTitle,Row,Col,} from "reactstrap";
import { allUsersRoutes, host,viewMsg ,viewMsgGroupe,getGroups} from '../../utils/APIRoutes';
import ChatContainer from "./ChatContainer"
import Welcome from "./Welcome";
import io from "socket.io-client";
import { useSocket } from '../SocketProvider';
import './css.css';
function User() {
  const [users, setusers] = useState([]);
  const scrollRef = useRef(null);
  const [currentChat, setCurrentChat] = useState({id_user:""});
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [notification, setnotification] = useState([{senderId:""}])
  const [notificationGroupe, setnotificationGroupe] = useState([])
  const [groupes, setgroupes] = useState([]);
  const [val, setval] = useState(20);
  const token=localStorage.getItem('token');
  const socket = useSocket();
  function getAllUsersGroupe() {
    fetch(allUsersRoutes, {
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
        setusers(data.allPosts);
        setcurrentUser(data.userinf);
        setnotification(data.allUnReadMsg);
        setnotificationGroupe(data.msgGroupe); 
        setgroupes(data.groupes)
       })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
   useEffect(() => {
    socket.emit("add",token);
    getAllUsersGroupe()
  }, [])
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    setCurrentChat(contact);
    setval(20);
    setCurrentChat(prev=>({...prev,limit:10}))
    if(contact.id_user!="groupe")
    {
      setnotification((prev) =>
    prev.map((msg) =>
      msg.senderId === contact.id_user ? { ...msg, isRead: 1 } : msg
    )
       ) ;
      handleViewMsg({	sender: contact.id_user, users:currentUser.id_user})
    }
     else
     {
     setnotificationGroupe((prev) =>
     prev.map((msg) =>
       msg.id_groupe === contact.id_groupe ? { ...msg, isRead: 1 } : msg
     )
      );
      handleViewMsgGroupe(contact.id_groupe,currentUser.id_user);
     }
  };
  /**************************************notification and en Ligne user*************************************/
  const handleViewMsg = async (msg) => {
   console.log("viewMsg"+msg);
    fetch(viewMsg, {
      method: 'POST',
      headers: {
      Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({msgId: msg.idMsg,sender:msg.sender,users:msg.users}),
    }).catch((error) => {
        console.log('Error:', error);
      });
  };
  const handleViewMsgGroupe = async (msg,currentUser) => {
    fetch(viewMsgGroupe, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_groupe:msg,users:currentUser}),
    }).catch((error) => {
        console.log('Error:', error);
      });
  };
  socket.on("refresh-update-groups", (data) => {
    getAllUsersGroupe();
   if (currentUser && data && data.length > 0) 
      {   
      if (data.some(item => item === currentUser.id_user)) 
       { 
        setCurrentChat({id_user:""});
        setCurrentSelected(undefined)
        }
      }
  });
 useEffect(() => {
  if (socket) {
    socket.on("user-online", (onlineUsers) => { 
    setonlineUsers(onlineUsers);
    });
    socket.on('msg-notification',(msg)=>{
      if(msg.too !="groupe")
      {  if(currentChat.id_user === msg.senderId)
        {
          setnotification(prev=>[{...msg, isRead : 1 } ,...prev])
          handleViewMsg({	sender: msg.senderId, users:msg.too})
        }
        else{
          setnotification(prev=>[msg,...prev])
        }
      }
    })  
    socket.on('msg-notification-groupe',(msg)=>{
         if(currentChat.id_user === msg.too && currentChat.id_groupe===msg.id_groupe)
        {
          setnotificationGroupe(prev=>[{...msg, isRead : 1 } ,...prev])
          handleViewMsgGroupe(msg.id_groupe,currentUser.id_user);
        }
        else{
          setnotificationGroupe(prev=>[msg,...prev]) 
        }
    }) 
    return()=>{
      socket.off("user-online")
      socket.off("msg-notification")
      socket.off("msg-notification-groupe")
    }
  }
 }, [[currentChat,socket]])

const notificationUnreadMsg = (senderId)=>{
    if(currentChat.id_user!=senderId)
      { 
      const unreadMessages = notification.filter((n) => n.isRead === 0 && n.senderId === senderId && n.too!="groupe");
      const count = unreadMessages.length;
      return count;
      }
  }
const notificationUnreadMsgGroupe = (id_groupe)=>{
      const unreadMessages = notificationGroupe.filter((n) => n.isRead === 0 && n.id_groupe===id_groupe);
      const count = unreadMessages.length;
      return count;  
  }
  /*******************************************end notification*********************************************/
  return (
    <>
    <div className="content">
    <Row>  
     <Col md="3">          
     <Card>
              <CardHeader>
                <CardTitle tag="h4">Membres</CardTitle>
              </CardHeader>
              <CardBody style={{ height: '530px', overflowY: 'scroll' }}>
  <ul className="list-unstyled team-members">
    {/* Sort the users so that online users appear first */}
    {users
      .sort((a, b) => onlineUsers.includes(b.id_user) - onlineUsers.includes(a.id_user))
      .map((contact, index) => (
        <li
          style={{height:"50px"}}
          key={contact.id_user}
          ref={scrollRef}
          className={`contact ${index === currentSelected ? 'selectedd' : ''} user`}
          onClick={() => changeCurrentChat(index, contact)}
        >
          <Row>
            <Col md="2" xs="2">
              <div className="avatar">
                <img
                  alt="..."
                  className="img-circle img-no-padding img-responsive"
                  src={require('assets/img/faces/avatar.png')}
                />
                 {onlineUsers.includes(contact.id_user) && (
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: 'green', // La bulle est verte quand l'utilisateur est en ligne
        }}
      ></div>
    )}
              </div>
            </Col>
            <Col md="8" xs="8">
              <span style={{ fontSize: '16px' }}>{contact.username}</span> <br />
            </Col>
            <Col className="text-right " md="2" xs="2">
              <button
                style={{ borderRadius: "50%", borderColor: "#6cbf91", backgroundColor: "#fff" }}
                onClick={() => changeCurrentChat(index, contact)}
              >
                {notificationUnreadMsg(contact.id_user) > 0 && (
                  <div className="circle-notification">
                    {
                      <span className="notification-count">
                        {notificationUnreadMsg(contact.id_user)}
                      </span>
                    }
                  </div>
                )}
                <i className="pi pi-envelope" style={{color:"#6cbf91"}}/>
              </button>
            </Col>
          </Row>
        </li>
      ))}
    <h5>Groupes</h5>
    {groupes.map((contact, index) => (
      <li
      style={{height:"50px"}}
        key={contact.id_groupe}
        className={`contact ${contact.name_groupe === currentSelected ? 'selectedd' : ''} user`}
        onClick={() => {
          changeCurrentChat(contact.name_groupe, {
            id_user: 'groupe',
            id_groupe: contact.id_groupe,
            name_groupe: contact.name_groupe,
          });
        }}
      >
        <Row>
          <Col md="2" xs="2">
            <div className="avatar">
              <img
                alt="..."
                className="img-circle img-no-padding img-responsive"
                src={require('assets/img/faces/avatargroupe.png')}
              />
            </div>
          </Col>
          <Col md="7" xs="7">
            <span style={{ fontSize: '16px' }}>{contact.name_groupe}</span> <br />
          </Col>
          <Col className="text-right" md="3" xs="3">
            <Button
              className="btn-round btn-icon"
              color="success"
              outline
              size="sm"
              onClick={() => {
                changeCurrentChat('groupe', {
                  id_user: 'groupe',
                  id_groupe: contact.id_groupe,
                  name_groupe: contact.name_groupe,
                });
              }}
            >
              {notificationUnreadMsgGroupe(contact.id_groupe) > 0 && (
                <div className="circle-notification">
                  {
                    <span className="notification-count">
                      {notificationUnreadMsgGroupe(contact.id_groupe)}
                    </span>
                  }
                </div>
              )}
              <i className="fa fa-envelope" />
            </Button>
          </Col>
        </Row>
      </li>
    ))}
  </ul>
</CardBody>

            </Card>
          </Col>
      <Col md='9'>   
      
             {currentChat.id_user === "" ? (
            <Welcome currentUser={currentUser} />
          ) : ( <ChatContainer val={val} setval={setval} setCurrentSelected={setCurrentSelected} setCurrentChat={setCurrentChat} socket={socket} currentChat={currentChat} currentUser={currentUser} setnotification={setnotification}/> )}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
