import React, { useEffect, useState } from 'react';
import "./SignIn.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header/Header';
import { Button } from '@mui/material';
import SidePic from "../../images/sidePic.png";
import { useNavigate } from 'react-router-dom';
import login from "../../apis/logIn";
import { ToastContainer, toast } from 'react-toastify';
import AuthorDashboard from '../AuthorDashboard/AuthorDashboard';
import emailjs from '@emailjs/browser';

function SignIn() {
    const navigate = useNavigate();
    const [inputField, setInputField] = useState({
        email: '',
        password: ''
    });
    const [userLoggedIn, setUserLoggedIn] = useState('');


    const updateInputFields = (fieldName, value) => {
        setInputField(prevState => ({
          ...prevState,
          [fieldName]: value
        }));
      };

    const submitLogin = async () => {
        try {
            const response = await login(inputField);
            if(response?.data?.message === "User fetched successfully") {
                // Set data in localStorage
                let loginData = response?.data?.data;
                console.log(loginData, "loginData");
                localStorage.setItem("login", JSON.stringify(loginData));
                toast.success("Sign in successfully", {
                    theme: "colored",
                });
                navigate('/author-dashboard');
            }
        }
        catch(err) {
            console.log(err, "err");
            toast.error("Invalid credentials", {
                theme: "colored",
            });
        }
    };

    const getUserFromLocal = () => {
        const loginData = localStorage.getItem('login');
        console.log(JSON.parse(loginData), "loginData");
        if(loginData)
        {
            setUserLoggedIn(JSON.parse(loginData));
        }
    };

    
    useEffect(() => {
        getUserFromLocal()
    }, []);

  return (
    !userLoggedIn ? 
    <div className='bgImageSignin'>
        <Header />
        <div className='bodyDiv'>
            <div className='box'>
                <div className='pictureContainer'>
                    <img src={SidePic}/>
                </div>
                <div className='formContainer'>
                    <h1 className='signinHeader'>Sign In</h1>
                    <div className='formDiv'>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Email" variant="outlined" className='fieldsWidth' value={inputField?.email} onChange={(e) => updateInputFields('email', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Password" variant="outlined" className='fieldsWidth' type='password' value={inputField?.password} onChange={(e) => updateInputFields('password', e.target.value)}/>
                        </div>
                    </div>
                    <div className='buttonDiv'>
                        <Button variant="contained" onClick={(e) => submitLogin()}>Submit</Button>
                    </div>
                    <div className='forgotDetails'>
                        <div>
                            Don't have any account? <span className='signUpText' onClick={(e) => navigate('/signup')}>Sign Up</span>
                        </div>
                        <div className='forgotPasswordText' onClick={(e) => navigate("/forgotPassword")}>
                            Forgot Password
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    :
    navigate("/author-dashboard")
  )
}

export default SignIn