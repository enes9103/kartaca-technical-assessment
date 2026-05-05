import Image from "next/image";
import Link from "next/link";

import type { UserItem } from "@/components/users/types";

type UserCardProps = {
  user: UserItem;
  isAuthenticated: boolean;
};

export function UserCard({ user, isAuthenticated }: UserCardProps) {
  return (
    <Link
      href={isAuthenticated ? `/users/${user.id}` : "/login"}
      className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-400/40 hover:bg-slate-900"
    >
      <div className="flex items-start gap-4">
        <Image
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold leading-6">
            {user.firstName} {user.lastName}
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            {user.gender}, age {user.age}
          </p>

          {isAuthenticated ? (
            <>
              <p className="mt-2 text-xs text-slate-300">@{user.username}</p>
              <p className="mt-1 text-xs text-slate-300">{user.email}</p>
              <p className="mt-1 text-xs text-slate-300">
                {user.address?.city ?? "-"} / {user.company?.title ?? "-"}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
