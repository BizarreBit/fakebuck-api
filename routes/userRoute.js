const router = require("express").Router();

const userController = require("../controllers/userController")

router.get("/me", userController.getMe)

module.exports = router;
