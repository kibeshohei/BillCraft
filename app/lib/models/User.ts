import mongoose, { Schema, model, Model } from "mongoose"

export interface IUser {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
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
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

const User: Model<IUser> =
  (mongoose.models?.["User"] as Model<IUser>) ?? model<IUser>("User", UserSchema)

export default User
