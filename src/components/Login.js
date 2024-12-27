import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */

  const [getLoginUserName, setLoginUserName] = useState("");

  const handleLoginUserNameChange = (e) => {
    setLoginUserName(e.target.value);
  };

  const [getLoginPassword, setLoginPassword] = useState("");
  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const [getValidation, setValidation] = useState(false);
  


  // const [getFormData, setFormData] = useState("")
  const login = async (formData) => {
    // setFormData({"username": getLoginUserName, "password": getLoginPassword})

    formData.username = getLoginUserName;
    formData.password = getLoginPassword;

    if (validateInput(formData)) {
      
      const data = {
        username: formData.username,
        password: formData.password,
      };

      try {
        const fetchData = await axios.post(`${config.endpoint}/auth/login`, data)
          persistLogin(fetchData.data.token, fetchData.data.username, fetchData.data.balance);
          enqueueSnackbar("Logged in successfully", { variant: "success" });
          setValidation(false);
       } catch (error) {
        const { data } = error.response;
        setValidation(false);
        if (error.response.status === 400) {
          enqueueSnackbar(data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
            { variant: "warning" }
          );
        }
      }
    }
    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */

  const validateInput = (data) => {
    const validateUser = data.username;
    const validatePwd = data.password;

    if (validateUser.length === 0 && validatePwd.length === 0) {
      enqueueSnackbar("Enter your credentials to Login to Qkart", {
        variant: "info",
      });
    } else if (validateUser.length === 0) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (validatePwd.length === 0) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    } else {
      setValidation(true);
      return true
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };


  const historyLogin = useHistory();
  const isloggedin = localStorage.getItem("username");
  if(isloggedin){
    historyLogin.push("/")
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >

      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            title="username"
            name="username"
            color="success"
            onChange={handleLoginUserNameChange}
            value={getLoginUserName}
          />
          <TextField
            id="password"
            label="Password"
            title="password"
            name="password"
            type="password"
            color="success"
            onChange={handleLoginPasswordChange}
            value={getLoginPassword}
          />
          {getValidation && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress color="success" />
            </Box>
          )}
          <Button variant="contained" onClick={login}>
            LOGIN TO QKART
          </Button>
          <p class="secondary-action">
            Don't have an account?
            <Link to="/register" className="link">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
