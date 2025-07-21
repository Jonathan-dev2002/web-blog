const userController = require("../controllers/user.Controller")

module.exports = [
    // --- Admin Routes ---
    {
        method: "GET",
        path: "/admin/users",
        options: userController.getAllUsers
    },
    {
        method: "PUT",
        path: "/admin/users/{id}",
        options: userController.adminUpdateUser
    },
    {
        method: "DELETE",
        path: "/admin/users/{id}",
        options: userController.adminDeleteUser
    },
    {
        method: "PATCH",
        path: "/admin/users/{id}/status",
        options: userController.setUserStatus
    },

    // --- Public/User Routes ---
    {
        method: "GET",
        path: "/users/{id}",
        options: userController.getUserById
    },
    {
        method: "POST",
        path: "/users",
        options: userController.createUser
    },
    {
        method: "PUT",
        path: "/users/me",
        options: userController.updateCurrentUserProfile
    },
];