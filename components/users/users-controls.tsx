"use client";

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
}: UsersControlsProps) {
  const filtersKey = `${selectedCity}|${selectedJobTitle}|${selectedGender}`;

  function makeQueryString(localParams: Record<string, string | undefined>) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(localParams)) {
      if (value && value.trim().length > 0) {
        query.set(key, value);
      }
    }

    return query.toString();
  }

  function buildBaseParams(overrides: Partial<UsersSearchParams> = {}) {
    const merged = {
      page: params.page,
      q: params.q,
      sortBy: params.sortBy,
      order: params.order,
      city: params.city,
      jobTitle: params.jobTitle,
      gender: params.gender,
      ...overrides,
    };

    return {
      page: merged.page,
      q: merged.q,
      sortBy: merged.sortBy,
      order: merged.order,
      city: merged.city,
      jobTitle: merged.jobTitle,
      gender: merged.gender,
    };
  }

  return (
    <section className="mt-4 space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/users?${makeQueryString(
              buildBaseParams({
                sortBy: firstNameSort.sortBy,
                order: firstNameSort.order,
                page: "1",
              }),
            )}`}
            className="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Sort by First Name
          </Link>
          <Link
            href={`/users?${makeQueryString(
              buildBaseParams({
                sortBy: ageSort.sortBy,
                order: ageSort.order,
                page: "1",
              }),
            )}`}
            className="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Sort by Age
          </Link>
          {(hasActiveFilter || hasSearch || (sortBy && order)) && (
            <Link
              href="/users"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </Link>
          )}
        </div>
      </div>

      <form
        id="users-controls-form"
        action="/users"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        {sortBy && order ? (
          <>
            <input type="hidden" name="sortBy" value={sortBy} />
            <input type="hidden" name="order" value={order} />
          </>
        ) : null}

        <div className="grid gap-3 md:grid-cols-12">
          <label className="md:col-span-2 space-y-2 text-sm font-medium text-slate-600">
            <span>City</span>
            <select
              key={`city-${filtersKey}`}
              name="city"
              defaultValue={selectedCity}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue) {
                  const form = event.currentTarget.form;
                  const jobTitleSelect = form?.elements.namedItem(
                    "jobTitle",
                  ) as HTMLSelectElement | null;
                  const genderSelect = form?.elements.namedItem(
                    "gender",
                  ) as HTMLSelectElement | null;
                  if (jobTitleSelect) {
                    jobTitleSelect.value = "";
                  }
                  if (genderSelect) {
                    genderSelect.value = "";
                  }
                }
              }}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="">All city</option>
              {filterOptions.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-4 space-y-2 text-sm font-medium text-slate-600">
            <span>Title</span>
            <select
              key={`jobTitle-${filtersKey}`}
              name="jobTitle"
              defaultValue={selectedJobTitle}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue) {
                  const form = event.currentTarget.form;
                  const citySelect = form?.elements.namedItem(
                    "city",
                  ) as HTMLSelectElement | null;
                  const genderSelect = form?.elements.namedItem(
                    "gender",
                  ) as HTMLSelectElement | null;
                  if (citySelect) {
                    citySelect.value = "";
                  }
                  if (genderSelect) {
                    genderSelect.value = "";
                  }
                }
              }}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="">All title</option>
              {filterOptions.jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2 space-y-2 text-sm font-medium text-slate-600">
            <span>Gender</span>
            <select
              key={`gender-${filtersKey}`}
              name="gender"
              defaultValue={selectedGender}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue) {
                  const form = event.currentTarget.form;
                  const citySelect = form?.elements.namedItem(
                    "city",
                  ) as HTMLSelectElement | null;
                  const jobTitleSelect = form?.elements.namedItem(
                    "jobTitle",
                  ) as HTMLSelectElement | null;
                  if (citySelect) {
                    citySelect.value = "";
                  }
                  if (jobTitleSelect) {
                    jobTitleSelect.value = "";
                  }
                }
              }}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
            >
              <option value="">All gender</option>
              {filterOptions.genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-12">
        <input
          form="users-controls-form"
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search"
          className="md:col-span-11 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500"
        />
        <button
          form="users-controls-form"
          type="submit"
          className="md:col-span-1 rounded-md bg-blue-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </section>
  );
}
