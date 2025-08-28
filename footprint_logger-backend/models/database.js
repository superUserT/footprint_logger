const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
// I need to get the logged in user's id
const logSchema = new mongoose.Schema(
  {
    userId: {
      // Changed from 'id' to 'userId'
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    logId: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    co2Saved: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

logSchema.index({ id: 1 });

// Instance method
userSchema.methods.getUserInfo = function () {
  return {
    username: this.username,
    email: this.email,
    isActive: this.isActive,
  };
};

logSchema.methods.getUserInfo = function () {
  return {
    id: this.id,
    email: this.email,
  };
};

// Static method
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

logSchema.statics.findbyId = function (id) {
  return this.findOne({ id: id });
};
const User = mongoose.model("User", userSchema);
const Log = mongoose.model("Log", logSchema);

module.exports = { User, Log };
