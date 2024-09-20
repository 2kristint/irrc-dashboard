import React, { useState } from 'react';
import { Autocomplete, Button, Box, TextField } from '@mui/material';

const Selector = ({ onSelect, selectedCourses, data }) => {

  const [value, setValue] = useState(null);

  const submitButton = () => {
    onSelect(value);
    setValue(null);
  };

  return (
    <Box
      sx={{ display: 'flex'}}
    >
      <Autocomplete
        options={data.courseNames.filter(course => !selectedCourses.includes(course))}
        getOptionLabel={(option) => option.fullname}
        style={{ width: 300 }}
        value={value} 
        onChange={(event, newValue) => {
          setValue(newValue); 
        }}
        isOptionEqualToValue={(option, value) => option.key === value.key} 
        renderInput={(params) => <TextField {...params} label="Select a course" variant="outlined" />}
        filterSelectedOptions
      />
      <Button variant="contained" onClick={submitButton} sx={{ ml: 2}} >Submit</Button>
    </Box>
  );
};

export default Selector;
