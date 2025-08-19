import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function QuestionRenderer({ question, answer, onAnswerChange }) {
  if (!question) return <div>Question not found</div>;

  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={answer?.value || ""}
            onValueChange={(value) => onAnswerChange({ value })}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="mt-1 border-neutral-400 dark:border-neutral-600"
                />
                <Label
                  htmlFor={option.id}
                  className="font-normal text-neutral-800 dark:text-neutral-200 cursor-pointer w-full"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple-select":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isChecked = answer?.values?.includes(option.id) || false;

              return (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentValues = answer?.values || [];
                      const newValues = checked
                        ? [...currentValues, option.id]
                        : currentValues.filter((id) => id !== option.id);

                      onAnswerChange({ values: newValues });
                    }}
                    className="mt-1 border-neutral-400 dark:border-neutral-600"
                  />
                  <Label
                    htmlFor={option.id}
                    className="font-normal text-neutral-800 dark:text-neutral-200 cursor-pointer w-full"
                  >
                    {option.text}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "true-false":
        return (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              variant={
                answer?.value === question.options?.[0]?.id
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                onAnswerChange({ value: question.options?.[0]?.id })
              }
              className={`flex-1 py-6 ${
                answer?.value === question.options?.[0]?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
              }`}
            >
              True
            </Button>
            <Button
              variant={
                answer?.value === question.options?.[1]?.id
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                onAnswerChange({ value: question.options?.[1]?.id })
              }
              className={`flex-1 py-6 ${
                answer?.value === question.options?.[1]?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
              }`}
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
              value={answer?.value || ""}
              onChange={(e) => onAnswerChange({ value: e.target.value })}
              className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
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
    <div className="space-y-4">
      <div className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
        {question.text}
      </div>
      {question.description && (
        <div className="text-sm text-neutral-600 dark:text-neutral-400 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md">
          {question.description}
        </div>
      )}

      <div className="mt-4">{renderQuestionContent()}</div>
    </div>
  );
}
