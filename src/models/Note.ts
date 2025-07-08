import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  userId: string;
  categoryId?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, isFavorite: 1 });
NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
