import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  ClipboardList,
  FilePenLine,
  Home,
  Settings,
  TestTube,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

function AdminLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const commonNavigation = [
    {
      name: "Home",
      href: `/`,
      icon: Home,
    },
    {
      name: "Profile",
      href: `#`,
      icon: User,
    },
  ];

  const adminNavigation = [
    {
      name: "Test Builder",
      href: `/admin/test/builder`,
      icon: ClipboardList,
    },
    {
      name: "Test Results",
      href: `/admin/test/results`,
      icon: BarChart3,
    },
    {
      name: "Test Management",
      href: `/admin/test`,
      icon: FilePenLine,
    },
    {
      name: "Users",
      href: `/admin/users`,
      icon: Users,
    },
  ];

  const settings = [
    {
      name: "Settings",
      href: `#`,
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="flex items-center justify-between p-4">
            <SidebarMenuButton asChild tooltip="Assessment App">
              <Link to={"/"}>
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 items-center rounded-md">
                    <TestTube className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-lg font-semibold">Assessment App</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>

          <SidebarContent className="flex flex-col justify-between h-[calc(100vh-4rem)]">
            {/* Common Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {commonNavigation.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={pathname === item.href}
                      >
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <Badge className="ml-auto" variant="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Admin Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavigation.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={pathname === item.href}
                      >
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && (
                        <Badge className="ml-auto" variant="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex-grow"></div>

            {/* Settings */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settings.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        isActive={pathname === item.href}
                      >
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Admin Panel</h1>
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl space-y-6">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
