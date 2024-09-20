import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = ({ title }) => {
  return (
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
      <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>

    </Box>
  );
};

export default Header;