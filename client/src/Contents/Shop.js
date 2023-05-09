// Components
import React from "react";
import {
  Card,
  Container,
  Grid,
  Typography,
  CardMedia,
  CardContent,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ZAppBar from "../Components/Appbar";

// Contents
import { ActivityData } from "../Data/Data";

const theme = createTheme();

export default function Album() {
  return (
    <ThemeProvider theme={theme}>
      <ZAppBar />
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Activity
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
            >
              ภาพการเข้าร่วมกิจกรรมการมีส่วนร่วมกับชุมชน
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 2 }}>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {ActivityData.map((item) => (
              <Grid item key={item} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="hover-zoom"
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: "10.9%",
                    }}
                    image={item.src}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.title}
                    </Typography>
                    <Typography className="text-indent">
                      {item.contents}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      {/* End footer */}
    </ThemeProvider>
  );
}
