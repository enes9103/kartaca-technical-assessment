"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAppSelector } from "@/lib/store/hooks";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const authState = useAppSelector((state) => state.auth);
  const activeUser = authState.user
    ? `${authState.user.firstName} ${authState.user.lastName}`.trim()
    : "";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">User Detail Page</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
          User #{params.id}
        </h1>

        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Auth Snapshot</p>
          <p className="mt-1 text-base font-medium capitalize text-slate-700">
            {authState.status}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {authState.isAuthenticated
              ? `Authenticated as ${activeUser}`
              : "No authenticated user"}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/users"
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Back to Users
          </Link>
          <Link
            href="/login"
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
