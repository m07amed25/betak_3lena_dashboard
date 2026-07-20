"use client";

import * as React from "react";
import { usePathname } from "@/i18n/routing";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupLabel,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, FoldVerticalIcon, UnfoldVerticalIcon, SearchIcon, XIcon } from "lucide-react";

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary rounded-sm px-0.5 font-medium">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function NavMain({
  items,
  collapseAllLabel,
  expandAllLabel,
  searchPlaceholder = "Search...",
}: {
  collapseAllLabel?: string;
  expandAllLabel?: string;
  searchPlaceholder?: string;
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;
    const lowerQuery = searchQuery.toLowerCase();
    
    return items.map(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        return item;
      }
      const matchingSubItems = item.items?.filter(sub => 
        sub.title.toLowerCase().includes(lowerQuery)
      );
      if (matchingSubItems && matchingSubItems.length > 0) {
        return { ...item, items: matchingSubItems };
      }
      return null;
    }).filter(Boolean) as typeof items;
  }, [items, searchQuery]);

  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      initialState[item.title] = !!item.isActive;
    });
    return initialState;
  });

  React.useEffect(() => {
    if (searchQuery.trim()) {
      const newState: Record<string, boolean> = {};
      filteredItems.forEach(item => {
        newState[item.title] = true;
      });
      setOpenStates(prev => ({ ...prev, ...newState }));
    }
  }, [searchQuery, filteredItems]);

  const toggleGroup = (title: string, isOpen: boolean) => {
    setOpenStates((prev) => ({ ...prev, [title]: isOpen }));
  };

  const collapseAll = () => {
    const newState: Record<string, boolean> = {};
    items.forEach((item) => {
      newState[item.title] = false;
    });
    setOpenStates(newState);
  };

  const expandAll = () => {
    const newState: Record<string, boolean> = {};
    items.forEach((item) => {
      newState[item.title] = true;
    });
    setOpenStates(newState);
  };

  return (
    <SidebarGroup>
      {(collapseAllLabel || expandAllLabel || searchPlaceholder) && (
        <div className="flex items-center justify-between px-2 py-1 mb-2 group-data-[collapsible=icon]:hidden gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute start-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <SidebarInput 
              placeholder={searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-7 pe-7 h-7 text-xs bg-sidebar-accent/50 border-transparent focus-visible:border-sidebar-ring focus-visible:ring-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute end-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-sidebar-foreground rounded-sm p-0.5"
                title="Clear search"
              >
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {expandAllLabel && (
              <button
                onClick={expandAll}
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent"
                title={expandAllLabel}
              >
                <UnfoldVerticalIcon className="h-3 w-3" />
              </button>
            )}
            {collapseAllLabel && (
              <button
                onClick={collapseAll}
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent"
                title={collapseAllLabel}
              >
                <FoldVerticalIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
      <SidebarMenu>
        {filteredItems.map((item) => {
          if (state === "collapsed") {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                    {item.icon}
                    <HighlightText text={item.title} highlight={searchQuery} />
                  </DropdownMenuTrigger>
                  {item.items && item.items.length > 0 && (
                    <DropdownMenuContent side="right" align="start" sideOffset={16} className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          <HighlightText text={item.title} highlight={searchQuery} />
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.items.map((subItem) => (
                          <DropdownMenuItem key={subItem.title} render={<a href={subItem.url} />}>
                            <HighlightText text={subItem.title} highlight={searchQuery} />
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              open={openStates[item.title] ?? false}
              onOpenChange={(isOpen) => toggleGroup(item.title, isOpen)}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                {item.icon}
                <HighlightText text={item.title} highlight={searchQuery} />
                <ChevronRightIcon className="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        isActive={pathname.startsWith(subItem.url)}
                        render={<a href={subItem.url} />}
                      >
                        <HighlightText text={subItem.title} highlight={searchQuery} />
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
