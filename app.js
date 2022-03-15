 const express = require("express");
 const bodyParser = require("body-parser");
 const app = express();
 const mongoose =require("mongoose");
 app.set("view engine","ejs");
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"));
 mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});
 const itemsSchema ={
   name : String
 }
 const Item = mongoose.model("Item", itemsSchema); 
const item1 = new Item({
  name : "Welcome to your todoList!"
});
const item2 = new Item({
  name : "Hit the + button to add a new item"
});
const item3 = new Item({
  name : "<--- Hit this to delete an item"
});
const defaultItems = [item1,item2,item3];

 app.get("/",function(req,res){
   
   Item.find({},function(err,foundItems){
     if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Succesfully saved items to out Database");
        }
      });
      res.redirect("/");
     }else{
      res.render("lists",{listTitle: "Today",newListItems: foundItems});
     }
    
   });



   
 });

app.post("/",function(req,res){
 const itemName = req.body.newItem;
 const item  =new Item({
   name : itemName
 });
 item.save();
 res.redirect("/");
});
app.post("/delete",function(req,res){
  const checkedid=req.body.checkbox;
  Item.findByIdAndRemove(checkedid,function(err){
    if(!err){
      console.log("Success");
    }
  });
  res.redirect("/");
});
app.get("/work",function(req,res){
  res.render("lists",{listTitle: "work List", newListItems: workItems});
});


app.listen(3000,function(){
    console.log("Server started on 3000");
});