import { NextResponse, NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  // LIBERAR ABSOLUTAMENTE TUDO PARA O GABRIEL
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
