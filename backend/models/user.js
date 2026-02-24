import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getUsersDB } from "../config/db.js";

const addressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    activeToken: {
      type: String,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving - CORRECTED VERSION
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};


// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Include virtuals in JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Get User model bound to users DB
const getUserModel = () => {
  const db = getUsersDB();

  if (!db) {
    throw new Error(
      "Users database not connected. Make sure server started properly.",
    );
  }

  if (db.models.User) return db.models.User;
  return db.model("User", userSchema);
};

export default getUserModel;
