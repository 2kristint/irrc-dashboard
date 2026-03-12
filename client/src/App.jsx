import * as React from "react";
import {
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Typography,
} from "@mui/material";
import { getDesignTokens } from "./styles";
import CummulativeReport from "./components/CummulativeReport.jsx";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import CourseSpecificReport from "./components/CourseSpecificReport.jsx";
import AutocompleteSelector from "./components/mui-components/AutocompleteSelector.jsx";
import axios from "axios";
import { useQuery } from "react-query";
import dayjs from "dayjs";

const retrieveCummulativeData = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/cummulative-data/data",
  );
  return response.data;
};

const retrieveEnrollmentData = async (to, from) => {
  const response = await axios.get(
    `http://localhost:5000/api/enrollment-data/enrollmentdata?to=${to}&from=${from}`,
  );
  return response.data;
};

export default function App() {
  const [from, setFrom] = React.useState("2023/01/01");
  const [to, setTo] = React.useState("2023/12/31");
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  const {
    data: data,
    error,
    isLoading,
  } = useQuery("data", retrieveCummulativeData, {
    cacheTime: 10000,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const {
    data: enrollmentData,
    isLoading: enrollmentLoading,
    refetch,
  } = useQuery(["data", from, to], () => retrieveEnrollmentData(to, from), {
    enabled: true,
  });

  function callCourseEnrollmentQuery(newFrom, newTo) {
    const formattedFrom = dayjs(newFrom).format("YYYY/MM/DD");
    const formattedTo = dayjs(newTo).format("YYYY/MM/DD");

    setFrom(formattedFrom);
    setTo(formattedTo);

    refetch();
  }

  if (isLoading) return <div>Fetching information...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const theme = createTheme(getDesignTokens("light")); //optional: add light and dark mode

  const handleCourseSelect = (course) => {
    if (course && !selectedCourses.some((c) => c.id === course.id)) {
      setSelectedCourses((prevState) => [...prevState, course]);
    }
  };

  function handleCourseUnselect(id) {
    setSelectedCourses((prevCourses) => {
      return prevCourses.filter((course) => course.id !== id);
    });
  }

  //display courses
  const courseComponents = selectedCourses.map((course) => (
    <CourseSpecificReport
      key={course.id}
      id={course.id}
      course={course}
      courseUnselect={handleCourseUnselect}
      data={data}
    />
  ));

  // console.log(enrollmentData);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            mt: 16,
            mb: 0,
            ml: "auto",
            mr: "auto",
          }}
        >
          <Typography variant="h1">Moodle Analytics Dashboard</Typography>
        </Box>
        <Box
          sx={{
            mt: 4,
            ml: { xs: 2, md: 4, xl: 8 },
            mr: { xs: 2, md: 4, xl: 8 },
          }}
        >
          {!isLoading && (
            <CummulativeReport
              data={data}
              callCourseEnrollmentQuery={() =>
                callCourseEnrollmentQuery(from, to)
              }
              enrollmentData={enrollmentData}
              from={dayjs(from)}
              to={dayjs(to)}
              setFrom={setFrom}
              setTo={setTo}
              enrollmentLoading={enrollmentLoading}
            />
          )}
        </Box>

        <Box
          sx={{
            mt: 4,
            mb: 8,
            ml: { xs: 2, md: 4, xl: 8 },
            mr: { xs: 2, md: 4, xl: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
            }}
          >
            <Typography variant="normaltext" sx={{ mb: 1 }}>
              See information for specific courses.
            </Typography>
          </Box>
          {!isLoading && (
            <AutocompleteSelector
              onSelect={handleCourseSelect}
              selectedCourses={selectedCourses}
              data={data}
            />
          )}
          {selectedCourses !== null ? courseComponents : <></>}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
