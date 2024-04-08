import React, { useEffect, useState } from "react";
import "./ViewStatus.css";
import SignedHeader from "../../components/SignedHeader/SignedHeader";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useLocation } from 'react-router-dom';

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

function ViewStatus() {
    const location = useLocation();
    const {userLoggedIn} = location.state;
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);

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
              <h2 className="submissionsHeading">Submissions and Status</h2>
              <div>
                <TableContainer component={Paper} className="tableHeightReviews">
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell width='100px'>Paper title</StyledTableCell>
                        <StyledTableCell align="center" width='100px'>Status</StyledTableCell>
                        {/* <StyledTableCell align="center" width='150px'>
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
                        </StyledTableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions?.map((row) => (
                        <StyledTableRow key={row?.id}>
                          <StyledTableCell component="th" scope="row" width='100px'>
                            {row?.paper_title}
                          </StyledTableCell>
                          <StyledTableCell align="center" width='100px'>
                            <Button className="statusBox" variant="contained" color={`${row?.submissionstatus?.status === "submitted" ? 'error' : row?.submissionstatus?.status === "reviewed" ? 'warning' : 'success'}`}>
                                {row?.submissionstatus?.status.charAt(0).toUpperCase() + row?.submissionstatus?.status.slice(1)}
                            </Button>
                          </StyledTableCell>
                          {/* <StyledTableCell align="center" width='150px'>
                            {row?.docurl}
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
                          </StyledTableCell> */}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
      </div>
    </div>
  );
}

export default ViewStatus;
