const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');
const axios = require('axios');
const nodemailer = require('nodemailer');
const Messages  = async (req, res) => {

  if (req.method === "POST" && req.body.GET === "currentUser") {
    try {
      await verifyJWT(req, res, async () => {
        const userId = req.userId;
        const to = req.body.to;
        if(to === "groupe")
        { const limit=req.body.limit;
          const id_groupe=req.body.id_groupe

          const [allMessages] = await db.promise().query(`SELECT messages.id_message, messages.type_message, messages.sender,messages.message,DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i" ) as createdAt,users.username,users.familyname,users.id_user  FROM messages,users WHERE  users.id_user = messages.sender AND exist=1 and users = '${to}' and vue=0 and id_groupe = '${id_groupe}' order by id_message ASC LIMIT ${limit}`);
          const projectedMessages = allMessages.map((msg) => {
            return {
              fromSelf: msg.sender === userId,
              message: msg.message,
              type_message:msg.type_message,
              createdAt:msg.createdAt,
              username:msg.username,
              familyname:msg.familyname,
              sender:msg.sender,
              id_message:msg.id_message
            };
          });
          res.json(projectedMessages);
        }
        else{
        const limit=req.body.limit;
        const [allMessages] = await db.promise().query(`SELECT *,DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i" ) as createdAt FROM messages WHERE  (sender = '${userId}' AND users = '${to}' and exist=1) OR (sender = '${to}' AND users = '${userId}' and exist=1) order by id_message DESC LIMIT ${limit}`);
        const projectedMessages = allMessages.map((msg) => {
            return {
              fromSelf: msg.sender === userId,
              message: msg.message,
              type_message:msg.type_message,
              createdAt:msg.createdAt,
              id_message:msg.id_message,
              vue:msg.vue

            };
          });
          res.json(projectedMessages.reverse());
         
        }
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }else if(req.method === "POST"){
    try {
        await verifyJWT(req, res, async () => {
          const message = req.body.message;
          const sender = req.body.from;
          const users = req.body.to;
          if(users=="groupe")
         { 
          const id_groupe=req.body.id_groupe 
          const query = 'INSERT INTO messages (message, users, sender,type_message, id_groupe ,createdAt,vue_groupe) VALUES (?,?,?,?,?, ?,?)';
          const values = [message, users,sender,"message",id_groupe,new Date(),""];
          const [sendMessages] = await db.promise().query(query, values);
          res.json(sendMessages);}
          else 
          { const query = 'INSERT INTO messages (message, users, sender,type_message, createdAt,vue_groupe,id_groupe) VALUES (?,?,?,?,?,?,?)';
          const values = [message, users,sender,"message",new Date(),"",0];
          const [sendMessages] = await db.promise().query(query, values);
          res.json(sendMessages);}

          
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
      
  } 
 // res.sendStatus(200); // something like this does!
};
const DeleteMsg = async (req,res)=>{
console.log(req.body);
  const msgId=req.body.idMsg;
  if(msgId)
    { 
    const [deletee] = await db.promise().query(`UPDATE messages SET exist = 0,vue=1 WHERE id_message = '${msgId}'`);
    if (deletee.affectedRows === 1) {
      res.json('true');
    } else {
      res.json('false');
    }
    } 
}
const Views = async(req,res)=>{
  try {

    await verifyJWT(req, res, async () => {
      const msgId=req.body.msgId;
    if(msgId)
      { 
      const [views] = await db.promise().query(`UPDATE messages SET vue = 1 WHERE id_message = '${msgId}'`);
      res.json("true");
      } 
    else{
      const sender=req.body.sender;
      const user=req.body.users;
      const [views] = await db.promise().query(`UPDATE messages SET vue = 1 WHERE sender= '${sender}' and users='${user}'`);
      res.json("true");
    }
    })
 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const ViewsGroupe = async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      const msgId=req.body.msgId;
      const user=req.body.users;
    if(msgId)
      { 
      const [views] = await db.promise().query(`UPDATE messages SET vue_groupe =  CONCAT_WS(',', vue_groupe, '${user}')  WHERE id_message = '${msgId}'`);
      res.json("true");
    } 
    else{
      const id_groupe=req.body.id_groupe;
      const user=req.body.users;
      const [views] = await db.promise().query(`UPDATE messages SET vue_groupe =  CONCAT_WS(',', vue_groupe, '${user}')  WHERE sender!='${user}' and vue_groupe NOT LIKE '%${user}%' and users="groupe" and id_groupe='${id_groupe}'`);
      res.json("true");
    }
    }) 
 

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getMsgs = async(req,res)=>
{
  try {
    await verifyJWT(req, res, async () => {
      if(req.body.id_user1=="" || req.body.id_user2=="" )
      { 
        res.json("empty");
      }else{
        const [allMessages] = await db.promise().query(`SELECT *,DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i" ) as createdAt FROM messages WHERE  (sender = '${req.body.id_user1}' AND users = '${req.body.id_user2}' and exist=1) OR (sender = '${req.body.id_user2}' AND users = '${req.body.id_user1}' and exist=1) order by id_message `);
        const projectedMessages = allMessages.map((msg) => {
            return {
              from1: msg.sender == req.body.id_user1,
              message: msg.message,
              type_message:msg.type_message,
              createdAt:msg.createdAt,
              id_message:msg.id_message,
              vue:msg.vue
            };})
          
        res.json(projectedMessages);
      }

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
module.exports = { Messages,Views,ViewsGroupe, DeleteMsg,getMsgs };