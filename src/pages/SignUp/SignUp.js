import React, { useEffect, useState } from 'react';
import "./SignUp.css"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header/Header';
import { Button, Typography } from '@mui/material';
import SidePic from "../../images/sidePic.png";
import { useNavigate } from 'react-router-dom';
import addUser from '../../apis/addUser';
import { ToastContainer, toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

function SignIn() {
    const navigate = useNavigate();
    const [userLoggedIn, setUserLoggedIn] = useState('');
    const [inputFields, setInputFields] = useState({
        name: "",
        email: "",
        organization: "",
        mobile: "",
        password: ""
    });
    const [passwordValid, setPasswordValid] = useState(true);

    // console.log(inputFields, "inputFields");
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

    // Function to update input fields
  const updateInputFields = (fieldName, value) => {
    setInputFields(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const addAuthor = async () => {
    // password regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
    const isValidPassword = passwordRegex.test(inputFields.password);
    if (isValidPassword) {
        console.log("Password is valid");
        setPasswordValid(true);

        try {
            const response = await addUser(inputFields);
            console.log(response, "response");
            if(response.data.message === "User added successfully") {
                toast.success("Author account created successfully", {
                    theme: "colored",
                });
                navigate("/signin");
            }
            else {
                toast.error("Falied to create author", {
                    theme: "colored",
                });
            }
        }
        catch(err) {
            toast.error("Falied to create author", {
                theme: "colored",
            });
        }

    } else {
        console.log("Password is invalid");
        setPasswordValid(false);
        toast.error("Please enter valid details", {
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
        getUserFromLocal();
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
                    <h1 className='signinHeader'>Sign Up</h1>
                    <div className='formDiv'>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Name" variant="outlined" className='fieldsWidth' autoComplete={false} value={inputFields?.name || ""} onChange={(e) => updateInputFields('name', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Email" variant="outlined" className='fieldsWidth' autoComplete={false} value={inputFields?.email || ""} onChange={(e) => updateInputFields('email', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Organization" variant="outlined" className='fieldsWidth' autoComplete={false} value={inputFields?.organization || ""} onChange={(e) => updateInputFields('organization', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Mobile Number" variant="outlined" className='fieldsWidth' autoComplete={false} value={inputFields?.mobile || ""} onChange={(e) => updateInputFields('mobile', e.target.value)}/>
                        </div>
                        <div className='signinfieldStyle'>
                            <TextField id="outlined-basic" label="Password" variant="outlined" className='fieldsWidth' autoComplete={false} type='password' value={inputFields?.password || ""} onChange={(e) => updateInputFields('password', e.target.value)} error={!passwordValid}/>
                            <div className='passwordRule'>
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
                        </div>
                    </div>
                    <div className='buttonDiv'>
                        <Button variant="contained" onClick={(e) => addAuthor()}>Submit</Button>
                    </div>
                    <div className='forgotDetails'>
                        <div>
                            Already have an account? <span className='signUpText' onClick={(e) => navigate('/signin')}>Sign In</span>
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