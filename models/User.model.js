const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select:false },
    image: {
      public_id:{type:String},
      secure_url:{type:String}
    }
  });
  
  const UserModel = mongoose.model("user", UserSchema);


module.exports=UserModel