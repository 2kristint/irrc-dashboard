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
import { PieChart } from '@mui/x-charts';
import Header from './layout/Header.jsx'
import axios from 'axios';
import { useQuery } from 'react-query';

const retrieveData = async (id) => {
  const response = await axios.get(`http://localhost:5000/getCourseData?param=${id}`);
  return response.data;
};

export default function CourseSpecificReport({ course, courseUnselect, id }) {

  const {
    data: resultData,
    error,
    isLoading
  } = useQuery(["data", id], () => retrieveData(id))

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const enrollmentData = resultData?.enrollmentData[0];
  const feedbackData = resultData?.feedbackData;

  console.log(feedbackData)

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

          {enrollmentData && <TableContainer component={Paper}>
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
                  key={enrollmentData.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{enrollmentData.course_name}</TableCell>
                  <TableCell align="right">{enrollmentData.total_users}</TableCell>
                  <TableCell align="right">{enrollmentData.completed_users}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          }

          {feedbackData && <PieChart
            series={[
              {
                data: feedbackData
              },
            ]}
            width={400}
            height={200}
          />}

          <Button variant="contained" onClick={() => courseUnselect(course.id)} sx={{ mt: 2, float: "right" }}>Close Data</Button>
        </Box>
      }
    </>
  );
}