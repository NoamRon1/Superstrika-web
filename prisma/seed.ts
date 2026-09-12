import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (email && password && !(await db.user.findUnique({ where: { email } }))) {
    await db.user.create({ data: { email, passwordHash: await bcrypt.hash(password, 12), role: Role.ADMIN, name: "Initial administrator" } });
  }
  await db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1, uploadRoot: process.env.UPLOAD_DIR || "/app/uploads" } });
}
main().finally(() => db.$disconnect());
