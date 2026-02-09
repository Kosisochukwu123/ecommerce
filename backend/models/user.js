import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Note: this is a mongoose middleware that will run before saving the user to the database.
// It will hash the password before saving it to the database. It will only hash the password
//  it is modified or if it is new. This is to prevent hashing the password multiple times
//  if the user updates their profile without changing their password. Removing the await makes the password save without being hashed

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});

// checking if the password written is same with the password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
