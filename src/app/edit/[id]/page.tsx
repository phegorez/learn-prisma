'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({ params }: { params: { id: string } }) => {

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [categoryId, setCategoryId] = useState<any>()
    const [categories, setCategories] = useState<Category[]>([])

    const { id } = params;
    const router = useRouter();

    //GET CURRENT POST
    const getPost = async () => {
        try {
            const response = await axios.get(`/api/posts/${id}`)
            setTitle(response.data.title)
            setContent(response.data.content)
            setCategoryId(response.data.categoryId)
        } catch (error) {
            console.log(error)
        }
    }

    //UPDATE LAST EDITED POST
    const updatePost = async (updatedPost: Post) => {
        try {
            await axios.put(`/api/posts/${id}`, updatedPost)
            router.push('/')
        } catch (erorr) {
            console.log(erorr);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const updatedPost = {
            title: title,
            content: content,
            categoryId: categoryId
        }
        await updatePost(updatedPost)
    }

    const getCategories = async () => {
        try {
            const response = await axios.get('/api/categories')
            setCategories(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (id) {
            getPost()
            getCategories()
        }
    }, [id])

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Edit Post {id}</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <label>Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((categoryTitle) => (
                            <option key={categoryTitle.id} value={categoryTitle.id}>{categoryTitle.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page