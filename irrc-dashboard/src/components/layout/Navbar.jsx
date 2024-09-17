import React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';

import logo from '~/assets/irrc.svg';

const Navbar = () => {
  return (
    <AppBar 
      position="absolute" 
      color="secondary" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '8'
      }}
    >
      <Toolbar disableGutters sx={{ paddingX: { xs: 1, md: 2 } }}>
        <Box display="flex" sx={{ height: '100%' }}>
          <img src={logo} alt="IRRC Logo" width={200} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;