export default function ProgressIndicator({ answeredCount, totalQuestions }) {
  return (
    <div className="px-4 py-2 bg-white dark:bg-neutral-900">
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        Progress: {answeredCount}/{totalQuestions} questions answered
      </div>
    </div>
  );
}
