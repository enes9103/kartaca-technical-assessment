import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserDetail = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  username: string;
  email: string;
  gender: string;
  image: string;
  company?: {
    title?: string;
  };
};

type PostItem = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: number | { likes: number; dislikes: number };
};

type UserPostsResponse = {
  posts: PostItem[];
  total: number;
  skip: number;
  limit: number;
};

const POSTS_PAGE_SIZE = 2;

function MetaIcon({ kind }: { kind: "title" | "age" | "user" | "email" }) {
  if (kind === "title") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <path
          d="M4 7h16M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7M6 7l1 11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "age") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <circle cx="12" cy="13" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 13V9.5M12 13l2.5 1.5M9 3h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5.5 19a6.5 6.5 0 0 1 13 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" aria-hidden="true">
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5 8 7 5 7-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getCurrentPage(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function getReactionCount(reactions: PostItem["reactions"]) {
  if (typeof reactions === "number") {
    return { likes: reactions, dislikes: 0 };
  }

  return reactions;
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

  const totalPages = Math.max(1, Math.ceil(postsData.total / postsData.limit));
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

        <section className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-4">
            <Image
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              width={60}
              height={60}
              className="rounded-full border border-slate-200 object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-800">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {user.gender}
                </span>
              </div>

              <div className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MetaIcon kind="title" />
                  <span>Title:</span>
                  <span>{user.company?.title ?? "-"}</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MetaIcon kind="user" />
                  <span>Username:</span>
                  <span className="font-medium text-blue-700">@{user.username}</span>
                </p>

                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MetaIcon kind="age" />
                  <span>Age:</span>
                  <span>{user.age} years old</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <MetaIcon kind="email" />
                  <span>Email:</span>
                  <span className="text-blue-700">{user.email}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3">
            <h2 className="text-3xl font-semibold text-slate-700">Posts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {postsData.posts.length} of {postsData.total} posts
            </p>
          </div>

          <div className="space-y-3">
            {postsData.posts.map((post) => {
              const reactions = getReactionCount(post.reactions);

              return (
                <article
                  key={post.id}
                  className="rounded-md border border-slate-200 bg-white p-4"
                >
                  <h3 className="text-xl font-semibold text-slate-800">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.body}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={`${post.id}-${tag}`}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600">↑ {reactions.likes}</span>
                      <span className="text-rose-600">↓ {reactions.dislikes}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <nav className="mt-6 flex items-center justify-center gap-2">
            <Link
              href={`/users/${resolvedParams.id}?page=${prevPage}`}
              className={`rounded border px-3 py-1.5 text-sm ${
                currentPage === 1
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Prev
            </Link>
            <span className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <Link
              href={`/users/${resolvedParams.id}?page=${nextPage}`}
              className={`rounded border px-3 py-1.5 text-sm ${
                currentPage >= totalPages
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Next
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
