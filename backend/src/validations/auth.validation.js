const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  username: z.string().min(6, 'Username must be at least 6 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.email || data.username, {
  message: "Either email or username is required",
  path: ["email", "username"], // ระบุว่า error นี้เกี่ยวกับ field ไหน
});

module.exports = { loginSchema };