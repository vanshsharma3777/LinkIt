import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }){
    
    const {id:linkId} = await params
    console.log(linkId)
    const session = await auth()
    if(!session?.user){
        return NextResponse.json({
            success:false,
            error:"unauthorized (link/update)"
        },{status:401})
    }

    const doLinkExists = await prisma.link.findFirst({
        where:{
            id:linkId,
            userId:session.user.id!
        }
    })
    if(!doLinkExists){
        return NextResponse.json({
            success:false,
            error:"Link not exists or Unauthorized"
        },{status:402})
    }

    const {url , title , description , notes , tags } = await request.json()
    const tagArray = tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    const userId= session.user.id!
    const updatedLink = await prisma.link.update({
        where:{id:linkId},
        data:{
            url,
            description,
            title,
            notes,
            tags:{
                set:[],
                connectOrCreate:tagArray.map((tag:string)=>(
                    {
                    where:{name:tag},   
                    create:{name:tag}
                }
                ))
            }
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
    if (isDel==1){
            console.log("A Link is updated so old cache deleted");
    } else{
        console.log("redis cache data cannot be deleted")
    }
    return NextResponse.json({
        success:true,
        updatedLink
    },{status:200})
}


export async function GET(
     request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
   ){
    
    const {id:linkId} = await params
    const session = await auth()
    if(!session?.user){
        return NextResponse.json({
            success:false,
            error:"unauthorized (link/update)"
        },{status:401})
    }

    const doLinkExists = await prisma.link.findFirst({
        where:{
            id:linkId,
            userId:session.user.id!
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
    if(!doLinkExists){
        return NextResponse.json({
            success:false,
            error:"Link not exists or Unauthorized"
        },{status:402})
    }
    return NextResponse.json({
        success:true,
        doLinkExists
    },{status:200})
}
