"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeftIcon, X } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FLOATING_SIDEBAR_COOKIE_NAME = "floating_sidebar_state";
const FLOATING_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const FLOATING_SIDEBAR_WIDTH = "16rem";
const FLOATING_SIDEBAR_WIDTH_MOBILE = "18rem";
const FLOATING_SIDEBAR_WIDTH_ICON = "3rem";
const FLOATING_SIDEBAR_KEYBOARD_SHORTCUT = "f";

const FloatingSidebarContext = React.createContext(null);

function useFloatingSidebar() {
  const context = React.useContext(FloatingSidebarContext);
  if (!context) {
    throw new Error(
      "useFloatingSidebar must be used within a FloatingSidebarProvider."
    );
  }
  return context;
}

function FloatingSidebarProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange: setOpenProp,
  side = "left",
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // Internal state management
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // Save state to cookie
      document.cookie = `${FLOATING_SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${FLOATING_SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Toggle function
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === FLOATING_SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [open, setOpen]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !isMobile) {
        const sidebar = document.querySelector(
          '[data-floating-sidebar="true"]'
        );
        const trigger = document.querySelector(
          '[data-floating-sidebar-trigger="true"]'
        );

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          trigger &&
          !trigger.contains(event.target)
        ) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen, isMobile]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      side,
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, side]
  );

  return (
    <FloatingSidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="floating-sidebar-wrapper"
          style={{
            "--floating-sidebar-width": FLOATING_SIDEBAR_WIDTH,
            "--floating-sidebar-width-mobile": FLOATING_SIDEBAR_WIDTH_MOBILE,
            "--floating-sidebar-width-icon": FLOATING_SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn(
            "group/floating-sidebar-wrapper flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </FloatingSidebarContext.Provider>
  );
}

function FloatingSidebar({ className, children, ...props }) {
  const { isMobile, open, openMobile, setOpenMobile, side } =
    useFloatingSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-floating-sidebar="true"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-[var(--floating-sidebar-width-mobile)] p-0"
          style={{
            "--floating-sidebar-width-mobile": FLOATING_SIDEBAR_WIDTH_MOBILE,
          }}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Floating Sidebar</SheetTitle>
            <SheetDescription>Floating sidebar content</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="group peer text-sidebar-foreground hidden md:block">
      {/* Icon Sidebar - Always visible */}
      <div className="relative w-[var(--floating-sidebar-width-icon)] bg-transparent transition-[width] duration-200 ease-linear" />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--floating-sidebar-width-icon)] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left" ? "left-0" : "right-0"
        )}
      >
        <div
          data-sidebar="sidebar"
          data-slot="floating-sidebar-icon"
          className="bg-sidebar border-sidebar-border flex h-full w-full flex-col border-r"
        >
          {/* Icon-only content */}
          <div className="flex h-full w-full flex-col">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { iconOnly: true });
              }
              return child;
            })}
          </div>
        </div>
      </div>

      {/* Floating Expanded Sidebar */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            data-floating-sidebar-backdrop="true"
          />

          {/* Floating Sidebar */}
          <div
            data-floating-sidebar="true"
            data-side={side}
            className={cn(
              "fixed top-4 z-50 h-[calc(100vh-2rem)] w-[var(--floating-sidebar-width)] transition-all duration-300 ease-in-out",
              side === "left" ? "left-16" : "right-16",
              className
            )}
            {...props}
          >
            <div className="bg-sidebar border-sidebar-border text-sidebar-foreground flex h-full w-full flex-col rounded-lg border shadow-2xl">
              {/* Close button */}
              <div className="flex items-center justify-end p-2">
                <FloatingSidebarClose />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, { iconOnly: false });
                  }
                  return child;
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FloatingSidebarTrigger({ className, onClick, children, ...props }) {
  const { toggleSidebar } = useFloatingSidebar();

  return (
    <Button
      data-floating-sidebar-trigger="true"
      variant="ghost"
      size="icon"
      className={cn("size-9", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children || <PanelLeftIcon className="h-4 w-4" />}
      <span className="sr-only">Toggle Floating Sidebar</span>
    </Button>
  );
}

function FloatingSidebarClose({ className, onClick, ...props }) {
  const { setOpen } = useFloatingSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-6", className)}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close Sidebar</span>
    </Button>
  );
}

// Reuse existing components with floating context
function FloatingSidebarHeader({ className, iconOnly, ...props }) {
  if (iconOnly) {
    return (
      <div
        data-slot="floating-sidebar-header"
        className={cn(
          "flex flex-col items-center justify-center p-2",
          className
        )}
        {...props}
      >
        {/* Show only icon when collapsed */}
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child) && child.type === "div") {
            return React.Children.toArray(child.props.children).find(
              (grandChild) =>
                React.isValidElement(grandChild) &&
                grandChild.props.className?.includes("h-8 w-8")
            );
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <div
      data-slot="floating-sidebar-header"
      className={cn("flex flex-col gap-2 p-4 pb-2", className)}
      {...props}
    />
  );
}

function FloatingSidebarContent({ className, iconOnly, ...props }) {
  return (
    <div
      data-slot="floating-sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        iconOnly ? "p-1" : "p-2",
        className
      )}
      {...props}
    />
  );
}

function FloatingSidebarFooter({ className, iconOnly, ...props }) {
  return (
    <div
      data-slot="floating-sidebar-footer"
      className={cn(
        "flex flex-col gap-2",
        iconOnly ? "p-2 items-center" : "p-4 pt-2",
        className
      )}
      {...props}
    />
  );
}

function FloatingSidebarGroup({ className, iconOnly, ...props }) {
  return (
    <div
      data-slot="floating-sidebar-group"
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        iconOnly ? "p-1" : "p-2",
        className
      )}
      {...props}
    />
  );
}

function FloatingSidebarGroupLabel({
  className,
  asChild = false,
  iconOnly,
  ...props
}) {
  const Comp = asChild ? Slot : "div";

  if (iconOnly) {
    return null; // Hide labels in icon-only mode
  }

  return (
    <Comp
      data-slot="floating-sidebar-group-label"
      className={cn(
        "text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opacity] duration-200 ease-linear",
        className
      )}
      {...props}
    />
  );
}

function FloatingSidebarMenu({ className, iconOnly, ...props }) {
  return (
    <ul
      data-slot="floating-sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function FloatingSidebarMenuItem({ className, iconOnly, ...props }) {
  return (
    <li
      data-slot="floating-sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const floatingSidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function FloatingSidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  className,
  iconOnly,
  tooltip,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile } = useFloatingSidebar();

  const button = (
    <Comp
      data-slot="floating-sidebar-menu-button"
      data-active={isActive}
      className={cn(
        floatingSidebarMenuButtonVariants({ variant, size }),
        isActive &&
          "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
        iconOnly && "size-8 justify-center p-2",
        className
      )}
      {...props}
    />
  );

  // In icon-only mode, always show tooltip
  if (iconOnly) {
    const tooltipContent =
      tooltip ||
      React.Children.toArray(props.children).find(
        (child) =>
          React.isValidElement(child) &&
          typeof child.props.children === "string"
      )?.props.children;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            data-slot="floating-sidebar-menu-button"
            data-active={isActive}
            className={cn(
              floatingSidebarMenuButtonVariants({ variant, size }),
              isActive &&
                "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
              "size-8 justify-center p-2",
              className
            )}
            {...props}
          >
            {/* Show only the icon */}
            {React.Children.toArray(props.children).find(
              (child) =>
                (React.isValidElement(child) &&
                  child.type?.name?.includes("Icon")) ||
                (React.isValidElement(child) &&
                  child.props.className?.includes("h-4 w-4"))
            )}
          </Comp>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="z-50">
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Regular mode with optional tooltip
  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function FloatingSidebarSeparator({ className, iconOnly, ...props }) {
  return (
    <Separator
      data-slot="floating-sidebar-separator"
      className={cn(
        "bg-sidebar-border mx-2 w-auto",
        iconOnly && "mx-1",
        className
      )}
      {...props}
    />
  );
}

// Additional helper components for better icon-only support
function FloatingSidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  iconOnly,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  if (iconOnly) {
    return null; // Hide menu actions in icon-only mode
  }

  return (
    <Comp
      data-slot="floating-sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 md:after:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function FloatingSidebarMenuBadge({ className, iconOnly, ...props }) {
  if (iconOnly) {
    return null; // Hide badges in icon-only mode
  }

  return (
    <div
      data-slot="floating-sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  FloatingSidebar,
  FloatingSidebarClose,
  FloatingSidebarContent,
  FloatingSidebarFooter,
  FloatingSidebarGroup,
  FloatingSidebarGroupLabel,
  FloatingSidebarHeader,
  FloatingSidebarMenu,
  FloatingSidebarMenuAction,
  FloatingSidebarMenuBadge,
  FloatingSidebarMenuButton,
  FloatingSidebarMenuItem,
  FloatingSidebarProvider,
  FloatingSidebarSeparator,
  FloatingSidebarTrigger,
  useFloatingSidebar,
};
