const prisma = require("../utils/prisma")

const getAllPosts = async () => {
    return await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: { displayName: true, photoURL: true }
            }
        }
    })
}

const getPostById = async (id) => {
    return await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    displayName: true,
                    photoURL: true
                }
            },
        }
    });
};
const createPost = async (authorId, postData) => {
    return await prisma.post.create({
        data: {
            content: postData.content,
            imageUrl: postData.imageUrl,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    });
}
const updatePost = async (id, data) => {
    return await prisma.post.update({ where: { id }, data})
}
const deletePost = async (id) => {
    return await prisma.post.delete({ where: { id } })
}
module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}