export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label={label}>
      <span className="size-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
    </div>
  );
}
