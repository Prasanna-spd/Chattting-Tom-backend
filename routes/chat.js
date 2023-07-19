const express = require("express");
const { isAuthorised } = require("../middlewares/auth");
const {
  fetchChats,
  accessChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat");

const router = express.Router();

router
  .route("/myChats")
  .post(isAuthorised, accessChat)
  .get(isAuthorised, fetchChats);
router.post("/group", isAuthorised, createGroupChat);
router.put("/rename", isAuthorised, renameGroup);
router.put("/groupAdd", isAuthorised, addToGroup);
router.put("/groupRemove", isAuthorised, removeFromGroup);

module.exports = router;
