import { ViewTransition, type ReactNode } from "react";

/** Route changes: old page lifts away, the new one wipes up (see ::view-transition-*(.page)). */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        {children}
      </main>
    </ViewTransition>
  );
}
