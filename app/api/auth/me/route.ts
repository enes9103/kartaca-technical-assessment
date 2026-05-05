import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { toAuthUser } from "@/lib/utils/auth";

type DummyJsonMeResponse = {
  message?: string;
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
};

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "No active session." }, { status: 401 });
  }

  const response = await fetch("https://dummyjson.com/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as DummyJsonMeResponse;

  if (!response.ok || !data.id) {
    return NextResponse.json(
      { message: data.message ?? "Session validation failed." },
      { status: response.status },
    );
  }

  return NextResponse.json(
    {
      user: toAuthUser(data as Required<DummyJsonMeResponse>),
    },
    { status: 200 },
  );
}
