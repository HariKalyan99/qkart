import { Snackbar } from "@mui/material";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import MuiAlert from '@mui/material/Alert';
import { useHistory, Link } from "react-router-dom";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const historyRegister = useHistory()


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */


  const [getUserNameValue, setUserNameValue] = useState("");
  const handleNameChange = (e) => {
    setUserNameValue(e.target.value);
  }

  const [getPasswordValue, setPasswordValue] = useState("");
  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value)
  }



  const [getConfirmPasswordValue, setConfirmPasswordValue] = useState("");
  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordValue(e.target.value)
  }


  const [getRegistrationDone, setRegistrationDone] = useState(false);

  const register = async (formData) => {
    formData.username=getUserNameValue;
    formData.password=getPasswordValue;
    formData.confirmPassword=getConfirmPasswordValue;

    if(validateInput(formData)){
      const data = {
        username: formData.username,
        password: formData.password,
      }
      try {
        await axios.post(`${config.endpoint}/auth/register`, data);
        enqueueSnackbar("Registered successfully",  {variant: "success", })
        setRegistrationDone(false)
        historyRegister.push("/login");
      }catch(error){
        setRegistrationDone(false)
        const {data} = error.response;
        if(error.response.status === 400){
          enqueueSnackbar(data.message, {variant: "error"})
        }else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON", {variant: "warning"})
        }
    }
    }
    
    

  };

  //when the user tries to manually put path in the url, its redirecting so the code below.

  // const isLoggedIn = localStorage.getItem("username");
  // if(isLoggedIn){
  //   historyRegister.push("/");
  // }else{
  //   historyRegister.push("/register");
  // }

    

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const [open, setOpen] = useState(false);
  const validateInput = (data) => {

    if(data.username.length === 0 && data.password.length === 0 && data.confirmPassword.length === 0){
      setOpen(true);
    }
    else if(data.username.length === 0){
      enqueueSnackbar("Username is a required field" , {variant: "warning"})
    }else if(data.username.length < 6){
      enqueueSnackbar("Username must be at least 6 characters" , {variant: "warning"})
    }
    else if(data.password.length === 0){
      enqueueSnackbar("Password is a required field" , {variant: "warning"})
    }
    else if(data.password.length < 6){
      enqueueSnackbar("Password must be at least 6 characters" , {variant: "warning"})
    }
    else if(data.password !== data.confirmPassword){
      enqueueSnackbar("Passwords do not match" , {variant: "warning"})
    }else{
      setRegistrationDone(true)
      return true;
    }


  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
          <h2 className="title">Register</h2>
           <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={getUserNameValue}
            onChange={handleNameChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={getPasswordValue}
            onChange={handlePasswordChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={getConfirmPasswordValue}
            onChange={handleConfirmPasswordChange}
          />
          {getRegistrationDone && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="success"/>
          </Box>}
           <Button className="button" variant="contained" onClick={register}>
            Register Now
           </Button>
           <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
            Kindly, Register your account or if you have an account try to Logging in!
            </Alert>
          </Snackbar>
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login" className="link">
             Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;




// curl --location 'URL' \
// --header 'Content-Type: application/json' \
// --data '{
//     "userName": "test",
//     "password": "test",
// }'
