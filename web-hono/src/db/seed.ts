import { db, users } from "./index";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const [admin] = await db
    .insert(users)
    .values({
      username: "admin",
      email: "admin@socialnetwork.com",
      password: hashedPassword,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      bio: "System administrator",
      isActive: true,
    })
    .returning();

  console.log("✅ Admin user created:", {
    username: admin.username,
    email: admin.email,
    role: admin.role,
  });

  // Create sample users
  const user1Password = await bcrypt.hash("user123", 10);
  const [user1] = await db
    .insert(users)
    .values({
      username: "johndoe",
      email: "john@example.com",
      password: user1Password,
      role: "user",
      firstName: "John",
      lastName: "Doe",
      bio: "Hello! I love sharing my thoughts here.",
    })
    .returning();

  console.log("✅ Sample user created:", user1.username);

  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
