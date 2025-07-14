const { ZodError } = require("zod");

const validateZod = (schema) => async (value, options) => {
  try {
    await schema.parseAsync(value);
  } catch (err) {
    if (err instanceof ZodError) {
      
      const messages = err.issues.map((i) => i.message).join(", ");
      throw new Error(`Validation error: ${messages}`);
    }
    throw err;
  }
};

module.exports = validateZod;