import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const categories = [
  "Academic",
  "Cultural",
  "Sports",
  "Professional",
  "Arts",
  "Service",
];
const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const majors = [
  "Computer Science",
  "Business Administration",
  "Communications",
  "Mechanical Engineering",
  "Psychology",
  "Biology",
  "Mathematics",
  "Political Science",
  "Economics",
  "Design",
  "Nursing",
  "History",
];
const interests = [
  "Academic",
  "Cultural",
  "Sports",
  "Professional",
  "Arts",
  "Service",
];

const clubNames = [
  "Robotics Club",
  "Debate Team",
  "South Asian Cultural Society",
  "Chess Club",
  "Photography Club",
  "Hiking Club",
  "Pre-Law Society",
  "Finance Club",
  "AI & Machine Learning Club",
  "Theater Club",
  "Volleyball Club",
  "Entrepreneurship Club",
  "Environmental Club",
  "Coding Club",
  "Music Club",
  "Dance Club",
  "Book Club",
  "Gaming Club",
  "Astronomy Club",
  "Swimming Club",
];

const benefits = [
  "Great networking opportunities with industry professionals",
  "Developed strong leadership and teamwork skills",
  "Built a meaningful friend group on campus",
  "Gained hands-on experience relevant to my major",
  "Improved my public speaking and communication skills",
  "Got access to exclusive workshops and seminars",
  "Had fun and learned something new every week",
  "Connected with alumni working in my field",
];

const challenges = [
  "Meetings can run long and eat into study time",
  "Requires consistent commitment even during midterms",
  "Can be hard to get leadership roles as a new member",
  "Travel for competitions takes up entire weekends",
  "Large group makes it harder to build close connections",
  "Onboarding process took a few weeks to get used to",
  "Expectations ramp up quickly once you join a project",
];

const firstNames = [
  "Alex",
  "Priya",
  "Marcus",
  "Aisha",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Jamie",
  "Riley",
  "Avery",
  "Quinn",
  "Skyler",
  "Drew",
  "Sam",
  "Dana",
  "Parker",
  "Reese",
  "Logan",
  "Cameron",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Lee",
  "Patel",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple(arr, min = 1, max = 3) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateClubs(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `${pick(clubNames)} ${i + 1}`,
    category: pick(categories),
    description: `A student organization focused on ${pick(categories).toLowerCase()} activities and professional development. Open to all students regardless of experience level.`,
    weeklyTimeCommitment: randomInt(1, 12),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function generateLogs(count, clubs) {
  return Array.from({ length: count }, () => ({
    clubName: pick(clubs).name,
    weeklyHours: randomInt(1, 12),
    benefits: pick(benefits),
    challenges: pick(challenges),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function generateUsers(count) {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(firstNames);
    const last = pick(lastNames);
    return {
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@northeastern.edu`,
      major: pick(majors),
      year: pick(years),
      bio: `${pick(years)} student at Northeastern interested in ${pick(categories).toLowerCase()} and ${pick(categories).toLowerCase()} activities.`,
      interests: pickMultiple(interests, 1, 3),
      joinedClubs: pickMultiple(clubNames, 0, 2),
      createdAt: new Date(),
    };
  });
}

async function seed() {
  try {
    await client.connect();
    const db = client.db("clubmatch");

    await db.collection("clubs").deleteMany({});
    await db.collection("membership_logs").deleteMany({});
    await db.collection("users").deleteMany({});

    const clubs = generateClubs(400);
    await db.collection("clubs").insertMany(clubs);
    console.log(`Inserted ${clubs.length} clubs`);

    const logs = generateLogs(400, clubs);
    await db.collection("membership_logs").insertMany(logs);
    console.log(`Inserted ${logs.length} membership logs`);

    const users = generateUsers(300);
    await db.collection("users").insertMany(users);
    console.log(`Inserted ${users.length} users`);

    console.log("Seeding complete — 1100 total records inserted");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
