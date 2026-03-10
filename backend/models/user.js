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
    
    // ← NEW: Phone number field
    phone: {
      type: String,
      sparse: true, // Allows multiple null values but enforces uniqueness when present
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Allow empty/null OR valid phone format
          if (!v) return true;
          return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
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
        ref: "Product",
      },
    ],
    
    // ← NEW: Password reset fields
    resetPasswordCode: {
      type: String,
      select: false, // Don't return in queries by default
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // Don't return in queries by default
    },
    
    // ← NEW: Email verification fields (optional)
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    
    activeToken: {
      type: String,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // ← NEW: Last login tracking
    lastLogin: {
      type: Date,
    },
  },
  { 
    timestamps: true,
  },
);

// ============================================
// INDEXES
// ============================================

// Index for faster login queries
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
// userSchema.index({ username: 1 });

// ============================================
// PRE-SAVE MIDDLEWARE
// ============================================

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// INSTANCE METHODS
// ============================================

// Compare password method
userSchema.methods.matchPassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

// Alternative name for consistency with other code
userSchema.methods.comparePassword = async function (plaintext) {
  return await bcrypt.compare(plaintext, this.password);
};

// Generate password reset code
userSchema.methods.generatePasswordReset = function () {
  // Generate 6-digit code
  this.resetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Code expires in 15 minutes
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  
  return this.resetPasswordCode;
};

// Generate email verification code
userSchema.methods.generateEmailVerification = function () {
  // Generate 6-digit code
  this.emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Code expires in 24 hours
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return this.emailVerificationCode;
};

// Check if password reset code is valid
userSchema.methods.isPasswordResetValid = function () {
  if (!this.resetPasswordCode || !this.resetPasswordExpires) {
    return false;
  }
  return this.resetPasswordExpires > Date.now();
};

// Check if email verification code is valid
userSchema.methods.isEmailVerificationValid = function () {
  if (!this.emailVerificationCode || !this.emailVerificationExpires) {
    return false;
  }
  return this.emailVerificationExpires > Date.now();
};

// Clear password reset fields
userSchema.methods.clearPasswordReset = function () {
  this.resetPasswordCode = undefined;
  this.resetPasswordExpires = undefined;
};

// Clear email verification fields
userSchema.methods.clearEmailVerification = function () {
  this.emailVerificationCode = undefined;
  this.emailVerificationExpires = undefined;
};

// ============================================
// VIRTUALS
// ============================================

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Virtual for masked phone (e.g., +1 234-***-**89)
userSchema.virtual("maskedPhone").get(function () {
  if (!this.phone) return null;
  
  const phone = this.phone.replace(/\D/g, ""); // Remove non-digits
  if (phone.length < 4) return this.phone;
  
  const lastFour = phone.slice(-4);
  const firstPart = phone.slice(0, -4);
  return firstPart.replace(/\d/g, "*") + lastFour;
});

// Virtual for masked email (e.g., j***@example.com)
userSchema.virtual("maskedEmail").get(function () {
  if (!this.email) return null;
  
  const [localPart, domain] = this.email.split("@");
  if (localPart.length <= 2) return this.email;
  
  const masked = localPart[0] + "***" + localPart.slice(-1);
  return `${masked}@${domain}`;
});

// ============================================
// STATIC METHODS
// ============================================

// Find user by email or phone
userSchema.statics.findByEmailOrPhone = function (identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(identifier)) {
    // It's an email
    return this.findOne({ email: identifier.toLowerCase() });
  } else {
    // It's a phone number - normalize it
    const normalizedPhone = identifier.replace(/[\s\-\(\)]/g, "");
    return this.findOne({ phone: normalizedPhone });
  }
};

// ============================================
// OPTIONS
// ============================================

// Include virtuals in JSON and toObject
userSchema.set("toJSON", { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive fields from JSON output
    delete ret.password;
    delete ret.resetPasswordCode;
    delete ret.resetPasswordExpires;
    delete ret.emailVerificationCode;
    delete ret.emailVerificationExpires;
    delete ret.activeToken;
    return ret;
  }
});

userSchema.set("toObject", { 
  virtuals: true 
});

// ============================================
// MODEL EXPORT
// ============================================

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