import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'desc'

    let whereCondition = category ? {
        category: {
            is: {
                name: category
            }
        },
        title: {
            contains: search,
        }
    } : {
        title: {
            contains: search,
        }
    }

    try {
        const getPosts = await prisma.post.findMany({
            where: whereCondition as any,
            orderBy: {
                createdAt: sort,
            } as any,
            include: {
                category: true
            }
        })
        return NextResponse.json(getPosts, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}

export const POST = async (request: NextRequest) => {

    const { title, content, categoryId } = await request.json()
    console.log({ title, content, categoryId });

    const newPost = {
        title: title,
        content: content,
        categoryId: Number(categoryId)
    }

    try {
        const addNewPost = await prisma.post.create({
            data: newPost
        })
        return NextResponse.json(addNewPost, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}