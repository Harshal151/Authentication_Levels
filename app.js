//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  mail: String,
  password: String,
});


// userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    mail: req.body.username,
    password: md5(req.body.password),
  });

  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username; 
    const password = md5(req.body.password);

    User.findOne({ mail: username }) 
        .exec()
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log("Authentication successful!");
                    res.render("secrets");
                } else {
                    console.log("Incorrect password!");
                    res.status(401).send("Incorrect password");
                }
            } else {
                console.log("User not found!");
                res.status(404).send("User not found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});


app.listen("3000", () => {
  console.log("Port started at 3000");
});
