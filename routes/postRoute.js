const router = require("express").Router();

const upload = require("../middlewares/upload");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController")

router.post("/", upload.single("image"), postController.createPost);
router.patch("/:id", upload.single("image"), postController.editPost);
router.delete("/:id", postController.deletePost);
router.post("/:id/like", postController.likePost);
router.delete("/:id/like", postController.unlikePost);
router.post("/:postId/comments", commentController.createComment);
router.patch("/:postId/comments/:id", commentController.editComment);
router.delete("/:postId/comments/:id", commentController.deleteComment);

module.exports = router;
