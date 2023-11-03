import { useState, useEffect } from "react";
import {
  Box,
  Sheet,
  Select,
  Option,
  Typography,
  Stack,
  ListItemButton,
  List,
  ListItem,
  ListItemDecorator,
  Chip,
  ListSubheader,
  Divider,
  IconButton,
  CardContent,
  Card,
  CircularProgress,
  Avatar,
  Badge,
  badgeClasses,
  Button,
  Input,
} from "@mui/joy";

import {
  GavelIcon,
  PieChart,
  SmsIcon,
  PersonIcon,
  BubbleChartIcon,
  MoreVertIcon,
  AddIcon,
  SettingsIcon,
  SettingsOutlinedIcon,
  CampaignIcon,
} from "@/icons";

import {
  MenuIcon,
  AddOutlinedIcon,
  QuestionAnswerOutlinedIcon,
  BorderColorIcon,
  DeleteIcon,
  AssessmentIcon,
  ChatBubbleOutlineOutlinedIcon,
  SettingsSuggestIcon,
  SpeedIcon,
  RestoreFromTrashIcon,
  LightModeIcon,
  NightlightIcon,
  LogoutIcon,
  CrisisAlertOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  BorderColorOutlinedIcon,
  SaveOutlinedIcon,
  SearchOutlinedIcon,
  CommentOutlinedIcon,
  GridViewRoundedIcon,
} from "@/icons";

import { Text } from "@/components";
import * as React from "react";
import ListItemContent from "@mui/joy/ListItemContent";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function Navigation({ isExpanded }) {
  const handleSearchChange = (event) => {};
  if (!isExpanded) {
    return (
      <Sheet
        // variant="glass"
        // color="glass"
        // invertedColors
        sx={{
          // bgcolor: "background.bodyBg",
          width: "100%",
          height: "100%",
          border: "red",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e0e0e0",
          gap: 0.5,
          mt: 1,
          transition: "all 0.5s ease",
        }}
      >
        <Input
          sx={{
            // width: "100%",
            m: "10px",
          }}
          placeholder="Search receipt..."
          // value={searchText}
          onChange={handleSearchChange}
          // variant="outlined"
          endDecorator={<SearchOutlinedIcon variant="outlined" />}
        />

        <Divider sx={{ mt: "auto", mb: 1, mx: 0 }} />
        <List
          sx={{
            "--List-item-radius": "8px",
            "--List-gap": "4px",
            flexGrow: 0,
            // minWidth: 256,
          }}
        >
          {/* <ListItem nested>
            <ListSubheader>Settings</ListSubheader>
            <List>
              <ListItemButton>Tasks</ListItemButton>
              <ListItemButton>Reports</ListItemButton>
              <ListItemButton>Settings</ListItemButton>
            </List>
          </ListItem> */}

          <ListItemButton>
            <ListItemDecorator>
              <PieChart />
            </ListItemDecorator>
            Dashboard
          </ListItemButton>
          <ListItemButton selected variant="soft">
            <ListItemDecorator>
              <CampaignIcon />
            </ListItemDecorator>
            Announcement
          </ListItemButton>
          <ListItemButton>
            <ListItemDecorator>
              <SmsIcon />
            </ListItemDecorator>
            Chat
            <Chip size="sm" color="danger" sx={{ ml: "auto" }}>
              5
            </Chip>
          </ListItemButton>
          <ListItemButton>
            <ListItemDecorator>
              <PersonIcon />
            </ListItemDecorator>
            Team
          </ListItemButton>
        </List>
      </Sheet>
    );
  }
  return (
    <Sheet
      // variant="glass"
      // color="glass"
      invertedColors
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        border: "red",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e0e0e0",
        gap: 0.5,
        mt: 1,
        transition: "all 0.5s ease",
        // bgcolor: "background.bodyBg",
      })}
    >
      <IconButton
        sx={{
          mx: "auto",
        }}
        size="sm"
        variant="outlined"
        color="primary"
        onClick={() => alert("sds")}
      >
        <AddOutlinedIcon />
      </IconButton>
      <IconButton
        size="sm"
        variant="outlined"
        color="primary"
        aria-label="Apps"
        sx={{
          mx: "auto",
          mt: 1,
        }}
      >
        <SearchOutlinedIcon />
      </IconButton>

      <Divider sx={{ mt: "auto", mb: 2 }} />
      <Sheet
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          size="sm"
          variant="outlined"
          color="primary"
          aria-label="Apps"
          sx={{
            mx: "auto",
            mb: 3,
          }}
        >
          <SettingsOutlinedIcon />
        </IconButton>
      </Sheet>
    </Sheet>
  );
}
