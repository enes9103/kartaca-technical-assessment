import Link from "next/link";

import type { UsersSearchParams } from "@/components/users/types";

type UsersPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
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
  totalItems,
  pageSize,
  prevPage,
  nextPage,
  params,
  makeQueryString,
  buildBaseParams,
}: UsersPaginationProps) {
  const startResult = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endResult = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const pageItems: Array<number | "..."> = [];
  const addPage = (page: number) => {
    if (!pageItems.includes(page)) {
      pageItems.push(page);
    }
  };

  addPage(1);
  addPage(totalPages);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      addPage(page);
    }
  }

  const sortedPages = pageItems
    .filter((item): item is number => typeof item === "number")
    .sort((a, b) => a - b);

  const displayItems: Array<number | "..."> = [];
  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const prev = sortedPages[index - 1];

    if (index > 0 && prev !== undefined && page - prev > 1) {
      displayItems.push("...");
    }

    displayItems.push(page);
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-end gap-4">
      <p className="text-sm text-slate-600">
        {startResult}-{endResult} of {totalItems} results
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={`/users?${makeQueryString(
            buildBaseParams(params, {
              page: String(prevPage),
            }),
          )}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
            currentPage === 1
              ? "pointer-events-none border-slate-200 bg-white text-slate-300"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label="Previous page"
        >
          ‹
        </Link>

        {displayItems.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-500">
              ...
            </span>
          ) : (
            <Link
              key={`page-${item}`}
              href={`/users?${makeQueryString(
                buildBaseParams(params, {
                  page: String(item),
                }),
              )}`}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm ${
                item === currentPage
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          ),
        )}

        <Link
          href={`/users?${makeQueryString(
            buildBaseParams(params, {
              page: String(nextPage),
            }),
          )}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
            currentPage >= totalPages
              ? "pointer-events-none border-slate-200 bg-white text-slate-300"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          aria-label="Next page"
        >
          ›
        </Link>
      </div>
    </nav>
  );
}
