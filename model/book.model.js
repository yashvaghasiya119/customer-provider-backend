import mondgoose from "mongoose";

const bookSchema = new mondgoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    user:{
        type:mondgoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
  },
  { timestamps: true }
);

export const bookModel = mondgoose.model("Book", bookSchema);