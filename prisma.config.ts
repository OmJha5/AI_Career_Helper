import { defineConfig, env } from "prisma/config"
import * as dotenv from "dotenv"

// ✅ Load environment variables from your .env file
dotenv.config()

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // ✅ Now env("DATABASE_URL") will find it
    url: env("DATABASE_URL"),
  },
})
