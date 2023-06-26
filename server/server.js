const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path"); // เพิ่มโมดูล path

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mongodb Connection
async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
}

// Constants
const PORT = 7777;
const MONGO_URI =
  "mongodb+srv://Zismail:130247@cluster0.jabodlm.mongodb.net/website";
const JWT_SECRET = "mysecret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/Website/website-mongodb/server/uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + uniqueSuffix + "." + fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Register
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, fullname, lastname, password, role } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    const db = await connectToDatabase();

    const existingUser = await db
      .collection("users")
      .findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      email,
      fullname,
      lastname,
      password: hashedPassword,
      avatar: "",
      role: "member",
    });

    res.status(201).json({ message: "Register Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, JWT_SECRET);

    res.json({
      status: "ok",
      username: user.username,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Authen System
app.post("/authen", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = await connectToDatabase();

    const user = await db
      .collection("users")
      .findOne({ username: decoded.username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "ok",
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      lastname: user.lastname,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
});

// Upload Image
app.post("/uploads", upload.single("avatar"), async (req, res) => {
  try {
    const { filename } = req.file;

    const db = await connectToDatabase();

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db
      .collection("users")
      .findOne({ username: decoded.username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.avatar = filename;
    await db
      .collection("users")
      .updateOne(
        { username: decoded.username },
        { $set: { avatar: filename } }
      );

    res.status(200).json({ message: "Image uploaded and saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while uploading and saving the image",
    });
  }
});

// Get User Avatar
app.get("/user/avatar/:username", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    const username = req.params.username;

    const user = await collection.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const avatarPath = user.avatar;

    if (!avatarPath) {
      return res
        .status(404)
        .json({ status: "error", message: "Avatar not found" });
    }

    res.sendFile(path.join(__dirname, "uploads", avatarPath));
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000, // 1 hour
        },
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click the link to reset your password: http://localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({
      status: "ok",
      message: "Email sent with instructions to reset password",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { email: user.email },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      }
    );

    res.json({ status: "ok", message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
