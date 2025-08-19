import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Search,
  Eye,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/common/header";
import axiosInstance from "@/lib/axios";

const ResultPage = () => {
  const navigate = useNavigate();

  // State for filters and search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Fetch published test results
  const {
    data: resultsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "publishedTestResults",
      { statusFilter, sortBy, sortOrder, page },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });

      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await axiosInstance.get(`/tests/published-results?${params}`);
      return response.data;
    },
  });

  const getStatusBadge = (passed, score, passingScore) => {
    if (passed) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Passed
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }
  };

  const getScoreBadge = (score) => {
    let colorClass = "";
    if (score >= 90) {
      colorClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (score >= 80) {
      colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    } else if (score >= 70) {
      colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else {
      colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }

    return (
      <Badge variant="outline" className={colorClass}>
        <Award className="h-3 w-3 mr-1" />
        {score}%
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

  const handleViewResult = (testId) => {
    navigate(`/test-results/${testId}`);
  };

  // Filter results based on search
  const filteredResults = resultsData?.results?.filter((result) => {
    if (!search) return true;
    return (
      result.testTitle.toLowerCase().includes(search.toLowerCase()) ||
      result.testCode.toLowerCase().includes(search.toLowerCase())
    );
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            My Test Results
          </h1>
          <p className="text-muted-foreground mt-2">
            View your completed test results and performance
          </p>
        </div>

        {/* Stats Cards */}
        {resultsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tests
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resultsData.pagination.totalResults}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    resultsData.results.filter(
                      (result) => result.attempt.passed
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    resultsData.results.reduce(
                      (sum, result) => sum + (result.attempt.score || 0),
                      0
                    ) / Math.max(resultsData.results.length, 1)
                  )}
                  %
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (resultsData.results.filter(
                      (result) => result.attempt.passed
                    ).length /
                      Math.max(resultsData.results.length, 1)) *
                      100
                  )}
                  %
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by test name or code..."
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
                  <SelectItem value="all">All Results</SelectItem>
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

        {/* Results List */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {resultsData
                ? `${filteredResults.length} of ${resultsData.pagination.totalResults} results`
                : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={`${result.testId}-${result.attempt.submittedAt}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewResult(result.testId)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-lg font-semibold">
                          {result.testTitle}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(
                            result.attempt.passed,
                            result.attempt.score,
                            result.passingScore
                          )}
                          {getScoreBadge(result.attempt.score)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Code: {result.testCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {result.attempt.correctAnswers}/{result.attempt.totalQuestions} correct
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{result.attempt.timeTaken} min</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {formatDate(result.attempt.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>Pass: {result.passingScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <div className="order-2 sm:order-1">
                        {result.attempt.passed ? (
                          <div className="text-xs text-green-600 font-medium">
                            ✓ PASSED
                          </div>
                        ) : (
                          <div className="text-xs text-red-600 font-medium">
                            ✗ FAILED
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="order-1 sm:order-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewResult(result.testId);
                        }}
                        disabled={!result.canViewResults}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{result.canViewResults ? "View Details" : "Results Pending"}</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">
                  No test results found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't completed any tests yet"}
                </p>
                {!search && statusFilter === "all" && (
                  <div className="mt-6">
                    <Button onClick={() => navigate("/test-entry")}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Take a Test
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {resultsData && resultsData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4 mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(resultsData.pagination.currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(
                    resultsData.pagination.currentPage * 10,
                    resultsData.pagination.totalResults
                  )}{" "}
                  of {resultsData.pagination.totalResults} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!resultsData.pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[
                      ...Array(Math.min(5, resultsData.pagination.totalPages)),
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
                    disabled={!resultsData.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultPage;
