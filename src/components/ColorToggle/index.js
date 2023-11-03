import { useColorScheme } from "@mui/joy/styles";
import { IconButton } from "@mui/joy";
import { useState, useEffect } from "react";
import { DarkModeRoundedIcon, LightModeRoundedIcon ,  MenuRoundedIcon,
  MenuOpenRoundedIcon,
} from "@/icons";

export default function ColorToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <IconButton
      size="sm"
      variant="outlined"
      color="primary"
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}
