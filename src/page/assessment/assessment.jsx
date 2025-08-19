import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import TestHeader from "@/components/test/TestHeader";
import QuestionPalette from "@/components/test/QuestionPalette";
import QuestionRenderer from "@/components/test/QuestionRenderer";
import QuestionInfoBar from "@/components/test/QuestionInfoBar";
import ProgressIndicator from "@/components/test/ProgressIndicator";
import NavigationControls from "@/components/test/NavigationControls";
import EndTestDialog from "@/components/test/EndTestDialog";
import TimeUpDialog from "@/components/test/TimeUpDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize, Clock, Play, AlertTriangle } from "lucide-react";
import ExamPageSkeleton from "@/components/test/ExamPageSkeleton";
import axiosInstance from "@/lib/axios";

export default function AssessmentExamPage() {
  const navigate = useNavigate();
  const params = useParams();
  const isMobile = useIsMobile();

  const testId = params.id;
  const [isEndingTest, setIsEndingTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEndTestDialog, setShowEndTestDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [showFullscreenEntryDialog, setShowFullscreenEntryDialog] =
    useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [fullscreenWarningShown, setFullscreenWarningShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
  const [testData, setTestData] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testStartTime, setTestStartTime] = useState(null);
  const [tabSwitchWarningShown, setTabSwitchWarningShown] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showFullscreenDialog, setShowFullscreenDialog] = useState(false);
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.get(`/tests/take/${testId}`);

        if (!response.data.success) {
          toast.error(response.data.message || "Failed to load test data");
          navigate("/");
          return;
        }

        const { test } = response.data;
        setTestData(test);

        setCandidateData({
          email: "user@example.com",
          name: "Test User",
        });

        setTimeLeft(test.duration * 60);
        setIsLoading(false);

        // Check for existing session in localStorage
        const savedData = loadFromLocalStorage(testId);
        if (savedData && savedData.attemptId && savedData.testStarted) {
          // Resume existing test session
          setAnswers(savedData.answers || {});
          setMarkedForReview(savedData.markedForReview || {});
          if (savedData.timeLeft && savedData.timeLeft > 0) {
            setTimeLeft(savedData.timeLeft);
          }
          if (savedData.currentQuestionIndex !== undefined) {
            setCurrentQuestionIndex(savedData.currentQuestionIndex);
          }
          if (savedData.testStartTime) {
            setTestStartTime(new Date(savedData.testStartTime));
          }
          setAttemptId(savedData.attemptId);
          setTestStarted(true);
          setFullscreenEnabled(true);

          enterFullscreen();
        } else {
          setShowFullscreenEntryDialog(true);
        }
      } catch (error) {
        console.error("Error loading test data:", error);

        if (error.response?.status === 403) {
          toast.error(error.response.data.message || "Test is not available");
        } else if (error.response?.status === 404) {
          toast.error("Test not found");
        } else {
          toast.error("Failed to load test data. Please try again.");
        }

        navigate("/");
      }
    };

    if (testId) {
      loadTestData();
    }
  }, [testId, navigate]);

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(
        `test_${testId}`,
        JSON.stringify({
          ...data,
          lastSaved: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromLocalStorage = (testId) => {
    try {
      const savedData = localStorage.getItem(`test_${testId}`);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(`test_${testId}`);
      localStorage.removeItem("testData");
      localStorage.removeItem("candidateData");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }

      setIsFullScreen(true);
      setFullscreenEnabled(true);
      return true;
    } catch (error) {
      console.error("Error entering fullscreen:", error);
      toast.error("Failed to enter fullscreen mode");
      return false;
    }
  };

  const exitFullscreen = () => {
    try {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((error) => {
            console.error("Fullscreen exit failed:", error);
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      setIsFullScreen(false);
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
      setIsFullScreen(false);
    }
  };

  const handleFullscreenEntry = async () => {
    const success = await enterFullscreen();
    if (success) {
      setShowFullscreenEntryDialog(false);
      setShowStartTestDialog(true);
    }
  };

  const startTest = async () => {
    try {
      setShowStartTestDialog(false);

      if (attemptId) {
        setTestStarted(true);
        toast.success("Test resumed");
        return;
      }

      const startTime = new Date();
      const newAttemptId = `attempt_${Date.now()}`;
      setAttemptId(newAttemptId);
      setTestStartTime(startTime);

      saveToLocalStorage({
        attemptId: newAttemptId,
        timeLeft,
        currentQuestionIndex,
        answers,
        markedForReview,
        testStartTime: startTime.toISOString(),
        testStarted: true,
      });

      setTestStarted(true);
      toast.success("Test started successfully!");
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error("Failed to start test");
      setShowStartTestDialog(true);
    }
  };

  const currentQuestion = testData?.questions?.[currentQuestionIndex] || null;
  const answeredCount = Object.keys(answers).length;

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answer,
      };

      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex,
        answers: newAnswers,
        markedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });

      return newAnswers;
    });
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => {
      const newMarkedForReview = {
        ...prev,
        [questionId]: !prev[questionId],
      };

      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex,
        answers,
        markedForReview: newMarkedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });

      return newMarkedForReview;
    });
  };

  const goToQuestion = (index) => {
    if (testData && index >= 0 && index < testData.questions.length) {
      setCurrentQuestionIndex(index);
      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex: index,
        answers,
        markedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });
    }
  };

  const goToNextQuestion = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex: currentQuestionIndex + 1,
        answers,
        markedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex: currentQuestionIndex - 1,
        answers,
        markedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });
    }
  };

  const clearAnswer = () => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];

      saveToLocalStorage({
        attemptId,
        timeLeft,
        currentQuestionIndex,
        answers: newAnswers,
        markedForReview,
        testStartTime: testStartTime?.toISOString(),
        testStarted: true,
      });

      return newAnswers;
    });

    toast("Answer Cleared");
  };

  const endTest = async () => {
    try {
      setIsSubmitting(true);
      setIsEndingTest(true);

      if (!testData || !candidateData || !testStartTime) {
        throw new Error("Missing test data");
      }

      const endTime = new Date();

      // Prepare answers for submission according to backend format
      const submissionAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer: answer.values || answer.value,
          timeSpent: 0, // You can track this if needed
        })
      );

      const submissionData = {
        answers: submissionAnswers,
        startTime: testStartTime.toISOString(),
        endTime: endTime.toISOString(),
        userAgent: navigator.userAgent,
      };

      // Submit test to backend
      const response = await axiosInstance.post(
        `/tests/code/${testData.testCode}/submit`,
        submissionData
      );

      if (response.data.success) {
        toast.success("Test submitted successfully!");
        clearLocalStorage();
        exitFullscreen();

        // Navigate to results page with the result data
        navigate(`/test-results/${testId}`, {
          state: { result: response.data.result },
        });
      } else {
        throw new Error(response.data.message || "Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit test");
      }

      setIsSubmitting(false);
      setIsEndingTest(false);
    }
  };

  const preventCopyPasteCut = (e) => {
    if (
      (e.ctrlKey &&
        (e.key === "c" ||
          e.key === "v" ||
          e.key === "x" ||
          e.key === "a" ||
          e.key === "s")) ||
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.shiftKey && e.key === "J") ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      toast.error("This action is not allowed during the test");
      return false;
    }
  };

  const preventRightClick = (e) => {
    e.preventDefault();
    toast.error("Right-click is disabled during the test");
    return false;
  };

  const preventScreenshot = () => {
    document.body.style.webkitUserSelect = "none";
    document.body.style.userSelect = "none";
    document.body.style.webkitTouchCallout = "none";
    document.body.style.webkitTapHighlightColor = "transparent";

    document.addEventListener("keyup", (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        toast.error("Screenshots are not allowed during the test");
      }
    });
  };

  const handleVisibilityChange = () => {
    if (document.hidden && testStarted && !isEndingTest) {
      setTabSwitchCount((prev) => prev + 1);

      if (!tabSwitchWarningShown) {
        setTabSwitchWarningShown(true);
        toast.warning("Warning: Tab switching detected!", {
          description:
            "The test will be automatically submitted if you switch tabs again.",
          duration: 5000,
        });
      } else {
        toast.error("Test submitted due to tab switching", {
          description: "You have switched tabs multiple times.",
        });

        setTimeout(() => {
          endTest();
        }, 1500);
      }
    }
  };

  useEffect(() => {
    if (testStarted) {
      // Prevent copy, paste, cut
      document.addEventListener("keydown", preventCopyPasteCut);

      // Prevent right-click
      document.addEventListener("contextmenu", preventRightClick);

      // Prevent text selection
      document.addEventListener("selectstart", (e) => e.preventDefault());
      document.addEventListener("dragstart", (e) => e.preventDefault());

      // Handle tab switching
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Prevent screenshot attempts
      preventScreenshot();

      // Disable F12 and other dev tools shortcuts
      document.addEventListener("keydown", (e) => {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "C") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
          toast.error("Developer tools are disabled during the test");
        }
      });

      return () => {
        document.removeEventListener("keydown", preventCopyPasteCut);
        document.removeEventListener("contextmenu", preventRightClick);
        document.removeEventListener("selectstart", (e) => e.preventDefault());
        document.removeEventListener("dragstart", (e) => e.preventDefault());
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        // Reset body styles
        document.body.style.webkitUserSelect = "";
        document.body.style.userSelect = "";
        document.body.style.webkitTouchCallout = "";
        document.body.style.webkitTapHighlightColor = "";
      };
    }
  }, [testStarted, isEndingTest, tabSwitchWarningShown]);

  // Add focus/blur detection for additional tab switch detection
  useEffect(() => {
    if (testStarted) {
      const handleWindowBlur = () => {
        if (!isEndingTest) {
          console.log("Window lost focus - possible tab switch");
        }
      };

      const handleWindowFocus = () => {
        if (!isEndingTest) {
          console.log("Window gained focus");
        }
      };

      window.addEventListener("blur", handleWindowBlur);
      window.addEventListener("focus", handleWindowFocus);

      return () => {
        window.removeEventListener("blur", handleWindowBlur);
        window.removeEventListener("focus", handleWindowFocus);
      };
    }
  }, [testStarted, isEndingTest]);

  // Timer effect
  useEffect(() => {
    if (testStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev <= 1 ? 0 : prev - 1;

          if (prev % 10 === 0) {
            saveToLocalStorage({
              attemptId,
              timeLeft: newTimeLeft,
              currentQuestionIndex,
              answers,
              markedForReview,
              testStartTime: testStartTime?.toISOString(),
              testStarted: true,
            });
          }

          if (newTimeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowTimeUpDialog(true);
          }
          return newTimeLeft;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [
    testStarted,
    attemptId,
    currentQuestionIndex,
    answers,
    markedForReview,
    testStartTime,
  ]);

  // Time warnings
  useEffect(() => {
    if (timeLeft === 300) {
      toast("Time is running out!", {
        description: "You have 5 minutes remaining.",
      });
    } else if (timeLeft === 60) {
      toast("Time is almost up!", {
        description: "You have 1 minute remaining.",
      });
    }
  }, [timeLeft]);

  // Auto-save effect
  useEffect(() => {
    if (testStarted) {
      autoSaveRef.current = setInterval(() => {
        saveToLocalStorage({
          attemptId,
          timeLeft,
          currentQuestionIndex,
          answers,
          markedForReview,
          testStartTime: testStartTime?.toISOString(),
          testStarted: true,
        });
      }, 30000);

      return () => {
        if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      };
    }
  }, [
    testStarted,
    attemptId,
    timeLeft,
    currentQuestionIndex,
    answers,
    markedForReview,
    testStartTime,
  ]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(true);
      toast.success("You're back online");
    };

    const handleOffline = () => {
      setNetworkStatus(false);
      toast.error("You're offline", {
        description: "Your answers are being saved locally.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Prevent page refresh during test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (testStarted && !isEndingTest) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [testStarted, isEndingTest]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isInFullScreen);

      // Don't trigger warnings if user is intentionally ending the test
      if (!isInFullScreen && testStarted && !isEndingTest) {
        saveToLocalStorage({
          attemptId,
          timeLeft,
          currentQuestionIndex,
          answers,
          markedForReview,
          testStartTime: testStartTime?.toISOString(),
          testStarted: true,
        });

        if (!fullscreenWarningShown) {
          setShowFullscreenDialog(true);
          setFullscreenWarningShown(true);
        } else {
          toast.error(
            "Test automatically submitted due to exiting fullscreen mode"
          );

          setTimeout(() => {
            endTest();
          }, 1500);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [
    isFullScreen,
    fullscreenWarningShown,
    testStarted,
    isEndingTest,
    attemptId,
    timeLeft,
    currentQuestionIndex,
    answers,
    markedForReview,
    testStartTime,
  ]);

  const handleFullscreenDialogAction = (shouldEnterFullscreen) => {
    setShowFullscreenDialog(false);

    if (shouldEnterFullscreen) {
      enterFullscreen();
    } else {
      toast.error("Test will be submitted as fullscreen is required");
      setTimeout(() => {
        endTest();
      }, 1500);
    }
  };

  if (isLoading || !testData || !candidateData) {
    return <ExamPageSkeleton />;
  }

  return (
    <div
      className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 overflow-hidden"
      style={{
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Fullscreen Entry Dialog - Shows first when navigating from test-entry */}
      <Dialog
        open={showFullscreenEntryDialog}
        onOpenChange={() => {}} // Prevent closing by clicking outside
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Maximize className="h-5 w-5 text-primary" />
              Enter Fullscreen Mode
            </DialogTitle>
            <DialogDescription>
              This test must be taken in fullscreen mode for security purposes.
              Please click "Enter Fullscreen" to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
              <Maximize className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Fullscreen Required
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  The test will run in fullscreen mode. Exiting fullscreen will
                  submit your test automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Important Notice
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Make sure you're ready to start the test before proceeding.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate("/test-entry")}>
              Go Back
            </Button>
            <Button onClick={handleFullscreenEntry} className="gap-2">
              <Maximize className="h-4 w-4" />
              Enter Fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Test Dialog - Shows after fullscreen is enabled */}
      <Dialog
        open={showStartTestDialog}
        onOpenChange={() => {}} // Prevent closing by clicking outside
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start Test: {testData.title}</DialogTitle>
            <DialogDescription>
              You are about to start the test. Once started, the timer will
              begin and you must complete the test within the given time limit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Time Limit: {testData.duration} minutes
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  The test will automatically submit when time expires.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Security Notice
                </p>
                <p className="text-xs text-red-700 dark:text-red-400">
                  Tab switching, exiting fullscreen, or using browser shortcuts
                  will end the test.
                </p>
              </div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                Test Details:
              </p>
              <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                <li>• Total Questions: {testData.questions?.length || 0}</li>
                <li>• Duration: {testData.duration} minutes</li>
                <li>• Test Code: {testData.testCode || "N/A"}</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                exitFullscreen();
                navigate("/test-entry");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={startTest}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isSubmitting ? "Starting..." : "Start Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Warning Dialog - Shows when user exits fullscreen during test */}
      <Dialog open={showFullscreenDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Fullscreen Required
            </DialogTitle>
            <DialogDescription>
              You have exited fullscreen mode. The test must be taken in
              fullscreen mode for security purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Warning:</strong> If you exit fullscreen mode again,
                your test will be automatically submitted.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleFullscreenDialogAction(false)}
            >
              End Test
            </Button>
            <Button
              onClick={() => handleFullscreenDialogAction(true)}
              className="gap-2"
            >
              <Maximize className="h-4 w-4" />
              Enter Fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Interface - Only shows when test is started */}
      {testStarted && (
        <>
          <TestHeader
            title={testData.title}
            code={testData.testCode || "N/A"}
            type={testData.testType}
            timeLeft={formatTimeLeft()}
            timeWarning={timeLeft <= 300}
            togglePalette={() => setIsPaletteOpen(!isPaletteOpen)}
            showPaletteToggle={isMobile || window.innerWidth < 1024}
            onEndTest={() => setShowEndTestDialog(true)}
          />

          <div className="flex-1 flex overflow-hidden">
            <div
              className={`${
                isMobile || window.innerWidth < 1024
                  ? "hidden"
                  : "w-72 border-r border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <QuestionPalette
                questions={testData.questions}
                currentIndex={currentQuestionIndex}
                answers={answers}
                markedForReview={markedForReview}
                onSelectQuestion={goToQuestion}
                isMobile={false}
              />
            </div>

            <QuestionPalette
              questions={testData.questions}
              currentIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={goToQuestion}
              onClose={() => setIsPaletteOpen(false)}
              isMobileOpen={isPaletteOpen}
              isMobile={true}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
              <QuestionInfoBar
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={testData.questions.length}
                answers={answers}
                markedForReview={markedForReview}
                onClearAnswer={clearAnswer}
                onToggleMarkForReview={toggleMarkForReview}
                testDetails={{
                  title: testData.title,
                  code: testData.testCode || "N/A",
                  type: testData.testType,
                  totalQuestions: testData.questions.length,
                  marksPerQuestion: currentQuestion?.points || 0,
                }}
              />

              <ProgressIndicator
                answeredCount={answeredCount}
                totalQuestions={testData.questions.length}
              />

              <div className="flex-1 overflow-auto p-4">
                <Card className="p-6 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm">
                  {currentQuestion ? (
                    <QuestionRenderer
                      question={currentQuestion}
                      answer={answers[currentQuestion.id]}
                      onAnswerChange={(answer) =>
                        handleAnswerChange(currentQuestion.id, answer)
                      }
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p>No question available</p>
                    </div>
                  )}
                </Card>
              </div>

              <NavigationControls
                onPrevious={goToPreviousQuestion}
                onNext={goToNextQuestion}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={
                  currentQuestionIndex === testData.questions.length - 1
                }
              />
            </div>
          </div>
        </>
      )}

      {/* End Test Dialog */}
      <EndTestDialog
        open={showEndTestDialog}
        onOpenChange={setShowEndTestDialog}
        questions={testData.questions}
        answers={answers}
        markedForReview={markedForReview}
        onEndTest={endTest}
        isSubmitting={isSubmitting}
      />

      {/* Time Up Dialog */}
      <TimeUpDialog
        open={showTimeUpDialog}
        onOpenChange={setShowTimeUpDialog}
        questions={testData.questions}
        answers={answers}
        onEndTest={endTest}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
