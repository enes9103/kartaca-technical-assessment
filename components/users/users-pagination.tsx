import Link from "next/link";

import type { UsersSearchParams } from "@/components/users/types";

type UsersPaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPage: number;
  nextPage: number;
  params: UsersSearchParams;
  makeQueryString: (params: Record<string, string | undefined>) => string;
  buildBaseParams: (
    current: UsersSearchParams,
    overrides?: Partial<UsersSearchParams>,
  ) => Record<string, string | undefined>;
};

export function UsersPagination({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  params,
  makeQueryString,
  buildBaseParams,
}: UsersPaginationProps) {
  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      <Link
        href={`/users?${makeQueryString(
          buildBaseParams(params, {
            page: String(prevPage),
          }),
        )}`}
        className={`rounded-lg border px-3 py-2 text-sm ${
          currentPage === 1
            ? "pointer-events-none border-white/10 text-slate-500"
            : "border-white/20 text-slate-200 hover:bg-white/5"
        }`}
      >
        Prev
      </Link>

      <span className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300">
        {currentPage} / {totalPages}
      </span>

      <Link
        href={`/users?${makeQueryString(
          buildBaseParams(params, {
            page: String(nextPage),
          }),
        )}`}
        className={`rounded-lg border px-3 py-2 text-sm ${
          currentPage >= totalPages
            ? "pointer-events-none border-white/10 text-slate-500"
            : "border-white/20 text-slate-200 hover:bg-white/5"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
