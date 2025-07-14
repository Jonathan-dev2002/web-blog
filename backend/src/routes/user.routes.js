const userController = require("")

module.exports = [
    {
        method: "GET",
        path: "/users",
        options: userController.getAllUsers
    }
]