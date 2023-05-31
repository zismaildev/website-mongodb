import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const pages = ["Shop", "About", "Profile", "Dashboard"];
const settings = ["Logout"];

function Navbar() {
  const [username, setUsername] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // เพิ่ม state สำหรับบทบาท admin

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthStatus("failed");
      return;
    }
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData && authData.status === "ok" && authData.username) {
      setUsername(authData.username);
      setAuthStatus("success");
      setIsAdmin(authData.role === "admin"); // เพิ่มการตรวจสอบบทบาท admin
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
          setAuthStatus("success");
          setIsAdmin(data.role === "admin"); // เพิ่มการตรวจสอบบทบาท admin
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
  }, []);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("authData");
    window.location = "/contents/login";
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToPage = (page) => {
    window.location.href = `/contents/${page.toLowerCase()}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Zismail-Dev
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleToPage(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Zismail
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => {
                // เพิ่มเงื่อนไขในการแสดงเมนู Dashboard
                if (page === "Dashboard" && !isAdmin) {
                  return null;
                }

                return (
                  <Button
                    key={page}
                    onClick={() => handleToPage(page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </Button>
                );
              })}
            </Box>

            {authStatus === "success" && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title={username}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Typography
                      component="h5"
                      variant="h6"
                      sx={{ p: 1, color: "white" }}
                    >
                      {username}
                    </Typography>
                    <Avatar alt={username} src="/assets/user-avatar.png" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => {
                    if (setting === "Logout") {
                      return (
                        <MenuItem key={setting} onClick={handleLogout}>
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      );
                    }
                    return (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Box>
            )}

            {authStatus === "failed" && (
              <Box sx={{ flexGrow: 0 }}>
                <Typography
                  component="h5"
                  variant="h6"
                  sx={{ ml: 1 }}
                  onClick={() => handleToPage("login")}
                  style={{ cursor: "pointer" }}
                >
                  Please login
                </Typography>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Navbar;
