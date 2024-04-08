import React, { useEffect, useState } from 'react';
import "./ShowReviews.css";
import { useLocation } from 'react-router-dom';
import SignedHeader from '../../components/SignedHeader/SignedHeader';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import getAllSubmissionsByAuthor from "../../apis/getAllSubmissionsByAuthor";

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

function ShowReviews(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const {userLoggedIn} = location.state;
    const [open, setOpen] = useState(false);
    const [reviewsPerSubmission, setReviewsPerSubmission] = useState([]);

    // console.log(submissions, "submissions");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
      };

    const getSubmissionList = async(id) => {
        const resp = await getAllSubmissionsByAuthor(id);
        // console.log(resp?.data?.data, "resp?.data?.data");
        setSubmissions(resp?.data?.data || []);
    };

    useEffect(() => {
        getSubmissionList(userLoggedIn?.id);
    }, []);

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
            <div className="tablePart">
              <h2 className="submissionsHeading">Submissions and Reviews</h2>
              <div>
                <TableContainer component={Paper} className="tableHeightReviews">
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell width='100px'>Action</StyledTableCell>
                        <StyledTableCell width='100px'>Paper title</StyledTableCell>
                        <StyledTableCell align="center" width='100px'>Field</StyledTableCell>
                        <StyledTableCell align="center" width='150px'>
                          Document URL
                        </StyledTableCell>
                        <StyledTableCell align="center" width='150px'>
                          Abstract
                        </StyledTableCell>
                        <StyledTableCell align="center" width='150px'>
                          KeyWords
                        </StyledTableCell>
                        <StyledTableCell align="right" width='100px'>Status</StyledTableCell>
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
                          <StyledTableCell component="th" scope="row" width='100px'>
                            <Button
                              variant="contained"
                              color="warning"
                              style={{ marginRight: "5px", width: "50px" }}
                              onClick={(e) => {
                                handleClickOpen();
                                console.log(row, "row");
                                setReviewsPerSubmission(row);
                              }}
                            >
                              Reviews
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row" width='100px'>
                            {row?.paper_title}
                          </StyledTableCell>
                          <StyledTableCell align="center" width='100px'>
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
                          <StyledTableCell align="center" width='150px'>
                            {row?.paper_abstract}
                          </StyledTableCell>
                          <StyledTableCell align="center" width='150px'>
                            {row?.keywords?.replace(/[\[\]'"\\]/g, '') || ""}
                          </StyledTableCell>
                          <StyledTableCell align="right" width='100px'>
                            {row?.submissionstatus?.status}
                          </StyledTableCell>
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
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-title">
              {`Reviews for ${reviewsPerSubmission?.paper_title || "" }`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              {reviewsPerSubmission?.reviewList?.length ? <TableContainer component={Paper} className="tableHeightReviews">
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
                      {reviewsPerSubmission?.reviewList?.map((row) => (
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
            {/* <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                // onClick={(e) => deleteSubmissionFunc()}
                autoFocus
              >
                Okay
              </Button>
            </DialogActions> */}
          </Dialog>
    </div>
  )
}

export default ShowReviews