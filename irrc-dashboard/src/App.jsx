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


export default function App() {

  const theme = createTheme(getDesignTokens('light')); //optional: add light and dark mode

  const [selectedCourses, setSelectedCourses] = React.useState([])

  const handleCourseSelect = (course) => {
    if (course && !selectedCourses.some(c => c.key === course.key)) {
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
    <CourseSpecificReport key={course.key} course={course} courseUnselect={handleCourseUnselect}/>
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
        <CummulativeReport />
      </Box>
      <Box
        sx={{
          mt: 0, 
          mb: 16,
          ml: 16,
          mr: 16
        }}
      >
        <AutocompleteSelector onSelect={handleCourseSelect} selectedCourses={selectedCourses}/>
        {selectedCourses !== null ? courseComponents : <></>}
      </Box>
      <Footer />
    </Box>
  </ThemeProvider>
  );
}
