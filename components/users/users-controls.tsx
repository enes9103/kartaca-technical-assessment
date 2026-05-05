import Link from "next/link";

import type { SortState, UsersSearchParams } from "@/components/users/types";

type FilterOptions = {
  cities: string[];
  jobTitles: string[];
  genders: string[];
};

type UsersControlsProps = {
  params: UsersSearchParams;
  q: string;
  sortBy?: "firstName" | "age";
  order?: "asc" | "desc";
  firstNameSort: SortState;
  ageSort: SortState;
  filterOptions: FilterOptions;
  selectedCity: string;
  selectedJobTitle: string;
  selectedGender: string;
  hasSearch: boolean;
  hasActiveFilter: boolean;
  makeQueryString: (params: Record<string, string | undefined>) => string;
  buildBaseParams: (
    current: UsersSearchParams,
    overrides?: Partial<UsersSearchParams>,
  ) => Record<string, string | undefined>;
};

export function UsersControls({
  params,
  q,
  sortBy,
  order,
  firstNameSort,
  ageSort,
  filterOptions,
  selectedCity,
  selectedJobTitle,
  selectedGender,
  hasSearch,
  hasActiveFilter,
  makeQueryString,
  buildBaseParams,
}: UsersControlsProps) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <form action="/users" className="grid gap-3 lg:grid-cols-12">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search all users"
          className="lg:col-span-5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
        />

        <select
          name="city"
          defaultValue={selectedCity}
          className="lg:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
        >
          <option value="">All City</option>
          {filterOptions.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          name="jobTitle"
          defaultValue={selectedJobTitle}
          className="lg:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
        >
          <option value="">All Title</option>
          {filterOptions.jobTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        <select
          name="gender"
          defaultValue={selectedGender}
          className="lg:col-span-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-500"
        >
          <option value="">All gender</option>
          {filterOptions.genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>

        <div className="lg:col-span-1 flex gap-2">
          {sortBy && order ? (
            <>
              <input type="hidden" name="sortBy" value={sortBy} />
              <input type="hidden" name="order" value={order} />
            </>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          href={`/users?${makeQueryString(
            buildBaseParams(params, {
              sortBy: firstNameSort.sortBy,
              order: firstNameSort.order,
              page: "1",
            }),
          )}`}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
        >
          Sort by Name ({firstNameSort.label})
        </Link>
        <Link
          href={`/users?${makeQueryString(
            buildBaseParams(params, {
              sortBy: ageSort.sortBy,
              order: ageSort.order,
              page: "1",
            }),
          )}`}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
        >
          Sort by Age ({ageSort.label})
        </Link>
        {(hasActiveFilter || hasSearch || (sortBy && order)) && (
          <Link
            href="/users"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
          >
            Clear
          </Link>
        )}
      </div>
    </section>
  );
}
