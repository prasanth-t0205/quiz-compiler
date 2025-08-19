import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

export default function QuestionEditor({ question, questionOperations }) {
  const renderQuestionTypeEditor = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => questionOperations.addOption(question.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
            <RadioGroup
              value={
                question.options?.find((o) => o.isCorrect)?.id?.toString() || ""
              }
              onValueChange={(value) =>
                questionOperations.updateCorrectOption(
                  question.id,
                  parseInt(value)
                )
              }
            >
              {question.options?.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`option-${option.id}`}
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      questionOperations.updateOptionText(
                        question.id,
                        option.id,
                        e.target.value
                      )
                    }
                    className="flex-1"
                  />
                  {question.options && question.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        questionOperations.removeOption(question.id, option.id)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "multiple-select":
        const selectedOptions =
          question.options?.filter((o) => o.isCorrect).map((o) => o.id) || [];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options (Select multiple correct answers)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => questionOperations.addOption(question.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`option-${option.id}`}
                  checked={option.isCorrect}
                  onCheckedChange={(checked) => {
                    const newSelectedOptions = checked
                      ? [...selectedOptions, option.id]
                      : selectedOptions.filter((id) => id !== option.id);
                    questionOperations.updateMultipleCorrectOptions(
                      question.id,
                      newSelectedOptions
                    );
                  }}
                />
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    questionOperations.updateOptionText(
                      question.id,
                      option.id,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
                {question.options && question.options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      questionOperations.removeOption(question.id, option.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        );

      case "true-false":
        return (
          <div className="space-y-4">
            <Label>Select the correct answer</Label>
            <RadioGroup
              value={
                question.options?.find((o) => o.isCorrect)?.id?.toString() || ""
              }
              onValueChange={(value) =>
                questionOperations.updateCorrectOption(
                  question.id,
                  parseInt(value)
                )
              }
            >
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`option-${option.id}`}
                  />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "short-answer":
        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="correct-answer">Correct Answer</Label>
              <Input
                id="correct-answer"
                placeholder="Enter the correct answer"
                value={question.correctAnswer || ""}
                onChange={(e) =>
                  questionOperations.updateOptionText(
                    question.id,
                    "correctAnswer",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3 flex flex-col gap-2">
          <Label htmlFor={`question-text-${question.id}`}>Question Text</Label>
          <Textarea
            id={`question-text-${question.id}`}
            placeholder="Enter your question here..."
            value={question.text}
            onChange={(e) =>
              questionOperations.updateText(question.id, e.target.value)
            }
            rows={3}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`question-points-${question.id}`}>Points</Label>
          <Input
            id={`question-points-${question.id}`}
            type="number"
            min="1"
            value={question.points}
            onChange={(e) =>
              questionOperations.updatePoints(
                question.id,
                parseInt(e.target.value) || 1
              )
            }
          />
        </div>
      </div>

      {renderQuestionTypeEditor()}
    </div>
  );
}
