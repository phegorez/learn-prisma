import { NextRequest, NextResponse } from "next/server"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const postId = Number(params.id)
    try {
        const getPost = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                category: true
            }
        })
        return NextResponse.json(getPost, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const postId = Number(params.id)
    try {
        const { title, content, categoryId } = await request.json()
        const updatePost = await prisma.post.update({
            where: { id: postId },
            data: { title, content, categoryId: Number(categoryId) }
        })
        return NextResponse.json(updatePost, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {

    try {
        await prisma.post.delete({ where: { id: Number(params.id) } })
        return NextResponse.json('This post has been delete', { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}
