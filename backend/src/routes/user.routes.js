const userController = require("../controllers/userControllers")

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
    }
]