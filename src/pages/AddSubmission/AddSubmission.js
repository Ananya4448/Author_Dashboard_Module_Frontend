import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import addSubmission from "../../apis/addSubmission";
import getAllStatus from "../../apis/getAllStatus";
import updateSubmission from "../../apis/updateSubmission";
import SignedHeader from "../../components/SignedHeader/SignedHeader";
import "./AddSubmission.css";

const supabaseUrl = 'https://ndbiymnaghcpjlislwyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kYml5bW5hZ2hjcGpsaXNsd3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyMTM3MDEsImV4cCI6MjAxNDc4OTcwMX0.vbYNhR2ZfEJyfpnI724FaXqjPm9ADwiy0bYXzSJRGXk';
const supabase = createClient(supabaseUrl, supabaseKey);

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname, "location.pathname");
  const { submissionData } = location?.state || {submissionData:{}};

  const [userLoggedIn, setUserLoggedIn] = useState('');
  const [allStatus, setAllStatus] = useState([]);
  const [today, setToday] = useState(new Date());
  const [inputFilelds, setInputFields] = useState({
    paper_title: submissionData?.paper_title || "",
    field: submissionData?.field || "",
    docurl: submissionData?.docurl || "",
    paper_abstract: submissionData?.paper_abstract || "",
    keywords: submissionData?.keywords || "",
    created_at: submissionData?.created_at || `${today?.getFullYear()}-${(today?.getMonth() + 1).toString().padStart(2, '0')}-${today?.getDate().toString().padStart(2, '0')}`,
    updated_at: submissionData?.updated_at || `${today?.getFullYear()}-${(today?.getMonth() + 1).toString().padStart(2, '0')}-${today?.getDate().toString().padStart(2, '0')}`,
    user: {
      id: submissionData?.user?.id || userLoggedIn?.id
    },
    submissionstatus: {
      id: submissionData?.submissionstatus?.id || allStatus?.filter(item => item?.status === "submitted")[0]?.id
    }
  });

  // console.log(inputFilelds, "inputFilelds");

  const [file, setFile] = useState("");

  const [validated, setValidated] = useState(true);
  

  const getUserFromLocal = () => {
    const loginData = JSON.parse(localStorage.getItem('login'));
    // console.log(loginData, "loginJson");
    if(loginData)
    {
      setInputFields(prevState => ({
        ...prevState,
        ['user']: {
          ['id']: loginData?.id
        }
      }));
        setUserLoggedIn(loginData);
    }
  } ;

  // console.log(allStatus, "allStatus");
  // console.log(inputFilelds, "inputFilelds");

  const updateInputFields = (fieldName, value) => {
    if(fieldName === 'keywords') {
      const arr = value.split(", ");
      setInputFields(prevState => ({
        ...prevState,
        [fieldName]: JSON.stringify(arr)
      }));
    }
    else {
      setInputFields(prevState => ({
        ...prevState,
        [fieldName]: value
      }));
    }

    // Status code update
    // if(!inputFilelds?.submissionstatus?.id)
    // {
      
      
    // }
  };

  // Delete bucket from supabase
  const handleDelete = async (data) => {
    let fileUrl = data?.docurl || "";
    if (fileUrl) {
      try {
        const fileName = fileUrl.split('/').pop(); // Extract file name from URL
        const { data, error } = await supabase.storage.from('submissiondoc').remove([fileName]);

        if (error) {
          console.error('Error deleting file:', error.message);
        } else {
          console.log('File deleted successfully:', data);
        }
      } catch (error) {
        console.error('Error deleting file:', error.message);
      }
    } else {
      console.error('No file deleted');
    }
  };

  const handleFileChange = async(event) => {
    // Delete existing doc first
    handleDelete(inputFilelds);

    // then upload new doc
    setFile(event?.target?.files[0]);
    let localFile = event?.target?.files[0];
    if (localFile) 
    {
      try {
        const { data, error } = await supabase.storage.from('submissiondoc').upload(localFile.name, localFile);

        if (error) {
            console.error('Error uploading file:', error?.message);
            toast.error("Failed to save file", {
              theme: "colored",
            });
          } else {
            // console.log('File uploaded successfully:', data?.Key ? data?.Key : data?.fullPath);
            const url = `${supabaseUrl}/storage/v1/object/public/${data?.fullPath}`;
            setInputFields(prevState => ({
              ...prevState,
              docurl: url
            }));
            toast.success("Saved file successfully", {
              theme: "colored",
            });
          }
        } catch (error) {
          console.error('Error uploading file:', error.message);
          toast.error("Failed to save file", {
            theme: "colored",
          });
        }
    } 
    else {
      console.error('No file selected');
    }
  };

  const defaultAPIs = async() => {
    const resp = await getAllStatus();
    // console.log(resp?.data?.data, "resp.data.data");
    setAllStatus(resp?.data?.data);
    let submitId = resp?.data?.data?.filter(item => item?.status === "submitted")[0]?.id;
    setInputFields(prevState => ({
      ...prevState,
      submissionstatus: {
        id: submitId
      }
    }));
  }

  useEffect(() => {
    getUserFromLocal();
    defaultAPIs();
}, []);

