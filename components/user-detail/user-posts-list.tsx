import type { PostItem } from "@/components/user-detail/types";

function getReactionCount(reactions: PostItem["reactions"]) {
  if (typeof reactions === "number") {
    return { likes: reactions, dislikes: 0 };
  }

  return reactions;
}

type UserPostsListProps = {
  posts: PostItem[];
};

export function UserPostsList({ posts }: UserPostsListProps) {
  return (
    <div className="space-y-3">
      {posts.map((post) => {
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
  );
}
