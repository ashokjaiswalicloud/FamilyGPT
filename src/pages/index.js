import { Typography, Box, Sheet } from "@mui/joy";

export default function App() {
  return (
    <Sheet
      sx={{
        background: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        mx: "50px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "height 0.5s ease-out",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              // background: "red",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                m: "20px",
              }}
            >
              <Typography level="h3">
                GonSave Surge Fee and Quest Incentive Admin Panel
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  ":hover": {
                    cursor: "pointer",
                    transform: "scale(1.2)",
                  },
                }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
}
