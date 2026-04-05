const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Record = require("./models/Record");

const DEMO_PASSWORD = "Password123!";
const DEMO_USERS = [
  {
    name: "Admin Demo",
    email: "admin@demo.com",
    role: "admin",
    isActive: true,
  },
  {
    name: "Analyst Demo",
    email: "analyst@demo.com",
    role: "analyst",
    isActive: true,
  },
  {
    name: "Viewer Demo",
    email: "viewer@demo.com",
    role: "viewer",
    isActive: true,
  },
];

function buildDemoRecords(adminUserId) {
  const baseDate = new Date("2025-05-15T00:00:00.000Z");
  const monthlyRows = [
    { income: 42000, software: 6200, payroll: 15800, marketing: 4600, ops: 3900 },
    { income: 45500, software: 6500, payroll: 16000, marketing: 4800, ops: 4100 },
    { income: 47000, software: 6400, payroll: 16100, marketing: 5000, ops: 4300 },
    { income: 49500, software: 6600, payroll: 16400, marketing: 5400, ops: 4500 },
    { income: 51000, software: 6800, payroll: 16600, marketing: 5600, ops: 4700 },
    { income: 53000, software: 6900, payroll: 16900, marketing: 5900, ops: 4900 },
    { income: 56000, software: 7100, payroll: 17100, marketing: 6200, ops: 5100 },
    { income: 54500, software: 7200, payroll: 17300, marketing: 6100, ops: 5200 },
    { income: 57500, software: 7300, payroll: 17500, marketing: 6400, ops: 5400 },
    { income: 59000, software: 7500, payroll: 17800, marketing: 6600, ops: 5600 },
    { income: 61000, software: 7600, payroll: 18200, marketing: 6800, ops: 5800 },
    { income: 64000, software: 7900, payroll: 18600, marketing: 7100, ops: 6100 },
  ];

  return monthlyRows.flatMap((row, index) => {
    const monthDate = new Date(baseDate);
    monthDate.setUTCMonth(baseDate.getUTCMonth() + index);

    const onDay = (day) =>
      new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), day, 10, 0, 0));

    return [
      {
        user: adminUserId,
        amount: row.income,
        type: "income",
        category: "Subscriptions",
        date: onDay(2),
        notes: `[demo-seed] Monthly recurring revenue for ${monthDate.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}`,
      },
      {
        user: adminUserId,
        amount: row.software,
        type: "expense",
        category: "Software",
        date: onDay(5),
        notes: "[demo-seed] Core platform and SaaS tooling costs",
      },
      {
        user: adminUserId,
        amount: row.payroll,
        type: "expense",
        category: "Payroll",
        date: onDay(12),
        notes: "[demo-seed] Team compensation and contractor payouts",
      },
      {
        user: adminUserId,
        amount: row.marketing,
        type: "expense",
        category: "Marketing",
        date: onDay(18),
        notes: "[demo-seed] Campaign spend and growth experiments",
      },
      {
        user: adminUserId,
        amount: row.ops,
        type: "expense",
        category: "Operations",
        date: onDay(24),
        notes: "[demo-seed] General operations, admin, and support costs",
      },
    ];
  });
}

async function upsertDemoUsers(hashedPassword) {
  const users = [];

  for (const demoUser of DEMO_USERS) {
    const user = await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        $set: {
          name: demoUser.name,
          role: demoUser.role,
          isActive: demoUser.isActive,
          password: hashedPassword,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    users.push(user);
  }

  return users;
}

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, { tlsAllowInvalidCertificates: true });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);
    const users = await upsertDemoUsers(hashedPassword);
    const adminUser = users.find((user) => user.role === "admin");

    await Record.deleteMany({
      notes: { $regex: "^\\[demo-seed\\]" },
    });

    const demoRecords = buildDemoRecords(adminUser._id);
    await Record.insertMany(demoRecords);

    console.log("Demo users ready:");
    users.forEach((user) => {
      console.log(`- ${user.role}: ${user.email} / ${DEMO_PASSWORD}`);
    });
    console.log(`Inserted ${demoRecords.length} demo financial records.`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
