import { model, Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Ireport extends Document {
  accountOwner: Schema.Types.ObjectId;
  accountWorker: Schema.Types.ObjectId;
  id: string;
  date: Date;
  name: string;
  locale: string;
  workhour: string;
  isOutsourced: boolean;
  imageUrl: string;
  rawText: string;
  totalSeconds: number;
}

const reportSchema = new Schema(
  {
    accountOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountWorker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    name: {
      type: String,
      required: [true, "Please provide account name"],
    },
    locale: {
      type: String,
      required: [true, "Please provide the locale you are working for"],
    },

    workhour: {
      type: String,
      required: [true, "work hour must be provided"],
    },

    totalSeconds: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
    },
    isOutsourced: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Report = model<Ireport>("Report", reportSchema);

export default Report;
