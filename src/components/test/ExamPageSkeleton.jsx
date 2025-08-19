import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExamPageSkeleton = () => {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 overflow-hidden">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-72 border-r border-neutral-200 dark:border-neutral-800 p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        {/* Question Content Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Question Info Bar Skeleton */}
          <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* Progress Indicator Skeleton */}
          <div className="h-2">
            <Skeleton className="h-full w-1/3" />
          </div>

          {/* Question Content Skeleton */}
          <div className="flex-1 overflow-auto p-4">
            <Card className="p-6 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-6" />

              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Navigation Controls Skeleton */}
          <div className="h-16 border-t border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPageSkeleton;
