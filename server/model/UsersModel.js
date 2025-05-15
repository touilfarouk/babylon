const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');
const argon2 = require('argon2');
const getUserinf = async(req,res)=>
{
  try {

    await verifyJWT(req, res, async () => {
      const userId = req.userId;
      const username=req.user;
      const familyname=req.familyname;
      const email=req.email;
      const role=req.roles;
      const structure=req.structure;
      const wilaya=req.wilaya;

      const userinf={
        id_user:userId,
        username:username,
        familyname:familyname,
        email:email,
        role:role,
        structure:structure,
        wilaya:wilaya
      }
      res.json({userinf})})
   
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
}
const getPosts = async (req, res) => {

    try {

      await verifyJWT(req, res, async () => {
        const userId = req.userId;
        const username=req.user;
        const familyname=req.familyname;
        const email=req.email;
        const role=req.roles;
        const structure=req.structure;
        const wilaya= req.wilaya;
    
         let allPosts;
        const userinf={
          id_user:userId,
          username:username,
          familyname:familyname,
          email:email,
          role:role
        }
        if(req.body.all)
        {
          [allPosts] = await db.promise().query(`SELECT id_user,username,familyname,email,roles,phone_number,structure,fonction FROM users`);}
        else
        {
          if (structure === "DGF" || structure === "BNEDER") {
            console.log(structure);
            [allPosts] = await db.promise().query('SELECT id_user, username, familyname, email FROM users WHERE id_user != ? ', [userId]);
        } else {
            if (structure === 'FORETS') {
              
                [allPosts] = await db.promise().query('SELECT id_user, username, familyname, email FROM users WHERE id_user != ?', [userId]);
            } else {
            
                [allPosts] = await db.promise().query('SELECT id_user, username, familyname, email FROM users WHERE id_user != ? ', [userId]);
            }
        }
       }
          const [allUnReadMsg]=await db.promise().query(`SELECT sender as senderId, users as too , vue as isRead from messages where vue=0 and users='${userId}' and exist=1`);
          const [groupeUnReadMsg]=await db.promise().query(`SELECT sender as senderId, users as too, id_groupe as id_groupe  from messages where users='groupe' and vue_groupe NOT LIKE '%${userId}%' and sender != '${userId}'and exist=1 `);
          const [groupes] = await db.promise().query(`SELECT * FROM groupe,chat_users_groupe WHERE groupe.id_groupe = chat_users_groupe.id_groupe and chat_users_groupe.id_user='${userId}'`);
         const msgGroupe = groupeUnReadMsg.map((msg) => {
          return {
            senderId: msg.senderId,
            too:msg.too,
            id_groupe:msg.id_groupe,
            isRead:0
          };
        });
        res.json({allPosts,userinf,allUnReadMsg,msgGroupe,groupes});
      })
   
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
};
const addUser = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
  
      if (
        !req.body.username ||
        !req.body.familyname ||
        !req.body.email ||
        !req.body.password ||
        !req.body.roles ||
        !req.body.fonction ||
        !req.body.structure ||
        !req.body.phone_number||
        !req.body.wilaya
      ) { res.json('empty');}
      else
      {
       const select='SELECT * FROM users WHERE username=? AND familyname=?';
       const values = [req.body.username,req.body.familyname];
       const [find] = await db.promise().query(select, values);
      if (find.length > 0) {
        res.json('exist');
      } else {
       const hashedPassword = await argon2.hash(req.body.password);
       const query = 'INSERT INTO users(username, familyname, email, password, roles,fonction,structure,phone_number,wilaya) VALUES (?,?,?,?,?,?,?,?,?)';
       const values = [req.body.username,req.body.familyname,req.body.email,hashedPassword,req.body.roles,req.body.fonction,req.body.structure,req.body.phone_number,req.body.wilaya];
       const [insert] = await db.promise().query(query, values);
       if (insert.affectedRows === 1) {
        res.json('true');
      } else {
        res.json('false');
      }
      }}
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const updateUser = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
    const updateQuery="UPDATE `users` SET `username`=?,`familyname`=?,`email`=?,`roles`=?,phone_number=?,structure=?,fonction=? WHERE `id_user`=? ";
    const values = [req.body.username,req.body.familyname,req.body.email,req.body.roles,req.body.phone_number,req.body.structure,req.body.fonction,req.body.id_user];
    const [update] = await db.promise().query(updateQuery, values);
    if (update.affectedRows === 1) {
      res.json('true');
    } else {
      res.json('false');
    }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const deleteUser = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
    const deleteQuery="DELETE FROM `users` WHERE `id_user`=?";
    const values = [req.body.id_user];
    const [deletee] = await db.promise().query(deleteQuery, values);
    if (deletee.affectedRows === 1) {
      res.json('true');
    } else {
      res.json('false');
    }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const getGroups = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      try {
        const [groupData] = await db.promise().query(`
        SELECT
            groupe.id_groupe,
            groupe.name_groupe,
            (
                SELECT GROUP_CONCAT(CONCAT(users.id_user, ' ',users.username, ' ', users.familyname) SEPARATOR ', ') as inf
                FROM chat_users_groupe
                JOIN users ON chat_users_groupe.id_user = users.id_user
                WHERE chat_users_groupe.id_groupe = groupe.id_groupe
            ) AS group_members
        FROM groupe;
    `);
    

        const formattedGroups = groupData.map(group => {
          const groupMembersArray = (group.group_members || '').split(', ');

          const formattedGroupMembers = groupMembersArray.map(member => {
              const [userId, ...nameParts] = member.split(' ');
              return {
                  value: userId,
                  label: nameParts.join(' ').trim()
              };
          });
      
          return {
            ...group,
            group_members: formattedGroupMembers
          };
        });

      

        res.json(formattedGroups);
      } catch (error) {
        console.error(`Error fetching group data and members:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const addGroup = async(req,res)=>{
  try{
  await verifyJWT(req, res, async () => {
    const members = req.body;
    
    if(members.name ==="" ||  members.selectedOption==null )
    {res.json('empty')
     }
     else{
      const [find]= await db.promise().query(`SELECT * FROM groupe WHERE name_groupe= '${members.name}'`);
      if (find.length > 0) {
        res.json('exist');
      } else {
        const selectedValues = members.selectedOption.map(option => option.value);
      
        const selectedValuesString = selectedValues.join(',');
        const values = [members.name];  
        const addgroupeQuery = `INSERT INTO groupe(name_groupe) VALUES (?)`;
        const [addgroupe] = await db.promise().query(addgroupeQuery, values);
        const insertedId = addgroupe.insertId;
    
selectedValues.forEach(value => {
  const addQuery = `INSERT INTO chat_users_groupe(id_groupe, id_user) VALUES (?, ?)`;
  db.promise().query(addQuery, [insertedId, value])

});
    if(addgroupe.affectedRows===1)
           res.json("true");
           else
           res.json("false");
      }
     }})
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'An error occurred' });
}
}
const deletegroupe = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
    const deleteQuery="DELETE FROM `groupe` WHERE `id_groupe`=?";
    const values = [req.body.id_groupe];
    const [deletee] = await db.promise().query(deleteQuery,values);
    if (deletee.affectedRows === 1) {
      res.json('true');
    } else {
      res.json('false');
    }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
   }
};
const updateGroupe = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
    const groupData =req.body
    if (groupData.name_groupe) {
      const updateQuery = "UPDATE `groupe` SET `name_groupe` = ? WHERE `id_groupe` = ?";
      const values = [groupData.name_groupe, groupData.id_groupe];
      const [update] = await db.promise().query(updateQuery, values);
    }
    const usersQuery = "SELECT id_user FROM chat_users_groupe WHERE id_groupe = ?";
    const groupeIdValues = [groupData.id_groupe];
    const [allUsers] = await db.promise().query(usersQuery, groupeIdValues);
    const notInDataBase = groupData.group_members.filter(item1 => 
      !allUsers.some(item2 => item2.id_user.toString() === item1.value)
    );
    const notInGroupMembers = allUsers.filter(item1 => 
      !groupData.group_members.some(item2 => item2.value.toString() === item1.id_user.toString())
    ); 
    if(notInDataBase.length >= 1)
    {notInDataBase.forEach(value => {
    if(value.value !="")
    { 
      const addQuery = `INSERT INTO chat_users_groupe(id_groupe, id_user) VALUES (?, ?)`;
      db.promise().query(addQuery, [groupeIdValues, value.value])
    }
    });
  }
    if(notInGroupMembers.length >= 1)
    {
      notInGroupMembers.forEach(value => {
        const deleteQuery = `delete from chat_users_groupe where id_groupe=? and id_user= ?`;
        db.promise().query(deleteQuery, [groupeIdValues, value.id_user])
      });
    }
    res.json({rep:'true',notInGroupMembers:notInGroupMembers})
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
module.exports = {getPosts,getUserinf,addUser,updateUser,deleteUser,getGroups,addGroup,deletegroupe,updateGroupe};