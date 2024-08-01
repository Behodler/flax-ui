import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { styled } from "@mui/material/styles"; // Update to use from @mui/material/styles

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: "14px",
  padding: "0px",
  width: "400px",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  border: "none",
  borderRadius: "10px !important",
  margin: "4px",
  lineHeight: "20px",
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 500,
  color: "#808080", // Grey text color for unselected buttons
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.active,
    fontWeight: 600,
    color: "#fff", // White text color for selected buttons
    "&:hover": {
      backgroundColor: theme.palette.action.active, // No hover effect for selected buttons
    },
  },
  "&:hover": {
    color: "#fff", // White text color on hover for unselected buttons
    backgroundColor: "transparent", // No background color change on hover
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "400px",
  height: "50px",
  backgroundColor: "#1D2833",
  borderRadius: "24px",
  padding: "0px 10px",
  marginTop: "20px",
}));

const Image = styled("img")({
  height: "50px",
  borderRadius: "50%",
});

const Bar = styled(Box)({
  flex: 1,
  height: "30px",
  display: "flex",
  margin: "0 10px",
});

const BarLeft = styled(Box)<{ color: string; width: string }>(({ color, width }) => ({
  width: width,
  backgroundColor: color,
  borderRadius: "24px 0 0 24px",
}));

const BarRight = styled(Box)<{ color: string; width: string }>(({ color, width }) => ({
  width: width,
  backgroundColor: color,
  borderRadius: "0 24px 24px 0",
}));

export { StyledToggleButtonGroup, StyledToggleButton, ImageBox, Image, Bar, BarLeft, BarRight };
