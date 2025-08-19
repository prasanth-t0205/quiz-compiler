import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Target,
  BookOpen,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import axiosInstance from "@/lib/axios";

const TestManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for filters and search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, test: null });

  // Fetch tests
  const {
    data: testsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "tests",
      { search, statusFilter, typeFilter, sortBy, sortOrder, page },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });

      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("testType", typeFilter);

      const response = await axiosInstance.get(`/tests?${params}`);
      return response.data;
    },
  });

  // Delete test mutation
  const deleteTestMutation = useMutation({
    mutationFn: async (testId) => {
      const response = await axiosInstance.delete(`/tests/${testId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      setDeleteDialog({ open: false, test: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete test");
    },
  });

  // Duplicate test mutation
  const duplicateTestMutation = useMutation({
    mutationFn: async (testId) => {
      const response = await axiosInstance.post(`/tests/${testId}/duplicate`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Test duplicated successfully");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      navigate(`/admin/test/builder/${data.test._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to duplicate test");
    },
  });

  // Archive test mutation
  const archiveTestMutation = useMutation({
    mutationFn: async (testId) => {
      const response = await axiosInstance.patch(`/tests/${testId}/archive`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test archived successfully");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to archive test");
    },
  });

  // Publish test mutation
  const publishTestMutation = useMutation({
    mutationFn: async (testId) => {
      const response = await axiosInstance.patch(`/tests/${testId}/publish`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test published successfully");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to publish test");
    },
  });

  // Publish result mutation
  const publishResultMutation = useMutation({
    mutationFn: async (testId) => {
      const response = await axiosInstance.post(`/tests/${testId}/publish-results`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test results published successfully");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to publish results");
    },
  });

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      published: "default",
      archived: "outline",
    };

    const colors = {
      draft:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      published:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const colors = {
      "multiple-choice":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      mixed:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };

    return (
      <Badge variant="outline" className={colors[type]}>
        {type === "multiple-choice" ? "Multiple Choice" : "Mixed"}
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

  const handleDeleteTest = (test) => {
    setDeleteDialog({ open: true, test });
  };

  const confirmDelete = () => {
    if (deleteDialog.test) {
      deleteTestMutation.mutate(deleteDialog.test._id);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  Failed to load tests
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Test Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your assessment tests and track performance
            </p>
          </div>
          <Button onClick={() => navigate("/admin/test/builder")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </div>

        {/* Stats Cards */}
        {testsData && (
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
                  {testsData.pagination.totalTests}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    testsData.tests.filter(
                      (test) => test.status === "published"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attempts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testsData.tests.reduce(
                    (sum, test) => sum + (test.statistics?.totalAttempts || 0),
                    0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Score
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    testsData.tests.reduce(
                      (sum, test, _, arr) =>
                        sum + (test.statistics?.averageScore || 0),
                      0
                    ) / Math.max(testsData.tests.length, 1)
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
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tests..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="multiple-choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
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
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tests</CardTitle>
            <CardDescription>
              {testsData
                ? `${testsData.pagination.totalTests} total tests`
                : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
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
                      <TableHead>Test Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Statistics</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testsData?.tests?.map((test) => (
                      <TableRow key={test._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{test.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Code: {test.testCode}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {test.questionsCount} questions • {test.duration}{" "}
                              min • {test.passingScore}% pass
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(test.testType)}</TableCell>
                        <TableCell>{getStatusBadge(test.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">
                                {test.statistics?.totalAttempts || 0}
                              </span>{" "}
                              attempts
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {test.statistics?.averageScore || 0}% avg score
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {test.statistics?.passRate || 0}% pass rate
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(test.createdAt)}
                          </div>
                          {test.createdBy && (
                            <div className="text-sm text-muted-foreground">
                              by {test.createdBy.fullname}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/admin/test/results?testId=${test._id}`
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/test/builder/${test._id}`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Test
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  duplicateTestMutation.mutate(test._id)
                                }
                                disabled={duplicateTestMutation.isPending}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {test.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    publishTestMutation.mutate(test._id)
                                  }
                                  disabled={publishTestMutation.isPending}
                                >
                                  <Target className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {test.status === "published" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      publishResultMutation.mutate(test._id)
                                    }
                                    disabled={publishResultMutation.isPending || test.statistics?.totalAttempts === 0}
                                  >
                                    <Target className="mr-2 h-4 w-4" />
                                    Publish Results
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      archiveTestMutation.mutate(test._id)
                                    }
                                    disabled={archiveTestMutation.isPending}
                                  >
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteTest(test)}
                                className="text-red-600 dark:text-red-400"
                                disabled={test.statistics?.totalAttempts > 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {testsData && testsData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(testsData.pagination.currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(
                    testsData.pagination.currentPage * 10,
                    testsData.pagination.totalTests
                  )}{" "}
                  of {testsData.pagination.totalTests} tests
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!testsData.pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {[
                      ...Array(Math.min(5, testsData.pagination.totalPages)),
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
                    disabled={!testsData.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {testsData && testsData.tests.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  No tests found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {search || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first test"}
                </p>
                {!search && statusFilter === "all" && typeFilter === "all" && (
                  <div className="mt-6">
                    <Button onClick={() => navigate("/admin/test/builder")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, test: null })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the test "
                {deleteDialog.test?.title}". This action cannot be undone.
                {deleteDialog.test?.statistics?.totalAttempts > 0 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400">
                    This test has {deleteDialog.test.statistics.totalAttempts}{" "}
                    attempts and cannot be deleted.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={
                  deleteTestMutation.isPending ||
                  deleteDialog.test?.statistics?.totalAttempts > 0
                }
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                {deleteTestMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default TestManagement;
