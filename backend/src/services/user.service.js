const prisma = require("../utils/prisma");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } })
}

const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({ where: { username } })
}

const comparePassword = async (user, plainPassword) => {
  return bcrypt.compare(plainPassword, user.password);
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany()

  // หรือจะสร้าง object ใหม่แบบนี้ก็ได้ (ปลอดภัยกว่า)
  /*
  const safeUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    username: user.username,
    // ... เอาฟิลด์อื่นๆ ที่ต้องการมาใส่ ...
  }));
  */

  const safeUser = users.map(user => {
    delete user.password
    return user
  })
  return safeUser
}

const getUserById = async (id) => {
  const users = await prisma.user.findUnique({ where: { id } })
  delete users.password
  return users
}

const createUser = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const createData = {
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    password: hashedPassword,
    displayName: data.displayName,
    photoURL: data.photoURL,
    bio: data.bio,
    role: data.role || 'USER'
  }
  const user = await prisma.user.create({ data: createData })

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }
}

const updateUser = async (id, data) => {
  return await prisma.user.update({ where: { id } ,data})
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  getUserByUsername,
  comparePassword,
  updateUser,
};