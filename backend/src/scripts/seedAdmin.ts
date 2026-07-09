import { connectDB } from "../config/db";
import { User } from "../models/User";

const run = async () => {
  await connectDB();
  const existing = await User.findOne({ email: "admin@lucknowcart.com" });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Admin already exists: admin@lucknowcart.com");
    process.exit(0);
  }

  await User.create({
    name: "Lucknow Cart Admin",
    email: "admin@lucknowcart.com",
    password: "Admin@123",
    role: "admin",
  });

  // eslint-disable-next-line no-console
  console.log("Admin created: admin@lucknowcart.com / Admin@123");
  process.exit(0);
};

void run();
