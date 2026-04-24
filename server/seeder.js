// server/seeder.js
// Run ONCE to create admin accounts in your database
// Command: node seeder.js
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");
dotenv.config();

const User = require("./model/user");

// ── Add your admins here ──────────────────────────────────────────────────────
const ADMINS = [
  {
    name:     "Admin1",
    email:    "admin1@hiresetu.com",
    password: "admin123",
  },
  // Add more if needed:
  // { name: "Admin2", email: "admin2@hiresetu.com", password: "admin456" },
];
// ─────────────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    for (const a of ADMINS) {
      const exists = await User.findOne({ email: a.email });

      if (exists) {
        console.log(`⚠️  ${a.email} already exists — skipping`);
        continue;
      }

      const hashed = await bcrypt.hash(a.password, 12);
      await User.create({
        name:     a.name,
        email:    a.email,
        password: hashed,
        role:     "admin",
      });

      console.log(`✅ Admin created: ${a.name} (${a.email}) / password: ${a.password}`);
    }

    console.log("\n🎉 Seeding complete!");
    console.log("─────────────────────────────────────────────────");
    console.log("Now go to: http://localhost:5173/admin");
    console.log("Login with one of the credentials above.");
    console.log("─────────────────────────────────────────────────");

  } catch (err) {
    console.error("❌ Seeder error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seed();