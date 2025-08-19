import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Copy, Trash } from "lucide-react";
import QuestionEditor from "./QuestionEditor";
import QuestionPreview from "./QuestionPreview";

export default function QuestionCard({
  question,
  index,
  showPreview,
  questionOperations,
}) {
  return (
    <Card className="mb-4 transform transition-all duration-200 ease-in-out w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {index + 1}
          </span>
          <CardTitle className="text-base">
            Question {index + 1}
            <span className="ml-2 text-xs text-muted-foreground">
              ({question.type.replace(/-/g, " ")})
            </span>
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => questionOperations.move(question.id, "up")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => questionOperations.move(question.id, "down")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => questionOperations.duplicate(question.id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => questionOperations.remove(question.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 w-full">
        <div className="w-full max-w-full">
          {showPreview ? (
            <QuestionPreview question={question} />
          ) : (
            <QuestionEditor
              question={question}
              questionOperations={questionOperations}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
