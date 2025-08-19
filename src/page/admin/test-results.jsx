import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Users,
  Clock,
  Target,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import AdminLayout from "@/components/common/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import axiosInstance from "@/lib/axios";

const TestResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  // State for filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch test attempts
  const {
    data: attemptsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "test-attempts",
      testId,
      { statusFilter, sortBy, sortOrder, page },
    ],
    queryFn: async () => {
      if (!testId) throw new Error("Test ID is required");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await axiosInstance.get(
        `/tests/${testId}/attempts?${params}`
      );
      return response.data;
    },
    enabled: !!testId,
  });

  // Fetch detailed user result
  const { data: userDetailData, isLoading: isLoadingUserDetail } = useQuery({
    queryKey: ["user-test-detail", testId, selectedUser?.user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/tests/${testId}/users/${selectedUser.user.id}`
      );
      return response.data;
    },
    enabled: !!testId && !!selectedUser?.user?.id,
  });

  const getStatusBadge = (status) => {
    const config = {
      Completed: {
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      Passed: {
        icon: CheckCircle,
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      Failed: {
        icon: XCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      "In Progress": {
        icon: AlertCircle,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
    };

    const { icon: Icon, className } = config[status] || config["In Progress"];

    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Filter attempts based on search
  const filteredAttempts =
    attemptsData?.attempts?.filter((attempt) => {
      if (!search) return true;
      return (
        attempt.user.name.toLowerCase().includes(search.toLowerCase()) ||
        attempt.user.email.toLowerCase().includes(search.toLowerCase())
      );
    }) || [];

  if (!testId) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Test Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Please select a test from the Test Management page to view
                  results
                </p>
                <Button onClick={() => navigate("/admin/test")}>
                  Go to Test Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  Failed to load test results
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {error.response?.data?.message || error.message}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Test Results
            </h1>
            {attemptsData?.testInfo && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {attemptsData.testInfo.title} • Code:{" "}
                {attemptsData.testInfo.testCode}
              </p>
            )}
          </div>
        </div>

        {/* Test Info & Stats */}
        {attemptsData?.testInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attempts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attemptsData.pagination.totalAttempts}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attemptsData.attempts.length > 0
                    ? Math.round(
                        (attemptsData.attempts.filter(
                          (a) => a.status === "Passed"
                        ).length /
                          attemptsData.attempts.filter(
                            (a) => a.status !== "In Progress"
                          ).length) *
                          100
                      ) || 0
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Score
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attemptsData.attempts.length > 0
                    ? Math.round(
                        attemptsData.attempts.reduce(
                          (sum, a) => sum + (a.score || 0),
                          0
                        ) /
                          attemptsData.attempts.filter((a) => a.score !== null)
                            .length
                      ) || 0
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Test Duration
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(attemptsData.testInfo.duration)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {attemptsData.testInfo.totalQuestions} questions •{" "}
                  {attemptsData.testInfo.passingScore}% to pass
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split("-");
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submittedAt-desc">Latest First</SelectItem>
                  <SelectItem value="submittedAt-asc">Oldest First</SelectItem>
                  <SelectItem value="score-desc">Highest Score</SelectItem>
                  <SelectItem value="score-asc">Lowest Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attempt Results</CardTitle>
            <CardDescription>
              {filteredAttempts.length} of{" "}
              {attemptsData?.pagination.totalAttempts || 0} attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time Taken</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttempts.map((attempt) => (
                      <TableRow key={attempt.attemptId}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {attempt.user.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {attempt.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {attempt.score !== null
                                ? `${attempt.score}%`
                                : "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {attempt.correctAnswers}/{attempt.totalAnswers}{" "}
                              correct
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {attempt.timeTaken
                            ? `${attempt.timeTaken} min`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {attempt.submittedAt
                              ? formatDate(attempt.submittedAt)
                              : "Not submitted"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(attempt)}
                            disabled={!attempt.endTime}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {attemptsData && attemptsData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(attemptsData.pagination.currentPage - 1) * 10 + 1}{" "}
                  to{" "}
                  {Math.min(
                    attemptsData.pagination.currentPage * 10,
                    attemptsData.pagination.totalAttempts
                  )}{" "}
                  of {attemptsData.pagination.totalAttempts} attempts
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!attemptsData.pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[
                      ...Array(Math.min(5, attemptsData.pagination.totalPages)),
                    ].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!attemptsData.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {attemptsData && filteredAttempts.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  No attempts found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No one has attempted this test yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Detail Modal */}
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detailed Results</DialogTitle>
              <DialogDescription>
                {selectedUser?.user.name} • {selectedUser?.user.email}
              </DialogDescription>
            </DialogHeader>

            {isLoadingUserDetail ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : userDetailData?.userResult ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-center">
                        {userDetailData.userResult.attemptDetails.score}%
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Final Score
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-center">
                        {userDetailData.userResult.statistics.correctAnswers}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Correct
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-center">
                        {userDetailData.userResult.statistics.incorrectAnswers}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Incorrect
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-center">
                        {userDetailData.userResult.attemptDetails.timeTaken ||
                          "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Time Taken
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Attempt Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attempt Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {userDetailData.userResult.attemptDetails.passed
                            ? "Passed"
                            : "Failed"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Started At</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(
                            userDetailData.userResult.attemptDetails.startTime
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Submitted At</p>
                        <p className="text-sm text-muted-foreground">
                          {userDetailData.userResult.attemptDetails.submittedAt
                            ? formatDate(
                                userDetailData.userResult.attemptDetails
                                  .submittedAt
                              )
                            : "Not submitted"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Accuracy</p>
                        <p className="text-sm text-muted-foreground">
                          {userDetailData.userResult.statistics.accuracy}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Question-wise Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Question-wise Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userDetailData.userResult.questions.map(
                        (question, index) => (
                          <div
                            key={question.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Q{index + 1}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {question.type.replace("-", " ")}
                                </Badge>
                                {question.isCorrect ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {question.pointsEarned}/{question.points} pts
                              </div>
                            </div>

                            <p className="text-sm mb-3">{question.text}</p>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  Your Answer:
                                </p>
                                <p className="text-sm">
                                  {Array.isArray(question.userAnswer)
                                    ? question.userAnswer.join(", ")
                                    : question.userAnswer || "Not answered"}
                                </p>
                              </div>

                              {!question.isCorrect && (
                                <div>
                                  <p className="text-xs font-medium text-green-600">
                                    Correct Answer:
                                  </p>
                                  <p className="text-sm text-green-600">
                                    {Array.isArray(question.correctAnswer)
                                      ? question.correctAnswer.join(", ")
                                      : question.correctAnswer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No detailed results available
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TestResults;
