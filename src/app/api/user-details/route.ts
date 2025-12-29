import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({
            success: false,
            error: "unauthorized (user-details)"
        }, { status: 401 })
    }

    const userDeatils = await prisma.user.findFirst({
        where: {
            id: session.user.id!
        },
    })
    const userLinks =await prisma.link.findMany({
        where: {
            userId:session.user.id
        },
        include:{
            tags:true
        }
    })
    
    if (!userDeatils) {
        return NextResponse.json({
            success: false,
            error: "User not found or unauthorized"
        }, { status: 402 })
    }
    return NextResponse.json({
        success:true,
        userDeatils,
        userLinks
    })
}