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
  Paper,
  Typography
} from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import Header from './layout/Header.jsx'
import axios from 'axios';
import { useQuery } from 'react-query';
import CSVButton from './mui-components/CSVDownloadButton.jsx'

const retrieveData = async (id) => {
  const response = await axios.get(`http://localhost:5000/api/course-specific/getCourseData?param=${id}`);
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
  const feedbackUserTypeData = resultData?.feedbackUserTypeData;
  const gradeLevelLabels = resultData?.gradeLevelLabels;
  const feedbackGradeLevelData = resultData?.feedbackGradeLevelData;
  const Q1_OverallFeedback = resultData?.Q1_OverallFeedback;
  const Q2_Applicable = resultData?.Q2_Applicable;
  const Q3_EngagingAppropriate = resultData?.Q3_EngagingAppropriate;
  const Q4_Navigate = resultData?.Q4_Navigate;
  const Q5_Technology = resultData?.Q5_Technology;
  const qualitativeFeedbackLikes = resultData?.qualitativeFeedbackLikes;
  const qualitativeFeedbackImprovements = resultData?.qualitativeFeedbackImprovements;

  const feedbackSurveys = [
    {
      label: "Overall, how satisfied or dissatisfied are you with this learning module?",
      data: Q1_OverallFeedback
    },
    {
      label: "How applicable was the content?",
      data: Q2_Applicable
    },
    {
      label: "The course material was engaging and appropriate for the topic.",
      data: Q3_EngagingAppropriate
    },
    {
      label: "How easy was it to navigate this learning module?",
      data: Q4_Navigate
    },
    {
      label: "How often did you encounter issues related to the learning module technology?",
      data: Q5_Technology
    }
  ]

  console.log(feedbackGradeLevelData)

  return (
    <>
      {course &&
        <Box
          sx={{
            flexGrow: 1,
            mb: 8,
            display: 'flex', // Enable Flexbox
            flexDirection: 'column', // Stack items vertically
            alignItems: 'center', // Center items horizontally
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

          <Box>
            <Typography variant="h3" gutterBottom>
              User Types
            </Typography>
            <PieChart
              series={[
                {
                  data: feedbackUserTypeData,
                },
              ]}
              margin={{ top: 50, bottom: 50, left: 0, right: 1000 }}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'middle' },
                  padding: 0,
                  labelStyle: {
                    fontSize: 14
                  },
                  itemMarkWidth: 11,
                  itemMarkHeight: 10,
                },
              }}
              width={1200}
              height={300}
            />
          </Box>

          <Box>
            <Typography variant="h3" gutterBottom>
              Grade Levels Worked With
            </Typography>
            {feedbackGradeLevelData &&
              <BarChart
                width={1200}
                height={300}
                series={[
                  { data: feedbackGradeLevelData, id: "gradeLevel" }
                ]}
                xAxis={[{ data: gradeLevelLabels, scaleType: 'band' }]}
              />}
          </Box>

          {feedbackSurveys.map((survey, index) => (
            <Box key={index}>
              <Typography variant="h3" gutterBottom>
                {survey.label}
              </Typography>
              <PieChart
                series={[
                  {
                    data: survey.data,
                  },
                ]}
                margin={{ top: 50, bottom: 50, left: 0, right: 1000 }}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'middle', horizontal: 'middle' },
                    padding: 0,
                    labelStyle: {
                      fontSize: 14
                    },
                    itemMarkWidth: 11,
                    itemMarkHeight: 10,
                  },
                }}
                width={1200}
                height={300}
              />
            </Box>
          ))}

          < CSVButton jsonData={qualitativeFeedbackLikes} />
          < CSVButton jsonData={qualitativeFeedbackImprovements} />

          <Button variant="contained" onClick={() => courseUnselect(course.id)} sx={{ mt: 2, float: "right" }}>Close Data</Button>
        </Box>
      }
    </>
  );
}