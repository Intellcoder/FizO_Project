import { Schema, model, Document, Types } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface IUSER extends Document {
  workerId: string;
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  locale: string;
  role: string;
  totalSeconds: Number;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUSER>(
  {
    workerId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => isEmail(value),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    locale: {
      type: String,
      required: true,
    },
    totalSeconds: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["worker", "admin"],
      default: "worker",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUSER>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const passwordMatch = await bcrypt.compare(password, this.password);
  return passwordMatch;
};

const User = model<IUSER>("User", userSchema);

export default User;
