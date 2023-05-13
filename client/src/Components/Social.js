// Components
import React from "react";
import "../App.css";
import { Container } from "@mui/system";

// Contents

export default function Social() {
  return (
    <Container sx={{ pt: 5 }} className="social">
      <a
        href="https://www.youtube.com/channel/UCzewwrLueNmJRRu-OMjGRnA"
        target="_blank"
        rel="noopender noreferrer"
      >
        <i class="fa-brands fa-youtube"></i>
      </a>
      <a
        href="https://web.facebook.com/Zismail_Kung-534513747501473"
        target="_blank"
        rel="noopender noreferrer"
      >
        <i class="fab fa-facebook"></i>
      </a>
      <a
        href="https://github.com/zismaildev"
        target="_blank"
        rel="noopender noreferrer"
      >
        <i class="fab fa-github"></i>
      </a>
      <a
        href="https://discord.gg/ZRR4fvpgmM"
        target="_blank"
        rel="noopender noreferrer"
      >
        <i class="fa-brands fa-discord"></i>
      </a>
    </Container>
  );
}
