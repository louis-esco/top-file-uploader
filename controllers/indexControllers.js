const db = require("../prisma/queries");

const getIndex = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) return res.redirect("/log-in");
    const parentId = req.params.folderId ? req.params.folderId : null;
    const folders = await db.getFoldersByParentId(parentId);
    res.render("index", {
      isAuth: req.isAuthenticated(),
      folders: folders,
    });
  } catch (error) {
    console.error("Error in getMessages controller", error);
    next(error);
  }
};

module.exports = {
  getIndex,
};
