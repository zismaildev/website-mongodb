const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require("multer");

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
    cb(null, "D:/website-mongodb/client/public/uploads");
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
app.post("/register", async (req, res) => {
  try {
    const { username, email, fullname, lastname, password, role } = req.body;

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
      profileImage: "",
      role: "member", // Add the role field to the user document
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
      profileImage: user.profileImage,
      role: user.role, // Include the role in the response
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
});

// Upload Image
app.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const profileImage = req.file.filename;

      const db = await connectToDatabase();

      await db.collection("users").updateOne(
        { username },
        {
          $set: {
            profileImage,
          },
        }
      );

      res.json({ message: "Profile image uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Save Profile Image
app.post("/save-profile-image", async (req, res) => {
  const { image } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const username = decoded.username; // Use the decoded username from the token

  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db();

    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.profileImage = image;
    await db
      .collection("users")
      .updateOne({ username }, { $set: { profileImage: image } });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  } finally {
    client.close();
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

    // Send reset password email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your Gmail email
        pass: "your-password", // Replace with your Gmail password
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your Gmail email
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
      message: "Reset password link sent to your email",
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
        .status(401)
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

    res.json({ status: "ok", message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
