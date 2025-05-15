const { Server } = require("socket.io");
const corsOptions = require('../config/corsOptions');
const jwt = require('jsonwebtoken');

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}
function setupSocket(socketServer) {
  const io = new Server(socketServer, {
    cors: {
      corsOptions,
    },
  });
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    // User connected
    socket.on("add", async (token) => {
      try {
        const decoded = await verifyJWT(token);
        const userId = decoded.UserInfo.userID;
        onlineUsers.set(userId, socket.id);
        const onlineUserIds = Array.from(onlineUsers.keys());
        console.log("User added to onlineUsers:", onlineUserIds);
        io.emit("user-online", onlineUserIds);
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    });
    // User disconnected
    socket.on("log-out", () => {
      const userId = Array.from(onlineUsers.keys()).find(
        (key) => onlineUsers.get(key) === socket.id
      );
      if (userId) {
        onlineUsers.delete(userId);
        const onlineUserIds = Array.from(onlineUsers.keys());
        console.log("User removed from onlineUsers:", onlineUserIds);
        io.emit("user-online", onlineUserIds);
      }
    });
    socket.on("disconnect", () => {
      const userId = Array.from(onlineUsers.keys()).find(
        (key) => onlineUsers.get(key) === socket.id
      );
  
      if (userId) {
        onlineUsers.delete(userId);
        const onlineUserIds = Array.from(onlineUsers.keys());
        console.log("User disconnected, removed from onlineUsers:", onlineUserIds);
        io.emit("user-online", onlineUserIds);
      }
    });
    // Sending messages
    socket.on("send-msg", (data) => {
      if (data.to !== "groupe") {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          if( data.type_message=="message")
         { socket.to(sendUserSocket).emit("msg-recieve", data);
          }
          else{
            socket.to(sendUserSocket).emit("msg-recieve", {to:data.to,from:data.from,username:data.username,familyname:data.familyname,message:data.message.fileContent,type_message:data.type_message});
          }
          socket.to(sendUserSocket).emit("msg-notification", {
            senderId: data.from,
            too: data.to,
            isRead: 0,
            idMsg: data.idMsg,
          });
        }
      } else {
      
        if( data.type_message ==="message")

         { socket.broadcast.emit("msg-recieve", data);}
        else{
          socket.broadcast.emit("msg-recieve", {to:data.to,from:data.from,username:data.username,familyname:data.familyname,message:data.message,type_message:data.type_message,id_groupe:data.id_groupe});
        }
        
        socket.broadcast.emit("msg-notification-groupe", {
          senderId: data.from,
          too: "groupe",
          isRead: 0,
          idMsg: data.idMsg,
          id_groupe: data.id_groupe,
        });
      }
    });
    //refresh updats groups
    socket.on('refresh-groups',(data)=>{
      const Array = data.map(item => item.id_user);
      socket.broadcast.emit("refresh-update-groups", Array);

    })
    //deleting msg
    socket.on('msg-deleting',(data)=>{
      if (data.to !== "groupe") {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("refresh-msgs");
        }
      } else {
        socket.broadcast.emit("refresh-msgs", data);
      }
    })
  });
}
module.exports = { setupSocket };
