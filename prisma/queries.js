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

  createFolder: async (name, parentId) => {
    try {
      let folder;
      if (parentId) {
        folder = await prisma.folder.create({
          data: {
            name: name,
            parentId: parentId,
          },
        });
      } else {
        folder = await prisma.folder.create({
          data: {
            name: name,
          },
        });
      }
      return folder;
    } catch (error) {
      console.error("There was an error creating folder", error);
      next(error);
    }
  },
  getFoldersByParentId: async (parentId) => {
    try {
      const folders = await prisma.folder.findMany({
        where: {
          parentId: parentId,
        },
        orderBy: {
          id: "asc",
        },
      });
      return folders;
    } catch (error) {
      console.error(
        "There was an error getting folder by parentId in db",
        error
      );
      throw error;
    }
  },
  deleteFolder: async (id) => {
    try {
      const folder = await prisma.folder.delete({
        where: {
          id: id,
        },
      });
      return folder;
    } catch (error) {
      console.error("There was an error deleting folder in db", error);
      throw error;
    }
  },
  getChildrenFolders: async (folderId) => {
    try {
      const folders = await prisma.folder.findMany({
        where: {
          parentId: folderId,
        },
      });
      return folders;
    } catch (error) {
      console.error("There was an error getting children folders in db", error);
      throw error;
    }
  },
};
