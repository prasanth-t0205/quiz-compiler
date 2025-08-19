import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function TimeUpDialog({
  open,
  onOpenChange,
  questions,
  answers,
  onEndTest,
  isSubmitting,
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const progressPercentage = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Time is up!</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
            Your test time has expired. Your answers have been automatically
            submitted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="flex justify-between mb-2">
            <span>Total Questions:</span>
            <span>{questions.length}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Answered:</span>
            <span>{Object.keys(answers).length}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Completion Rate:</span>
            <span>{progressPercentage}%</span>
          </div>

          {!isOnline && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                You're offline. Your answers will be saved locally and submitted
                when you're back online.
              </span>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onEndTest}
            className="bg-primary hover:bg-primary/90 gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                {isOnline ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                View Results
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
