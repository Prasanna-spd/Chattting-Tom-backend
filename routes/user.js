const express = require("express");
const { register, login, allUsers } = require("../controllers/user");
const { isAuthorised } = require("../middlewares/auth");

const router = express.Router();

router.route("/new").post(register).get(isAuthorised, allUsers);
router.post("/login", login);
// router.get("/logout", logout);

module.exports = router;

// {
//     "name": "Priti Simposin",
//     "email": "pratikpriti@gmail.com",
//     "password": "qwertyuiop"
// }
