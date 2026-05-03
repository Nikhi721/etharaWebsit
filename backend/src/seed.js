import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Project from './models/Project.js';
import StaffAuthorization from './models/StaffAuthorization.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  const admin = await User.findOne({ email: 'nikhil.k@ethara.ai' });
  if (admin) {
    admin.name = 'NIKHIL';
    admin.password = 'password123';
    admin.role = 'Admin';
    await admin.save();
  } else {
    await User.create({
      name: 'NIKHIL',
      email: 'nikhil.k@ethara.ai',
      password: 'password123',
      role: 'Admin'
    });
  }

  await StaffAuthorization.bulkWrite([
    {
      updateOne: {
        filter: { email: 'piyush.t@ethara.ai', staffType: 'leads' },
        update: { $set: { name: 'Piyush Singh Tomar', email: 'piyush.t@ethara.ai', staffType: 'leads' } },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { email: 'sanyam.s@ethara.ai', staffType: 'reviewers' },
        update: {
          $set: {
            name: 'Sanyam Sehrawat',
            email: 'sanyam.s@ethara.ai',
            staffType: 'reviewers',
            assignedLead: 'Piyush Singh Tomar'
          }
        },
        upsert: true
      }
    }
  ]);

  await Project.bulkWrite([
    {
      updateOne: {
        filter: { name: 'LLM Data Evaluation Project' },
        update: { $set: { name: 'LLM Data Evaluation Project', duration: '5m' } },
        upsert: true
      }
    },
    {
      updateOne: {
        filter: { name: 'Text-to-Image Ranking' },
        update: { $set: { name: 'Text-to-Image Ranking', duration: '10m' } },
        upsert: true
      }
    }
  ]);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
