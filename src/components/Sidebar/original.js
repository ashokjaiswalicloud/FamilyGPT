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
} from "@/icons";
export default function Sidebar({ sxx }) {
  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        left: 24,
        top: 95,
        bottom: 24,
        width: sxx?.width || "300px",
        position: "fixed",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        zIndex: "1",
      }}
    >
      <Sheet
        variant="glass"
        color="glass"
        invertedColors
        sx={(theme) => ({
          p: 2,
          ml: -3,
          my: -3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          // background: "none",

          background: `linear-gradient(to top, ${theme.vars.palette.primary[700]}, ${theme.vars.palette.primary[600]} 25%, ${theme.vars.palette.primary[500]} 75%)`,
        })}
      >
        <Select
          variant="outlined"
          defaultValue="1"
          placeholder={
            <Box>
              <Typography level="inherit">Saleshouse</Typography>
              <Typography level="body2">general team</Typography>
            </Box>
          }
          startDecorator={
            <Sheet
              variant="solid"
              sx={{
                p: 0.75,
                borderRadius: "50%",
                lineHeight: 0,
                alignSelf: "center",
              }}
            >
              <GavelIcon sx={{ m: 1 }} />
            </Sheet>
          }
          sx={{ py: 1 }}
        >
          <Option value="1">General team</Option>
          <Option value="2">Engineering team</Option>
        </Select>
        <List
          sx={{
            "--List-item-radius": "8px",
            "--List-gap": "4px",
            flexGrow: 0,
            // minWidth: 256,
          }}
        >
          <ListItemButton>
            <ListItemDecorator>
              <PieChart />
            </ListItemDecorator>
            Dashboard
          </ListItemButton>
          <ListItemButton>
            <ListItemDecorator />
            Overview
          </ListItemButton>
          <ListItemButton selected variant="soft">
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
          <ListItem nested>
            <ListSubheader>Shortcuts</ListSubheader>
            <List>
              <ListItemButton>Tasks</ListItemButton>
              <ListItemButton>Reports</ListItemButton>
              <ListItemButton>Settings</ListItemButton>
            </List>
          </ListItem>
        </List>
        <Card variant="soft" orientation="horizontal" sx={{ mt: 1, mb: 2 }}>
          <CircularProgress value={35} determinate thickness={2} size="lg">
            35%
          </CircularProgress>
          <CardContent sx={{ ml: 2 }}>
            <Typography fontSize="sm">Last update: 22/12/22</Typography>
            <Chip
              size="sm"
              variant="outlined"
              sx={{ alignSelf: "flex-start", mt: 1 }}
            >
              Active
            </Chip>
          </CardContent>
        </Card>
        <Divider sx={{ mt: "auto", mb: 2, mx: -2 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar src="/icon.png" size="lg" />
          <Typography sx={{ flex: 1 }}>Jerry Wilson</Typography>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Sheet>
      {false && (
        <Sheet
          variant="soft"
          color="primary"
          invertedColors
          sx={(theme) => ({
            p: 2,
            mr: -3,
            my: -3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "& button": {
              borderRadius: "50%",
              padding: 0,
              "&:hover": {
                boxShadow: theme.shadow.md,
              },
            },
          })}
        >
          <Badge badgeContent="7">
            <IconButton>
              <Avatar src="/static/images/avatar/3.jpg" />
            </IconButton>
          </Badge>
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeInset="14%"
            sx={{ [`& .${badgeClasses.badge}`]: { bgcolor: "success.300" } }}
          >
            <IconButton>
              <Avatar src="/static/images/avatar/4.jpg" />
            </IconButton>
          </Badge>
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeInset="14%"
            sx={{ [`& .${badgeClasses.badge}`]: { bgcolor: "success.300" } }}
          >
            <IconButton>
              <Avatar src="/static/images/avatar/5.jpg" />
            </IconButton>
          </Badge>
          <IconButton variant="soft" aria-label="Add another chat">
            <AddIcon />
          </IconButton>
          <IconButton
            variant="outlined"
            aria-label="Add another chat"
            sx={{ mt: "auto" }}
          >
            <SettingsIcon />
          </IconButton>
        </Sheet>
      )}
    </Box>
  );
}
