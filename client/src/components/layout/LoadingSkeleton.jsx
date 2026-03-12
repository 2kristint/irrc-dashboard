import {
  Skeleton,
  Box,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Skeleton variant="text" width="40%" height={80} />
      </Box>

      {/* Skeleton for "User Demographics" Title */}
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />

      {/* Skeleton for Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "black" }}>
              <TableCell>
                <Skeleton
                  variant="text"
                  width="50%"
                  sx={{ bgcolor: "grey.800" }}
                />
              </TableCell>
              <TableCell align="right">
                <Skeleton
                  variant="text"
                  width="30%"
                  sx={{ bgcolor: "grey.800", ml: "auto" }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Create 10 fake rows */}
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="rectangular" width="80%" height={20} />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="rectangular"
                    width="20%"
                    height={20}
                    sx={{ ml: "auto" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DashboardSkeleton;
