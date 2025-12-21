const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/signup",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  authController.login
);

router.get("/me", authMiddleware, authController.me);

router.patch("/me", authMiddleware, authController.updateMe);

router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  authController.uploadAvatar
);

module.exports = router;
