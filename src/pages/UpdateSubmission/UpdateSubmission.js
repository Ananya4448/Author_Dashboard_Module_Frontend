import React from "react";
import "./UpdateSubmission.css";
import SignedHeader from "../../components/SignedHeader/SignedHeader";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

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
          <h2>Update Submission</h2>
          <div className="formStyle">
            {/* left div */}
            <div className="formPartitions">
              <div className="leftFieldsContainers">
                <TextField
                  id="standard-basic"
                  label="Paper Title"
                  variant="filled"
                  className="leftFields"
                />
              </div>
              <div className="leftFieldsContainers">
                <TextField id="standard-basic" label="Field" variant="filled"
                className="leftFields" />
              </div>
              <div className="leftFieldsContainers">
                <TextField
                  id="standard-basic"
                  label="Status"
                  variant="filled"
                  className="leftFields"
                  disabled={true}
                  value={'UnSubmitted'}
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
                >
                  Upload file
                  <VisuallyHiddenInput type="file" />
                </Button>
              </div>
            </div>
            <div className="formPartitions">
              <TextField
                id="filled-textarea"
                label="Abstract"
                multiline
                variant="filled"
                rows={10}
                className="abstractFieldStyle"
              />
            </div>
            <div className="formPartitions">
              <TextField
                id="filled-textarea"
                label="Keywords"
                multiline
                variant="filled"
                rows={10}
                className="abstractFieldStyle"
              />
            </div>
          </div>
          <div className="submitStyle">
            <Button variant="contained" style={{marginLeft:'10px'}}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubmission;
