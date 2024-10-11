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

const retrieveData = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/data",
  );
  return response.data;
};

export default function App() {

  const {
    data: data,
    error,
    isLoading,
  } = useQuery("data", retrieveData);

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
