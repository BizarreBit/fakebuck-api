const router = require("express").Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const upload = require("../middlewares/upload");

router.get("/me", userController.getMe);
// router.patch("/", upload.single("profileImage"), userController.updateImage)
router.patch(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.updateImage
);
router.get("/posts", postController.getUserPost)

module.exports = router;
