import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  BarChart3, FileSpreadsheet, Brain, Plug, LayoutGrid, FileText, Library,
  Settings, Bell, Search, ChevronLeft, ChevronRight, Home, User
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Excel to Dashboard", url: "/excel-dashboard", icon: BarChart3 },
  { title: "BOM to Quote", url: "/excel-quote", icon: FileSpreadsheet },
  { title: "AI Insights", url: "/ai-insights", icon: Brain },
  { title: "AI Bridge for SAP", url: "/sap-bridge", icon: Plug },
  { title: "Drag & Drop Builder", url: "/drag-drop", icon: LayoutGrid },
  { title: "Pre-Engineered Reports", url: "/reports", icon: FileText },
  { title: "Template Library", url: "/templates", icon: Library },
];

const roles = ["CEO", "Manager", "Employee"] as const;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string>("CEO");
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
          {collapsed ? (
            <img src="/bullmind-logo.png" alt="BuLLMind" className="h-8 w-8 object-contain" />
          ) : (
            <img src="/bullmind-logo.png" alt="BuLLMind" className="h-10 object-contain" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm nav-item-hover",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
                activeClassName=""
              >
                <item.icon className="h-4 w-4 shrink-0 icon-hover" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin + Collapse */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          <NavLink
            to="/admin"
            end
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              location.pathname === "/admin"
                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            )}
            activeClassName=""
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Admin Panel</span>}
          </NavLink>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-indigo hidden md:block">
              SOTA Custom Reporting Tool
            </h1>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports, data, insights…"
                className="w-72 pl-9 h-9 bg-muted/50 border-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-3.5 w-3.5" />
                  {role}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {roles.map((r) => (
                  <DropdownMenuItem key={r} onClick={() => setRole(r)}>{r}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative icon-hover">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-amber text-amber-foreground badge-pulse">
                3
              </Badge>
            </Button>

            {/* Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">RK</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}
