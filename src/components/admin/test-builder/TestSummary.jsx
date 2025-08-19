import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Target,
  FileText,
  Calendar,
  Save,
  Send,
  Loader2,
} from "lucide-react";

export default function TestSummary({
  testDetails,
  questions,
  onSaveTest,
  onPublishTest,
  isSaving,
  isEditing = false,
  testId,
}) {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "public":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
    }
  };

  const saveButtonText = isSaving
    ? isEditing
      ? "Updating..."
      : "Saving..."
    : isEditing
    ? "Update Assessment"
    : "Save Draft";

  const publishButtonText = isEditing ? "Update & Publish" : "Publish Test";
  const getTypeColor = (type) => {
    return type === "mixed"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
            {isEditing ? "Update Assessment" : "Test Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Questions
              </span>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-neutral-500" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Total Points
              </span>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-neutral-500" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {totalPoints}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Duration
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {testDetails.duration} min
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Passing Score
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {testDetails.passingScore}%
              </span>
            </div>
          </div>

          <Separator className="bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Type
              </span>
              <Badge
                variant="outline"
                className={getTypeColor(testDetails.type)}
              >
                {testDetails.type === "multiple-choice"
                  ? "Multiple Choice"
                  : "Mixed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Visibility
              </span>
              <Badge
                variant="outline"
                className={getVisibilityColor(testDetails.visibility)}
              >
                {testDetails.visibility.charAt(0).toUpperCase() +
                  testDetails.visibility.slice(1)}
              </Badge>
            </div>

            {testDetails.dueDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Due Date
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {new Date(testDetails.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {testDetails.scheduledDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Scheduled
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {new Date(testDetails.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-2">
            <Button
              onClick={onSaveTest}
              disabled={
                isSaving || !testDetails.title.trim() || questions.length === 0
              }
              className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {saveButtonText}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {saveButtonText}
                </>
              )}
            </Button>

            <Button
              onClick={onPublishTest}
              disabled={
                isSaving || !testDetails.title.trim() || questions.length === 0
              }
              variant="outline"
              className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Send className="mr-2 h-4 w-4" />
              {publishButtonText}
            </Button>
          </div>

          {(testDetails.shuffleQuestions ||
            testDetails.showResultsImmediately) && (
            <>
              <Separator className="bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Settings
                </h4>
                {testDetails.shuffleQuestions && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Shuffle questions
                    </span>
                  </div>
                )}
                {testDetails.showResultsImmediately && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Show results immediately
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      {questions.length > 0 && (
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
              Question Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Q{index + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-neutral-300 dark:border-neutral-700"
                      >
                        {question.type.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-wrap truncate">
                      {question.text || "Untitled question"}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {question.points} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Warnings */}
      {(!testDetails.title.trim() || questions.length === 0) && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Required to {isEditing ? "update" : "save"}:
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                {!testDetails.title.trim() && <li>• Add a test title</li>}
                {questions.length === 0 && <li>• Add at least one question</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
