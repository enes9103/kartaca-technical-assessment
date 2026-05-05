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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/users"
          className="text-sm font-semibold tracking-wide text-slate-100"
        >
          Employee Social
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <p className="text-sm text-slate-300">Welcome, {userName}</p>
          ) : null}

          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
