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
      className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
    >
      Logout
    </button>
  );
}
