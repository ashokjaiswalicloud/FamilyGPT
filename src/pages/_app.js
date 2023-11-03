import { useState, useEffect } from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { GlobalStyles } from "@mui/system";

import {
  Input,
  Box,
  Layout,
  Text,
  Menu,
  Navigation,
  ColorToggle,
  Header,
  Sidebar,
  SideNav,
} from "@/components";

// import "@/styles/globals.css";
// import { Sidebar, Header } from "@/components";
const theme = extendTheme({
  components: {
    JoyChip: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
      },
    },
    JoySheet: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "glass" && {
            color: theme.vars.palette.text.primary,
            background: "rgba(255, 255, 255, 1.0)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(0, 0, 0, 0.3)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.0)",
          }),
        }),
      },
    },
  },
});

import { Sheet } from "@mui/joy";
export default function App({ Component, pageProps }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleMenuClick = () => {
    setDrawerOpen((prevState) => !prevState);
  };
  return (
    <CssVarsProvider theme={theme}>
      <Sheet
        sx={
          {
            // background: "red",
          }
        }
      >
        <Layout.Root
          expanded={!drawerOpen}
          sx={{
            ...(drawerOpen && {
              height: "100vh",
              overflow: "hidden",
            }),
          }}
        >
          <Header onMenuClick={handleMenuClick} />

          <Sidebar expanded={drawerOpen} />
          <Layout.Main>
            <Component {...pageProps} />
          </Layout.Main>
        </Layout.Root>
      </Sheet>
    </CssVarsProvider>
  );
}
