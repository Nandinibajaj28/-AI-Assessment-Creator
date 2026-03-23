"use client";

type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text = "Generating assessment..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
}
