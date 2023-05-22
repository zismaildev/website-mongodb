const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mongodb Connecting
const PORT = 7777;
const MONGO_URI =
  "mongodb+srv://Zismail:130247@cluster0.jabodlm.mongodb.net/website";
const JWT_SECRET = "mysecret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/web-next-template/client/public/uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop(); // ดึงนามสกุลไฟล์
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + uniqueSuffix + "." + fileExtension; // กำหนดชื่อไฟล์ภาพที่จะบันทึกในเครื่อง
    cb(null, fileName);
  },
});

// Create multer instance
const upload = multer({ storage });

// Register
app.post("/register", async (req, res) => {
  const { username, email, fullname, lastname, password } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db();

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
      profileImage: "", // เพิ่มฟิลด์เก็บ URL รูปภาพโปรไฟล์เป็นสตริงว่างไว้
    });

    res.status(201).json({ message: "Register Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db();

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
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Authen System
app.post("/authen", async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, JWT_SECRET);
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db();
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
      profileImage: user.profileImage, // เพิ่มข้อมูล URL รูปภาพโปรไฟล์ในการตอบกลับ
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
});

app.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  async (req, res) => {
    const { username } = req.body;

    // ตรวจสอบว่ามีไฟล์ภาพที่อัปโหลดหรือไม่
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const profileImage = req.file.filename;

    try {
      const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db();

      await db.collection("users").updateOne(
        { username },
        {
          $set: {
            profileImage,
          },
        }
      );

      // ดึงข้อมูลผู้ใช้หลังจากอัปโหลดรูปภาพเพื่อส่งกลับให้ผู้ใช้
      const user = await db.collection("users").findOne({ username });

      res.json({ message: "Profile image uploaded successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Forgot Password
app.post("/forgot", async (req, res) => {
  // โค้ดส่วนนี้เหมือนกับเดิม
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
