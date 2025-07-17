const { z } = require('zod')
const { Role } = require('@prisma/client')

const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(6,"username is require"),
  firstName: z.string().min(1,"firstname is require").optional(),
  lastName: z.string().min(1,"lastname is require").optional(),
  password: z.string().min(6,"password must be at least 6 characters"),
  displayName: z.string().min(1).optional(),
  photoURL: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  role: z.nativeEnum(Role).optional()
})

const idParamSchema = z.object({
  id: z.string().cuid({ message: "Invalid CUID format" }),
});

const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z.string().min(6,"username is require").optional(),
  firstName: z.string().min(1,"firstname is require").optional(),
  lastName: z.string().min(1,"lastname is require").optional(),
  displayName: z.string().min(1).optional(),
  photoURL: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  role: z.nativeEnum(Role).optional()
})

const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive field is required",
    invalid_type_error: "isActive must be a boolean",
  }),
});

module.exports = {
    idParamSchema,
    createUserSchema,
    updateUserSchema,
    updateUserStatusSchema,
}