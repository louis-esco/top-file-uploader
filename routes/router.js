const express = require("express");
const authControllers = require("../controllers/authControllers");
const indexControllers = require("../controllers/indexControllers");
const filesControllers = require("../controllers/filesControllers");

const router = express.Router();

// Public routes
router.get("/", indexControllers.getIndex);

router.get("/sign-up", authControllers.getSignupForm);
router.post("/sign-up", authControllers.postSignupForm);

router.get("/log-in", authControllers.getLogin);
router.post("/log-in", authControllers.postLogin);

router.get("/log-out", authControllers.getLogout);

// Protected routes for authenticated users
router.use(authControllers.isAuth);

router.post(
  ["/upload", "/upload/:folderId"],
  filesControllers.postMulterUpload,
  filesControllers.postCloudinaryUpload,
  filesControllers.postFileUploadToDb
);

router.get(
  ["/folder", "/folder/:folderId"],
  filesControllers.getDisplayFolderContent
);

router.post(
  ["/new-folder", "/new-folder/:folderId"],
  filesControllers.postNewFolder
);
router.get("/update-folder/:folderId", filesControllers.getUpdateFolder);
router.post("/update-folder/:folderId", filesControllers.postUpdateFolder);
router.get("/delete-folder/:folderId", filesControllers.getDeleteFolder);

module.exports = router;
