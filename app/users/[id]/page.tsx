"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAppSelector } from "@/lib/store/hooks";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const authState = useAppSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-sm text-slate-400">User Detail Route</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          User #{params.id}
        </h1>
        
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Auth Snapshot</p>
          <p className="mt-2 text-lg font-medium capitalize">
            {authState.status}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {authState.isAuthenticated
              ? `Authenticated as ${authState.username}`
              : "No authenticated user"}
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href="/users"
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            Back to Users
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
