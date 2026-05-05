"use client";

import { useRouter } from "next/navigation";

import { logoutRequested } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutRequested());
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
    >
      Logout
    </button>
  );
}
