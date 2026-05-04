"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

import { loginRequested } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authState.isAuthenticated) {
      router.replace("/users");
    }
  }, [authState.isAuthenticated, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(
      loginRequested({
        username,
        password,
      }),
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-50">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm text-slate-400">Login Route</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Demo credentials: <span className="font-medium">demo / demo123</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 outline-none transition focus:border-cyan-400"
              placeholder="demo"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 outline-none transition focus:border-cyan-400"
              placeholder="demo123"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            {authState.status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">Auth State</p>
          <p className="mt-2 text-base font-medium capitalize">
            {authState.status}
          </p>
          {authState.error ? (
            <p className="mt-2 text-sm text-rose-300">{authState.error}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
