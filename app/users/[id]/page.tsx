import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserPostsEmptyState } from "@/components/user-detail/user-posts-empty-state";
import { UserPostsList } from "@/components/user-detail/user-posts-list";
import { UserPostsPagination } from "@/components/user-detail/user-posts-pagination";
import { UserProfileCard } from "@/components/user-detail/user-profile-card";
import type {
  UserDetail,
  UserPostsResponse,
} from "@/components/user-detail/types";

const POSTS_PAGE_SIZE = 2;

function getCurrentPage(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

async function fetchUserDetail(userId: string): Promise<UserDetail | null> {
  const response = await fetch(`https://dummyjson.com/users/${userId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as UserDetail;
}

async function fetchUserPosts(
  userId: string,
  page: number,
): Promise<UserPostsResponse | null> {
  const skip = (page - 1) * POSTS_PAGE_SIZE;
  const response = await fetch(
    `https://dummyjson.com/users/${userId}/posts?limit=${POSTS_PAGE_SIZE}&skip=${skip}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as UserPostsResponse;
}

async function ensureAuthenticated() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const response = await fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/login");
  }
}

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await ensureAuthenticated();

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = getCurrentPage(resolvedSearchParams.page);

  const [user, postsData] = await Promise.all([
    fetchUserDetail(resolvedParams.id),
    fetchUserPosts(resolvedParams.id, currentPage),
  ]);

  if (!user || !postsData) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-800">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">User detail could not be loaded.</p>
          <div className="mt-4">
            <Link
              href="/users"
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const safeLimit =
    Number.isFinite(postsData.limit) && postsData.limit > 0
      ? postsData.limit
      : POSTS_PAGE_SIZE;
  const hasPosts = postsData.total > 0 && postsData.posts.length > 0;
  const totalPages = Math.max(1, Math.ceil(postsData.total / safeLimit));
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Link
            href="/users"
            className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
          >
            <span aria-hidden="true">←</span>
            <span>Go to Main Page</span>
          </Link>
        </div>

        <UserProfileCard user={user} />

        <section className="mt-6">
          <div className="mb-3">
            <h2 className="text-3xl font-semibold text-slate-700">Posts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {postsData.posts.length} of {postsData.total} posts
            </p>
          </div>

          {hasPosts ? (
            <>
              <UserPostsList posts={postsData.posts} />
              <UserPostsPagination
                userId={resolvedParams.id}
                currentPage={currentPage}
                totalPages={totalPages}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            </>
          ) : (
            <UserPostsEmptyState />
          )}
        </section>
      </div>
    </main>
  );
}
