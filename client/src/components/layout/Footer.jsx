import { Launch as LinkIcon } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import logo from "~/assets/irrc-reverse.svg";

const links = [
  { name: "About Us", link: "https://iowareadingresearch.org/about" },
  {
    name: "Technical Support",
    link: "https://support.irrc-tools.org/support/open.php",
  },
];

const today = new Date();
const year = today.getFullYear();

export default function Footer() {
  return (
    <Paper
      elevation={0}
      component="footer"
      sx={{ position: "sticky", top: "100vh" }}
    >
      <Divider sx={{ p: 0.5, backgroundColor: "secondary.main" }} />
      <Box
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "primary.main",
          p: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid spacing={{ xs: 1, sm: 2 }} container justifyContent="center">
            {/* logo */}
            <Grid item xs={12} md={6}>
              <img src={logo} alt="IRRC Logo" width={250} />
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="button" sx={{ color: "white" }}>
                    Iowa Reading Research Center
                  </Typography>
                  <Typography sx={{ color: "#ccc" }}>
                    300{" "}
                    <Link
                      target="_blank"
                      href="https://www.facilities.uiowa.edu/building/0454"
                      sx={{ color: "secondary.main" }}
                    >
                      Blank Honors Center
                    </Link>
                  </Typography>
                  <Typography sx={{ color: "#ccc" }}>
                    Iowa City, IA 52245
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "white" }} variant="caption">
                    © {year} Iowa Reading Research Center
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            {/* logo */}

            {/* links */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ color: grey[300], mb: 2 }}
                >
                  Quick Links
                </Typography>
                {links.map((item) => (
                  <Box
                    key={item.link}
                    sx={{ display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <LinkIcon sx={{ color: "white", fontSize: 16 }} />
                    <Link
                      target="_blank"
                      href={item.link}
                      sx={{ color: "secondary.main" }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
                <Divider
                  orientation="vertical"
                  sx={{ backgroundColor: grey[300] }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Paper>
  );
}
