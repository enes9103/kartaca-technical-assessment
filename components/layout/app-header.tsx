"use client";

import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { useAppSelector } from "@/lib/store/hooks";

export function AppHeader() {
  const authState = useAppSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const userName = authState.user
    ? `${authState.user.firstName} ${authState.user.lastName}`.trim()
    : "";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/users"
          className="text-sm font-semibold tracking-wide text-slate-700"
        >
          Employee Directory
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <p className="text-sm text-slate-600">Welcome, {userName}</p>
          ) : null}

          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
