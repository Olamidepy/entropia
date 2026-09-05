import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LoadingState } from "@/components/shared/loading-state";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingState message="Initializing Entropia Console..." />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
