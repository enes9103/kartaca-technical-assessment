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
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage === 1
            ? "pointer-events-none border-slate-200 text-slate-400"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Prev
      </Link>

      <span className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
        {currentPage} / {totalPages}
      </span>

      <Link
        href={`/users?${makeQueryString(
          buildBaseParams(params, {
            page: String(nextPage),
          }),
        )}`}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage >= totalPages
            ? "pointer-events-none border-slate-200 text-slate-400"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
