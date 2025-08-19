import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function QuestionPalette({
  questions,
  currentIndex,
  answers,
  markedForReview,
  onSelectQuestion,
  onClose,
  isMobileOpen = false,
  isMobile,
}) {
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  // The content of the question palette
  const PaletteContent = () => (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-neutral-900 dark:text-neutral-100">
            Question Palette
          </h2>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-4 gap-2">
        <div className="p-3 rounded-[8px] bg-neutral-100/50 dark:bg-neutral-800/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-600"></div>
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {answeredCount}
                </span>
              </div>
              <div className="flex items-center text-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600"></div>
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {reviewCount}
                </span>
              </div>
              <div className="flex items-center text-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
                <span className="text-xs text-neutral-700 dark:text-neutral-300">
                  {unansweredCount}
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {answeredCount}/{totalQuestions}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 w-full h-[calc(100vh-220px)]">
          <div className="p-3 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              const isMarkedForReview = !!markedForReview[question.id];
              const isCurrent = index === currentIndex;

              // Define base styles for each state without transitions
              let baseStyle =
                "w-12 h-12 rounded-full cursor-pointer text-[16px] font-medium border-none outline-none";
              let stateStyle = "";

              if (isMarkedForReview) {
                stateStyle = "bg-blue-500 text-white";
              } else if (isAnswered) {
                stateStyle = "bg-emerald-500 text-white";
              } else {
                stateStyle =
                  "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300";
              }

              // Add current question indicator
              const currentStyle = isCurrent
                ? "ring-2 ring-offset-1 ring-primary dark:ring-primary-foreground"
                : "";

              return (
                <div key={question.id} className="relative">
                  <button
                    className={`${baseStyle} ${stateStyle} ${currentStyle}`}
                    onClick={() => {
                      onSelectQuestion(index);
                      if (isMobile && onClose) {
                        onClose();
                      }
                    }}
                    style={{
                      transition: "none", // Disable transitions to prevent blinking
                    }}
                  >
                    {index + 1}
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="p-0 w-[300px] sm:w-[350px] border-r border-neutral-200 dark:border-neutral-800"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Question Palette</SheetTitle>
            <SheetDescription>
              Navigate between test questions and track your progress
            </SheetDescription>
          </SheetHeader>
          <PaletteContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <PaletteContent />;
}
