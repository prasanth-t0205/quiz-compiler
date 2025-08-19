import { Button } from "@/components/ui/button";
import { Menu, Clock, AlertTriangle } from "lucide-react";

export default function TestHeader({
  title,
  code,
  type,
  timeLeft,
  timeWarning,
  togglePalette,
  showPaletteToggle = true,
  onEndTest,
}) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b shadow-sm">
      <div className="container mx-auto max-w-full px-2 sm:px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and title */}
          <div className="flex items-center min-w-0">
            {showPaletteToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePalette}
                className="mr-2 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg md:text-xl truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                {title}
              </h1>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="mr-2 truncate">{code}</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs flex-shrink-0">
                  {type}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Timer and buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div
              className={`flex items-center ${
                timeWarning ? "text-red-600" : ""
              }`}
            >
              <Clock
                className={`h-4 w-4 mr-1 ${timeWarning ? "animate-pulse" : ""}`}
              />
              <span className="font-mono font-medium text-xs sm:text-sm">
                {timeWarning && (
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                )}
                {timeLeft}
              </span>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={onEndTest}
              className="ml-1 text-xs px-2 sm:px-3"
            >
              End Test
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
