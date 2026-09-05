export function LoadingState({ message = "Calculating deterministic metrics..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-orange-100 border-t-[#FF6B00] animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
