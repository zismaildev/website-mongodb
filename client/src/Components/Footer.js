import React, { Component } from "react";
import Social from "./Social.js";
import { Link, Typography, Box, Grid } from "@mui/material";

function Copyright(props) {
  return (
    <Typography variant="body1" color="text.wite" align="center" {...props}>
      {"Copyright © "}
      <Link
        t
        color="inherit"
        href="https://portfolio-a3bbe.firebaseapp.com/portfolio"
      >
        P.Nattapong
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default class Footer extends Component {
  render() {
    return (
      <div>
        <Box
          style={{ textAlign: "center" }}
          sx={{ bgcolor: "background.paper", p: 6 }}
          component="footer"
          mt={5}
        >
          <hr />
          <Grid container>
            <Grid md={6} mt={8}>
              <Copyright />
            </Grid>
            <Grid md={6}>
              <Social />
            </Grid>
          </Grid>
        </Box>
      </div>
    );
  }
}
