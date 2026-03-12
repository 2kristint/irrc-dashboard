import * as React from "react";
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
  Grid,
} from "@mui/material";
import { PieChart, BarChart } from "@mui/x-charts";
import Header from "./layout/Header.jsx";
import axios from "axios";
import { useQuery } from "react-query";
import CSVButton from "./mui-components/CSVDownloadButton.jsx";

const retrieveData = async (id) => {
  const response = await axios.get(
    `http://localhost:5000/api/course-specific/getCourseData?param=${id}`,
  );
  return response.data;
};

export default function CourseSpecificReport({ course, courseUnselect, id }) {
  const {
    data: resultData,
    error,
    isLoading,
  } = useQuery(["data", id], () => retrieveData(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const enrollmentData = resultData?.enrollmentCompletedData;
  const feedbackUserTypeData = resultData?.feedbackUserTypeData;
  const gradeLevelLabels = resultData?.gradeLevelLabels;
  const feedbackGradeLevelData = resultData?.feedbackGradeLevelData;
  const feedbackSurveys = resultData?.feedbackSurveys;
  const qualitativeFeedbackLikes = resultData?.qualitativeFeedbackLikes;
  const qualitativeFeedbackImprovements =
    resultData?.qualitativeFeedbackImprovements;

  console.log(feedbackUserTypeData);

  // clean labels in survey data to remove '#' and '>'
  // const clean = (s) => (s ?? "").toString().replace(/[>#]/g, "").trim();

  const clean = (s) => {
    let str = (s ?? "").toString();

    let cleaned = str
      .replace(/(\d)[#]/g, "") // clean up number ratings
      .replace(/[>#]/g, "") // Remove remaining > and #
      .replace(/^r\s*/, "") // Remove the "r" prefix found in your data
      .trim();

    return formatWrappedLabel(cleaned);
  };

  const formatWrappedLabel = (value) => {
    // Example: Breaks text every 15 characters at the nearest space
    return value.replace(/(.{1,26})( +|$\n?)/g, "$1\n");
  };

  const cleanData = (arr) =>
    (arr || [])
      .filter((item) => !item.label?.includes("Choice")) // Remove junk rows
      .map((item) => ({
        ...item,
        label: clean(item.label),
      }));

  const cleanedFeedbackUserTypeData = cleanData(feedbackUserTypeData).sort(
    (a, b) => b.value - a.value,
  );

  const cleanedgradeLevelLabels = gradeLevelLabels.map((str) =>
    str.replace(/^[a-z]>>>>>/, "").trim(),
  );

  const addPercentages = (arr) => {
    const dataArray = arr || [];
    const currentTotal = dataArray.reduce(
      (acc, item) => acc + (Number(item.value) || 0),
      0,
    );

    return dataArray
      .filter((item) => !item.label?.includes("Choice"))
      .map((item) => ({
        ...item,
        label: clean(item.label),
        value:
          currentTotal > 0
            ? parseFloat(((item.value / currentTotal) * 100).toFixed(1))
            : 0,
      }));
  };

  const cleanedSurveys = (feedbackSurveys || []).map((s) => ({
    ...s,
    data: addPercentages(s.data).sort((a, b) => b.value - a.value),
  }));

  return (
    <>
      {course && (
        <Box
          sx={{
            flexGrow: 1,
            mt: 6,
            mb: 8,
            display: "flex", // Enable Flexbox
            flexDirection: "column", // Stack items vertically
            alignItems: "center", // Center items horizontally
            gap: 2,
          }}
        >
          <Typography variant="h2" marginRight="auto">
            {course.fullname}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "background.dim",
                  height: { xs: 300, sm: 300, md: 400, lg: 400 },
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Enrollment Data
                </Typography>
                <PieChart
                  colors={[
                    "#00558C",
                    "#04a2a2",
                    "#00664F",
                    "#74b22d",
                    "#c17626",
                    "#c29f22",
                    "#BD472A",
                  ]}
                  series={[
                    {
                      data: enrollmentData,
                      cx: "30%",
                      cy: "50%",
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  height={220}
                  margin={{ top: 10, bottom: 10, left: 0, right: 10 }}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: {
                        vertical: "middle",
                        horizontal: "right",
                      },
                      labelStyle: {
                        fontSize: 14,
                        width: 150,
                      },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      hidden: false,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 1,
                  backgroundColor: "background.dim",
                  height: { xs: 500, sm: 500, md: 400, lg: 400 },
                }}
              >
                <Typography variant="h4" gutterBottom padding={2}>
                  User Types
                </Typography>
                <PieChart
                  colors={[
                    "#00558C",
                    "#04a2a2",
                    "#00664F",
                    "#74b22d",
                    "#c17626",
                    "#c29f22",
                    "#BD472A",
                  ]}
                  series={[
                    {
                      data: cleanedFeedbackUserTypeData,
                      cx: "30%",
                      cy: "50%",
                      outerRadius: 120,
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  height={440}
                  margin={{ top: 10, bottom: 10, left: 0, right: 10 }}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: {
                        vertical: "middle",
                        horizontal: "right",
                      },
                      labelStyle: {
                        fontSize: 14,
                        width: 150,
                      },
                      itemMarkWidth: 20,
                      itemMarkHeight: 20,
                      hidden: false,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              borderRadius: 1,
              backgroundColor: "background.dim",
              p: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Grade Levels Worked With
            </Typography>
            {feedbackGradeLevelData && (
              <Box>
                <BarChart
                  height={400}
                  series={[{ data: feedbackGradeLevelData, id: "gradeLevel" }]}
                  xAxis={[
                    {
                      data: cleanedgradeLevelLabels,
                      scaleType: "band",
                      valueFormatter: (value) => formatWrappedLabel(value),
                      tickLabelStyle: {
                        fontSize: 11,
                      },
                      colorMap: {
                        type: "ordinal",
                        values: cleanedgradeLevelLabels,
                        colors: [
                          "#00558C",
                          "#04a2a2",
                          "#00664F",
                          "#74b22d",
                          "#c17626",
                          "#c29f22",
                          "#BD472A",
                        ],
                      },
                    },
                  ]}
                  margin={{ bottom: 70 }}
                />
              </Box>
            )}
          </Box>

          <Typography variant="h4" gutterBottom marginRight="auto">
            Feedback Surveys
          </Typography>
          {/*Surveys*/}
          <Grid container spacing={2}>
            {cleanedSurveys.map((survey, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: "background.dim",
                    height: "100%",
                  }}
                >
                  <Typography variant="subtitle">{survey.label}</Typography>
                  <Box>
                    <PieChart
                      colors={[
                        "#56A0D2",
                        "#04B9B9",
                        "#58A77E",
                        "#74b22d",
                        "#c17626",
                        "#c29f22",
                        "#BD472A",
                      ]}
                      series={[
                        {
                          data: survey.data,
                          cx: "30%",
                          cy: "50%",
                          innerRadius: 30,
                          outerRadius: 80,
                          arcLabel: (item) => `${item.value}%`,
                          arcLabelMinAngle: 35,
                          arcLabelRadius: "50%",
                          highlightScope: { fade: "global", highlight: "item" },
                        },
                      ]}
                      height={300}
                      margin={{ top: 10, bottom: 10, left: 0, right: 10 }}
                      slotProps={{
                        legend: {
                          direction: "column",
                          position: {
                            vertical: "middle",
                            horizontal: "right",
                          },
                          labelStyle: {
                            fontSize: 14,
                            width: 150,
                          },
                          itemMarkWidth: 20,
                          itemMarkHeight: 20,
                          hidden: false,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} md={6} lg={4}>
              {/* Same size as pie charts */}
              <Box display="flex" flexDirection="column" alignItems="left">
                <Box>
                  <CSVButton jsonData={qualitativeFeedbackLikes} />
                </Box>
                <Box marginTop={2}>
                  <CSVButton jsonData={qualitativeFeedbackImprovements} />
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* < CSVButton jsonData={qualitativeFeedbackLikes} />
          < CSVButton jsonData={qualitativeFeedbackImprovements} /> */}

          <Button
            variant="contained"
            onClick={() => courseUnselect(course.id)}
            sx={{ marginLeft: "auto" }}
          >
            Close Data
          </Button>
        </Box>
      )}
    </>
  );
}
