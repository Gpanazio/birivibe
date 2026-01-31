import { NextResponse } from "next/server"

export default function middleware(req) {
  // LIBERAR ABSOLUTAMENTE TUDO PARA O GABRIEL
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
