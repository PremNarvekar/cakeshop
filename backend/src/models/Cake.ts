import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICake extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cakeSchema: Schema<ICake> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
      required: true,
    },
    video: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: string[]) {
  return val.length <= 5;
}

// Indexes for optimization
cakeSchema.index({ name: 1 });
cakeSchema.index({ category: 1 });
cakeSchema.index({ slug: 1 });
cakeSchema.index({ createdAt: -1 });

const Cake: Model<ICake> = mongoose.model<ICake>('Cake', cakeSchema);

export default Cake;
