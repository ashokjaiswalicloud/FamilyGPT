import * as React from "react";

import { Sheet, Stack, Box } from "@mui/joy";

const Root = (props) => {
  const { expanded } = props;
  const navWidth = expanded ? "265px" : "60px";
  console.log("expanded", expanded, navWidth);
  // const navWidth = "265px";
  return (
    <Stack
      {...props}
      sx={[
        {
          // bgcolor: "background.bodyBg",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            // sm: "minmax(64px, 200px) 1fr", // updated grid template columns
            sm: `minmax(${navWidth}, ${navWidth}) 1fr`,
            md: `minmax(${navWidth}, ${navWidth}) 1fr`,
            // md: `${
            //   props.isExpanded
            //     ? `minmax(${width}, ${width}) 1fr`
            //     : `minmax(${width}, 255px) 1fr`
            // }`, // updated grid template columns
          },
          gridTemplateRows: "64px 1fr",
          minHeight: "100vh",
          transition: "all 0.5s ease",
          left: 0,
          top: 0,
          right: 0,
          //   bottom: 24,
          // width: sxx?.width || "300px",
          position: "fixed",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

const Header = (props) => {
  return (
    <Sheet
      component="header"
      className="Header"
      {...props}
      sx={[
        {
          p: 2,
          gap: 2,
          // bgcolor: "background.bodyBg",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gridColumn: "1 / -1",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
};

const SideNav = (props) => (
  <Sheet
    component="nav"
    className="Navigation"
    {...props}
    sx={[
      {
        // p: 0.5,
        // bgcolor: "background.componentBg",
        // bgcolor: "background.bodyBg",
        // bgcolor: "red",
        // borderRight: "1px solid",
        // borderColor: "divider",
        display: {
          xs: "none",
          sm: "initial",
        },
      },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  />
);

const SidePane = (props) => (
  <Box
    className="Inbox"
    {...props}
    sx={[
      {
        // bgcolor: "background.bodyBg",

        borderRight: "1px solid",
        borderColor: "divider",
        display: {
          xs: "none",
          md: "initial",
        },
      },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  />
);

const Main = (props) => (
  <Sheet
    direction="column"
    component="main"
    className="Main"
    {...props}
    sx={[
      { p: 0, flexDirection: "column", overflow: "auto" },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  />
);

const SideDrawer = ({ onClose, ...props }) => (
  <Box
    {...props}
    sx={[
      { position: "fixed", zIndex: 1200, width: "100%", height: "100%" },
      ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
    ]}
  >
    <Box
      role="button"
      onClick={onClose}
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: (theme) =>
          `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
      }}
    />
    <Sheet
      sx={{
        top: 70,
        minWidth: 26,
        width: "max-content",
        height: "100%",
        p: 2,
        boxShadow: "lg",
        bgcolor: "background.componentBg",
      }}
    >
      {props.children}
    </Sheet>
  </Box>
);

export default {
  Root,
  Header,
  SideNav,
  SidePane,
  SideDrawer,
  Main,
};
