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

//font sizes
const normal_text = 24;

export default function Footer() {
  return (
    <Paper elevation={0} component="footer" sx={{ position: "relative" }}>
      <Divider sx={{ p: 1, backgroundColor: "primary.main" }} />
      <Box
        sx={{
          bgcolor: "#000000",
          p: 2,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            ml: 0,
            pl: { xs: 2, md: 4, xl: 8 },
            pb: 2,
          }}
        >
          <Grid
            container
            spacing={8}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Grid item xs={12} md={6}>
              <Box className="logo--footer" sx={{ width: 400 }}>
                <img src={logo} alt="IRRC Logo" width={"100%"} />
              </Box>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography
                    className="company--name"
                    variant="h4"
                    sx={{
                      color: "#fff",
                    }}
                  >
                    IOWA READING RESEARCH CENTER
                  </Typography>
                  <Typography
                    className="company--address"
                    variant="h4"
                    sx={{ color: "#ccc" }}
                  >
                    300{" "}
                    <Link
                      variant="h4"
                      href="https://www.facilities.uiowa.edu/building/0454"
                      sx={{ color: "primary.main" }}
                    >
                      Blank Honors Center
                    </Link>
                  </Typography>
                  <Typography
                    variant="h4"
                    className="company--address"
                    sx={{ color: "#ccc" }}
                  >
                    Iowa City, IA 52245
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    className="copyright"
                    sx={{ color: "#fff", fontSize: 20 }}
                  >
                    © {year} Iowa Reading Research Center
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h4" sx={{ color: "#fff", pb: 1 }}>
                  Quick Links
                </Typography>
                {links.map((item) => (
                  <Box
                    key={item.link}
                    sx={{ display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <LinkIcon variant="links" sx={{ color: "white" }} />
                    <Link
                      href={item.link}
                      variant="links"
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
                <Divider
                  orientation="vertical"
                  sx={{ backgroundColor: "#ffffff" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Paper>
  );
}
