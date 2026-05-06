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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16 text-slate-800">
      <div className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-semibold tracking-tight text-slate-800">
          Welcome
        </h1>
        <p className="mt-2 text-center text-xs leading-5 text-slate-500">
          Demo credentials:{" "}
          <span className="font-medium">emilys / emilyspass</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
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
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
              placeholder="emilys"
            />
            {errors.username ? (
              <p className="mt-1 text-xs text-rose-500">{errors.username}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-600">
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
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
              placeholder="emilyspass"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={authState.status === "loading"}
            className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            {authState.status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>

        {authState.error ? (
          <p className="mt-3 text-center text-xs text-rose-600">
            {authState.error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-center">
          <Link
            href="/users"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Go to Main Page
          </Link>
        </div>
      </div>
    </main>
  );
}
