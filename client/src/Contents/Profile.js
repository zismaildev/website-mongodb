import React, { useState, useEffect } from "react";
import ZAppBar from "../Components/Appbar";
import { Card, Container, Grid, Typography } from "@mui/material";

import AboutmeJpg from "../Assets/Contents/aboutme.jpg";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthStatus("failed");
      return;
    }
    fetch("http://localhost:7777/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.status === "ok" && data.username) {
          setUsername(data.username);
          setEmail(data.email);
          setFullname(data.fullname);
          setLastname(data.lastname);
          setAuthStatus("success");
        } else {
          localStorage.removeItem("token");
          setAuthStatus("failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <ZAppBar />
      {authStatus === "success" && (
        //** main content**/
        <Container sx={{ pt: 5 }}>
          <Card p={5}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              mt={3}
            ></Typography>

            <Container>
              <Card className="Card-Bg">
                <Typography
                  style={{ color: "white" }}
                  component="h1"
                  variant="h4"
                  p={3}
                >
                  Your Dashboard
                </Typography>
                <Grid container>
                  <Grid md={3} p={3}>
                    <img
                      src={AboutmeJpg}
                      alt="profile"
                      className="profilepic"
                    />
                  </Grid>
                  <Grid md={9} p={3} mt={7}>
                    <Typography
                      style={{ color: "white" }}
                      component="h3"
                      variant="h4"
                    >
                      Welcome back {username} !
                    </Typography>
                    <Typography
                      style={{ color: "white" }}
                      component="h4"
                      variant="h5"
                    >
                      {email}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid md={6} p={3}>
                    <h3 style={{ color: "white" }}>Fullname : {fullname}</h3>
                    <h3 style={{ color: "white" }}>Lastname : {lastname}</h3>
                  </Grid>
                  <Grid md={6} p={3} mt={5}></Grid>
                </Grid>
              </Card>
            </Container>
          </Card>
        </Container>
      )}
      {authStatus === "failed" && (
        <p>Authentication failed. Please log in again.</p>
      )}
      {authStatus === "" && <p>Please wait...</p>}
    </div>
  );
}

export default Profile;
