import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { toAuthUser } from "@/lib/utils/auth";

type DummyJsonLoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = body.username?.trim();
  const password = body.password?.trim();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as DummyJsonLoginResponse;

  if (!response.ok || !data.accessToken || !data.refreshToken) {
    return NextResponse.json(
      {
        message: data.message ?? "Authentication failed.",
      },
      { status: response.status },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  });

  cookieStore.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json(
    {
      user: toAuthUser(data as Required<DummyJsonLoginResponse>),
    },
    { status: 200 },
  );
}
