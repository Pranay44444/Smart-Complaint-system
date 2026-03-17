import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/smart-complaint';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'USER'],
      default: 'USER',
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', UserSchema);

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@complaint.dev',
    password: 'Admin@1234',
    role: 'ADMIN',
  },
  {
    name: 'Staff Alice',
    email: 'alice@complaint.dev',
    password: 'Staff@1234',
    role: 'STAFF',
  },
  {
    name: 'Staff Bob',
    email: 'bob@complaint.dev',
    password: 'Staff@1234',
    role: 'STAFF',
  },
  {
    name: 'User Charlie',
    email: 'charlie@complaint.dev',
    password: 'User@1234',
    role: 'USER',
  },
  {
    name: 'User Diana',
    email: 'diana@complaint.dev',
    password: 'User@1234',
    role: 'USER',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  for (const user of seedUsers) {
    const exists = await UserModel.findOne({ email: user.email });
    if (exists) {
      console.log(`⏭  Skipping ${user.email} — already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await UserModel.create({ ...user, password: hashedPassword });
    console.log(`🌱 Seeded ${user.role}: ${user.email}`);
  }

  await mongoose.disconnect();
  console.log('✅ Seeding complete. Connection closed.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
