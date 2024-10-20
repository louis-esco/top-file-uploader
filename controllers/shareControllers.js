const db = require("../prisma/queries");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const validateDuration = [
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration can't be empty")
    .isInt({ min: 1 })
    .withMessage("Please enter an integer higher than 0"),
];

const getAuthorizedFoldersIds = async (folderId) => {
  const folder = await db.getFolderById(folderId);
  if (!folder) throw new Error(`Folder Id ${folderId} doesn't exist in db`);

  const childrenArray = folder.children.map((child) => child.id);

  // Base case, no children in this folder, return empty array
  if (!childrenArray.length) return [folderId];

  const childResults = await Promise.all(
    childrenArray.map((childId) => getChildrenRecursive(childId))
  );

  return [folderId, ...childResults.flat()];
};

const getAllFoldersIds = async () => {
  const folders = await db.getAllFolders();
  const foldersIds = folders.map((folder) => folder.id);
  return foldersIds;
};

const getCreateShareLink = async (req, res, next) => {
  try {
    const currentFolder = req.params.folderId ? req.params.folderId : null;
    res.render("./share-link/create-share-link", {
      currentFolder: currentFolder,
    });
  } catch (error) {
    console.error("There was an error accessing share link form", error);
    next(error);
  }
};

const postCreateShareLink = [
  validateDuration,
  async (req, res, next) => {
    try {
      const currentFolder = req.params.folderId ? req.params.folderId : null;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("./share-link/create-share-link", {
          errors: errors.array(),
          currentFolder: currentFolder,
        });
      }

      const expires = new Date();
      expires.setHours(expires.getHours() + parseInt(req.body.duration));

      const folderId = req.params.folderId
        ? parseInt(req.params.folderId)
        : null;

      const authorizedFolders = rootFolder
        ? await getAuthorizedFoldersIds(rootFolder)
        : await getAllFoldersIds();

      const link = {
        folderId,
        authorizedFolders,
        shareCode: uuidv4(),
        expires,
      };
      const response = await db.createShareLink(link);
      const url =
        req.protocol +
        "://" +
        req.headers.host +
        "/share/" +
        response.shareCode;

      res.render("./share-link/display-share-link", {
        url: url,
        expires: response.expires,
      });
    } catch (error) {
      console.error("There was an error creating share link", error);
      next(error);
    }
  },
];

const getDisplaySharedFolderContent = async (req, res, next) => {
  try {
    const sharedFolder = await db.getFolderByShareCode(req.params.shareCode);

    if (!sharedFolder || sharedFolder.expires.getTime() < new Date().getTime())
      return res.redirect("/");

    const folderId = req.params.folderId
      ? parseInt(req.params.folderId)
      : sharedFolder.folderId;
    const folders = await db.getFoldersByParentId(folderId);
    const files = await db.getFolderFiles(folderId);
    const sharePrefix = "/share/" + req.params.shareCode;

    res.render("index", {
      folders: folders,
      files: files,
      currentFolder: folderId,
      share: sharePrefix,
    });
  } catch (error) {
    console.error("There was an error displaying shared folder content", error);
    next(error);
  }
};

module.exports = {
  getCreateShareLink,
  postCreateShareLink,
  getDisplaySharedFolderContent,
};
