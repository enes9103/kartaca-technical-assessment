import type { AuthUser } from "@/lib/features/auth/authTypes";

type DummyJsonAuthResponse = AuthUser & {
  accessToken?: string;
  refreshToken?: string;
};

export function toAuthUser(user: DummyJsonAuthResponse): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    image: user.image,
  };
}
