import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import Header from './layout/Header.jsx'

export default function CummulativeReport({ data }) {

  console.log(data.statesList);

  // const [statesList, setStatesList] = useState([]);

  // useEffect(() => {
  //   if (data && data.statesList) {
  //     setStatesList(data.statesList);
  //   }
  // }, [data]);

  // const [statesList, setStatesList] = useState({});

  // React.useEffect(() => {
  //   getStatesList(data)
  // }, []);

  // //create user states list from array of zipCodes
  // function getStatesList(data) {
  //   let statesList = [];
  //   (data.userZipcodes).forEach((ele) => {
  //     let state = getState(ele.data);
  //     if (statesList[state]) {
  //       statesList[state] += ele.user_count;
  //     }
  //     else {
  //       statesList[state] = ele.user_count;
  //     }
  //   })
  //   statesList.sort();
  //   setStatesList(statesList);
  // }


  return (
    <div>

      <Box
        sx={{
          flexGrow: 1,
          mb: 8
        }}
      >
        <Header title={"User Type"} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Type</TableCell>
                <TableCell align="right">Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.userTypes?.map(function (type) {
                return (
                  <TableRow
                    key={type.data}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{type.data}</TableCell>
                    <TableCell align="right">{type.user_count}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          mb: 8
        }}
      >
        <Header title={"States"} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>States</TableCell>
                <TableCell align="right">Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.statesList.map(({ state, count }) => (
                <TableRow key={state} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{state}</TableCell>
                  <TableCell align="right">{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          mb: 8
        }}
      >
        <Header title={"Course Enrollment"} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell align="right">Total Users</TableCell>
                <TableCell align="right">Completed Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.courseEnrollment?.map(function (course) {
                return (
                  <TableRow
                    key={course.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{course.course_name}</TableCell>
                    <TableCell align="right">{course.total_users}</TableCell>
                    <TableCell align="right">{course.completed_users}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};