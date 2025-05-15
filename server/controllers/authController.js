const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const connection = require('../config/connection');
require('dotenv').config();
const handleLogin = async (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });
  try {
   const [rows] = await connection.promise().query('SELECT * FROM users WHERE username = ?', [user]);
   const foundUser = rows[0];
   if (!foundUser) return res.sendStatus(401);
   const match = await argon2.verify(foundUser.password, pwd);
   if (match) {
     const roles = foundUser.roles;
     // Create JWTs
     const accessToken = jwt.sign(
       {
         "UserInfo": {
           "userID":foundUser.id_user,
           "username": foundUser.username,
           "roles": roles,
           "familyname":foundUser.familyname,
           "structure":foundUser.structure,
           "email":foundUser.email,
           "wilaya":foundUser.wilaya,
         },
       },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: '12h' }
     );
     const refreshToken = jwt.sign(
       { "username": foundUser.username},
       process.env.REFRESH_TOKEN_SECRET,
       { expiresIn: '12h' }
     );
     // Save refreshToken with current user
     await connection.promise().query('UPDATE users SET refreshToken = ? WHERE id_user = ?', [refreshToken, foundUser.user_id]);
     res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
     res.json({ success: true, accessToken });
   } else {
     res.sendStatus(401);
   }
 } catch (error) {
   console.error('Error connecting to MySQL database:', error);
   res.sendStatus(500);
 }
};
const updatePassWord=async(req,res)=>{
  try {
   const pwd=req.body.oldpassword;
    const selectQuery="select * FROM `users` WHERE username=?";
    const values = [req.body.username];
    const [select] = await connection.promise().query(selectQuery, values);
    if (select.length === 1){
      if(select[0].passWordSet==1)
      {
        res.json('alreadychanged');
      }
      else{ 
        const verify = await argon2.verify(select[0].password,pwd); 
         if(verify)
         { try{
          const hashNewPass=  await argon2.hash(req.body.newpassword);
          const updateQuery= "UPDATE USERS SET password = ? , passWordSet =1 where id_user=?";
          const values = [hashNewPass,select[0].id_user];
          const update=await connection.promise().query(updateQuery,values);
          res.json('true');
         } catch (error) {
          res.json("erreur");
        }
        }}
     } else {
      res.json('notexist');
     }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
module.exports = { handleLogin,updatePassWord };
