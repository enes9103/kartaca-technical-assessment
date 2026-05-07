"use client";

import { useState } from "react";
import Link from "next/link";

import { FilterSelect } from "@/components/users/filter-select";
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
  const [city, setCity] = useState(selectedCity);
  const [jobTitle, setJobTitle] = useState(selectedJobTitle);
  const [gender, setGender] = useState(selectedGender);

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
    <section key={filtersKey} className="mt-4 space-y-4">
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
        <input type="hidden" name="city" value={city} />
        <input type="hidden" name="jobTitle" value={jobTitle} />
        <input type="hidden" name="gender" value={gender} />

        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-2">
            <FilterSelect
              label="City"
              placeholder="All city"
              options={filterOptions.cities}
              value={city}
              onChange={(nextValue) => {
                setCity(nextValue);
                if (nextValue) {
                  setJobTitle("");
                  setGender("");
                }
              }}
            />
          </div>

          <div className="md:col-span-4">
            <FilterSelect
              label="Title"
              placeholder="All title"
              options={filterOptions.jobTitles}
              value={jobTitle}
              onChange={(nextValue) => {
                setJobTitle(nextValue);
                if (nextValue) {
                  setCity("");
                  setGender("");
                }
              }}
            />
          </div>

          <div className="md:col-span-2">
            <FilterSelect
              label="Gender"
              placeholder="All gender"
              options={filterOptions.genders}
              value={gender}
              onChange={(nextValue) => {
                setGender(nextValue);
                if (nextValue) {
                  setCity("");
                  setJobTitle("");
                }
              }}
            />
          </div>
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
