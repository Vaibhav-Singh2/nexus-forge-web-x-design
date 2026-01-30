import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Load Data
  const journeysData = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/data/journeys.json"),
      "utf-8",
    ),
  );
  const questionsData = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/data/questions.json"),
      "utf-8",
    ),
  );
  const answerKey: Record<string, string> = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "prisma/answer-key.json"),
      "utf-8",
    ),
  );

  console.log("Start seeding ...");

  // 2. Clear existing data (optional but good for dev)
  await prisma.journeyLog.deleteMany();
  await prisma.examSession.deleteMany();
  await prisma.question.deleteMany();
  await prisma.journey.deleteMany();

  // 3. Seed Journeys
  for (const j of journeysData) {
    const journey = await prisma.journey.create({
      data: {
        id: j.id,
        title: j.title,
        description: j.description,
        difficulty: j.difficulty,
        duration: j.duration,
        totalQuestions: j.totalQuestions || 0,
        prerequisiteId: j.prerequisiteId || null,
        minScoreToUnlock: j.minScoreToUnlock || 0,
      },
    });
    console.log(`Created journey: ${journey.title}`);
  }

  // 4. Seed Questions
  for (const q of questionsData) {
    // Ensure journey exists (mock data might be inconsistent)
    const journeyExists = await prisma.journey.findUnique({
      where: { id: q.journeyId },
    });
    if (journeyExists) {
      await prisma.question.create({
        data: {
          id: q.id,
          journeyId: q.journeyId,
          text: q.question,
          options: JSON.stringify(q.options), // Stringify for SQLite
          correctOption: answerKey[q.id] || "a", // Use answer key
          explanation: "Explanation goes here.",
        },
      });
    }
  }

  // 5. Seed Users
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.create({
    data: {
      email: "student@example.com",
      name: "Eco Traveler",
      role: "STUDENT",
      password: studentPassword,
    },
  });

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Expedition Leader",
      role: "ADMIN",
      password: adminPassword,
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
