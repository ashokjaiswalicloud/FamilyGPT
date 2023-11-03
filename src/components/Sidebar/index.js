import * as React from "react";

import { Layout, Text, Menu, Navigation, ColorToggle } from "@/components";

export default function Sidebar({ expanded }) {
  return (
    <Layout.SideNav>
      <Navigation isExpanded={expanded} />
    </Layout.SideNav>
  );
}
