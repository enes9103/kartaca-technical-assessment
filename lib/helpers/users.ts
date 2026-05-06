import type {
  SortState,
  UsersResponse,
  UsersSearchParams,
} from "@/components/users/types";

export function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export function makeQueryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && value.trim().length > 0) {
      query.set(key, value);
    }
  }

  return query.toString();
}

export function getSortState(
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

export function getActiveFilter(params: UsersSearchParams) {
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

export function matchesActiveFilter(
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

export function buildBaseParams(
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
