import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ScalableProps {
  scale: number;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: "14px",
  padding: "1px",
  width: "400px",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,

  borderRadius: "12px !important",
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

const ImageBox = styled(Box)<{ scale: number }>(({ scale }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: `${20 * scale}px`,
  height: `${5 * scale}px`,
  backgroundColor: "#1D2833",
  borderRadius: `${2.4 * scale}px`,
  padding: `${0 * scale}px ${1 * scale}px`,
  marginTop: `${2 * scale}px`,
}));

const Image = styled("img")<{ scale: number }>(({ scale }) => ({
  height: `${5 * scale}px`,
  borderRadius: "50%",
}));

const Bar = styled(Box)<{ scale: number }>(({ scale }) => ({
  flex: 1,
  height: `${3 * scale}px`,
  display: "flex",
  margin: `0 ${scale}px`,
}));

const BarLeft = styled(Box)<{ color: string; width: string, scale: number }>(({ color, width, scale }) => ({
  width: width,
  backgroundColor: color,
  borderRadius: `${scale}px 0 0 ${scale}px`,
}));

const BarRight = styled(Box)<{ color: string; width: string, scale: number }>(({ color, width, scale }) => ({
  width: width,
  backgroundColor: color,
  borderRadius: `0 ${scale}px ${scale}px 0`,
}));

export { StyledToggleButtonGroup, StyledToggleButton, ImageBox, Image, Bar, BarLeft, BarRight };
