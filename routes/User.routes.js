const express= require("express")
const { getUserFromDb, deleteUser, updateUser, register, loginUser, verifyUser } = require("../controllers/User.controller")
const router = express.Router()


router.post("/register", register)
router.get("/getUserFromDb",verifyUser, getUserFromDb)
router.delete("/user/:id",verifyUser, deleteUser)
router.patch("/user/:id",verifyUser, updateUser)
router.post("/login", loginUser)


module.exports = router