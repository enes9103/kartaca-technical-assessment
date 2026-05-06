import { UserCard } from "@/components/users/user-card";
import type { UserItem } from "@/components/users/types";

type UsersGridProps = {
  users: UserItem[];
  isAuthenticated: boolean;
};

export function UsersGrid({ users, isAuthenticated }: UsersGridProps) {
  return (
    <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} isAuthenticated={isAuthenticated} />
      ))}
    </section>
  );
}
