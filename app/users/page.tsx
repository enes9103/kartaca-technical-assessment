import { cookies } from "next/headers";

import type {
  SortState,
  UsersResponse,
  UsersSearchParams,
} from "@/components/users/types";
import { UserCard } from "@/components/users/user-card";
import { UsersControls } from "@/components/users/users-controls";
import { UsersPagination } from "@/components/users/users-pagination";

const PAGE_SIZE = 12;

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

function makeQueryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && value.trim().length > 0) {
      query.set(key, value);
    }
  }

  return query.toString();
}

function getSortState(
  currentSortBy: UsersSearchParams["sortBy"],
  currentOrder: UsersSearchParams["order"],
  targetField: "firstName" | "age",
): SortState {
  if (currentSortBy !== targetField) {
    return {
      sortBy: targetField,
      order: "asc" as const,
      label: "asc" as const,
    };
  }

  if (currentOrder === "asc") {
    return {
      sortBy: targetField,
      order: "desc" as const,
      label: "desc" as const,
    };
  }

  return {
    sortBy: undefined,
    order: undefined,
    label: "off" as const,
  };
}

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

function matchesActiveFilter(
  user: UsersResponse["users"][number],
  activeFilter: { field: "city" | "jobTitle" | "gender"; value: string },
) {
  if (activeFilter.field === "city") {
    return (user.address?.city ?? "") === activeFilter.value;
  }

  if (activeFilter.field === "jobTitle") {
    return (user.company?.title ?? "") === activeFilter.value;
  }

  return (user.gender ?? "") === activeFilter.value;
}

function buildBaseParams(
  current: UsersSearchParams,
  overrides: Partial<UsersSearchParams> = {},
) {
  const merged = {
    page: current.page,
    q: current.q,
    sortBy: current.sortBy,
    order: current.order,
    city: current.city,
    jobTitle: current.jobTitle,
    gender: current.gender,
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

function getActiveFilter(params: UsersSearchParams) {
  const city = params.city?.trim();
  const jobTitle = params.jobTitle?.trim();
  const gender = params.gender?.trim();

  if (city) {
    return { field: "city" as const, value: city };
  }

  if (jobTitle) {
    return { field: "jobTitle" as const, value: jobTitle };
  }

  if (gender) {
    return { field: "gender" as const, value: gender };
  }

  return null;
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
            <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {usersData.users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </section>

            <UsersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              prevPage={prevPage}
              nextPage={nextPage}
              params={params}
              makeQueryString={makeQueryString}
              buildBaseParams={buildBaseParams}
            />
          </>
        ) : (
          <section className="text-center mt-4 rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
            No results found for this search.
          </section>
        )}
      </div>
    </main>
  );
}
