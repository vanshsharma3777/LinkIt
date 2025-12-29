import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: linkId } = await params

  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "unauthorized (link/delete)" },
      { status: 401 }
    )
  }

  const doLinkExists = await prisma.link.findFirst({
    where: {
      id: linkId,
      userId: session.user.id!,
    },
  })

  if (!doLinkExists) {
    return NextResponse.json(
      { success: false, error: "Link not exists or Unauthorized" },
      { status: 403 }
    )
  }

  const deletedLink = await prisma.link.delete({
    where: { id: linkId },
  })

  return NextResponse.json(
    { success: true, deletedLink },
    { status: 200 }
  )
}
