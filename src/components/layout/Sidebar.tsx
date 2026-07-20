"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { usePathname } from "@/i18n/routing";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarCompany } from "@/components/layout/SidebarCompany";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BriefcaseIcon,
  HeadsetIcon,
  CreditCardIcon,
  Settings2Icon,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  const navMain = [
    {
      title: t("operations"),
      url: "#",
      icon: <BriefcaseIcon />,
      isActive: [
        "/requests",
        "/technicians",
        "/clients",
        "/approvals",
        "/categories",
      ].some((url) => pathname.startsWith(url)),
      items: [
        {
          title: t("requests"),
          url: "/requests",
        },
        {
          title: t("technicians"),
          url: "/technicians",
        },
        {
          title: t("clients"),
          url: "/clients",
        },
        {
          title: t("approvals"),
          url: "/approvals",
        },
        {
          title: t("categories"),
          url: "/categories",
        },
      ],
    },
    {
      title: t("support_and_moderation"),
      url: "#",
      icon: <HeadsetIcon />,
      isActive: ["/support", "/moderation"].some((url) =>
        pathname.startsWith(url)
      ),
      items: [
        {
          title: t("technical_support"),
          url: "/support",
        },
        {
          title: t("chat_moderation"),
          url: "/moderation",
        },
      ],
    },
    {
      title: t("finance"),
      url: "#",
      icon: <CreditCardIcon />,
      isActive: ["/payments", "/accounting"].some((url) =>
        pathname.startsWith(url)
      ),
      items: [
        {
          title: t("payments"),
          url: "/payments",
        },
        {
          title: t("accounting"),
          url: "/accounting",
        },
      ],
    },
    {
      title: t("system"),
      url: "#",
      icon: <Settings2Icon />,
      isActive: ["/analytics", "/admins", "/settings"].some((url) =>
        pathname.startsWith(url)
      ),
      items: [
        {
          title: t("analytics"),
          url: "/analytics",
        },
        {
          title: t("roles"),
          url: "/admins",
        },
        {
          title: t("settings"),
          url: "/settings",
        },
      ],
    },
  ];

  // TODO: Replace with actual session user data
  const user = {
    name: "Admin User",
    email: "admin@omnexa-technology.com",
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarCompany />
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={navMain} 
          collapseAllLabel={t("collapse_all")} 
          expandAllLabel={t("expand_all")}
          searchPlaceholder={t("search_routes")}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
