import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function QuestionPreview({ question }) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup className="space-y-3">
            {question.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`preview-option-${option.id}`}
                  className="mt-1 border-neutral-400 dark:border-neutral-600"
                  disabled
                />
                <Label
                  htmlFor={`preview-option-${option.id}`}
                  className="font-normal text-neutral-800 dark:text-neutral-200 cursor-pointer w-full"
                >
                  {option.text || `Option ${option.id}`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple-select":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Checkbox
                  id={`preview-option-${option.id}`}
                  className="mt-1 border-neutral-400 dark:border-neutral-600"
                  disabled
                />
                <Label
                  htmlFor={`preview-option-${option.id}`}
                  className="font-normal text-neutral-800 dark:text-neutral-200 cursor-pointer w-full"
                >
                  {option.text || `Option ${option.id}`}
                </Label>
              </div>
            ))}
          </div>
        );

      case "true-false":
        return (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              variant="outline"
              className="flex-1 py-6 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
              disabled
            >
              True
            </Button>
            <Button
              variant="outline"
              className="flex-1 py-6 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
              disabled
            >
              False
            </Button>
          </div>
        );

      case "short-answer":
        return (
          <div className="space-y-3 mt-4">
            <Label className="text-neutral-800 dark:text-neutral-200">
              Your answer:
            </Label>
            <Input
              placeholder="Type your answer here"
              className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
              disabled
            />
          </div>
        );

      default:
        return (
          <div className="text-neutral-800 dark:text-neutral-200 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md">
            Unsupported question type: {question.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
          {question.text || "Question text will appear here..."}
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {question.points} {question.points === 1 ? "point" : "points"}
        </div>
      </div>

      <div className="mt-4">{renderQuestionContent()}</div>
    </div>
  );
}
