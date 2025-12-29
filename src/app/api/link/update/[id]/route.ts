import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest,
   context: { params: Promise<{ id: string }> }){
    
    const {id:linkId} = await context.params
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

    const {url , title , description , notes , tags } = await req.json()
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
        include:{
            tags:true
        }
    })
    return NextResponse.json({
        success:true,
        updatedLink
    },{status:200})
}


export async function GET(req: NextRequest,
   context: { params: Promise<{ id: string }> }){
    
    const {id:linkId} = await context.params
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
        },
        include:{
            tags:true
        }
    })
    if(!doLinkExists){
        return NextResponse.json({
            success:false,
            error:"Link not exists or Unauthorized"
        },{status:402})
    }

    const userId= session.user.id!
    return NextResponse.json({
        success:true,
        doLinkExists
    },{status:200})
}
