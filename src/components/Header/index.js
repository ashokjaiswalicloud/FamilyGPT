import { useState } from "react";
import {
  Layout,
  Text,
  Menu,
  Navigation,
  ColorToggle,
  MenuToggle,
} from "@/components";
import Avatar from "@mui/joy/Avatar";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Chip from "@mui/joy/Chip";
import AddIcon from "@mui/icons-material/Add";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  SearchRoundedIcon,
  FindInPageRoundedIcon,
  DarkModeRoundedIcon,
  LightModeRoundedIcon,
  GridViewRoundedIcon,
  CloseIcon,
  EditOutlinedIcon,
  FolderOpenIcon,
  MenuIcon,
  MenuRoundedIcon,
  MenuOpenRoundedIcon,
} from "@/icons";

export default function Header({ onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Layout.Header>
      <MenuToggle onMenuClick={onMenuClick} />
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
        onClick={handleMenuClick}
      >
        <IconButton
          variant="outlined"
          size="lg"
          sx={{ display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="solid"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          <MenuIcon />
        </IconButton>
      </Box> */}
      {/* <Input
        size="sm"
        placeholder="Search anything..."
        startDecorator={<SearchRoundedIcon color="primary" />}
        endDecorator={
          <IconButton variant="outlined" size="sm" color="neutral">
            <Text fontWeight="lg" fontSize="sm" textColor="text.tertiary">
              /
            </Text>
          </IconButton>
        }
        sx={{
          flexBasis: "500px",
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
      /> */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          color="primary"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <SearchRoundedIcon />
        </IconButton>
        <Menu
          id="app-selector"
          control={
            <IconButton
              size="sm"
              variant="outlined"
              color="primary"
              aria-label="Apps"
            >
              <GridViewRoundedIcon />
            </IconButton>
          }
          menus={[
            {
              label: "Email",
              component: "a",
              href: "/joy-ui/templates/email/",
            },
            {
              label: "Team",
              component: "a",
              href: "/joy-ui/templates/team/",
            },
            { label: "Files", active: true },
          ]}
        />
        <ColorToggle />
      </Box>
    </Layout.Header>
  );
}
