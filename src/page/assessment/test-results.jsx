import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";
import Header from "@/components/common/header";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const TestResults = () => {
  const navigate = useNavigate();
  const { id: testId } = useParams();

  const { data: testDetails, isLoading } = useQuery({
    queryKey: ["testDetails", testId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tests/take/${testId}`);
      return response.data.test;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-4">
        <Card className="max-w-md w-full p-8 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              Test Submitted Successfully
            </h1>

            {isLoading ? (
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-4 w-3/4"></div>
            ) : (
              <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                {testDetails?.title || "Test Title Not Available"}
              </h2>
            )}

            <p className="text-muted-foreground mb-6">
              Thank you for attending the test. Your responses have been
              recorded.
            </p>

            <Button onClick={() => navigate("/")} className="w-full gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground">
          If you have any questions, please contact the Manager.
        </p>
      </div>
    </div>
  );
};

export default TestResults;
