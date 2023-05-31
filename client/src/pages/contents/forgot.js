import React, { useState } from "react";
import { Container, Card } from "@mui/material";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7777/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to send password reset email");
      }
    } catch (error) {
      console.error(error);
      setMessage("Internal server error");
    }
  };

  return (
    <>
      <Container sx={{ mt: 15, pb: 5 }}>
        <Card style={{ backgroundColor: "gray", color: "white" }}>
          <Container p={5} sx={{ mt: 5, pb: 5 }}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
          </Container>
        </Card>
      </Container>
    </>
  );
};

export default Forgot;
