const db = require("../prisma/queries");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const postUpload = async (req, res, next) => {
  try {
    upload.single("uploaded_file")(req, res, next);
    res.redirect("/");
  } catch (error) {
    console.error("There was an error uploading file", error);
    next(error);
  }
};

const postNewFolder = async (req, res, next) => {
  try {
    const parentId = req.params.folderId ? parseInt(req.params.folderId) : null;
    await db.createFolder(req.body.folder, parentId);
    res.redirect(req.get("Referrer"));
  } catch (error) {
    console.error("There was an error creating new folder", error);
    next(error);
  }
};

const getDeleteFolder = async (req, res, next) => {
  try {
    await db.deleteFolder(parseInt(req.params.folderId));
    res.redirect(req.get("Referrer"));
  } catch (error) {
    console.error("There was an error deleting folder", error);
    next(error);
  }
};

const getDisplayChildrenFolders = async (req, res, next) => {
  try {
    const folders = await db.getChildrenFolders(parseInt(req.params.folderId));
    res.render("index", {
      isAuth: req.isAuthenticated(),
      folders: folders,
      currentFolder: req.params.folderId,
    });
  } catch (error) {
    console.error("There was an error displaying children folders", error);
    next(error);
  }
};

const getUpdateFolder = async (req, res, next) => {
  try {
    const folder = await db.getFolderById(parseInt(req.params.folderId));
    res.render("./files/update-folder", {
      isAuth: req.isAuthenticated(),
      folder: folder,
    });
  } catch (error) {
    console.error("There was an error getting folder update form", error);
    next(error);
  }
};

const postUpdateFolder = async (req, res, next) => {
  try {
    await db.updateFolderById(parseInt(req.params.folderId), req.body.name);
    res.redirect("/");
  } catch (error) {
    console.error("There was an error submitting folder update", error);
    next(error);
  }
};

module.exports = {
  postUpload,
  postNewFolder,
  getDeleteFolder,
  getDisplayChildrenFolders,
  getUpdateFolder,
  postUpdateFolder,
};
