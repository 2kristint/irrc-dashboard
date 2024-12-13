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
  Paper,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Header from './layout/Header.jsx'

export default function CummulativeReport({ data, callCourseEnrollmentQuery, enrollmentData, from, to, setFrom, setTo, enrollmentLoading }) {

  return (
    <div>

      <Box
        sx={{
          flexGrow: 1,
          mb: 8
        }}
      >
        <Typography variant="h4">
          User Demographic
        </Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }} size="small">
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
        </Paper>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          mb: 8
        }}
      >
        <Typography variant="h4">
          States
        </Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }} size="small">
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
        </Paper>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              margin: 2
            }}>
            <DatePicker
              label="From"
              value={from}
              onChange={(newValue) => setFrom(newValue)}
            />
          </Box>
          <Box
            sx={{
              margin: 2
            }}>
            <DatePicker
              label="To"
              value={to}
              onChange={(newValue) => setTo(newValue)}
            />
          </Box>
          <Button variant="contained" onClick={() => callCourseEnrollmentQuery(from, to)} sx={{ m: 2, float: "right" }}>Submit</Button>
        </LocalizationProvider>
      </Box>

      {
        enrollmentLoading ? (
          <div>Data loading..</div>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              mb: 8
            }}
          >
            <Typography variant="h4">
              Course Enrollment
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell align="right">Completed Users</TableCell>
                      <TableCell align="right">Total Users</TableCell>
                      <TableCell align="right">Recently Completed</TableCell>
                      <TableCell align="right">Recently Enrolled</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enrollmentData?.map(function (course) {
                      return (
                        <TableRow
                          key={course.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{course.course_name}</TableCell>
                          <TableCell align="right">{course.total_complete}</TableCell>
                          <TableCell align="right">{course.total_enrolled}</TableCell>
                          <TableCell align="right">{course.recently_completed}</TableCell>
                          <TableCell align="right">{course.recently_enrolled}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )
      }
    </div >
  );
};