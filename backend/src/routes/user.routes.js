const userController = require("../controllers/user.Controller")

module.exports = [
    {
        method: "GET",
        path: "/users",
        options: userController.getAllUsers
    },
    {
        method: "GET",
        path: "/users/{id}",
        options: userController.getUserById
    },
    {
        method: "POST",
        path: "/users",
        options:userController.createUser
    },
    {
        method: "PUT",
        path: "/users/{id}",
        options:userController.updateUser
    },
    {
        method: "PUT",
        path: "/profile/users",
        options:userController.updateUserProfile
    },
    {
        method: "DELETE",
        path: "/users/{id}",
        options:userController.deleteUser
    },
    {
        method: "PATCH",
        path: "/users/{id}/status",
        options: userController.setUserStatus
    }
]