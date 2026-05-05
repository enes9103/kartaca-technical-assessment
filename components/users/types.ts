export type UserItem = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  username?: string;
  email?: string;
  image: string;
  address?: {
    city?: string;
  };
  company?: {
    title?: string;
  };
};

export type UsersResponse = {
  users: UserItem[];
  total: number;
  skip: number;
  limit: number;
};

export type UsersSearchParams = {
  page?: string;
  q?: string;
  sortBy?: "firstName" | "age";
  order?: "asc" | "desc";
  city?: string;
  jobTitle?: string;
  gender?: string;
};

export type SortState = {
  sortBy?: "firstName" | "age";
  order?: "asc" | "desc";
  label: "asc" | "desc" | "off";
};
