import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"
import { userNameSchema } from "@/lib/validations/user"

export const runtime = 'edge';

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function PATCH(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const token = await getToken({ req })

    if (!token || params.userId !== token.id) {
      return new Response(null, { status: 403 })
    }

    // Edit username based on input
    const body = await req.json() as any
    const payload = userNameSchema.parse(body)

    await db.user.update({
      where: {
        id: token.id as string,
      },
      data: {
        name: payload.name,
        updatedAt: new Date(),
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
