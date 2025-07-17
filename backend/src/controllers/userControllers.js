const userService = require("../services/user.service")
const validateZod = require("../validations/validateZod")
const Boom = require('@hapi/boom');
const { idParamSchema, createUserSchema,updateUserSchema } = require('../validations/user.validation')

const getAllUsers = {
    description: "Get list of all users",
    tags: ["api", "user"],
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
const updateUser = {
    description: "Update User By Id",
    tags: ["api", "user"],
    auth: false,
    validate: {
        params: validateZod(idParamSchema),
        payload: validateZod(updateUserSchema),
    },
    handler: async (req, h) => {
        const { id } = req.params
        try {
            const update = await userService.updateUser(id, req.payload)
            return h.response(update).code(200)
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

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
};