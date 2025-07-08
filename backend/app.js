const express=require('express');
const fs=require('fs');
const path = require('path');
const dotenv=require('dotenv');
const app=express();

dotenv.config({path:path.resolve(__dirname,'../.env')})

const filepath=path.join(__dirname,'public');
console.log(filepath);
app.use(express.static(filepath));

const API_KEY=process.env.API_KEY;

//we need to add an authorize middleware which will be passed in api endpoint.
const authorize=(req,res,next)=>{
const key=req.query.apikey||req.headers['x-api-key']||req.headers['botauth'];
if(key==API_KEY)
  next();
else
res.status(401).json({message:"Unauthorized user"});
}

app.get('/',(req,res)=>{
res.sendFile(path.join(filepath,'index.html'));
})

app.get('/api',authorize,(req,res)=>{
const {orderid}=req.query;
const id=parseInt(orderid);
console.log(id);

if(!id){
   return res.json({message:"The order id is invalid. No such order exists"});
}
const data=fs.readFileSync(path.join(filepath,'order.json'),'utf-8');
const orders=JSON.parse(data);

const found = orders.find(order=>order.orderId===id);

  if (found) {
    return res.json({message:"Your order is dispatched. Please wait for a few more days"});
  } else {
   return res.json({message:"Invalid order details"});
  }
})

app.listen(8080,()=>{
    console.log("Server running at port 8080");
})
