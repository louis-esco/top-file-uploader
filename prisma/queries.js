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
      console.error("There was an error finding user in db", error);
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
      console.error("There was an error finding user in db", error);
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
  getFolderById: async (folderId) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: {
          id: folderId,
        },
        include: {
          parent: true,
          children: true,
          file: true,
        },
      });
      return folder;
    } catch (error) {
      console.error("There was an error getting folder in db", error);
      throw error;
    }
  },
  getAllFolders: async () => {
    try {
      const folders = await prisma.folder.findMany();
      return folders;
    } catch (error) {
      console.error("There was an error getting all folders in db", error);
      throw error;
    }
  },
  updateFolderById: async (folderId, name) => {
    try {
      const folder = await prisma.folder.update({
        where: {
          id: folderId,
        },
        data: {
          name: name,
        },
      });
      return folder;
    } catch (error) {
      console.error("There was an error updating folder in db", error);
      throw error;
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
  getFolderFiles: async (folderId) => {
    try {
      const files = await prisma.file.findMany({
        where: {
          folderId: folderId,
        },
      });
      return files;
    } catch (error) {
      console.error("There was an error getting folder files in db", error);
      throw error;
    }
  },
  createFile: async (file) => {
    try {
      const response = await prisma.file.create({
        data: {
          name: file.name,
          size: file.size,
          link: file.url,
          folderId: file.folderId,
        },
      });
      return response;
    } catch (error) {
      console.error("There was an error creating file in db", error);
      throw error;
    }
  },
  createShareLink: async (link) => {
    try {
      const response = await prisma.link.create({
        data: {
          folderId: link.folderId,
          authorizedFolders: link.authorizedFolders,
          shareCode: link.shareCode,
          expires: link.expires,
        },
      });
      return response;
    } catch (error) {
      console.error("There was an error creating share link in db", error);
      throw error;
    }
  },
  getFileFromId: async (fileId) => {
    try {
      const file = await prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });
      return file;
    } catch (error) {
      console.error("There was an error getting file in db", error);
      throw error;
    }
  },
  getFolderByShareCode: async (shareCode) => {
    try {
      const folder = prisma.link.findUnique({
        where: {
          shareCode: shareCode,
        },
      });
      return folder;
    } catch (error) {
      console.error(
        "There was an error getting folder by share code in db",
        error
      );
      throw error;
    }
  },
};
