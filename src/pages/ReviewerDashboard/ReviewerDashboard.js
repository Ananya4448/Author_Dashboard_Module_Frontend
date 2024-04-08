import React, { useEffect, useState } from 'react';
import "./ReviewerDashboard.css";
import SignedHeader from '../../components/SignedHeader/SignedHeader';
import Header from '../../components/Header/Header';
import DefaultPic from "../../images/defaultProfile.jpg";
import { useNavigate } from 'react-router-dom';
import AddSubmissionIcon from "../../images/addSubmission.png";
import StatusIcon from "../../images/statusIcon.png";
import ReviewIcon from "../../images/reviewsIcon.png";
import InviteIcon from "../../images/inviteFriendsIcon.png";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import getAllSubmissions from '../../apis/getAllSubmissions';
import addReview from "../../apis/addReview";
import getUserByEmail from '../../apis/getUserByEmail';
import updateUserWithoutPass from '../../apis/updateUserWithoutPass';
import getAllStatus from '../../apis/getAllStatus';
import updateSubmission from '../../apis/updateSubmission';

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

function ReviewerDashboard() {
    const navigate = useNavigate();
    const [userLoggedIn, setUserLoggedIn] = useState("");
    const [open, setOpen] = useState(false);
    const [openTab, setOpenTab] = useState("dashboard");
    const [submissions, setSubmissions] = useState([]);
    const [addReviewSubmission, setAddReviewSubmission] = useState("");
    const [review, setReview] = useState("");

    const [openAddReviewModal, setOpenAddReviewModal] = useState(false);
    const [openShowReviewModal, setOpenShowReviewModal] = useState(false);
    const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
    const [editUserData, setEditUserData] = useState("");
    const [reloadAPI, setReloadAPI] = useState(false);
    const [allStatus, setAllStatus] = useState([]);

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

      const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const handleClickOpenAddReviewDialog = () => {
        setOpenAddReviewModal(true);
      };

      const handleClickOpenShowReviewDialog = () => {
        setOpenShowReviewModal(true);
      }

      const handleClickCloseAddReviewDialog = () => {
        setOpenAddReviewModal(false);
      };

      const handleClickCloseShowReviewDialog = () => {
        setOpenShowReviewModal(false);
      };

      const openEditUserModal = () => {
        setOpenEditUserDialog(true);
      };

      const closeEditUserModal = () => {
        setOpenEditUserDialog(false);
      };

      const getSubmissionList = async() => {
        const resp = await getAllSubmissions();
        // console.log(resp?.data?.data, "resp?.data?.data");
        setSubmissions(resp?.data?.data || []);
      }

    const getUserFromLocal = () => {
        const loginData = localStorage.getItem("login");
        console.log(JSON.parse(loginData), "loginData");
        if (loginData) {
          setUserLoggedIn(JSON.parse(loginData));
        }
        getSubmissionList();
      };

      const logOutFunc = () => {
        try {
            localStorage.removeItem('login');
            toast.success("Log out successfully", {
                theme: "colored",
            });
            handleClose();
            navigate("/signin");
        }
        catch(err) {
            console.log(err, "Error");
        }
      }

      const createReview = async () => {
        console.log(addReviewSubmission, "addReviewSubmission");
        try {
            if(review)
            {
                const payload = {
                    review : review,
                    submission : {
                        id: addReviewSubmission?.id
                    }
                }
                const resp = await addReview(payload);
                // set the status of submission as reviewed
                let updateSubmissionData = {...addReviewSubmission};
                updateSubmissionData.submissionstatus = {
                  id: (allStatus?.filter(item => item?.status === "reviewed"))[0]?.id
                }
                updateSubmissionData.reviewList = [];
                const updatedSubRes = await updateSubmission(updateSubmissionData);
                toast.success("Review created successfully", {
                    theme: "colored",
                });
                setAddReviewSubmission("");
                handleClickCloseAddReviewDialog();
                setReview("");
                setReloadAPI(true);
            }
            else {
                toast.error("Put a review", {
                    theme: "colored",
                });
            }
        }
        catch(err) {
            console.log(err, "Error");
        }
        
      }

    const getAllSubmissionStatuses = async () => {
      try {
        const res = await getAllStatus();
        setAllStatus(res?.data?.data);
      }
      catch(err) {
        console.log(err, "Error");
      }
    };

    useEffect(() => {
        getUserFromLocal();
        getAllSubmissionStatuses();
    }, [reloadAPI]);

  return (
    <div>
        {userLoggedIn ? <SignedHeader /> : <Header />}
        {userLoggedIn ? (
        <div className="mainContainer">
          <div className="leftDashboard">
            {/* 1st row */}
            <div className="picNameContainer">
              <div>
                <img src={DefaultPic} className="profilePic" />
              </div>
              <div className="nameAuthor">{userLoggedIn?.name}</div>
              <div className="designationStyle">{userLoggedIn?.user_role ? "Author" : "Reviewer"}</div>
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
            {/* 2nd table */}
            <div className="tablePart">
              <h2 className="submissionsHeading">Your Submissions</h2>
              <div>
                <TableContainer component={Paper} className="tableHeightReviewer">
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell width='500px'>Reviews</StyledTableCell>
                        <StyledTableCell width='100px'>Paper title</StyledTableCell>
                        <StyledTableCell width='100px'>Author</StyledTableCell>
                        <StyledTableCell align="center" width='100px'>Field</StyledTableCell>
                        <StyledTableCell align="center" width='150px'>
                          Document URL
                        </StyledTableCell>
                        <StyledTableCell align="right" width='150px'>
                          Abstract
                        </StyledTableCell>
                        <StyledTableCell align="right" width='150px'>
                          KeyWords
                        </StyledTableCell>
                        {/* <StyledTableCell align="right" width='100px'>Status</StyledTableCell> */}
                        <StyledTableCell align="right" width='100px'>
                          Created At
                        </StyledTableCell>
                        <StyledTableCell align="right" width='100px'>
                          Updated At
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions?.map((row) => (
                        <StyledTableRow key={row?.id}>
                          <StyledTableCell component="th" scope="row" width='500px'>
                            <Button
                              variant="contained"
                              color="warning"
                              style={{ marginRight: "5px", width: "50px" }}
                              onClick={(e) => {
                                console.log(row, "row");
                                setAddReviewSubmission(row);
                                handleClickOpenShowReviewDialog();
                              }}
                            >
                              View
                            </Button>
                            <Button
                              color="error"
                              variant="outlined"
                              style={{ width: "50px" }}
                              onClick={(e) => {
                                console.log(row, "row");
                                handleClickOpenAddReviewDialog();
                                setAddReviewSubmission(row);
                                // setOpenDeleteDialog(true);
                                // setDeleteSubmissionData(row);
                              }}
                            >
                              Add
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row" width='100px'>
                            {row?.paper_title}
                          </StyledTableCell>
                          <StyledTableCell align='center' width='100px'>
                            {row?.user?.name}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='100px'>
                            {row?.field}
                          </StyledTableCell>
                          <StyledTableCell align="center" width='150px'>
                            {row?.docurl ? 
                              <a href={row?.docurl} target="blank">
                                <FileDownloadIcon />
                                <div>Download</div>
                              </a>
                            : "No Doc"}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='150px'>
                            {row?.paper_abstract}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='150px'>
                            {row?.keywords?.replace(/[\[\]'"\\]/g, '') || ""}
                          </StyledTableCell>
                          {/* <StyledTableCell align="right" width='100px'>
                            {row?.submissionstatus?.status}
                          </StyledTableCell> */}
                          <StyledTableCell align="right" width='100px'>
                            {row?.created_at}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='100px'>
                            {row?.updated_at}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
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
              <Button
                onClick={(e) => logOutFunc()}
                autoFocus
              >
                Okay
              </Button>
            </DialogActions>
          </Dialog>
          {/* Add Review Dialog */}
          <Dialog
            open={openAddReviewModal}
            onClose={handleClickCloseAddReviewDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-title">
              Add review for {addReviewSubmission?.paper_title || ""}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              <TextField
                id="filled-textarea"
                label="Put your review here*"
                multiline
                variant="filled"
                rows={10}
                className="abstractFieldStyle"
                onChange={(e) => setReview(e.target.value)}
                value={review || ""}
              />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickCloseAddReviewDialog}>Cancel</Button>
              <Button
                onClick={(e) => createReview()}
                autoFocus
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {/* Show reviews dialog */}
          <Dialog
            open={openShowReviewModal}
            onClose={handleClickCloseShowReviewDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-title">
              {`Reviews for ${addReviewSubmission?.paper_title || "" }`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              {addReviewSubmission?.reviewList?.length ? <TableContainer component={Paper} className="tableHeightReviews">
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" width='150px'>
                          Review
                        </StyledTableCell>
                        <StyledTableCell align="right" width='100px'>
                          Created At
                        </StyledTableCell>
                        <StyledTableCell align="right" width='100px'>
                          Updated At
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {addReviewSubmission?.reviewList?.map((row) => (
                        <StyledTableRow key={row?.id}>
                          <StyledTableCell component="th" scope="row" width='100px'>
                            {row?.review}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='100px'>
                            {row?.created_at}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='100px'>
                            {row?.update_at}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> : "No Reviews for this submission"}
              </DialogContentText>
            </DialogContent>
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
  )
}

export default ReviewerDashboard