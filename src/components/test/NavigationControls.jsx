import { Button } from "@/components/ui/button";

export default function NavigationControls({
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
}) {
  return (
    <div className="p-4 flex justify-between bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        Previous
      </Button>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={isLastQuestion}
        className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        Next
      </Button>
    </div>
  );
}
