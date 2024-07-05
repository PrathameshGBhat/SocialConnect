import { Box } from "@mui/material";
import styled from "@emotion/styled";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  Padding: "1.5rem 1.5rem 0.7rem 1.5rem",
  backgroundColor: theme.Pelette.background.alt,
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;
