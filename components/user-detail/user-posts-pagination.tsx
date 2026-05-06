import Link from "next/link";

type UserPostsPaginationProps = {
  userId: string;
  currentPage: number;
  totalPages: number;
  prevPage: number;
  nextPage: number;
};

export function UserPostsPagination({
  userId,
  currentPage,
  totalPages,
  prevPage,
  nextPage,
}: UserPostsPaginationProps) {
  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      <Link
        href={`/users/${userId}?page=${prevPage}`}
        className={`rounded border px-3 py-1.5 text-sm ${
          currentPage === 1
            ? "pointer-events-none border-slate-200 text-slate-400"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Prev
      </Link>
      <span className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
        {currentPage} / {totalPages}
      </span>
      <Link
        href={`/users/${userId}?page=${nextPage}`}
        className={`rounded border px-3 py-1.5 text-sm ${
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
