const express = require("express");
const authControllers = require("../controllers/authControllers");
const indexControllers = require("../controllers/indexControllers");

const router = express.Router();

// Public routes
router.get("/", indexControllers.getIndex);

router.get("/sign-up", authControllers.getSignupForm);
router.post("/sign-up", authControllers.postSignupForm);

// Protected routes for authenticated users

module.exports = router;
