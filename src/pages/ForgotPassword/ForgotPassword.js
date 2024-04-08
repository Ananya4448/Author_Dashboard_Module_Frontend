import React, { useEffect, useState } from 'react';
import "./ForgotPassword.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header/Header';
import { Button } from '@mui/material';
import SidePic from "../../images/sidePic.png";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

import getUserByEmail from "../../apis/getUserByEmail";

function ForgotPassword() {
    const navigate = useNavigate();
    const [inputField, setInputField] = useState({
        email: ''
    });
    const [userLoggedIn, setUserLoggedIn] = useState('');


    const updateInputFields = (fieldName, value) => {
        setInputField(prevState => ({
          ...prevState,
          [fieldName]: value
        }));
      };

    const getUserFromLocal = () => {
        const loginData = localStorage.getItem('login');
        console.log(JSON.parse(loginData), "loginData");
        if(loginData)
        {
            setUserLoggedIn(JSON.parse(loginData));
        }
    };

    const sendEmail = async() => {
        console.log(inputField, "inputField");
        if(inputField?.email) {
            try {

                // First fetch the user by email
                const foundUser = await getUserByEmail(inputField?.email);

                if(foundUser?.data?.data) {
                    // then send email
                    await emailjs.send("service_omnstzc","template_vpi3fa7",{
                        to_name: "Rupam Bar",
                        message: 'http://localhost:3000/resetPassword/'+foundUser?.data?.data?.email,
                        to_email: foundUser?.data?.data?.email,
                        }, 
                        {
                            publicKey: 'kSB3ZtxbtwsIvxd91',
                        });
                    alert("Sent a password renewal link to your email. Please Check your inbox.");
                }
                else {
                    toast.error("No account found for this email. Please Sign Up to continue.", {
                        theme: "colored",
                    });
                }
                
            }
            catch(err) {
                console.log(err, "err");
                alert("some problem occured");
            }
        }
        else {
            toast.error("Put a valid email first", {
                theme: "colored",
            });
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
            <div className='boxForgot'>
                <div className='pictureContainer'>
                    <img src={SidePic}/>
                </div>
                <div className='formContainer'>
                    <h1 className='signinHeader'>Forgot Password</h1>
                    <div className='formDiv'>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Email" variant="outlined" className='fieldsWidth' value={inputField?.email} onChange={(e) => updateInputFields('email', e.target.value)}/>
                        </div>
                        {/* <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Password" variant="outlined" className='fieldsWidth' type='password' value={inputField?.password} onChange={(e) => updateInputFields('password', e.target.value)}/>
                        </div> */}
                    </div>
                    <div className='buttonDiv'>
                        <Button variant="contained" onClick={(e) => sendEmail()}>Send Renewal Link</Button>
                    </div>
                    <div className='forgotDetails'>
                        <div>
                            Don't have any account? <span className='signUpText' onClick={(e) => navigate('/signup')}>Sign Up</span>
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

export default ForgotPassword