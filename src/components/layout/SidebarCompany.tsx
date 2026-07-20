"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarCompany() {
  const tCompany = useTranslations("Company")
  const tSidebar = useTranslations("Sidebar")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="pointer-events-none"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image 
              src="/logo-no-text.png" 
              alt={tCompany("name")} 
              width={32}
              height={32}
              className="rounded-md object-contain" 
            />
          </div>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-semibold">{tCompany("name")}</span>
            <span className="truncate text-xs">{tSidebar("admin_dashboard")}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
