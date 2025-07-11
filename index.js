const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const users = require("./users");

const app = express();
const PORT = 3000;

const JWT_SECRET = "mi-secreto-super-secreto";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
      sub: user.username,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    access_token: token,
    isFirstLogin: user.isFirstLogin,
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend Pele - Authentication Server" });
});

app.get("/users", (req, res) => {
  res.json({ users, total: users.length });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);;
});
