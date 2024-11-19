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
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Header from './layout/Header.jsx'

export default function CummulativeReport({ data }) {

  // const [from, setFrom] = React.useState(dayjs('2023-01-01'));
  // const [to, setTo] = React.useState(dayjs('2023-12-31'));

  // console.log(data.courseEnrollment);

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

      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From"
          value={from}
          onChange={() => { }}
        />
        <DatePicker
          label="To"
          value={to}
          onChange={() => { }}
        />
      </LocalizationProvider>

      <Button variant="contained" onClick={callCourseEnrollmentQuery} sx={{ mt: 2, float: "right" }}>Submit</Button> */}

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
                <TableCell align="right">Completed Users</TableCell>
                <TableCell align="right">Total Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.courseEnrollment?.map(function (course) {
                return (
                  <TableRow
                    key={course.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{course.course_name}</TableCell>
                    <TableCell align="right">{course.total_complete}</TableCell>
                    <TableCell align="right">{course.total_enrolled}</TableCell>
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