const router= require('express').Router()
const { query } = require('express');
const connection =require('../db')
const randomstring = require('randomstring');
  // restful and rest api is samething`
  //get,delete,post,put(also->update full kindda),patch(update->kindda)

    router.post('/users', async(req,res)=>{
            //   res.send("its working")
            const { username, email, password } = req.body;
            try {
              if (!username || !email || !password) {
                return res.send("provide whole data");
              }
            
              const checkQuery = "SELECT * FROM auth WHERE email = ?";
              const checkValue = [email];
              const checkResult = await connection.query(checkQuery, checkValue);
            
              if (checkResult.length > 0) {
                return res.status(400).send("User already exists");
              }
            
              const insertQuery = "INSERT INTO auth (username, email, password) VALUES (?, ?, ?)";
              const insertValues = [username, email, password];
              const insertResult = await connection.query(insertQuery, insertValues);
            
              console.log(insertResult);
            
              // Send a success message instead of the result object
              res.status(200).send("Data inserted successfully!");
            } catch (err) {
              console.error("Error:", err);
              res.status(500).send("Something went wrong");
            }
            
       
    });

    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
          if (!email || !password) {
            return res.status(400).json({ error: "Provide both email and password" });
          }
      
          const checkQuery = "SELECT * FROM auth WHERE email = ?";
          const checkValue = [email];
          const checkResult = await connection.query(checkQuery, checkValue);
      
          if (checkResult.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
          }
      
          const verificationId = randomstring.generate(12);

             const inserttoken="insert into session values(?,?)"
            const insertvalue=[email,verificationId];

           await connection.query(inserttoken , insertvalue,(err,resp)=>{
                  if(err){
                   return  res.send("err in it ag")
                  }
                    
                 
          res.status(200).json({ message: "Verification ID generated", verificationId: verificationId }); 
           })







        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        }
      });



      router.post('/check', async (req,res)=>{
               
              const {token} = req.body;
               const query="select * from session where token = ? ";
               const value =[token];

             await connection.query(query,value,(err,result)=>{
                         if(err){
                           return res.send(err)
                         }
                         res.send( result);
                    
             })


      })
      

      

      router.get('/users', async (req, res) => {
        
          const query = "SELECT * FROM students";
              await connection.query(query ,(err,resi)=>{
            if(err){
                res.json({msg:'err in it'})
            }
                 res.send(resi);
          });

      });

      router.put('/users/:id', async (req, res) => {
        const { name, courses } = req.body;
        const id = req.params.id;
        const query = "UPDATE students SET name=?, courses=? WHERE id=?";
        const values = [name, courses, id];
      
        try {
          await connection.query(query, values, (err, result) => {
            if (err) {
              return res.status(404).send("Problem updating data");
            }
            res.send(result);
          });
        } catch (error) {
          console.error("Error:", error);
          res.status(500).send("Internal server error");
        }
      });
      router.patch('/users/:id', async (req, res) => {
        const { name, courses } = req.body;
        const id = req.params.id;
        const query = "UPDATE students SET name=?, courses=? WHERE id=?";
        const values = [name, courses, id];
      
        try {
          await connection.query(query, values, (err, result) => {
            if (err) {
              return res.status(404).send("Problem updating data");
            }
            res.send(result);
          });
        } catch (error) {
          console.error("Error:", error);
          res.status(500).send("Internal server error");
        }
      });
      










module.exports=router;



