const postController = require("../controllers/post.Controller")
const { requireAdmin } = require("../utils/authorization");


module.exports = [
    {
        method: "GET",
        path: "/posts",
        options: postController.getAllPosts
    },
    {
        method: "GET",
        path: "/post/{id}",
        options: postController.getPostById
    },
    {
        method: "POST",
        path: "/post",
        options: postController.createPost
    },
    {
        method: "PUT",
        path: "/post/{id}",
        options: postController.updatePost
    },
    {
        method: "DELETE",
        path: "/post/{id}",
        options: postController.deletePost
    },
]