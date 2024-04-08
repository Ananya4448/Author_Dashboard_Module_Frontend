import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import SignedHeader from "../../components/SignedHeader/SignedHeader";
import AddSubmissionIcon from "../../images/addSubmission.png";
import DefaultPic from "../../images/defaultProfile.jpg";
import ReviewIcon from "../../images/reviewsIcon.png";
import StatusIcon from "../../images/statusIcon.png";
import "./AuthorDashboard.css";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";

import { createClient } from "@supabase/supabase-js";
import deleteSubmission from "../../apis/deleteSubmission";
import getAllSubmissionsByAuthor from "../../apis/getAllSubmissionsByAuthor";
import getUserByEmail from "../../apis/getUserByEmail";
import updateUserWithoutPass from "../../apis/updateUserWithoutPass";

const supabaseUrl = "https://ndbiymnaghcpjlislwyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kYml5bW5hZ2hjcGpsaXNsd3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyMTM3MDEsImV4cCI6MjAxNDc4OTcwMX0.vbYNhR2ZfEJyfpnI724FaXqjPm9ADwiy0bYXzSJRGXk";
const supabase = createClient(supabaseUrl, supabaseKey);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function AuthorDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openTab, setOpenTab] = useState("dashboard");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [deleteSubmissionData, setDeleteSubmissionData] = useState("");
  const [reloadAPI, setReloadAPI] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [editUserData, setEditUserData] = useState("");

  const changeTab = (tab) => {
    setOpenTab(tab);
    if (tab === "logOut") {
      handleClickOpen();
    }
    if (tab === "editProfile") {
      openEditUserModal();
      getProfileDataForEdit();
    }
  };

  const getProfileDataForEdit = async () => {
    try {
      const res = await getUserByEmail(userLoggedIn?.email);
      setEditUserData(res?.data?.data);
    } catch (err) {
      console.log(err, "err");
    }
  };

  
  // Function to update input fields
  const updateInputFields = (fieldName, value) => {
    setEditUserData(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const updateProfile = async() => {
    try {
      if(editUserData?.name && editUserData?.email && editUserData?.organization && editUserData?.mobile) {
        let payload = {...editUserData};
        payload.submissionList = [];
        const res = await updateUserWithoutPass(payload);
        payload.submissionList = null;
        localStorage.setItem("login", JSON.stringify(payload));
        getUserFromLocal();
        toast.success("Profile data updated successfully", {
          theme: "colored",
        });
        closeEditUserModal();
      }
      else {
        toast.error("Fill all the fields carefully", {
          theme: "colored",
        });
      }
    }
    catch(err) {
      console.log("Error", err);
    }
  };

  const getUserFromLocal = async() => {
    const loginData = localStorage.getItem("login");
    console.log(JSON.parse(loginData), "loginData");
    if (loginData) {
        setUserLoggedIn(JSON.parse(loginData));
        getSubmissionList(JSON.parse(loginData)?.id);
    }    
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const openEditUserModal = () => {
    setOpenEditUserDialog(true);
  };

  const closeEditUserModal = () => {
    setOpenEditUserDialog(false);
  };

  const logOutFunc = () => {
    try {
      localStorage.removeItem("login");
      toast.success("Log out successfully", {
        theme: "colored",
      });
      handleClose();
      navigate("/signin");
    } catch (err) {
      console.log(err, "Error");
    }
  };

  // Delete bucket from supabase
  const handleDelete = async (data) => {
    let fileUrl = data?.docurl || "";
    if (fileUrl) {
      try {
        const fileName = fileUrl.split("/").pop(); // Extract file name from URL
        const { data, error } = await supabase.storage
          .from("submissiondoc")
          .remove([fileName]);

        if (error) {
          console.error("Error deleting file:", error.message);
        } else {
          console.log("File deleted successfully:", data);
        }
      } catch (error) {
        console.error("Error deleting file:", error.message);
      }
    } else {
      console.error("No file deleted");
    }
  };

  const deleteSubmissionFunc = async () => {
    try {
      handleDelete(deleteSubmissionData);
      const resp = await deleteSubmission(deleteSubmissionData?.id);
      toast.success("Submission deleted successfully", {
        theme: "colored",
      });
      handleCloseDeleteDialog();
      setDeleteSubmissionData("");
      setReloadAPI(true);
    } catch (err) {
      console.log(err, "Error");
      toast.error("Failed to delete submission", {
        theme: "colored",
      });
    }
  };

  const getSubmissionList = async (id) => {
    const resp = await getAllSubmissionsByAuthor(id);
    // console.log(resp?.data?.data, "resp?.data?.data");
    setSubmissions(resp?.data?.data || []);
  };

  useEffect(() => {
    // if(reloadAPI)
    // {
    getUserFromLocal();
    // }
  }, [reloadAPI]);

  return (
    <div>
      {userLoggedIn ? <SignedHeader /> : <Header />}
      {userLoggedIn?.userRole === "reviewer" ? (
        navigate("/reviewer-dashboard")
      ) : userLoggedIn ? (
        <div className="mainContainer">
          <div className="leftDashboard">
            {/* 1st row */}
            <div className="picNameContainer">
              <div>
                <img src={DefaultPic} className="profilePic" />
              </div>
              <div className="nameAuthor">{userLoggedIn?.name}</div>
              <div className="designationStyle">
                {userLoggedIn?.user_role ? "Reviewer" : "Author"}
              </div>
            </div>
            {/* 2nd row */}
            <div className="optionRoutes">
              <div
                className={`optionsStyles ${
                  openTab === "dashboard" ? "tabOpened" : ""
                }`}
                onClick={(e) => changeTab("dashboard")}
              >
                Dashboard
              </div>
              <div
                className={`optionsStyles ${
                  openTab === "editProfile" ? "tabOpened" : ""
                }`}
                onClick={(e) => changeTab("editProfile")}
              >
                Edit Profile
              </div>
              <div
                className={`optionsStyles ${
                  openTab === "logOut" ? "tabOpened" : ""
                }`}
                onClick={(e) => changeTab("logOut")}
              >
                Log out
              </div>
            </div>
          </div>
          <div className="rightDashboard">
            {/* 1st row right */}
            <div className="fourCardsContainer">
              <div
                className="fourCards firstCard"
                onClick={(e) => navigate("/addSubmission")}
              >
                <div>
                  <img src={AddSubmissionIcon} />
                </div>
                <div className="cardLebels">Add Submission</div>
              </div>
              <div
                className="fourCards secondCard"
                onClick={(e) =>
                  navigate("/viewStatus", {
                    state: {
                      userLoggedIn: userLoggedIn,
                    },
                  })
                }
              >
                <div>
                  <img src={StatusIcon} />
                </div>
                <div className="cardLebels">Status</div>
              </div>
              <div
                className="fourCards thirdCard"
                onClick={(e) =>
                  navigate("/viewReviews", {
                    state: {
                      userLoggedIn: userLoggedIn,
                    },
                  })
                }
              >
                <div>
                  <img src={ReviewIcon} />
                </div>
                <div className="cardLebels">Review Feedbacks</div>
              </div>
              {/* <div className="fourCards fourthCard">
                <div>
                  <img src={InviteIcon} />
                </div>
                <div className="cardLebels">Invite Friends</div>
              </div> */}
            </div>
            {/* 2nd table */}
            <div className="tablePart">
              <h2 className="submissionsHeading">Your Submissions</h2>
              {submissions.length ? (
                <div>
                  <TableContainer component={Paper} className="tableHeight">
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell width="500px">
                            Action
                          </StyledTableCell>
                          <StyledTableCell width="100px">
                            Paper title
                          </StyledTableCell>
                          <StyledTableCell align="right" width="100px">
                            Field
                          </StyledTableCell>
                          <StyledTableCell align="center" width="150px">
                            Document URL
                          </StyledTableCell>
                          <StyledTableCell align="right" width="150px">
                            Abstract
                          </StyledTableCell>
                          <StyledTableCell align="right" width="150px">
                            KeyWords
                          </StyledTableCell>
                          {/* <StyledTableCell align="right" width='100px'>Status</StyledTableCell> */}
                          <StyledTableCell align="right" width="100px">
                            Created At
                          </StyledTableCell>
                          <StyledTableCell align="right" width="100px">
                            Updated At
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {submissions?.map((row) => (
                          <StyledTableRow key={row?.id}>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              width="500px"
                            >
                              <Button
                                variant="contained"
                                color="warning"
                                style={{ marginRight: "5px", width: "50px" }}
                                onClick={(e) => {
                                  navigate("/updateSubmission", {
                                    state: {
                                      submissionData: row,
                                    },
                                  });
                                }}
                              >
                                Update
                              </Button>
                              <Button
                                color="error"
                                variant="outlined"
                                style={{ width: "50px" }}
                                onClick={(e) => {
                                  setOpenDeleteDialog(true);
                                  setDeleteSubmissionData(row);
                                }}
                              >
                                Delete
                              </Button>
                            </StyledTableCell>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              width="100px"
                            >
                              {row?.paper_title}
                            </StyledTableCell>
                            <StyledTableCell align="right" width="100px">
                              {row?.field}
                            </StyledTableCell>
                            <StyledTableCell align="center" width="150px">
                              {row?.docurl ? (
                                <a href={row?.docurl} target="blank">
                                  <FileDownloadIcon />
                                  <div>Download</div>
                                </a>
                              ) : (
                                "No Doc"
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="right" width="150px">
                              {row?.paper_abstract}
                            </StyledTableCell>
                            <StyledTableCell align="right" width="150px">
                              {row?.keywords?.replace(/[\[\]'"\\]/g, "") || ""}
                            </StyledTableCell>
                            {/* <StyledTableCell align="right" width='100px'>
                                {row?.submissionstatus?.status}
                              </StyledTableCell> */}
                            <StyledTableCell align="right" width="100px">
                              {row?.created_at}
                            </StyledTableCell>
                            <StyledTableCell align="right" width="100px">
                              {row?.updated_at}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : (
                <div className="emptyTable">No submissions yet</div>
              )}
            </div>
          </div>
          {/* Log out dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Notification from the site"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you want to log out ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={(e) => logOutFunc()} autoFocus>
                Okay
              </Button>
            </DialogActions>
          </Dialog>
          {/* Delete dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Notification from the site"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you want to delete the submission{" "}
                {deleteSubmissionData?.paper_title} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={(e) => deleteSubmissionFunc()} autoFocus>
                Okay
              </Button>
            </DialogActions>
          </Dialog>
          {/* Edit User dialog */}
          <Dialog
            open={openEditUserDialog}
            onClose={closeEditUserModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-title">{"Edit Profile"}</DialogTitle>
            <DialogContent className="editDialogcontent">
              <DialogContentText id="alert-dialog-description">
                <div className="formDiv">
                  <div className="signinfieldStyle">
                    <TextField
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      className="fieldsWidth"
                      autoComplete={false}
                      value={editUserData?.name || ""}
                      onChange={(e) =>
                        updateInputFields("name", e.target.value)
                      }
                    />
                  </div>
                  <div className="signinfieldStyle">
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      disabled
                      variant="outlined"
                      className="fieldsWidth"
                      autoComplete={false}
                      value={editUserData?.email || ""}
                      onChange={(e) =>
                        updateInputFields("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="signinfieldStyle">
                    <TextField
                      id="outlined-basic"
                      label="Organization"
                      variant="outlined"
                      className="fieldsWidth"
                      autoComplete={false}
                      value={editUserData?.organization || ""}
                      onChange={(e) =>
                        updateInputFields("organization", e.target.value)
                      }
                    />
                  </div>
                  <div className="signinfieldStyle">
                    <TextField
                      id="outlined-basic"
                      label="Mobile Number"
                      variant="outlined"
                      className="fieldsWidth"
                      autoComplete={false}
                      value={editUserData?.mobile || ""}
                      onChange={(e) =>
                        updateInputFields("mobile", e.target.value)
                      }
                    />
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditUserModal}>Cancel</Button>
              <Button
                onClick={(e) => updateProfile()}
                autoFocus
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div>
          <h1>You are not authorized to view this page</h1>
          <Button variant="contained" onClick={(e) => navigate("/signin")}>
            Log in
          </Button>
        </div>
      )}
    </div>
  );
}

export default AuthorDashboard;