const submitSubmission = async() => {
  console.log(inputFilelds, "inputFilelds");
  try {
    if(inputFilelds.user.id && inputFilelds.field && inputFilelds.keywords && inputFilelds.paper_abstract && inputFilelds.paper_title && inputFilelds.docurl) {
      setValidated(true);
      if(location.pathname === "/addSubmission") {
        const res = await addSubmission(inputFilelds);
        setInputFields({
          paper_title: "",
          field: "",
          docurl: "",
          paper_abstract: "",
          keywords: "",
          user: {
            id: userLoggedIn?.id
          },
          submissionstatus: {
            id: allStatus?.filter(item => item?.status === "submitted")[0]?.id
          }
        });
        toast.success("Submission created successfully", {
          theme: "colored",
      });
        navigate("/author-dashboard");
      }
      else if(location.pathname === "/updateSubmission") {
        let payloadFields = {...inputFilelds};
        payloadFields.id = submissionData?.id;
        // console.log(payloadFields, "payloadFields");
        const res = await updateSubmission(payloadFields);
        setInputFields({
          paper_title: "",
          field: "",
          docurl: "",
          paper_abstract: "",
          keywords: "",
          user: {
            id: userLoggedIn?.id
          },
          submissionstatus: {
            id: allStatus?.filter(item => item?.status === "submitted")[0]?.id
          }
        });
        toast.success("Submission updated successfully", {
          theme: "colored",
      });
        navigate("/author-dashboard");
      }
      else {
        toast.error("Failed to update submission", {
          theme: "colored",
      });
      }

    
    }
    else {
      setValidated(false);
      toast.error("Fill the fields carefully", {
        theme: "colored",
    });
    }
  }
  catch(err) {
    toast.error("Failed to add submission", {
      theme: "colored",
  });
  }
};

  return (
    <div>
      <SignedHeader />
      <div className="submissionFormContainer">
        <div
          className="goBackStyle"
          onClick={(e) => navigate("/author-dashboard")}
        >
          <KeyboardBackspaceIcon />
          <div>Go Back to Dashboard</div>
        </div>
        <div>
          <h2>{location.pathname === "/updateSubmission" ? "Update Submission" : "Add Submission"}</h2>
          <div className="formStyle">
            {/* left div */}
            <div className="formPartitions">
              <div className="leftFieldsContainers">
                <TextField
                  id="standard-basic"
                  label="Paper Title*"
                  variant="filled"
                  className="leftFields"
                  onChange={(e) => updateInputFields('paper_title', e.target.value)}
                  value={inputFilelds?.paper_title || ""}
                />
              </div>
              <div className="leftFieldsContainers">
                <TextField id="standard-basic" label="Field*" variant="filled"
                className="leftFields" onChange={(e) => updateInputFields('field', e.target.value)} value={inputFilelds?.field || ""}/>
              </div>
              <div className="leftFieldsContainers">
                <TextField
                  id="standard-basic"
                  label="Status*"
                  variant="filled"
                  className="leftFields"
                  disabled={true}
                  value={location.pathname === "/updateSubmission" ? String(allStatus?.filter(item => item?.id === inputFilelds?.submissionstatus?.id)[0]?.status) : 'Unsubmitted'}
                />
              </div>
              <div className="leftFieldsContainers">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  className="leftFields"
                  onChange={handleFileChange}
                  // onChange={(e) => updateInputFields('paper_title', e.target.value)}
                >
                  { inputFilelds?.docurl.split('/').pop() ? inputFilelds?.docurl.split('/').pop() : file ? file?.name : 'Upload file*'}
                  <VisuallyHiddenInput type="file" />
                </Button>
              </div>
            </div>
            <div className="formPartitions">
              <TextField
                id="filled-textarea"
                label="Abstract*"
                multiline
                variant="filled"
                rows={10}
                className="abstractFieldStyle"
                onChange={(e) => updateInputFields('paper_abstract', e.target.value)}
                value={inputFilelds?.paper_abstract || ""}
              />
            </div>
            <div className="formPartitions">
              <TextField
                id="filled-textarea"
                label="Keywords*"
                placeholder="Key1, Key2, Key3"
                multiline
                variant="filled"
                rows={10}
                className="abstractFieldStyle"
                onChange={(e) => updateInputFields('keywords', e.target.value)}
                // value={JSON.stringify(inputFilelds?.keywords).replace(/[\[\]'"\\]/g, '') || ""}
                value={ inputFilelds?.keywords.replace(/[\[\]'"\\]/g, '') || ""}
              />
            </div>
          </div>
          <div className="submitStyle">
            <Button variant="contained" style={{marginLeft:'10px'}} onClick={(e) => submitSubmission()}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubmission;
