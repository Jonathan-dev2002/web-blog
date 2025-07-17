const userRoutes = require("./user.routes")
const authRoutes = require("./auth.routes")
const postRoutes = require("./post.routes")

module.exports = [
    ...userRoutes,
    ...authRoutes,
    ...postRoutes,
]