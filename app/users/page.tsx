"use client";

import Link from "next/link";

import { logoutRequested } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Users Route</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Users Page Skeleton
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => dispatch(logoutRequested())}
              className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Auth Overview</p>
          <p className="mt-3 text-lg font-medium capitalize">
            {authState.status}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {authState.isAuthenticated
              ? `Current user: ${authState.username}`
              : "User not authenticated yet"}
          </p>
        </div>
      </div>
    </main>
  );
}
