import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  Calendar,
  BookOpen,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/common/header";
import axiosInstance from "@/lib/axios";

const TestResultDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const {
    data: resultData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testResultDetail", testId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tests/my-results/${testId}`);
      return response.data;
    },
    enabled: !!testId,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  {error.response?.data?.message ||
                    "Failed to load test result"}
                </p>
                <Button onClick={() => navigate("/test-results")}>
                  Back to Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const getStatusBadge = (passed) => {
    if (passed) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-4 w-4 mr-2" />
          PASSED
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="h-4 w-4 mr-2" />
          FAILED
        </Badge>
      );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAnswerStatus = (isCorrect) => {
    if (isCorrect) {
      return (
        <div className="flex items-center text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4 mr-1" />
          Correct
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600 dark:text-red-400">
          <XCircle className="h-4 w-4 mr-1" />
          Incorrect
        </div>
      );
    }
  };

  const formatAnswer = (answer, type) => {
    if (type === "multiple-select" && Array.isArray(answer)) {
      return answer.join(", ");
    }
    return answer?.toString() || "No answer";
  };

  const formatCorrectAnswer = (correctAnswer, type) => {
    if (type === "multiple-select" && Array.isArray(correctAnswer)) {
      return correctAnswer.join(", ");
    }
    return correctAnswer?.toString() || "N/A";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const result = resultData?.result;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/test-results")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{result.testDetails.title}</h1>
            <p className="text-muted-foreground">
              Test Code: {result.testDetails.testCode}
            </p>
          </div>
        </div>

        {/* Result Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Score Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5" />
                Final Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  result.attemptDetails.score
                )}`}
              >
                {result.attemptDetails.score}%
              </div>
              <div className="mt-2">
                {getStatusBadge(result.attemptDetails.passed)}
              </div>
              <div className="mt-4">
                <Progress value={result.attemptDetails.score} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Pass required: {result.testDetails.passingScore}%
              </p>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Correct:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {result.statistics.correctAnswers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Incorrect:
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {result.statistics.incorrectAnswers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Unanswered:
                </span>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {result.statistics.unansweredQuestions}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Accuracy:</span>
                <span className="font-medium">
                  {result.statistics.accuracy}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Test Info Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Test Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {result.testDetails.duration} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Time Taken:
                </span>
                <span className="font-medium">
                  {result.attemptDetails.timeTaken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Questions:
                </span>
                <span className="font-medium">
                  {result.statistics.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Points:
                </span>
                <span className="font-medium">
                  {result.testDetails.totalPoints}
                </span>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(result.attemptDetails.submittedAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Question Review
            </CardTitle>
            <CardDescription>
              Review your answers and see the correct solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.questions.map((question, index) => (
                <AccordionItem
                  key={question.id}
                  value={`question-${question.id}`}
                >
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Question {index + 1}
                        </span>
                        {getAnswerStatus(question.isCorrect)}
                      </div>
                      <div className="flex-1 text-sm text-muted-foreground truncate">
                        {question.text}
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {question.pointsEarned}/{question.points} pts
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Question:</h4>
                        <p className="text-sm">{question.text}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Type: {question.type} • Points: {question.points}
                        </div>
                      </div>

                      {question.options && question.options.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Options:</h4>
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className={`p-2 rounded border text-sm ${
                                  option.isCorrect
                                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                    : "bg-muted border-border"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {option.isCorrect && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  <span>{option.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            Your Answer:
                            {question.isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </h4>
                          <div
                            className={`p-3 rounded border text-sm ${
                              question.isCorrect
                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            }`}
                          >
                            {question.userAnswer ? (
                              formatAnswer(question.userAnswer, question.type)
                            ) : (
                              <span className="text-muted-foreground italic">
                                No answer provided
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            Correct Answer:
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </h4>
                          <div className="p-3 rounded border text-sm bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                            {formatCorrectAnswer(
                              question.correctAnswer,
                              question.type
                            )}
                          </div>
                        </div>
                      </div>

                      {question.timeSpent > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Time spent: {Math.round(question.timeSpent)} seconds
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/test-results")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Results
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Print Result
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResultDetail;
