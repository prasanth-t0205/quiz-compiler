import { Link } from "react-router";
import { TestTube, User, Home, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Assessment App</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/test-entry"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Take Test
              </Link>
              <Link
                to="/test-results"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                My Results
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <ModeToggle />
              
              {user && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-sm">
                    <div className="font-medium">{user.fullname}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2024 Assessment App. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;