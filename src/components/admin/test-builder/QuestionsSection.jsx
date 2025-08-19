import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuestionCard from "./QuestionCard";

export default function QuestionsSection({
  questions,
  availableQuestionTypes,
  showPreview,
  handlePreviewTest,
  questionOperations,
}) {
  const getQuestionTypeDisplayName = (type) => {
    const typeMap = {
      "multiple-choice": "Multiple Choice",
      "multiple-select": "Multiple Select",
      "true-false": "True/False",
      "short-answer": "Short Answer",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Questions ({questions.length})</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Add Question</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableQuestionTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => questionOperations.add(type)}
                >
                  {getQuestionTypeDisplayName(type)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={handlePreviewTest}
            className="w-full sm:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">
              {showPreview ? "Hide Preview" : "Preview"}
            </span>
          </Button>
        </div>
      </div>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          showPreview={showPreview}
          questionOperations={questionOperations}
        />
      ))}

      {questions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">
              No questions added yet.
            </p>
            <Button
              onClick={() => questionOperations.add(availableQuestionTypes[0])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Question
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
