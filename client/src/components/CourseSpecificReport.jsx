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
  Typography,
  Grid
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

  const enrollmentData = resultData?.enrollmentCompletedData;
  const feedbackUserTypeData = resultData?.feedbackUserTypeData;
  const gradeLevelLabels = resultData?.gradeLevelLabels;
  const feedbackGradeLevelData = resultData?.feedbackGradeLevelData;
  const feedbackSurveys = resultData?.feedbackSurveys;
  const qualitativeFeedbackLikes = resultData?.qualitativeFeedbackLikes;
  const qualitativeFeedbackImprovements = resultData?.qualitativeFeedbackImprovements;


  return (
    <>
      {course &&
        <Box
          sx={{
            flexGrow: 1,
            mt: 6,
            mb: 8,
            display: 'flex', // Enable Flexbox
            flexDirection: 'column', // Stack items vertically
            alignItems: 'center', // Center items horizontally
          }}
        >
          <Typography variant="h3" marginRight="auto">
            {course.fullname}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              alignItems: 'center',
              justifyContent: {
                xs: 'flex-start',
                md: 'space-between',
              },
              mt: 2,
              mb: 1
            }}
          >
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4} key={0}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Enrollment Data
                </Typography>
                <PieChart
                  series={[{
                    data: enrollmentData,
                    cx: "25%",
                    cy: "50%",
                  }]}
                  margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'middle' },
                      padding: 0,
                      margin: 0,
                      labelStyle: {
                        fontSize: 11,
                        width: '100px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        height: 'auto'
                      },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                    },
                  }}
                  width={500}
                  height={250}
                />
              </Box>
            </Grid>
            <Grid item xs={8} key={1}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  User Types
                </Typography>
                <PieChart
                  series={[{
                    data: feedbackUserTypeData,
                    cx: "20%",
                    cy: "50%",
                  }]}
                  margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'middle' },
                      padding: 0,
                      margin: 0,
                      labelStyle: {
                        fontSize: 11,
                      },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                    },
                  }}
                  width={900}
                  height={250}
                />
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h4" gutterBottom>
              Grade Levels Worked With
            </Typography>
            {feedbackGradeLevelData &&
              <BarChart
                width={1200}
                height={250}
                series={[
                  { data: feedbackGradeLevelData, id: "gradeLevel" }
                ]}
                xAxis={[{ data: gradeLevelLabels, scaleType: 'band' }]}
              />}
          </Box>


          <Typography variant="h4" gutterBottom marginRight="auto">
            Feedback Surveys
          </Typography>
          {/*Surveys*/}
          <Grid container spacing={2}>
            {feedbackSurveys.map((survey, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left'
                  }}>
                  <Typography variant="subtitle">
                    {survey.label}
                  </Typography>
                  <PieChart
                    series={[{
                      data: survey.data,
                      cx: "15%",
                      cy: "50%",
                    }]}
                    margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    slotProps={{
                      legend: {
                        direction: 'column',
                        position: { vertical: 'middle', horizontal: 'middle' },
                        padding: 0,
                        margin: 0,
                        labelStyle: {
                          fontSize: 11,
                          width: '100px',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          height: 'auto'
                        },
                        itemMarkWidth: 10,
                        itemMarkHeight: 10,
                      },
                    }}
                    width={500}
                    height={200}
                  />
                </Box>
              </Grid>
            ))}
            <Grid item xs={4}> {/* Same size as pie charts */}
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <Box
                  sx={{
                    margin: 2
                  }}>
                  <CSVButton jsonData={qualitativeFeedbackLikes} />
                </Box>
                <Box
                  sx={{
                    margin: 2
                  }}>
                  <CSVButton jsonData={qualitativeFeedbackImprovements} />
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* < CSVButton jsonData={qualitativeFeedbackLikes} />
          < CSVButton jsonData={qualitativeFeedbackImprovements} /> */}

          <Button variant="contained" onClick={() => courseUnselect(course.id)} sx={{ mt: 2, marginLeft: "auto" }}>Close Data</Button>
        </Box>
      }
    </>
  );
}