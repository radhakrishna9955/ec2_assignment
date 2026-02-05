const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Fake database
const accounts = [];

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Signup logic
app.post("/signup", async (req, res) => {
  const { userName, userPassword } = req.body;

  const existingUser = accounts.find(u => u.userName === userName);
  if (existingUser) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  accounts.push({
    userName,
    userPassword: hashedPassword
  });

  res.send("Registration successful <br><a href='/signin'>Login</a>");
});

// Signin page
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// Signin logic
app.post("/signin", async (req, res) => {
  const { userName, userPassword } = req.body;

  const account = accounts.find(u => u.userName === userName);
  if (!account) return res.send("Account not found");

  const isMatch = await bcrypt.compare(userPassword, account.userPassword);
  if (!isMatch) return res.send("Incorrect password");

  res.send(`<h2>Login Successful</h2><p>Welcome ${userName}</p>`);
});

// Server
app.listen(3004, () => {
  console.log("Server running on http://localhost:3004");
});
