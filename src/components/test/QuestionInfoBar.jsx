import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Bookmark, HelpCircle, Trash2, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

export default function QuestionInfoBar({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answers,
  markedForReview,
  onClearAnswer,
  onToggleMarkForReview,
  testDetails = {},
}) {
  const isMobile = useIsMobile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const {
    title,
    code,
    type,
    totalQuestions: totalQs,
    marksPerQuestion,
  } = testDetails;

  if (!currentQuestion) return null;

  const HelpContent = () => (
    <div className="space-y-4 text-xs">
      <div>
        <p className="font-medium mb-1">Test Instructions:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Use the sidebar to navigate between questions</li>
          <li>Mark questions for review to revisit later</li>
          <li>Your answers are saved automatically</li>
          <li>Click "End Test" when you're finished</li>
        </ul>
      </div>
      <div className="text-xs">
        <p className="font-medium mb-2">Question Status:</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
            <span>Unanswered</span>
          </div>
        </div>
      </div>

      <div>
        <p className="font-medium mb-1">Test Information:</p>
        <div className="space-y-1 pl-4">
          <div className="flex justify-between">
            <span>Total Questions:</span>
            <span>{totalQs}</span>
          </div>
          <div className="flex justify-between">
            <span>Marks per Question:</span>
            <span>{marksPerQuestion}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Marks:</span>
            <span>{(totalQs || 0) * (marksPerQuestion || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-2 sm:px-4 py-2 sm:py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
      <div className="text-sm font-medium flex items-center gap-1 sm:gap-2 min-w-0">
        <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-md text-xs sm:text-sm whitespace-nowrap">
          Q {currentQuestionIndex + 1}/{totalQuestions}
        </span>

        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[100px] sm:max-w-none hidden sm:inline-block">
          {currentQuestion.type === "multiple-choice"
            ? "Multiple Choice"
            : currentQuestion.type === "multiple-select"
            ? "Multiple Select"
            : currentQuestion.type === "true-false"
            ? "True/False"
            : currentQuestion.type === "short-answer"
            ? "Short Answer"
            : currentQuestion.type}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onClearAnswer}
                disabled={!answers[currentQuestion.id]}
                className="h-7 sm:h-8 px-1 sm:px-3 text-xs bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Clear Answer"
              >
                <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Clear Answer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="sm:hidden">
              Clear Answer
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={
                  markedForReview[currentQuestion.id] ? "default" : "secondary"
                }
                onClick={() => onToggleMarkForReview(currentQuestion.id)}
                className={`h-7 sm:h-8 px-1 sm:px-3 text-xs flex items-center gap-1 ${
                  markedForReview[currentQuestion.id]
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                }`}
                aria-label={
                  markedForReview[currentQuestion.id]
                    ? "Marked for Review"
                    : "Mark for Review"
                }
              >
                {markedForReview[currentQuestion.id] ? (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Marked</span>
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark for Review</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="sm:hidden">
              {markedForReview[currentQuestion.id]
                ? "Marked for Review"
                : "Mark for Review"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Use Tooltip for desktop and Popover for mobile */}
        {isMobile ? (
          <Popover open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-4" side="bottom">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Help & Information</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsHelpOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <HelpContent />
            </PopoverContent>
          </Popover>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                >
                  <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[300px] p-4">
                <HelpContent />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
