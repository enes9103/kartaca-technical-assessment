export type UserDetail = {
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

export type PostItem = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: number | { likes: number; dislikes: number };
};

export type UserPostsResponse = {
  posts: PostItem[];
  total: number;
  skip: number;
  limit: number;
};
