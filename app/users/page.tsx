import { cookies } from "next/headers";

import type {
  UsersResponse,
  UsersSearchParams,
} from "@/components/users/types";
import { UsersControls } from "@/components/users/users-controls";
import { UsersEmptyState } from "@/components/users/users-empty-state";
import { UsersGrid } from "@/components/users/users-grid";
import { UsersPagination } from "@/components/users/users-pagination";
import {
  buildBaseParams,
  getActiveFilter,
  getSortState,
  makeQueryString,
  matchesActiveFilter,
  toPositiveInt,
} from "@/lib/helpers/users";

const PAGE_SIZE = 12;

async function fetchUsers(url: string): Promise<UsersResponse> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }

  return (await response.json()) as UsersResponse;
}

async function fetchFilterOptions() {
  const response = await fetch("https://dummyjson.com/users?limit=0", {
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      cities: [] as string[],
      jobTitles: [] as string[],
      genders: [] as string[],
    };
  }

  const data = (await response.json()) as UsersResponse;

  const cities = Array.from(
    new Set(data.users.map((user) => user.address?.city).filter(Boolean)),
  ).sort((a, b) => a!.localeCompare(b!)) as string[];

  const jobTitles = Array.from(
    new Set(data.users.map((user) => user.company?.title).filter(Boolean)),
  ).sort((a, b) => a!.localeCompare(b!)) as string[];

  const genders = Array.from(
    new Set(data.users.map((user) => user.gender).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return { cities, jobTitles, genders };
}


export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<UsersSearchParams>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("accessToken")?.value);

  const currentPage = toPositiveInt(params.page, 1);
  const skip = (currentPage - 1) * PAGE_SIZE;
  const q = isAuthenticated ? params.q?.trim() ?? "" : "";
  const hasSearch = q.length > 0;
  const sortBy = isAuthenticated ? params.sortBy : undefined;
  const order = isAuthenticated ? params.order : undefined;

  const activeFilter = isAuthenticated ? getActiveFilter(params) : null;

  let usersData: UsersResponse;
  let totalPages = 1;

  if (hasSearch && activeFilter) {
    const searchAllQuery = new URLSearchParams({
      q,
      limit: "0",
    });

    if (sortBy && order) {
      searchAllQuery.set("sortBy", sortBy);
      searchAllQuery.set("order", order);
    }

    const searchAllData = await fetchUsers(
      `https://dummyjson.com/users/search?${searchAllQuery.toString()}`,
    );
    const filteredUsers = searchAllData.users.filter((user) =>
      matchesActiveFilter(user, activeFilter),
    );
    const pagedUsers = filteredUsers.slice(skip, skip + PAGE_SIZE);

    usersData = {
      users: pagedUsers,
      total: filteredUsers.length,
      skip,
      limit: PAGE_SIZE,
    };
    totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  } else {
    const endpoint = hasSearch
      ? "https://dummyjson.com/users/search"
      : activeFilter
        ? "https://dummyjson.com/users/filter"
        : "https://dummyjson.com/users";

    const query = new URLSearchParams({
      limit: String(PAGE_SIZE),
      skip: String(skip),
    });

    if (hasSearch) {
      query.set("q", q);
    }

    if (activeFilter) {
      const keyMap = {
        city: "address.city",
        jobTitle: "company.title",
        gender: "gender",
      } as const;
      query.set("key", keyMap[activeFilter.field]);
      query.set("value", activeFilter.value);
    }

    if (sortBy && order) {
      query.set("sortBy", sortBy);
      query.set("order", order);
    }

    if (!isAuthenticated) {
      query.set("select", "id,firstName,lastName,age,gender,image");
    }

    usersData = await fetchUsers(`${endpoint}?${query.toString()}`);
    totalPages = Math.max(1, Math.ceil(usersData.total / PAGE_SIZE));
  }

  const filterOptions = isAuthenticated
    ? await fetchFilterOptions()
    : { cities: [] as string[], jobTitles: [] as string[], genders: [] as string[] };

  const firstNameSort = getSortState(sortBy, order, "firstName");
  const ageSort = getSortState(sortBy, order, "age");

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const selectedCity = activeFilter?.field === "city" ? activeFilter.value : "";
  const selectedJobTitle =
    activeFilter?.field === "jobTitle" ? activeFilter.value : "";
  const selectedGender = activeFilter?.field === "gender" ? activeFilter.value : "";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        {isAuthenticated ? (
          <UsersControls
            params={params}
            q={q}
            sortBy={sortBy}
            order={order}
            firstNameSort={firstNameSort}
            ageSort={ageSort}
            filterOptions={filterOptions}
            selectedCity={selectedCity}
            selectedJobTitle={selectedJobTitle}
            selectedGender={selectedGender}
            hasSearch={hasSearch}
            hasActiveFilter={Boolean(activeFilter)}
          />
        ) : null}

        {usersData.users.length > 0 ? (
          <>
            <UsersGrid users={usersData.users} isAuthenticated={isAuthenticated} />

            <UsersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={usersData.total}
              pageSize={PAGE_SIZE}
              prevPage={prevPage}
              nextPage={nextPage}
              params={params}
              makeQueryString={makeQueryString}
              buildBaseParams={buildBaseParams}
            />
          </>
        ) : (
          <UsersEmptyState />
        )}
      </div>
    </main>
  );
}
