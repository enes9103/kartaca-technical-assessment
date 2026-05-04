"use client";

import { useAppSelector } from "@/lib/store/hooks";

export default function Home() {
  const appState = useAppSelector((state) => state.app);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-slate-50">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-lg font-medium capitalize">
              {appState.status}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Initialized</p>
            <p className="mt-2 text-lg font-medium">
              {appState.initialized ? "Yes" : "No"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Message</p>
            <p className="mt-2 text-lg font-medium">{appState.message}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
