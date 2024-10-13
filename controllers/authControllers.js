const { body, validationResult } = require("express-validator");
const passport = require("passport");
const db = require("../prisma/queries");

const validateSignup = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty")
    .isEmail()
    .withMessage("Username must be at email format: name@domain.com")
    .custom(async (value) => {
      const user = await db.findUserByUsername(value);
      if (user) {
        throw new Error("This username is not available");
      }
    }),
  body("password").notEmpty().withMessage("Password can't be empty"),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
];

const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty")
    .isEmail()
    .withMessage("Username must be at email format: name@domain.com"),
  body("password").notEmpty().withMessage("Password can't be empty"),
];

const getSignupForm = (req, res) => {
  res.render("sign-up", {
    formData: {
      username: null,
    },
  });
};

const postSignupForm = [
  validateSignup,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("sign-up", {
          errors: errors.array(),
          formData: {
            username: req.body.username,
          },
        });
      }
      await db.createUser(req.body.username, req.body.password);
      res.redirect("/");
    } catch (error) {
      console.error("Error in postSignupForm controller", error);
      next(error);
    }
  },
];

module.exports = {
  getSignupForm,
  postSignupForm,
};
