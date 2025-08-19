import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function EndTestDialog({
  open,
  onOpenChange,
  questions,
  answers,
  markedForReview,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700">
        <DialogHeader>
          <DialogTitle>End Test Confirmation</DialogTitle>
          <DialogDescription className="text-neutral-600 dark:text-neutral-400">
            Are you sure you want to end the test and submit your answers? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
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
            <span>Marked for Review:</span>
            <span>
              {
                Object.keys(markedForReview).filter(
                  (id) => markedForReview[parseInt(id)]
                ).length
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Unanswered:</span>
            <span>{questions.length - Object.keys(answers).length}</span>
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
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onEndTest}
            disabled={isSubmitting}
            className="gap-2"
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
                End Test & Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
