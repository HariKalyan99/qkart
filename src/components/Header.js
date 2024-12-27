import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
 
  const historyHeader = useHistory();

  const handleBackToExplore = () => {
    historyHeader.push("/")
  }

  const handleRegister = () => {
    historyHeader.push("/register")
  }


  const handleLogin = () => {
    historyHeader.push("/login")
  }

  const isOnline = localStorage.getItem("username");

  const removeFromLocal = () => {
    localStorage.clear()
    window.location.reload();
  }

    if(hasHiddenAuthButtons){
      return (
        <Box className="header">
          <Box className="header-title">
             <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          <Stack direction="row" spacing={2}  justifyContent="center" alignItems="center">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={handleBackToExplore}
            >
            Back to explore
           </Button>
           </Stack>
        </Box>
      );
    } else if(isOnline){
        return (
          <Box className="header">
            <Box className="header-title">
                <img src="logo_light.svg" alt={isOnline}></img>
            </Box>
            {children}
            {/* children prop composition */}
            <Stack direction="row" spacing={2}  justifyContent="center" alignItems="center">
            <Avatar src="public/avatar.png" />
            <p className="username-text">
              {isOnline}
            </p>
            <Button onClick={removeFromLocal}>Logout</Button>
            </Stack> 
          </Box>
        );
     }
     if(!isOnline){
      return (
        <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        <Stack direction="row" spacing={2}  justifyContent="center" alignItems="center">
         <Button onClick={handleLogin}>LOGIN</Button>
         <Button variant="contained" onClick={handleRegister}>Register</Button>
         </Stack>
      </Box>
      );
     }
};

export default Header;
