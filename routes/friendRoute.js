const router = require("express").Router();

const friendController = require("../controllers/friendController");

router.post("/", friendController.requestFriend);
router.patch("/:fromUserId", friendController.acceptFriend);
router.delete("/:id", friendController.deleteFriend);
router.get("/", friendController.getAllFriend);

module.exports = router;
