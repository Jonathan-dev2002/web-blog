const { z } = require('zod')

const idParamSchema = z.object({
  id: z.string().cuid({ message: "Invalid CUID format" }),
});

const createPostSchema = z.object({
    content: z.string().min(1,"content is require"),
})

const updatePostSchema = z.object({
    content: z.string().min(1,"content is require").optional()
})
module.exports = {
    idParamSchema,
    createPostSchema,
    updatePostSchema
}