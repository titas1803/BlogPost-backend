import mongoose from "mongoose";
import { ISubscriber } from "../utilities/types.js";

const subscriberSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  subscribedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users",
    default: []
  },
  subscribedTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users",
    default: []
  }
}, {
  timestamps: true
});

const Subscribers = mongoose.model<ISubscriber>("Subscribers", subscriberSchema);

export default Subscribers;