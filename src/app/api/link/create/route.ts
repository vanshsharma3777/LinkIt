import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
export async function POST(request: NextRequest) {
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
        select: {
            title: true,
            url: true,
            description: true,
            createdAt: true,
            tags: {
                select: {
                    name: true,
                },
            },
        },

    })

    const cacheKey = `user:${session.user.id!}:links`
    const isDel = await redis.del(cacheKey);
    console.log(isDel)
    if (isDel == 1) {
        console.log("New Link created so old cache deleted");
    } else {
        console.log("redis cache data cannot be deleted")
    }
    return NextResponse.json({
        success: true,
        newLink
    }, { status: 200 })
} 