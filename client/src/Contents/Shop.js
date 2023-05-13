// Components
import React from "react";
import {
  Card,
  Container,
  Grid,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
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
        <Container sx={{ pt: 5 }} mt={10}>
          <Card p={5}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              mt={10}
            ></Typography>

            <Container>
              <Card className="Card-Bg">
                <Typography
                  component="h1"
                  variant="h3"
                  align="center"
                  gutterBottom
                  style={{ color: "whitesmoke" }}
                  mt={3}
                >
                  Product
                </Typography>
                <Grid container spacing={4} p={5}>
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
                        <CardActions>
                          <Button size="small">View</Button>
                          <Button size="small">Buy</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Container>
          </Card>
        </Container>
      </main>
      {/* Footer */}
      {/* End footer */}
    </ThemeProvider>
  );
}
