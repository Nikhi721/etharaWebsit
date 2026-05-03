import StaffAuthorization from '../models/StaffAuthorization.js';
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

const roleToStaffType = {
  'Project Lead': 'leads',
  'Quality Reviewer': 'reviewers',
  Tasker: 'taskers'
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  assignedLead: user.assignedLead,
  assignedReviewer: user.assignedReviewer
});

export const register = async (req, res) => {
  const { fullName, role, email, password, lead, reviewer } = req.body;

  if (!fullName || !role || !email || !password) {
    return res.status(400).json({ message: 'Name, role, email and password are required' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  if (role !== 'Admin') {
    const auth = await StaffAuthorization.findOne({
      email: email.toLowerCase(),
      staffType: roleToStaffType[role]
    });

    if (!auth) return res.status(403).json({ message: 'Email is not authorized for this role' });

    if (role === 'Quality Reviewer' && auth.assignedLead !== lead) {
      return res.status(403).json({ message: 'Wrong Project Lead selected' });
    }

    if (role === 'Tasker' && (auth.assignedLead !== lead || auth.assignedReviewer !== reviewer)) {
      return res.status(403).json({ message: 'Wrong Quality Reviewer or Project Lead selected' });
    }
  }

  const user = await User.create({
    name: fullName,
    email,
    password,
    role,
    assignedLead: lead,
    assignedReviewer: reviewer
  });

  res.status(201).json({ user: sanitizeUser(user), token: generateToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (role && role !== user.role) {
    return res.status(403).json({ message: 'Unauthorized role selected' });
  }

  res.json({ user: sanitizeUser(user), token: generateToken(user._id) });
};

export const getMe = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
