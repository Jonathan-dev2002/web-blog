const { signToken } = require("../utils/jwt");
const userService = require("../services/user.service")
const validateZod = require("../validations/validateZod")
const Boom = require('@hapi/boom');

const { loginSchema , changePasswordSchema } = require("../validations/auth.validation")

const login = {
    description: "User login and get JWT token",
    tags: ["api", "auth"],
    auth: false,
    validate: {
        payload: validateZod(loginSchema)
    },
    handler: async (request, h) => {
        const { email, username, password } = request.payload;
        try {
            let user;

            if (email) {
                user = await userService.getUserByEmail(email);
            }
            else if (username) {
                user = await userService.getUserByUsername(username);
            }

            const passwordIsValid = user ? await userService.comparePassword(user, password) : false;
            if (!user || !passwordIsValid) {
                throw Boom.unauthorized("Invalid credentials");
            }

            const token = signToken({ sub: user.id, role: user.role });

            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role
            };
            return h.response({ token, user: safeUser }).code(200)
        } catch (error) {
            console.error("Login error:", error);
            if (error.isBoom) {
                throw error;
            }
            throw Boom.internal("An unexpected error occurred during login.");
        }
    }
}

const changePassword = {
    description: "Change the current user's password",
    tags: ["api", "auth"],
    validate: {
        payload: validateZod(changePasswordSchema),
    },
    handler: async (request, h) => {
        try {
            const userId = request.auth.credentials.sub; 
            const { currentPassword, newPassword } = request.payload;

            const result = await userService.updatePassword(
                userId,
                currentPassword,
                newPassword
            );

            if (!result.success) {
                if (result.error === 'INCORRECT_PASSWORD') {
                    throw Boom.unauthorized('Incorrect current password.');
                }
                throw Boom.badImplementation('Could not update password.');
            }

            return h.response({ message: "Password changed successfully" }).code(200);

        } catch (error) {
            console.error("Error changing password:", error);
            if (error.isBoom) {
                throw error;
            }
            throw Boom.internal("An unexpected error occurred while changing the password.");
        }
    }
};

module.exports = { login , changePassword};