"use client";

import Link from "next/link";
import Image from "next/image";

import { LogoutButton } from "@/components/auth/logout-button";
import { useAppSelector } from "@/lib/store/hooks";

export function AppHeader() {
  const authState = useAppSelector((state) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const userImage = authState.user?.image ?? "";
  const userName = authState.user
    ? `${authState.user.firstName} ${authState.user.lastName}`.trim()
    : "";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
        <div className="min-w-[220px] text-sm font-semibold tracking-wide text-slate-700">
          {isAuthenticated ? (
            <Link href="/users" className="inline-flex items-center gap-2 hover:text-slate-900">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                />
              ) : null}
              <span>Welcome, {userName}</span>
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
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
