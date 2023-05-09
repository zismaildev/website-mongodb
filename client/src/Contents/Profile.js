import React, { useState, useEffect } from "react";
import ZAppBar from "../Components/Appbar";

function Profile() {
  const [username, setUsername] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
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
      {authStatus === "success" && <p>Welcome, {username}!</p>}
      {authStatus === "failed" && (
        <p>Authentication failed. Please log in again.</p>
      )}
      {authStatus === "" && <p>Please wait...</p>}
    </div>
  );
}

export default Profile;
