import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Shield, AlertCircle, Key, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import Header from "@/components/common/header";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

const TestEntry = () => {
  const navigate = useNavigate();
  const [testCode, setTestCode] = useState("");

  const authenticateTestMutation = useMutation({
    mutationFn: async (code) => {
      const response = await axiosInstance.post("/tests/authenticate", {
        testCode: code.trim().toUpperCase(),
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("testData", JSON.stringify(data.test));
      localStorage.setItem("candidateData", JSON.stringify(data.user));

      toast.success("Test code verified! Redirecting...");
      setTimeout(() => {
        navigate(`/assessment/${data.test._id}`);
      }, 1000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid test code. Please check and try again.";
      toast.error(errorMessage);

      // If user already attempted, show attempt details
      if (error.response?.data?.attemptDetails) {
        const attempt = error.response.data.attemptDetails;
        toast.info(
          `You have already attempted this test on ${new Date(
            attempt.createdAt
          ).toLocaleDateString()}.`
        );
      }
    },
  });

  const handleStartTest = (e) => {
    e.preventDefault();

    if (!testCode.trim()) {
      toast.error("Please enter a test code");
      return;
    }

    authenticateTestMutation.mutate(testCode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Enter Test Code</CardTitle>
              <CardDescription>
                Enter the test code provided by your instructor
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Test Code Input */}
              <form onSubmit={handleStartTest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testCode">Test Code</Label>
                  <Input
                    id="testCode"
                    type="text"
                    placeholder="Enter test code"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                    className="text-center text-lg"
                    required
                    disabled={authenticateTestMutation.isPending}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    authenticateTestMutation.isPending || !testCode.trim()
                  }
                >
                  {authenticateTestMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Start Test"
                  )}
                </Button>
              </form>

              {/* Instructions */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-center">Important Notes</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950 rounded">
                    <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-800 dark:text-amber-300">
                      Test runs in fullscreen mode
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-800 dark:text-blue-300">
                      Timer will be visible throughout
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-red-800 dark:text-red-300">
                      Tab switching will end the test
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestEntry;
