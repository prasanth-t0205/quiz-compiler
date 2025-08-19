import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes } from "react-router";
import Home from "./page/home";
import Login from "./page/auth/login";
import Signup from "./page/auth/signup";
import { Toaster } from "./components/ui/sonner";
import TestEntry from "./page/assessment/test-entry";
import AssessmentExamPage from "./page/assessment/assessment";
import TestResults from "./page/assessment/test-results";
import TestBuilderPage from "./page/admin/test-builder";
import TestResult from "./page/admin/test-results";
import ProtectedRoute from "./router/ProtectedRoute";
import UserManagement from "./page/admin/user-management";
import TestManagement from "./page/admin/test-management";
import ResultPage from "./page/result-page";
import TestResultDetail from "./page/test-result-detail";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors position="bottom-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/test-results" element={<ResultPage />} />
        <Route
          path="/test-results/:testId"
          element={
            <ProtectedRoute allowedRoles={["user", "staff", "admin"]}>
              <TestResultDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          }
        />

        {/* Protected user routes */}
        <Route
          path="/test-entry"
          element={
            <ProtectedRoute allowedRoles={["user", "staff", "admin"]}>
              <TestEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "staff", "admin"]}>
              <AssessmentExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-result/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "staff", "admin"]}>
              <TestResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/test/builder"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <TestBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/test/builder/:id"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <TestBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/test/results"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <TestResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/test"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <TestManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
