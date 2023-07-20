const express = require("express");
const { isAuthorised } = require("../middlewares/auth");
const { sendMessage, allMessages } = require("../controllers/message");

const router = express.Router();

router.post("/myMessages", isAuthorised, sendMessage);
router.get("/myMessages/:chatId", isAuthorised, allMessages);

module.exports = router;
