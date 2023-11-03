import { useColorScheme } from "@mui/joy/styles";
import { IconButton } from "@mui/joy";
import { useState, useEffect } from "react";
import {
  DarkModeRoundedIcon,
  LightModeRoundedIcon,
  MenuRoundedIcon,
  MenuOpenRoundedIcon,
} from "@/icons";

export default function MenuToggle({ onMenuClick }) {
  const [isOpen, SetIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuClick = () => {
    SetIsOpen(!isOpen);
    console.log("MenuToggle: handleMenuClick", isOpen);
    onMenuClick();
  };

  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <IconButton
      size="sm"
      variant="outlined"
      color="primary"
      onClick={handleMenuClick}
    >
      {!isOpen ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
    </IconButton>
  );
}
