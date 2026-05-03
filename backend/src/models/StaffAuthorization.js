import mongoose from 'mongoose';

const staffAuthorizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    staffType: { type: String, enum: ['leads', 'reviewers', 'taskers'], required: true },
    assignedLead: { type: String, default: '' },
    assignedReviewer: { type: String, default: '' }
  },
  { timestamps: true }
);

staffAuthorizationSchema.index({ email: 1, staffType: 1 }, { unique: true });

const StaffAuthorization = mongoose.model('StaffAuthorization', staffAuthorizationSchema);

export default StaffAuthorization;
