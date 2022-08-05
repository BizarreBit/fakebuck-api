const router = require("express").Router();

const upload = require("../middlewares/upload");
const postController = require("../controllers/postController");

router.post("/", upload.single("image"), postController.createPost);
router.patch("/:id", upload.single("image"), postController.editPost);
router.delete("/:id", postController.deletePost);
router.post("/:id/like", postController.likePost);
router.delete("/:id/like", postController.unlikePost);

module.exports = router;
