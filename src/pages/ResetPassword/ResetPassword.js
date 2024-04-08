import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./ResetPassword.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header/Header';
import { Button } from '@mui/material';
import SidePic from "../../images/sidePic.png";
import { useNavigate } from 'react-router-dom';
import login from "../../apis/logIn";
import { ToastContainer, toast } from 'react-toastify';
import getUserByEmail from '../../apis/getUserByEmail';
import updateUser from '../../apis/updateUser';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [inputField, setInputField] = useState({
        newPass: "",
        conPass: ""
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

    const renewPassword = async () => {

        const str = location.pathname;
        const index = str.lastIndexOf('/');
        const restOfString = str.slice(index + 1);
        console.log(restOfString);

        try {
            // First fetch the user by email
            const foundUser = await getUserByEmail(restOfString);

            if(foundUser?.data?.data) {
                let payload = foundUser?.data?.data;
                if(inputField?.conPass === "") {
                    toast.error("Fill all the fields", {
                        theme: "colored",
                    });
                }
                else if(inputField?.conPass !== inputField?.newPass) {
                    toast.error("New and Confirm password doesn't match", {
                        theme: "colored",
                    });
                }
                else {
                    // password regex
                    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
                    const isValidPassword = passwordRegex.test(inputField?.newPass);
                    if (isValidPassword) {
                        payload.password = inputField?.newPass;
                        console.log(payload, "payload");
                        payload.submissionList = [];
                        const resp = await updateUser(payload);
                        toast.success("Password changed successfully. Sign in to proceed", {
                            theme: "colored",
                        });
                        navigate("/signin");
                    }
                    else {
                        toast.error("Follow the password definition rules", {
                            theme: "colored",
                        });
                    }
                }
            }
            else {
                toast.error("No account found for this email. Please Sign Up to continue.", {
                    theme: "colored",
                });
                navigate("/signup");
            }
        }
        catch(err) {
            console.log(err, "err");
            alert("some problem occured");
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
                            <div className='passwordRuleRenew'>
                                <HtmlTooltip
                                    title={
                                    <React.Fragment>
                                        <ul>
                                            <li>Minimum 8 characters</li>
                                            <li>Atleast 1 special character</li>
                                            <li>Contains at least one digit.</li>
                                            <li>Contains at least one lowercase letter.</li>
                                            <li>Contains at least one uppercase letter.</li>
                                            <li>{`Contains at least one special character (e.g., !@#$%^&*()_+}{":;'?/>.<,).`}</li>
                                        </ul>
                                    </React.Fragment>
                                    }>
                                        View Password Definition Rule
                                </HtmlTooltip>
                            </div>
                            <TextField id="outlined-basic" label="New Password" variant="outlined" className='fieldsWidth' type='password' value={inputField?.email} onChange={(e) => updateInputFields('newPass', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Confirm Password" variant="outlined" className='fieldsWidth' value={inputField?.password} onChange={(e) => updateInputFields('conPass', e.target.value)}/>
                        </div>
                    </div>
                    <div className='buttonDiv'>
                        <Button variant="contained" onClick={(e) => renewPassword()}>Proceed</Button>
                    </div>
                    {/* <div className='forgotDetails'>
                        <div>
                            Don't have any account? <span className='signUpText' onClick={(e) => navigate('/signup')}>Sign Up</span>
                        </div>
                        <div className='forgotPasswordText' onClick={(e) => navigate("/forgotPassword")}>
                            Forgot Password
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
    :
    navigate("/author-dashboard")
  )
}

export default ResetPassword