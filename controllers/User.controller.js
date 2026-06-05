const express = require("express");
const UserModel = require("../models/User.model");
const app = express();

const addUserToDb=  async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  console.log(req.body);

  try {
    const user = await UserModel.create(req.body);

    if (user) {
      // res.send("user created successfully")
      res.status(201).send({
        message: "user created successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);

    if (error.code == 11000) {
      res.status(400).send({
        message: "User already exists",
      });
    } else {
      res.status(400).send({
        message: "error creating user",
      });
    }
  }
};

const getUserFromDb= async (req, res) => {
  try {
    const users = await UserModel.find();

    res.status(200).send({
      message: "users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "user fetch failed",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete({ _id: id });

    res.status(200).send({
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "error deleting user",
    });
  }
};


const updateUser= async(req, res)=>{
    const {firstName, lastName}  = req.body
    const {id} = req.params

    try {
        let allowedUpdate ={
            ...(firstName&&{firstName}),
            ...(lastName&&{lastName})

        }

        const isUser = await UserModel.findById(id)
        if(!isUser){
            res.status(404).send({
                message:"cannot update this user as it does not exist"
            })

            return
        }
        console.log(isUser);
        

        const user = await UserModel.findByIdAndUpdate(id, allowedUpdate, {new:true})
        // lastName?lastName:null
        // firstName&&firstName

        res.status(200).send({
            message:"user updated successfully",
            data:user
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:"cannot update user at this time",
            reason:String(error)
        })
        
        
    }
}

module.exports = {
    addUserToDb,
    getUserFromDb,
    deleteUser,
    updateUser
}
