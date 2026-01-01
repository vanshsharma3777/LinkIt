import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { User } from "../../generated/prisma/client";
import { Link } from "../../generated/prisma/client";
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            error: "unauthorized (user-details)"
        }, { status: 401 })
    }

    const userId = session.user.id!
    const cacheKey = `user:${userId}:links`;
    try {
        const cachedData = await redis.get(cacheKey)
        if (cachedData) {
            console.log("returning data from redis caching")
            return NextResponse.json({
                success: true,
                ...JSON.parse(cachedData),
                source: 'cache'
            })
        }
        console.log('Fetching from Database');

        const userDetails: User | null = await prisma.user.findFirst({
            where: {
                id: session.user.id!
            },
        })
        const userLinks = await prisma.link.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                tags: true
            }
        })

        if (!userDetails) {
            return NextResponse.json({
                success: false,
                error: "User not found or unauthorized"
            }, { status: 402 })
        }

        const responseData = {
            userDetails,
            userLinks
        }
        await redis.setex(
            cacheKey,
            300,
            JSON.stringify(responseData)
        )

        console.log('data cached in redis')
        return NextResponse.json({
            success: true,
            ...responseData,
            source: 'database' 
        });

    } catch (err) {
        console.error('Error:', err);
    return NextResponse.json({
      error: err,
        success: false,
      msg: "Server error"
    }, { status: 500 })
  }
    

}