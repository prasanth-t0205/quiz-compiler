import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import TestDetailsForm from "@/components/admin/test-builder/TestDetailsForm";
import QuestionsSection from "@/components/admin/test-builder/QuestionsSection";
import TestSummary from "@/components/admin/test-builder/TestSummary";
import AdminLayout from "@/components/common/admin-layout";

export default function TestBuilderPage() {
  const router = useNavigate();
  const { id: testId } = useParams();
  const isEditing = Boolean(testId);

  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    type: "multiple-choice",
    duration: "60",
    passingScore: "70",
    shuffleQuestions: false,
    showResultsImmediately: true,
    visibility: "private",
    dueDate: null,
    scheduledDate: null,
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load test data for editing
  useEffect(() => {
    if (isEditing && testId) {
      loadTestData(testId);
    }
  }, [testId, isEditing]);

  const loadTestData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/tests/${id}`);

      if (response.data.success) {
        const test = response.data.test;

        setTestDetails({
          title: test.title || "",
          description: test.description || "",
          type: test.testType || "multiple-choice",
          duration: test.duration?.toString() || "60",
          passingScore: test.passingScore?.toString() || "70",
          shuffleQuestions: test.shuffleQuestions || false,
          showResultsImmediately: test.showResultsImmediately !== false,
          visibility: test.visibility || "private",
          dueDate: test.dueDate || null,
          scheduledDate: test.scheduledDate || null,
        });

        if (test.questions && test.questions.length > 0) {
          setQuestions(test.questions);
          // Set next question ID based on existing questions
          const maxId = Math.max(...test.questions.map((q) => q.id || 0));
          setCurrentQuestionId(maxId + 1);
        }
      }
    } catch (error) {
      console.error("Error loading test data:", error);
      toast.error("Failed to load test data");
      router("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestDetail = useCallback((key, value) => {
    setTestDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addQuestion = useCallback(
    (type) => {
      const baseQuestion = {
        id: currentQuestionId,
        type,
        text: "",
        points: 5,
      };

      const typeProperties = {
        "multiple-choice": {
          options: Array.from({ length: 4 }, (_, i) => ({
            id: i + 1,
            text: "",
            isCorrect: false,
          })),
        },
        "multiple-select": {
          options: Array.from({ length: 4 }, (_, i) => ({
            id: i + 1,
            text: "",
            isCorrect: false,
          })),
        },
        "true-false": {
          options: [
            { id: 1, text: "True", isCorrect: false },
            { id: 2, text: "False", isCorrect: false },
          ],
        },
        "short-answer": {
          correctAnswer: "",
        },
      };

      const newQuestion = { ...baseQuestion, ...typeProperties[type] };
      setQuestions((prev) => [...prev, newQuestion]);
      setCurrentQuestionId((prev) => prev + 1);
    },
    [currentQuestionId]
  );

  const removeQuestion = useCallback((id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const moveQuestion = useCallback((id, direction) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === prev.length - 1)
      ) {
        return prev;
      }

      const newQuestions = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[newIndex]] = [
        newQuestions[newIndex],
        newQuestions[index],
      ];
      return newQuestions;
    });
  }, []);

  const duplicateQuestion = useCallback(
    (id) => {
      setQuestions((prev) => {
        const questionToDuplicate = prev.find((q) => q.id === id);
        if (!questionToDuplicate) return prev;

        const newQuestion = {
          ...JSON.parse(JSON.stringify(questionToDuplicate)),
          id: currentQuestionId,
        };

        setCurrentQuestionId((prev) => prev + 1);
        return [...prev, newQuestion];
      });
    },
    [currentQuestionId]
  );

  const updateQuestionText = useCallback((id, text) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)));
  }, []);

  const updateOptionText = useCallback((questionId, optionId, text) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        if (optionId === "correctAnswer") {
          return { ...q, correctAnswer: text };
        } else {
          return {
            ...q,
            options: q.options?.map((o) =>
              o.id === optionId ? { ...o, text } : o
            ),
          };
        }
      })
    );
  }, []);

  const updateCorrectOption = useCallback((questionId, optionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options?.map((o) => ({
            ...o,
            isCorrect: o.id === optionId,
          })),
        };
      })
    );
  }, []);

  const updateMultipleCorrectOptions = useCallback((questionId, optionIds) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options?.map((o) => ({
            ...o,
            isCorrect: optionIds.includes(o.id),
          })),
        };
      })
    );
  }, []);

  const updateQuestionPoints = useCallback((id, points) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, points } : q))
    );
  }, []);

  const addOption = useCallback((questionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        const newOptionId =
          Math.max(...(q.options?.map((o) => o.id) || [0])) + 1;
        return {
          ...q,
          options: [
            ...(q.options || []),
            { id: newOptionId, text: "", isCorrect: false },
          ],
        };
      })
    );
  }, []);

  const removeOption = useCallback((questionId, optionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options?.filter((o) => o.id !== optionId),
        };
      })
    );
  }, []);

  const availableQuestionTypes = useMemo(() => {
    const typeMap = {
      "multiple-choice": ["multiple-choice", "multiple-select", "true-false"],
      mixed: [
        "multiple-choice",
        "multiple-select",
        "true-false",
        "short-answer",
      ],
    };

    return Array.from(typeMap[testDetails.type] || typeMap["multiple-choice"]);
  }, [testDetails.type]);

  const questionOperations = useMemo(
    () => ({
      add: addQuestion,
      remove: removeQuestion,
      move: moveQuestion,
      duplicate: duplicateQuestion,
      updateText: updateQuestionText,
      updateOptionText: updateOptionText,
      updateCorrectOption: updateCorrectOption,
      updateMultipleCorrectOptions: updateMultipleCorrectOptions,
      updatePoints: updateQuestionPoints,
      addOption: addOption,
      removeOption: removeOption,
    }),
    [
      addQuestion,
      removeQuestion,
      moveQuestion,
      duplicateQuestion,
      updateQuestionText,
      updateOptionText,
      updateCorrectOption,
      updateMultipleCorrectOptions,
      updateQuestionPoints,
      addOption,
      removeOption,
    ]
  );

  const validateTest = useCallback(() => {
    if (!testDetails.title.trim()) {
      toast.error("Test title is required");
      return false;
    }

    if (parseInt(testDetails.duration) <= 0) {
      toast.error("Test duration must be greater than 0");
      return false;
    }

    if (
      parseInt(testDetails.passingScore) < 0 ||
      parseInt(testDetails.passingScore) > 100
    ) {
      toast.error("Passing score must be between 0 and 100");
      return false;
    }

    if (questions.length === 0) {
      toast.error("At least one question is required");
      return false;
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        toast.error(`Question ${question.id} is missing text`);
        return false;
      }

      if (["multiple-choice", "multiple-select"].includes(question.type)) {
        if (question.options?.some((o) => !o.text.trim())) {
          toast.error(`Question ${question.id} has empty options`);
          return false;
        }

        const correctOptions =
          question.options?.filter((o) => o.isCorrect) || [];
        if (correctOptions.length === 0) {
          toast.error(`Question ${question.id} has no correct answer selected`);
          return false;
        }

        if (question.type === "multiple-choice" && correctOptions.length > 1) {
          toast.error(
            `Question ${question.id} should have only one correct answer`
          );
          return false;
        }
      }

      if (question.type === "true-false") {
        if (!question.options?.some((o) => o.isCorrect)) {
          toast.error(`Question ${question.id} has no correct answer selected`);
          return false;
        }
      }

      if (question.type === "short-answer") {
        if (!question.correctAnswer?.trim()) {
          toast.error(`Question ${question.id} is missing a correct answer`);
          return false;
        }
      }
    }

    return true;
  }, [questions, testDetails]);

  const handleSaveTest = useCallback(async () => {
    if (!validateTest()) return;

    setIsSaving(true);

    const testData = {
      title: testDetails.title,
      description: testDetails.description,
      testType: testDetails.type,
      duration: parseInt(testDetails.duration),
      passingScore: parseInt(testDetails.passingScore),
      questions,
      shuffleQuestions: testDetails.shuffleQuestions,
      showResultsImmediately: testDetails.showResultsImmediately,
      visibility: testDetails.visibility,
      dueDate: testDetails.dueDate || null,
      scheduledDate: testDetails.scheduledDate || null,
    };

    try {
      let response;

      if (isEditing) {
        response = await axiosInstance.put(`/tests/${testId}`, testData);
        toast.success("Test updated successfully!");
      } else {
        response = await axiosInstance.post("/tests", testData);
        toast.success("Test saved as draft successfully!");
      }

      if (response.data.success) {
        // Redirect to tests list after successful save
        setTimeout(() => {
          router("/admin");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving test:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save test. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [questions, testDetails, validateTest, router, isEditing, testId]);

  const handlePublishTest = useCallback(async () => {
    if (!validateTest()) return;

    setIsSaving(true);

    const testData = {
      title: testDetails.title,
      description: testDetails.description,
      testType: testDetails.type,
      duration: parseInt(testDetails.duration),
      passingScore: parseInt(testDetails.passingScore),
      questions,
      shuffleQuestions: testDetails.shuffleQuestions,
      showResultsImmediately: testDetails.showResultsImmediately,
      visibility: testDetails.visibility,
      dueDate: testDetails.dueDate || null,
      scheduledDate: testDetails.scheduledDate || null,
      status: "published",
    };

    try {
      let response;

      if (isEditing) {
        // Update test first, then publish
        await axiosInstance.put(`/tests/${testId}`, testData);
        response = await axiosInstance.patch(`/tests/${testId}/publish`);
      } else {
        // Create and publish in one go
        response = await axiosInstance.post("/tests", testData);
        if (response.data.success) {
          const newTestId = response.data.test._id;
          await axiosInstance.patch(`/tests/${newTestId}/publish`);
        }
      }

      toast.success("Test published successfully!");

      // Redirect to tests list after successful publish
      setTimeout(() => {
        router("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error publishing test:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to publish test. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [questions, testDetails, validateTest, router, isEditing, testId]);

  const handlePreviewTest = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Loading test data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {isEditing ? "Edit Test" : "Test Builder"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isEditing
                ? "Update your assessment test"
                : "Create a new assessment test"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TestDetailsForm
                testTitle={testDetails.title}
                setTestTitle={(value) => updateTestDetail("title", value)}
                testDescription={testDetails.description}
                setTestDescription={(value) =>
                  updateTestDetail("description", value)
                }
                testType={testDetails.type}
                setTestType={(value) => updateTestDetail("type", value)}
                testDuration={testDetails.duration}
                setTestDuration={(value) => updateTestDetail("duration", value)}
                passingScore={testDetails.passingScore}
                setPassingScore={(value) =>
                  updateTestDetail("passingScore", value)
                }
                visibility={testDetails.visibility}
                setVisibility={(value) => updateTestDetail("visibility", value)}
                shuffleQuestions={testDetails.shuffleQuestions}
                setShuffleQuestions={(value) =>
                  updateTestDetail("shuffleQuestions", value)
                }
                showResultsImmediately={testDetails.showResultsImmediately}
                setShowResultsImmediately={(value) =>
                  updateTestDetail("showResultsImmediately", value)
                }
                dueDate={testDetails.dueDate}
                setDueDate={(value) => updateTestDetail("dueDate", value)}
                scheduledDate={testDetails.scheduledDate}
                setScheduledDate={(value) =>
                  updateTestDetail("scheduledDate", value)
                }
              />

              <QuestionsSection
                questions={questions}
                availableQuestionTypes={availableQuestionTypes}
                showPreview={showPreview}
                handlePreviewTest={handlePreviewTest}
                questionOperations={questionOperations}
              />
            </div>
            <div className="lg:col-span-1">
              <TestSummary
                testDetails={testDetails}
                questions={questions}
                onSaveTest={handleSaveTest}
                onPublishTest={handlePublishTest}
                isSaving={isSaving}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
