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

module.exports = { postUpload };
