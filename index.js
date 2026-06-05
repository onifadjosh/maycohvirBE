const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //body parser
app.use(express.json());

let URI = process.env.MONGODB_URI;
mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });


  const UserRouter = require("./routes/User.routes")
  app.use('/api/v1', UserRouter)
 


//GET, POST, PUT, PATCH, DELETE
//100
//200
//300
//400
//500

const users = [
  {
    username: "alex_wander",
    email: "alex.wander@example.com",
    address: "123 Maple Street, Springfield, IL 62701",
  },
  {
    username: "jasmine_lee",
    email: "jasmine.lee@example.com",
    address: "456 Oak Avenue, Austin, TX 73301",
  },
  {
    username: "mike_truong",
    email: "mike.truong@example.com",
    address: "789 Pine Road, Denver, CO 80202",
  },
  {
    username: "sarah_chen",
    email: "sarah.chen@example.com",
    address: "101 Cedar Lane, Seattle, WA 98101",
  },
  {
    username: "chris_park",
    email: "chris.park@example.com",
    address: "202 Birch Blvd, Miami, FL 33101",
  },
  {
    username: "emily_ross",
    email: "emily.ross@example.com",
    address: "303 Walnut Drive, Portland, OR 97201",
  },
  {
    username: "david_kim",
    email: "david.kim@example.com",
    address: "404 Elm Court, Boston, MA 02101",
  },
];

app.get("/", (request, response) => {
  // response.send(12345)
  // response.send(users)
  response.send([1, 6, "omo", "lol"]);
});

app.get("/file", (req, res) => {
  console.log(__dirname);

  // res.sendFile(__dirname+"/index.html")
  res.sendFile(__dirname + "/biometrics.png");
});

app.get("/seeEjs", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  const gender = "female";
  res.render("about", { gender, users });
});

app.get("/addUser", (req, res) => {
  res.render("addUser");
});

app.post("/addUser", (req, res) => {
  const { username, email, address } = req.body;
  console.log("submit request made");
  console.log(req.body);

  users.push(req.body);
  const gender = "male";
  res.render("about", { gender, users });
});

app.post("/deleteUser/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  users.splice(id, 1);
  const gender = "male";
  res.render("about", { gender, users });
}); //params

app.get("/editUser/:id", (req, res) => {
  res.render("editUser");
});



//Create, Read, Update, Delete -> CRUD operations

// app.post("/editUser/:id", (req, res)=>{

// })

//create a static api for products that contains, name, price, quantity of the product

//creating our server
// app.listen(port, callback)
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("cannot start server");
  } else {
    console.log("Server started successfully");
  }
});
