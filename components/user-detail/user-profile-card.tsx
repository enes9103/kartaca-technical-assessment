import Image from "next/image";

import type { UserDetail } from "@/components/user-detail/types";

function MetaIcon({ kind }: { kind: "title" | "age" | "user" | "email" }) {
  if (kind === "title") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <path
          d="M4 7h16M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7M6 7l1 11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "age") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 13V9.5M12 13l2.5 1.5M9 3h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5.5 19a6.5 6.5 0 0 1 13 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5 8 7 5 7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type UserProfileCardProps = {
  user: UserDetail;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-4">
        <Image
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          width={60}
          height={60}
          className="rounded-full border border-slate-200 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </h1>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {user.gender}
            </span>
          </div>

          <div className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MetaIcon kind="title" />
              <span>Title:</span>
              <span>{user.company?.title ?? "-"}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MetaIcon kind="user" />
              <span>Username:</span>
              <span className="font-medium text-blue-700">@{user.username}</span>
            </p>

            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MetaIcon kind="age" />
              <span>Age:</span>
              <span>{user.age} years old</span>
            </p>
            <p className="min-w-0 flex items-center gap-2 text-sm text-slate-600">
              <MetaIcon kind="email" />
              <span>Email:</span>
              <span className="min-w-0 break-all text-blue-700">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
