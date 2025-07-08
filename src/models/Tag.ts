import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  _id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique tag names per user
TagSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
