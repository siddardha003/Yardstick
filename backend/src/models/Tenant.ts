import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  plan: 'free' | 'pro';
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
});

export default mongoose.model<ITenant>('Tenant', TenantSchema);
