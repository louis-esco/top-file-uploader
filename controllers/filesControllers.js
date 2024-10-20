const db = require("../prisma/queries");
const { body, validationResult } = require("express-validator");
const { multerUpload } = require("../multer/multer");
const { cloudinary } = require("../cloudinary/cloudinary");

const validateFolder = [
  body("folder").trim().notEmpty().withMessage("Name can't be empty"),
];

const getDisplayFolderContent = async (req, res, next) => {
  try {
    const folderId = req.params.folderId ? parseInt(req.params.folderId) : null;
    const folders = await db.getFoldersByParentId(folderId);
    const files = await db.getFolderFiles(folderId);
    res.render("index", {
      isAuth: req.isAuthenticated(),
      folders: folders,
      files: files,
      currentFolder: folderId,
    });
  } catch (error) {
    console.error("There was an error displaying children folders", error);
    next(error);
  }
};

const postMulterUpload = async (req, res, next) => {
  try {
    multerUpload.single("uploaded_file")(req, res, next);
  } catch (error) {
    console.error("There was an error uploading file with multer", error);
    next(error);
  }
};

const postCloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400);
    const fileName = Buffer.from(req.file.originalname, "latin1")
      .toString("utf8")
      .split(".")
      .slice(0, -1)
      .join(".");
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: fileName,
      display_name: req.file.originalname,
      unique_filename: false,
      overwrite: true,
    });
    res.locals.file = result;
    return next();
  } catch (error) {
    console.error("There was an error in cloudinary upload", error);
    next(error);
  }
};

const postFileUploadToDb = async (req, res, next) => {
  try {
    const folderId = req.params.folderId ? parseInt(req.params.folderId) : null;
    const dlUrl = cloudinary.url(res.locals.file.public_id, {
      flags: "attachment",
    });
    const file = {
      name: res.locals.file.public_id,
      size: res.locals.file.bytes,
      url: dlUrl,
      folderId: folderId,
    };
    await db.createFile(file);
    res.redirect(req.get("Referrer"));
  } catch (error) {
    console.error("There was an error posting uploaded file in db", error);
    next(error);
  }
};

const postNewFolder = [
  validateFolder,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.redirect(req.get("Referrer"));
      }
      const parentId = req.params.folderId
        ? parseInt(req.params.folderId)
        : null;
      await db.createFolder(req.body.folder, parentId);
      res.redirect(req.get("Referrer"));
    } catch (error) {
      console.error("There was an error creating new folder", error);
      next(error);
    }
  },
];

const getDeleteFolder = async (req, res, next) => {
  try {
    await db.deleteFolder(parseInt(req.params.folderId));
    res.redirect(req.get("Referrer"));
  } catch (error) {
    console.error("There was an error deleting folder", error);
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

const postUpdateFolder = [
  validateFolder,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("./files/update-folder", {
          errors: errors.array(),
          folder: {
            name: req.body.folder,
            id: req.params.folderId,
          },
        });
      }
      await db.updateFolderById(parseInt(req.params.folderId), req.body.folder);
      const folder = await db.getFolderById(parseInt(req.params.folderId));
      if (folder.parentId) return res.redirect(`/folder/${folder.parentId}`);
      return res.redirect("/folder");
    } catch (error) {
      console.error("There was an error submitting folder update", error);
      next(error);
    }
  },
];

module.exports = {
  postMulterUpload,
  postCloudinaryUpload,
  postNewFolder,
  getDeleteFolder,
  getDisplayFolderContent,
  getUpdateFolder,
  postUpdateFolder,
  postFileUploadToDb,
};
