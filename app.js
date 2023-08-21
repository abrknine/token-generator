
const express = require('express')
const  app =express()
const connection =require('./db')

//middleware  //for post req
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  //for parms

// connect db
connection.connect();
console.log("db connected")


//routes
 const  UserRoutes= require('./Routes/routes')
 app.use('/' , UserRoutes)
//  app.get('/live' ,(req,res)=>{
//     res.send("its working");
//  })


module.exports=app