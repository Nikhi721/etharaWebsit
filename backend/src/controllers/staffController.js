import StaffAuthorization from '../models/StaffAuthorization.js';

export const getStaff = async (_req, res) => {
  const staff = await StaffAuthorization.find().sort({ staffType: 1, name: 1 });
  res.json({ staff });
};

export const createStaff = async (req, res) => {
  const { name, email, staffType, assignedLead = '', assignedReviewer = '' } = req.body;

  if (!name || !email || !staffType) {
    return res.status(400).json({ message: 'Name, email and staff type are required' });
  }

  const staff = await StaffAuthorization.create({
    name,
    email,
    staffType,
    assignedLead,
    assignedReviewer
  });

  res.status(201).json({ staff });
};

export const deleteStaff = async (req, res) => {
  const staff = await StaffAuthorization.findByIdAndDelete(req.params.id);
  if (!staff) return res.status(404).json({ message: 'Staff authorization not found' });
  res.json({ message: 'Staff authorization deleted' });
};
