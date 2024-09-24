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
import useFetch from './useFetch.jsx'; // Adjust the path as necessary


export default function App() {

  const { data, loading, error } = useFetch('http://localhost:5000/api/data');
  const [selectedCourses, setSelectedCourses] = React.useState([]);

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <CourseSpecificReport key={course.id} course={course} courseUnselect={handleCourseUnselect} data={data}/>
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
        {!loading && <CummulativeReport key={1} data={data}/>}
      </Box>
      <Box
        sx={{
          mt: 0, 
          mb: 16,
          ml: 16,
          mr: 16
        }}
      >
        {!loading && <AutocompleteSelector onSelect={handleCourseSelect} selectedCourses={selectedCourses} data={data}/>}
        {selectedCourses !== null ? courseComponents : <></>}
      </Box>
      <Footer />
    </Box>
  </ThemeProvider>
  );
}
