const express= require("express")
const { addUserToDb, getUserFromDb, deleteUser, updateUser } = require("../controllers/User.controller")
const router = express.Router()


router.post("/addUserToDb", addUserToDb)
router.get("/getUserFromDb", getUserFromDb)
router.delete("/user/:id", deleteUser)
router.patch("/user/:id", updateUser)


module.exports = router