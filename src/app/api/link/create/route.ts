import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
export async function POST(request: NextRequest ) {
    const session = await auth()
    console.log(session)
    console.log("Cookies:", request.cookies.getAll())
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized (link/create)"
        }, { status: 401 })
    }

    const { url, title, id, description, notes, tags, userId } = await request.json()
    const tagArray = tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)

    const newLink = await prisma.link.create({
        data: {
            url,
            title,
            description,
            notes,
            userId: session.user.id!,
            tags: {
                connectOrCreate: tagArray.map((tag: string) => ({
                    where: {
                        name: tag,
                    },
                    create: {
                        name: tag,
                    },
                })),
            },
        },
        include: {
            tags: true
        }
    })
    return NextResponse.json({
        success: true,
        newLink
    }, { status: 200 })
}