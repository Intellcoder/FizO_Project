import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProgressCircle = ({
  size = "40",
  progress = 0.75,
  trackColor = "#1f2a40",
  progressColor = "#6870fa",
  holeColor = "#4cceac",
}) => {
  const angle = progress * 360;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <Box
        sx={{
          background: `radial-gradient(${trackColor} 55% ,transparent 56%),
        conic-gradient(transparent 0deg ${angle}deg,${progressColor} ${angle}deg 360deg),${holeColor}`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          color: "black",
          fontWeight: "bold",
          fontSize: Number(size) * 0.18,
        }}
      >
        {"6 Hours"}
      </Typography>
    </Box>
  );
};

export default ProgressCircle;
