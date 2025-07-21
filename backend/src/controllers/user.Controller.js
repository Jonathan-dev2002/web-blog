const userService = require("../services/user.service")
const validateZod = require("../validations/validateZod")
const Boom = require('@hapi/boom');
const { idParamSchema, createUserSchema, updateUserSchema, updateUserStatusSchema } = require('../validations/user.validation')

const getAllUsers = {
    description: "Get list of all users",
    tags: ["api", "user", "ADMIN"],
    auth: { scope: ['ADMIN'] },
    auth: false,
    handler: async (req, h) => {
        try {
            const user = await userService.getAllUsers()
            return h.response(user).code(200)

        } catch (error) {
            console.error("Error fetching users:", error);
            throw Boom.internal("Failed to fetch users");
        }
    }
}

const getUserById = {
    description: "Get Id of User",
    tags: ["api", "user"],
    auth: false,
    validate: {
        params: validateZod(idParamSchema)
    },
    handler: async (req, h) => {
        try {
            const { id } = req.params
            const user = await userService.getUserById(id)

            if (!user) {
                throw Boom.notFound("User not found");
            }

            return h.response(user).code(200)

        } catch (error) {
            console.error("Error fetching user by ID:", error);
            if (error.isBoom) {
                throw error;
            }
            throw Boom.internal("An unexpected error occurred while fetching the user");
        }
    }
}

const createUser = {
    description: "Create New User",
    tags: ["api", "user"],
    auth: false,
    validate: {
        payload: validateZod(createUserSchema)
    },
    handler: async (req, h) => {
        try {
            const dataUser = req.payload
            const createUser = await userService.createUser(dataUser)

            return h.response(createUser).code(201)
        } catch (error) {
            console.error("Error to create users:", error);

            if (error.code === 'P2002') {
                const field = error.meta.target[0];

                throw Boom.conflict(`The ${field} is already taken.`);
            }

            throw Boom.internal("An unexpected error occurred while creating the user.");
        }
    }
}
const updateCurrentUserProfile = {
    description: "Update the currently logged-in user's profile",
    tags: ["api", "user", "profile"],
    validate: {
        payload: validateZod(updateUserSchema),
    },
    handler: async (req, h) => {
        const userId = req.auth.credentials.sub
        try {
            const updatedUser = await userService.updateUserProfile(userId, req.payload);
            return h.response(updatedUser).code(200);
        } catch (error) {
            console.error("Error updating user:", error);

            if (error.code === 'P2025') {
                throw Boom.notFound("User with the specified ID was not found.");
            }

            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                throw Boom.conflict(`The ${field} is already taken by another user.`);
            }

            throw Boom.internal("An unexpected error occurred while updating the user.");
        }
    }
}

const adminUpdateUser = {
    description: "Update any user by ID (Admin only)",
    tags: ["api", "user", "admin"],
    auth: { scope: ['ADMIN'] },
    validate: {
        params: validateZod(idParamSchema),
        payload: validateZod(updateUserSchema),
    },
    handler: async (req, h) => {
        const { id } = req.params;
        try {
            const updatedUser = await userService.updateUserProfile(id, req.payload);
            return h.response(updatedUser).code(200);
        } catch (error) {
            console.error("Error updating user:", error);

            if (error.code === 'P2025') {
                throw Boom.notFound("User with the specified ID was not found.");
            }

            if (error.code === 'P2002') {
                const field = error.meta.target[0];
                throw Boom.conflict(`The ${field} is already taken by another user.`);
            }

            throw Boom.internal("An unexpected error occurred while updating the user.");
        }
    }
}

const adminDeleteUser = {
    description: "Delete a user by ID (Admin only)",
    tags: ["api", "user", "admin"],
    auth: { scope: ['ADMIN'] },
    validate: {
        params: validateZod(idParamSchema),
    },
    handler: async (req, h) => {
        const { id } = req.params
        try {
            const deleteUser = await userService.deleteUser(id)
            return h.response({
                message: "User deleted successfully.",
                deleteUserId: deleteUser.id
            }).code(200);
        } catch (error) {
            console.error("Error deleting user:", error);

            if (error.code === 'P2025') {
                throw Boom.notFound("User with the specified ID was not found.");
            }

            throw Boom.internal("An unexpected error occurred while deleting the user.");
        }
    }
}

const setUserStatus = {
    description: "Activate or Deactivate a user account (Admin only)",
    tags: ["api", "user", "admin"],
    auth: { scope: ['ADMIN'] },
    validate: {
        params: validateZod(idParamSchema),
        payload: validateZod(updateUserStatusSchema),
    },
    handler: async (req, h) => {
        const { id } = req.params;
        const { isActive } = req.payload;

        try {
            const updatedUser = await userService.setUserStatus(id, isActive);
            return h.response(updatedUser).code(200);

        } catch (error) {
            console.error(`Error setting user status for ID ${id}:`, error);

            if (error.code === 'P2025') {
                throw Boom.notFound("User with the specified ID was not found.");
            }

            throw Boom.internal("An unexpected error occurred while updating user status.");
        }
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    adminDeleteUser,
    setUserStatus,
    updateCurrentUserProfile,
    adminUpdateUser
};