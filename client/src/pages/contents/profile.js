import { Card, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Swal from "sweetalert2";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    // ตรวจสอบ token จาก localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthStatus("failed");
      return;
    }

    // ตรวจสอบข้อมูลการเข้าสู่ระบบจาก localStorage
    const authData = JSON.parse(localStorage.getItem("authData"));

    if (authData?.status === "ok" && authData.username) {
      setUsername(authData.username);
      setEmail(authData.email);
      setFullname(authData.fullname);
      setLastname(authData.lastname);
      setAuthStatus("success");
      return;
    }

    // ส่งคำขอยืนยันตัวตนไปยังเซิร์ฟเวอร์
    fetch("http://localhost:7777/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data?.status === "ok" && data.username) {
          setUsername(data.username);
          setEmail(data.email);
          setFullname(data.fullname);
          setLastname(data.lastname);
          setAuthStatus("success");
          localStorage.setItem("authData", JSON.stringify(data));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("authData");
          setAuthStatus("failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // ดึงข้อมูลโปรไฟล์ผู้ใช้และรูปภาพ avatar จากเซิร์ฟเวอร์
    fetch(`http://localhost:7777/user/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data?.user) {
          const { username, email, fullname, lastname, avatar } = data.user;
          setUsername(username);
          setEmail(email);
          setFullname(fullname);
          setLastname(lastname);
          setAuthStatus("success");
          setAvatar(avatar);
          localStorage.setItem(
            "authData",
            JSON.stringify({
              status: "ok",
              username,
              email,
              fullname,
              lastname,
            })
          );
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("authData");
          setAuthStatus("failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleImageUpload = () => {
    if (!selectedImage) {
      Swal.fire({
        icon: "error",
        title: "No Image Selected",
        text: "Please select an image to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    // อัปโหลดรูปภาพไปยังเซิร์ฟเวอร์
    fetch("http://localhost:7777/uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        // อัปเดตรูปภาพโปรไฟล์ในฐานข้อมูล
        fetch("http://localhost:7777/updates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            avatar: data.filename,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: "Image Uploaded",
              text: "The image has been uploaded successfully.",
            });
            setAvatar(data.filename);
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Upload Error",
              text: "An error occurred while uploading the image. Please try again later.",
            });
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Upload Error",
          text: "An error occurred while uploading the image. Please try again later.",
        });
      });
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sx={{ mt: 15, pb: 5 }}>
        <Card style={{ backgroundColor: "gray", color: "white" }}>
          <Container p={5} sx={{ mt: 5, pb: 5 }}>
            {authStatus === "success" ? (
              <Grid container spacing={2} sx={{ mt: 3, pb: 10 }}>
                <Grid item md={4}>
                  <label htmlFor="profile-image">
                    {avatar ? (
                      <Image
                        src={avatar}
                        width={250}
                        height={250}
                        className="Profile-Das"
                        alt={`Profile Picture of ${username}`}
                      />
                    ) : (
                      <Image
                        src="/assets/user-avatar.png"
                        width={250}
                        height={250}
                        className="Profile-Das"
                        alt="profile"
                      />
                    )}
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </Grid>
                <Grid item md={8} mt={8}>
                  <Typography component="h1" variant="h4">
                    Welcome back {username}!
                  </Typography>

                  <Typography component="h1" variant="h5">
                    {email}
                  </Typography>
                  <Typography component="h1" variant="h5">
                    Name {fullname} {lastname}
                  </Typography>
                  {selectedImage && (
                    <button onClick={handleImageUpload}>Upload</button>
                  )}
                  {selectedImage && (
                    <Typography variant="body2">
                      Click "Upload" to upload the image.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ) : (
              <Container p={5} sx={{ mt: 5, pb: 5 }} className="Sad-Das">
                <Image
                  src="/assets/sad.png"
                  width={250}
                  height={250}
                  alt="sad"
                />
                <Typography component="h1" variant="h4" mt={5}>
                  Unauthorized Access
                </Typography>
              </Container>
            )}
          </Container>
        </Card>
      </Container>
    </>
  );
}
