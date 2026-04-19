import 'dotenv/config';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/smart-complaint';

// ─── Schemas ───────────────────────────────────────────────────────────────

const OrganizationSchema = new MongooseSchema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const UserSchema = new MongooseSchema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'USER'],
      default: 'USER',
    },
    orgId: { type: MongooseSchema.Types.ObjectId, ref: 'Organization', default: null },
  },
  { timestamps: true },
);

const OrganizationModel = mongoose.model('Organization', OrganizationSchema);
const UserModel = mongoose.model('User', UserSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Create sample organization
  let org = await OrganizationModel.findOne({ slug: 'acme-corp' });
  if (!org) {
    org = await OrganizationModel.create({
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'FREE',
      isActive: true,
    });
    console.log('Seeded organization: Acme Corp');
  } else {
    console.log('Skipping Acme Corp, already exists');
  }

  const orgId = (org as any)._id;

  // 2. Seed users
  const seedUsers = [
    // Platform super admin — no orgId
    {
      name: 'Super Admin',
      email: 'superadmin@complaint.dev',
      password: 'Super@1234',
      role: 'SUPER_ADMIN',
      orgId: null,
    },
    // Business admin — linked to Acme Corp
    {
      name: 'Admin User',
      email: 'admin@complaint.dev',
      password: 'Admin@1234',
      role: 'ADMIN',
      orgId,
    },
    // Staff — linked to Acme Corp
    {
      name: 'Staff Alice',
      email: 'alice@complaint.dev',
      password: 'Staff@1234',
      role: 'STAFF',
      orgId,
    },
    {
      name: 'Staff Bob',
      email: 'bob@complaint.dev',
      password: 'Staff@1234',
      role: 'STAFF',
      orgId,
    },
    // Regular users — linked to Acme Corp
    {
      name: 'User Charlie',
      email: 'charlie@complaint.dev',
      password: 'User@1234',
      role: 'USER',
      orgId,
    },
    {
      name: 'User Diana',
      email: 'diana@complaint.dev',
      password: 'User@1234',
      role: 'USER',
      orgId,
    },
  ];

  for (const user of seedUsers) {
    const exists = await UserModel.findOne({ email: user.email });
    if (exists) {
      // Update orgId if missing (for already-seeded users)
      if (!exists.orgId && user.orgId) {
        await UserModel.updateOne({ email: user.email }, { orgId: user.orgId });
        console.log(`Linked ${user.email} to Acme Corp`);
      } else {
        console.log(`Skipping ${user.email}, already exists`);
      }
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await UserModel.create({ ...user, password: hashedPassword });
    console.log(`Seeded ${user.role}: ${user.email}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete. Connection closed.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
