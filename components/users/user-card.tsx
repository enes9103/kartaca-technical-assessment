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
      className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        <Image
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
        />
        <div>
          <h2 className="text-base font-semibold leading-6 text-slate-800">
            {user.firstName} {user.lastName}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {user.gender}, age {user.age}
          </p>

          {isAuthenticated ? (
            <>
              <p className="mt-2 text-xs text-slate-600">@{user.username}</p>
              <p className="mt-1 text-xs text-slate-600">{user.email}</p>
              <p className="mt-1 text-xs text-slate-500">
                {user.address?.city ?? "-"} / {user.company?.title ?? "-"}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
