const postController = require("../controllers/post.Controller")

module.exports = [
    {
        method: "GET",
        path: "/posts",
        options: postController.getAllPosts
    },
    {
        method: "GET",
        path: "/posts/{id}",
        options: postController.getPostById
    },
    {
        method: "POST",
        path: "/posts",
        options: postController.createPost
    },
    {
        method: "PUT",
        path: "/posts/{id}",
        options: postController.updatePost
    },
    {
        method: "DELETE",
        path: "/posts/{id}",
        options: postController.deletePost
    },
];