import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  tenantId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
