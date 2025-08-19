import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Trophy, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const { authUser, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error("Error logging out");
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleResultsClick = () => {
    navigate("/test-results");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            QuizCompiler
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {/* Show loading state */}
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          ) : !isAuthenticated ? (
            /* Not logged in - show login/signup buttons */
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="hidden md:block"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            /* Logged in - show user menu */
            <div className="flex items-center space-x-4">
              {/* Results Button */}
              <div className={"hidden md:block "}>
                <Button variant="outline" onClick={handleResultsClick}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Results
                </Button>
              </div>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {authUser?.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden md:block">
                      {authUser?.fullname || "User"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResultsClick}>
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>My Results</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
