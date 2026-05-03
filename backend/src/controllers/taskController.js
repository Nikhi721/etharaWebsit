import Task from '../models/Task.js';

export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ tasks });
};

export const createTask = async (req, res) => {
  const {
    taskId,
    project,
    projectName,
    screenshot,
    status,
    submissionTime,
    duration,
    durationInSeconds,
    justification
  } = req.body;

  if (!taskId || !projectName || !status || !submissionTime || !duration) {
    return res.status(400).json({ message: 'Task details are incomplete' });
  }

  const task = await Task.create({
    taskId,
    project: project || undefined,
    projectName,
    screenshot,
    status,
    submissionTime,
    duration,
    durationInSeconds,
    justification,
    user: req.user._id
  });

  res.status(201).json({ task });
};
