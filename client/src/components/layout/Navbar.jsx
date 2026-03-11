import React from "react";
import { AppBar, Box, Toolbar } from "@mui/material";

import logo from "~/assets/irrc.svg";

const Navbar = () => {
  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: "primary.main",
      }}
    >
      <Toolbar sx={{ pl: { xs: 2, md: 4, xl: 8 } }}>
        <Box display="flex" sx={{ width: 200, pt: 2, pb: 2 }}>
          <img src={logo} alt="IRRC Logo" width={"100%"} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
