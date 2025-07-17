const postService = require("../services/post.service");
const validateZod = require("../validations/validateZod");
const Boom = require('@hapi/boom');
const { idParamSchema, createPostSchema, updatePostSchema } = require("../validations/post.validation")

const getAllPosts = {
    description: "Get list of all Posts",
    tags: ["api", "post"],
    auth: false,
    handler: async (req, h) => {
        try {
            const data = await postService.getAllPosts()
            return h.response(data).code(200)
        } catch (error) {
            console.error("Error fetching posts:", error)
            throw Boom.internal("Failed to fetch posts")
        }
    }
}

const getPostById = {
    description: "Get list of all Posts",
    tags: ["api", "post"],
    auth: false,
    validate: {
        params: validateZod(idParamSchema)
    },
    handler: async (req, h) => {
        const { id } = req.params
        try {
            const data = await postService.getPostById(id)
            if (!data) {
                throw Boom.notFound("Post not found");
            }
            return h.response(data).code(200)

        } catch (error) {
            console.error("Error fetching post by ID:", error);
            if (error.isBoom) {
                throw error;
            }
            throw Boom.internal("An unexpected error occurred while fetching the post");
        }
    }
}

const createPost = {
    description: "Create a new post for the authenticated user",
    tags: ["api", "post"],
    validate: {
        payload: validateZod(createPostSchema)
    },
    handler: async (req, h) => {
        const authorId = req.auth.credentials.sub
        const postData = req.payload
        try {
            const data = await postService.createPost(authorId, postData)
            return h.response(data).code(201)

        } catch (error) {
            console.error("Error to create users:", error);

            if (error.code === 'P2025') {
                throw Boom.unauthorized("Author not found, please log in again.");
            }

            throw Boom.internal("An unexpected error occurred while creating the post.");
        }
    }
}
const updatePost = {
    description: "update a post",
    tags: ["api", "post"],
    validate: {
        params: validateZod(idParamSchema),
        payload: validateZod(updatePostSchema),
        
    },
    auth: false,
    handler: async (req, h) => {
        const { id } = req.params
        const updateData = req.payload
        try {
            const data = await postService.updatePost(id, updateData)
            return h.response(data).code(200)

        } catch (error) {
            console.error("Error updating post:", error);

            if (error.code === 'P2025') {
                throw Boom.notFound("Post with the specified ID was not found.");
            }

            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                throw Boom.conflict(`The ${field} is already taken by another post.`);
            }

            throw Boom.internal("An unexpected error occurred while updating the post.");
        }
    }
}

const deletePost = {
    description: "delete a post",
    tags: ["api", "post"],
    validate: {
        params: validateZod(idParamSchema)
    },
    auth: false,
    handler: async (req, h) => {
        const { id } = req.params
        try {
            const deletePost = await postService.deletePost(id)
            return h.response({
                message: "Post deleted successfully.",
                deletePostId: deletePost.id
            }).code(200);
        } catch (error) {
            console.error("Error deleting post:", error);

            if (error.code === 'P2025') {
                throw Boom.notFound("post with the specified ID was not found.");
            }

            throw Boom.internal("An unexpected error occurred while deleting the post.");
        }
    }
}



module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}