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
import ZAppbar from "../Components/Appbar"
import Footer from "../Components/Footer";

// Contents

import { SkillsData } from "../Data/Data";
import AboutmeJpg from "../Assets/Contents/aboutme.jpg";

export default function Aboutme() {
  return (
    <div>
      <ZAppbar />
      <Container sx={{ pt: 5 }}>
        <Card p={5}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            mt={10}
          >
            About Me
          </Typography>
          <Grid container p={5}>
            <Grid md={6} p={3} mt={2}>
              <img src={AboutmeJpg} alt="profile" className="profilepic" />
            </Grid>
            <Grid md={6} p={3} mt={15}>
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
              >
                Nattapong Panthiya
              </Typography>
            </Grid>
          </Grid>

          <Container>
            <Card className="Card-Bg">
              <Grid container p={5}>
                <Grid md={6} p={3} mt={5}>
                  <Typography
                    style={{ color: "white" }}
                    component="h1"
                    variant="h6"
                  >
                    ชื่อ : นาย ณัฐพงษ์ ปันธิยะ
                  </Typography>
                  <h6 style={{ color: "white" }}>ชื่อเล่น : หนึ่ง</h6>
                  <h6 style={{ color: "white" }}>อายุ : 18 ปี</h6>
                  <h6 style={{ color: "white" }}>
                    เกิดวันที่ : 13 กุมภาพันธ์ พ.ศ. 2547
                  </h6>
                  <h6 style={{ color: "white" }}>บุคลิกภาพ : ISTP</h6>
                  <h6 style={{ color: "white" }}>หมู่เลือด : O</h6>
                  <h6 style={{ color: "white" }}>วิชาที่ชอบ : คอมพิวเตอร์</h6>
                  <h6 style={{ color: "white" }}>
                    งานอดิเรก : ทำเว็บไซต์ ซ่อมคอม เรียนเขียนโปรแกรม
                  </h6>
                </Grid>
                <Grid md={6} p={3} mt={5}></Grid>
              </Grid>

              <Typography
                component="h1"
                variant="h4"
                align="center"
                color="white"
                gutterBottom
              >
                Skills
              </Typography>

              <Container p={5}>
                <Grid>
                  <Grid container spacing={2}>
                    {SkillsData.map((item) => (
                      <Grid item key={item} xs={6} md={3}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          /**style={{ color: "gray", textAlign: "center" }}*/
                          className="Skill-Image"
                          gutterBottom
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
                            <Typography variant="h6" component="h4">
                              {item.title}
                            </Typography>
                            <Typography variant="p" component="p">
                              ระดับความสามารถ : {item.level} %
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Container>
              <br />
            </Card>
          </Container>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}