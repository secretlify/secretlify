import { AuthApi } from "@/lib/api/auth.api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/app/login", req.url));
  }

  try {
    const { token } = await AuthApi.loginGoogle(code);

    const res = NextResponse.redirect(new URL("/app/me", req.url));

    const store = await cookies();
    store.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    return NextResponse.redirect(
      new URL("/app/login?error=oauth_failed", req.url)
    );
  }
}
