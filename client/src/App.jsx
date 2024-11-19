import * as React from 'react';
import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline
} from "@mui/material";
import { getDesignTokens } from "./styles";
import CummulativeReport from './components/CummulativeReport.jsx'
import Footer from './components/layout/Footer.jsx'
import Navbar from './components/layout/Navbar.jsx'
import CourseSpecificReport from './components/CourseSpecificReport.jsx';
import AutocompleteSelector from './components/mui-components/AutocompleteSelector.jsx'
import axios from 'axios';
import { useQuery } from "react-query";

const retrieveCummulativeData = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/cummulative-data/data",
  );
  return response.data;
};

// const retrieveEnrollmentData = async (to, from) => {
//   const response = await axios.get(`http://localhost:5000/api/enrollment-data/enrollmentdata?param=${to, from}`);
//   return response.data;
// };

export default function App() {

  // const [from, setFrom] = React.useState(dayjs('2023-01-01'));
  // const [to, setTo] = React.useState(dayjs('2023-12-31'));

  const { data: data, error, isLoading } = useQuery("data", retrieveCummulativeData, {
    cacheTime: 10000,
    staleTime: 30000,
    refetchOnWindowFocus: true
  });

  //have two query calls, one for usertype and states and another for enrollment data
  //have default value for the times
  //create a method that can be passed into the prop to change the times from the inputs
  //when the inputs change, call the query again and update data
  // function callCourseEnrollmentQuery() {
  //   const fromValue = fromRef.current?.value || null;
  //   const toValue = toRef.current?.value || null;

  //   console.log("From:", fromValue);
  //   console.log("To:", toValue);

  //   const { data: enrollmentData, error: enrollmentError, isLoading: enrollmentIsLoading } = useQuery(["data", to, from], () => retrieveEnrollmentData(to, from));
  // }

  const [selectedCourses, setSelectedCourses] = React.useState([]);

  if (isLoading) return <div>Fetching information...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const theme = createTheme(getDesignTokens('light')); //optional: add light and dark mode

  const handleCourseSelect = (course) => {
    if (course && !selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses(prevState => [...prevState, course]);
    }
  }

  function handleCourseUnselect(id) {
    setSelectedCourses(prevCourses => {
      return prevCourses.filter(course => course.id !== id)
    })
  }

  //display courses
  const courseComponents = selectedCourses.map(course => (
    <CourseSpecificReport key={course.id} id={course.id} course={course} courseUnselect={handleCourseUnselect} data={data} />
  ));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <Box
          sx={{
            mt: 16,
            mb: 4,
            ml: 16,
            mr: 16
          }}
        >
          {!isLoading && <CummulativeReport key={1} data={data} />}
        </Box>
        <Box
          sx={{
            mt: 0,
            mb: 16,
            ml: 16,
            mr: 16
          }}
        >
          {!isLoading && <AutocompleteSelector onSelect={handleCourseSelect} selectedCourses={selectedCourses} data={data} />}
          {selectedCourses !== null ? courseComponents : <></>}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
