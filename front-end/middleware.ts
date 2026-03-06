import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const i18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  return i18nRouting(request);
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
