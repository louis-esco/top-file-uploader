const { prisma } = require("./client");
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: async (username, password) => {
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hash,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user in db", error);
      throw error;
    }
  },
  findUserByUsername: async (username) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
      console.log("There was an error finding user in db", error);
      throw error;
    }
  },
  findUserById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      console.log("There was an error finding user in db", error);
      throw error;
    }
  },
};
