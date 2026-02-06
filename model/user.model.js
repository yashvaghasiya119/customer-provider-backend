import mongoose from "mongoose";

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
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },
    role:{
      type:String,
      enum:["user","admin","provider"]
    },
    providerType: {
      type: String,
      enum: [
        "ac_repair",
        "plumber",
        "doctor",
        "carpenter",
        "electrician",
        "mechanic",
      ],
      required: function () {
        return this.role === "provider";
      },
    },
   lattitude: {
      type: Number,
      required: function () {
        return this.role === "provider";
      },
    },
    longitude: {
      type: Number,
      required: function () {
        return this.role === "provider";
      },
    },
  //  isBlocked: {
  //     type: Boolean,
  //     default: false,
  //   },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);

