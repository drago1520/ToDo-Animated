import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
await mongoose.connect('mongodb+srv://dragomir1520:VL4X5h8hv36jZkQx@cluster0.x03wwke.mongodb.net/test?retryWrites=true&w=majority');

const tasksSchema = new mongoose.Schema({
  name: String
});

const Task_today = mongoose.model("Task_today", tasksSchema);
const Task_week = mongoose.model("Task_week", tasksSchema);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const t1 = new Task_today({
  name: "Brush teeth."
})
const t2 = new Task_today({
  name: "Don't be gay"
})
const t3 = new Task_today({
  name: "Be straight!"
})

const t4 = new Task_week({
  name: "Brush teeth."
})
const t5 = new Task_week({
  name: "Don't be gay"
})
const t6 = new Task_week({
  name: "Be straight!"
})

const defaultItems = [t1,t2,t3];

//



//replace with db
let to_do_s = [];
let to_do_s_week = [];

//GET
app.get("/", async(req, res) => {
  let find_results = await Task_today.find({});
if (find_results.length === 0){
  let insert_results = await Task_today.insertMany(defaultItems);
}else{
  console.log("No inserted docs. Already full.");
}
find_results = await Task_today.find({});
  res.render("index.ejs", {find_results});
});

//POST
app.post("/", (req, res) => {
  const task_name = req.body.tasks;
  console.log(task_name);

  const tasks = {}; // Use an object to store tasks with dynamic names
  tasks[task_name] = new Task_today({
  name: task_name
});

tasks[task_name].save()
  .then(()=>{
    res.redirect("/") // Redirect to the main page after adding a task
  });
});

//DELETE
app.post("/deleteDay", async(req, res)=>{
  let delete_item = req.body.delete;
  console.log(delete_item);
  await Task_today.deleteOne({name: delete_item});
  res.redirect("/");
})




//WEEK
app.get("/week", async(req, res) => {
  let find_results = await Task_week.find({});
if (find_results.length === 0){
  let insert_results = await Task_week.insertMany(defaultItems);
}else{
  console.log("No inserted docs. Already full.");
}
find_results = await Task_week.find({});
  res.render("week.ejs", {find_results});
});


//DELETE
app.post("/deleteWeek", async(req,res)=>{
  let delete_item = req.body.delete;
  console.log(delete_item);
  await Task_week.deleteOne({name: delete_item});
  res.redirect("/week");
});


//POST
app.post("/week", (req, res) => {
  const task_name = req.body.tasks;
  console.log(task_name);

  const tasks = {}; // Use an object to store tasks with dynamic names
  tasks[task_name] = new Task_week({
  name: task_name
  });

  tasks[task_name].save()
  
  .then(()=>{
    res.redirect("/week") // Redirect to the main page after adding a task
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
