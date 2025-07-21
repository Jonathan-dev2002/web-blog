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
    description: "Update a post. Allowed for the post owner or an admin.",
    tags: ["api", "post"],
    validate: {
        params: validateZod(idParamSchema),
        payload: validateZod(updatePostSchema),
    },
    handler: async (req, h) => {
        const postId = req.params.id;
        const { sub: userId, role: userRole } = req.auth.credentials;
        const updateData = req.payload;

        try {
            let updatedPost;

            if (userRole === 'ADMIN') {
                updatedPost = await postService.adminUpdatePost(postId, updateData);
            } else {
                updatedPost = await postService.updatePost(postId, userId, updateData);
            }

            return h.response(updatedPost).code(200);

        } catch (error) {
            console.error("Error updating post:", error);
            if (error.code === 'P2025') {
                throw Boom.forbidden("You are not allowed to edit this post or it does not exist.");
            }
            throw Boom.internal("An unexpected error occurred while updating the post.");
        }
    }
};

const deletePost = {
    description: "Delete a post. Allowed for the post owner or an admin.",
    tags: ["api", "post"],
    validate: {
        params: validateZod(idParamSchema)
    },
    handler: async (req, h) => {
        const postId = req.params.id;
        const { sub: userId, role: userRole } = req.auth.credentials;

        try {
            let deletedPost;

            if (userRole === 'ADMIN') {
                deletedPost = await postService.adminDeletePost(postId);
            } else {
                deletedPost = await postService.deletePost(postId, userId);
            }

            return h.response({
                message: "Post deleted successfully.",
                deletedPostId: deletedPost.id
            }).code(200);
        } catch (error) {
            console.error("Error deleting post:", error);
            if (error.code === 'P2025') {
                throw Boom.forbidden("You are not allowed to delete this post or it does not exist.");
            }
            throw Boom.internal("An unexpected error occurred while deleting the post.");
        }
    }
};



module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
}