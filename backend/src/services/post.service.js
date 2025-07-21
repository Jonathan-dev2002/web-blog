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
const updatePost = async (postId, userId, data) => {
    return await prisma.post.update({
        where: { id: postId, authorId: userId },
        data
    });
};
const deletePost = async (postId, userId) => {
    return await prisma.post.delete({
        where: { id: postId, authorId: userId }
    });
};

const adminUpdatePost = async (postId, data) => {
    return await prisma.post.update({
        where: { id: postId },
        data
    });
};

const adminDeletePost = async (postId) => {
    return await prisma.post.delete({
        where: { id: postId }
    });
};
module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    adminUpdatePost,
    adminDeletePost
}