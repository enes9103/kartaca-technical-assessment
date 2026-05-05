"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { loginRequested } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (authState.isAuthenticated) {
      router.replace("/users");
    }
  }, [authState.isAuthenticated, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      username?: string;
      password?: string;
    } = {};

    if (!username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    dispatch(
      loginRequested({
        username: username.trim(),
        password: password.trim(),
      }),
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-50">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm text-slate-400">Login Route</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Demo credentials:{" "}
          <span className="font-medium">emilys / emilyspass</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (errors.username) {
                  setErrors((current) => ({ ...current, username: undefined }));
                }
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 outline-none transition focus:border-cyan-400"
              placeholder="emilys"
            />
            {errors.username ? (
              <p className="mt-2 text-sm text-rose-300">{errors.username}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((current) => ({ ...current, password: undefined }));
                }
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 outline-none transition focus:border-cyan-400"
              placeholder="emilyspass"
            />
            {errors.password ? (
              <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={authState.status === "loading"}
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
          {authState.user ? (
            <p className="mt-2 text-sm text-emerald-300">
              Session ready for {authState.user.firstName}{" "}
              {authState.user.lastName}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/users"
            className="rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            Users
          </Link>
        </div>
      </div>
    </main>
  );
}
