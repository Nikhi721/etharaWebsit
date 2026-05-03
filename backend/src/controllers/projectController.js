import Project from '../models/Project.js';

export const getProjects = async (_req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ projects });
};

export const createProject = async (req, res) => {
  const { name, duration } = req.body;
  if (!name || !duration) return res.status(400).json({ message: 'Name and duration are required' });

  const project = await Project.create({
    name,
    duration,
    createdBy: req.user._id
  });

  res.status(201).json({ project });
};
