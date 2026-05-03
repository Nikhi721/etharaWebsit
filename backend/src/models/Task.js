import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String, required: true },
    screenshot: { type: String, default: '' },
    status: { type: String, enum: ['Completed', 'Cancelled'], required: true },
    submissionTime: { type: String, required: true },
    duration: { type: String, required: true },
    durationInSeconds: { type: Number, required: true },
    justification: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
