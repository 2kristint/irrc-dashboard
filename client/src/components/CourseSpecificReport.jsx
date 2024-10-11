import * as React from 'react';
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
import axios from 'axios';

export default function CourseSpecificReport({ course, courseUnselect, data }) {

  const [courseData, setCourseData] = React.useState({});
  const [DataList, setDataList] = React.useState({});

  React.useEffect(() => {
    const courseData = getEnrollmentData(course.fullname, data.enrollmentData)
    setCourseData(courseData)
    axios.get('http://localhost:5000/get1?param=2')
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function getEnrollmentData(courseName, data) {
    const courseData = data.find(obj => obj.course_name === courseName);
    return courseData;
  }

  return (
    <>
      {course &&
        <Box
          sx={{
            flexGrow: 1,
            mb: 8
          }}
        >
          <Header title={course.fullname} />

          {courseData && DataList && <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell align="right">Total Users</TableCell>
                  <TableCell align="right">Completed Users</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={courseData.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{courseData.course_name}</TableCell>
                  <TableCell align="right">{courseData.total_users}</TableCell>
                  <TableCell align="right">{courseData.completed_users}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          }
          <Button variant="contained" onClick={() => courseUnselect(course.id)} sx={{ mt: 2, float: "right" }}>Close Data</Button>
        </Box>
      }
    </>
  );
}