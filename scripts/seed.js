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
  "Electrical Engineering",
  "Data Science",
  "Finance",
  "International Affairs",
  "Biochemistry",
  "Architecture",
  "Cybersecurity",
  "Health Science",
];
const interests = [
  "Academic",
  "Cultural",
  "Sports",
  "Professional",
  "Arts",
  "Service",
];

const clubs = [
  {
    name: "Northeastern Robotics",
    category: "Academic",
    description:
      "One of Northeastern's most competitive engineering clubs. Members design, build, and program robots for regional and national competitions including FIRST Robotics. Open to all majors with a passion for engineering and problem solving.",
    weeklyTimeCommitment: 8,
  },
  {
    name: "NU Debate Society",
    category: "Academic",
    description:
      "A competitive and casual debate club that participates in intercollegiate tournaments across the Northeast. Members sharpen their argumentation, research, and public speaking skills through weekly practice rounds.",
    weeklyTimeCommitment: 5,
  },
  {
    name: "South Asian Student Association",
    category: "Cultural",
    description:
      "SASA celebrates South Asian culture through events like Diwali Night, Holi, and cultural showcases. A welcoming community for students of South Asian heritage and anyone interested in learning about the culture.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "Northeastern Chess Club",
    category: "Academic",
    description:
      "A community for chess enthusiasts of all skill levels. Members meet weekly for casual games, strategy sessions, and tournament preparation. Participates in collegiate chess leagues across New England.",
    weeklyTimeCommitment: 2,
  },
  {
    name: "NU Photography Club",
    category: "Arts",
    description:
      "A creative community for photographers at all levels. Members go on photo walks around Boston, critique each other's work, and participate in exhibitions. Access to club cameras and studio equipment included.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "Husky Hiking Club",
    category: "Sports",
    description:
      "Organizes weekend hikes across New England — from the Blue Hills to the White Mountains. No experience necessary. A great way to explore the outdoors and connect with fellow students who love nature.",
    weeklyTimeCommitment: 4,
  },
  {
    name: "Pre-Law Society",
    category: "Professional",
    description:
      "Prepares undergraduate students for law school and legal careers through LSAT prep sessions, mock trials, networking with law school admissions officers, and trips to local courthouses.",
    weeklyTimeCommitment: 4,
  },
  {
    name: "NU Finance Club",
    category: "Professional",
    description:
      "Connects students interested in investment banking, equity research, and financial analysis. Hosts stock pitch competitions, case workshops, and networking events with Wall Street recruiters.",
    weeklyTimeCommitment: 5,
  },
  {
    name: "AI & Machine Learning Club",
    category: "Academic",
    description:
      "Explores the cutting edge of artificial intelligence through paper reading sessions, hands-on projects, and industry speaker events. Members work on real ML projects and compete in Kaggle competitions.",
    weeklyTimeCommitment: 6,
  },
  {
    name: "NU Theater Company",
    category: "Arts",
    description:
      "Produces full-scale theatrical productions each semester ranging from classic plays to original student works. Open to performers, directors, stage managers, and crew. No prior experience required.",
    weeklyTimeCommitment: 10,
  },
  {
    name: "Club Volleyball",
    category: "Sports",
    description:
      "Competitive club volleyball team that practices three times a week and competes in the National Collegiate Volleyball Federation. Open tryouts held at the start of each semester.",
    weeklyTimeCommitment: 9,
  },
  {
    name: "IDEA — Entrepreneurship Club",
    category: "Professional",
    description:
      "Northeastern's premier entrepreneurship organization. Hosts startup pitch competitions, connects students with venture capitalists, and runs workshops on product development, fundraising, and growth strategy.",
    weeklyTimeCommitment: 5,
  },
  {
    name: "NU Environmental Collective",
    category: "Service",
    description:
      "Advocates for sustainability on campus and in the Boston community. Organizes beach cleanups, campus garden projects, and lobbies the university for greener policies. Passionate about climate action.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "Generate — Product Development",
    category: "Professional",
    description:
      "A student-led product development studio that builds real software and hardware products for nonprofit clients. Teams of designers, engineers, and PMs work together on semester-long projects.",
    weeklyTimeCommitment: 8,
  },
  {
    name: "NU Acoustic & Music Club",
    category: "Arts",
    description:
      "A community for musicians of all genres. Members perform at open mics, collaborate on original music, and organize concerts on campus. Practice rooms and instruments available for members.",
    weeklyTimeCommitment: 4,
  },
  {
    name: "Bhangra Dance Team",
    category: "Cultural",
    description:
      "A high-energy competitive Bhangra team that performs at South Asian cultural events and college competitions across the country. Welcomes dancers of all backgrounds who are willing to put in the work.",
    weeklyTimeCommitment: 7,
  },
  {
    name: "NU Book Club",
    category: "Academic",
    description:
      "Reads and discusses one book per month spanning fiction, non-fiction, and everything in between. A relaxed space for literary discussion, critical thinking, and connecting over shared reads.",
    weeklyTimeCommitment: 2,
  },
  {
    name: "Esports at Northeastern",
    category: "Sports",
    description:
      "Hosts competitive gaming teams across titles including Valorant, League of Legends, and Rocket League. Competes in collegiate esports leagues and organizes campus-wide gaming tournaments.",
    weeklyTimeCommitment: 6,
  },
  {
    name: "NU Astronomy Club",
    category: "Academic",
    description:
      "Explores the universe through stargazing nights, telescope sessions, and talks by astrophysics faculty. Organizes trips to observatories and participates in astronomy olympiad competitions.",
    weeklyTimeCommitment: 2,
  },
  {
    name: "Club Swimming & Water Polo",
    category: "Sports",
    description:
      "Offers both competitive swimming and water polo for students who want to stay active in the pool. Practices held at the Cabot Center pool. Competes against other New England universities.",
    weeklyTimeCommitment: 8,
  },
  {
    name: "Chinese Student Association",
    category: "Cultural",
    description:
      "Celebrates Chinese culture and heritage through events like Lunar New Year celebrations, lantern festivals, and cultural exchange programs. Open to all students interested in Chinese culture.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "NU Consulting Group",
    category: "Professional",
    description:
      "A student-run consulting organization that works with local businesses and nonprofits. Members gain hands-on consulting experience and develop skills in strategy, operations, and data analysis.",
    weeklyTimeCommitment: 6,
  },
  {
    name: "Northeastern Dance Collective",
    category: "Arts",
    description:
      "An inclusive dance organization featuring styles from hip-hop to contemporary. Hosts semesterly showcases, workshops with professional choreographers, and collaborative projects with other arts groups.",
    weeklyTimeCommitment: 5,
  },
  {
    name: "NU Cycling Club",
    category: "Sports",
    description:
      "Organizes group rides around Boston and beyond. From casual rides along the Charles River to multi-day cycling trips. Members share tips on gear, routes, and bike maintenance.",
    weeklyTimeCommitment: 4,
  },
  {
    name: "Global Medical Brigades",
    category: "Service",
    description:
      "Partners with communities in developing countries to provide medical care and public health education. Members fundraise, prepare, and travel on annual brigade trips during spring break.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "NU Hack — Hackathon Club",
    category: "Academic",
    description:
      "Organizes HackBeanpot, one of Boston's largest collegiate hackathons, and sends teams to competitions nationwide. Hosts workshops on full-stack development, design, and pitching to judges.",
    weeklyTimeCommitment: 5,
  },
  {
    name: "Korean Student Association",
    category: "Cultural",
    description:
      "Celebrates Korean culture through K-pop dance covers, Korean food events, language exchange programs, and cultural nights. A tight-knit community welcoming to all students.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "NU Rugby Club",
    category: "Sports",
    description:
      "Competitive club rugby team open to experienced players and complete beginners alike. Practices twice a week and competes in the New England Collegiate Rugby Conference. No prior experience needed.",
    weeklyTimeCommitment: 8,
  },
  {
    name: "Habitat for Humanity at NU",
    category: "Service",
    description:
      "Works with Habitat for Humanity Greater Boston to build affordable housing for families in need. Members volunteer on build sites, organize fundraisers, and advocate for affordable housing policy.",
    weeklyTimeCommitment: 3,
  },
  {
    name: "NU Model United Nations",
    category: "Academic",
    description:
      "Prepares students for Model UN conferences by simulating UN committee sessions. Members research global issues, write policy papers, and compete at conferences hosted by Harvard, Yale, and MIT.",
    weeklyTimeCommitment: 5,
  },
];

const benefits = [
  "Built strong connections with students across different majors and years",
  "Gained hands-on experience that directly complemented my co-op",
  "Improved my public speaking and presentation skills significantly",
  "Got access to exclusive industry networking events and recruiters",
  "Developed real leadership skills by running projects and events",
  "Made some of my closest friends at Northeastern through this club",
  "Got exposed to fields outside my major that I never expected to enjoy",
  "Connected with alumni who gave me co-op and full-time referrals",
  "Learned practical skills that my classes don't teach",
  "Had a consistent social outlet during an otherwise stressful semester",
];

const challenges = [
  "Time commitment is heavier than advertised, especially around competitions",
  "Difficult to balance with a co-op or heavy course load",
  "Getting a leadership position as a new member takes time and patience",
  "Some semesters are more active than others depending on the exec board",
  "Travel for competitions or events can take up entire weekends",
  "Large membership makes it harder to build close individual relationships",
  "Onboarding is informal and it takes a few weeks to find your place",
  "Funding from the university can be inconsistent for some events",
];

const firstNames = [
  "Aiden",
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
  "Maya",
  "Ethan",
  "Sofia",
  "Liam",
  "Zoe",
  "Noah",
  "Chloe",
  "Lucas",
  "Emma",
  "Oliver",
  "Isabella",
  "James",
  "Mia",
  "Benjamin",
  "Charlotte",
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
  "Kim",
  "Nguyen",
  "Chen",
  "Singh",
  "Kumar",
  "Sharma",
  "Okafor",
  "Gonzalez",
  "Murphy",
  "Cohen",
  "Walsh",
  "Sullivan",
  "Reyes",
  "Torres",
  "Rivera",
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
  return Array.from({ length: count }, (_, i) => {
    const base = clubs[i % clubs.length];
    return {
      name:
        count <= clubs.length
          ? base.name
          : `${base.name} — Section ${Math.floor(i / clubs.length) + 1}`,
      category: base.category,
      description: base.description,
      weeklyTimeCommitment: base.weeklyTimeCommitment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
}

function generateLogs(count, insertedClubs) {
  return Array.from({ length: count }, () => ({
    clubName: pick(insertedClubs).name,
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
      bio: `${pick(years)} student at Northeastern studying ${pick(majors)}. Passionate about getting involved on campus and making the most out of my time here.`,
      interests: pickMultiple(interests, 1, 3),
      joinedClubs: pickMultiple(
        clubs.map((c) => c.name),
        0,
        2
      ),
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

    const generatedClubs = generateClubs(clubs.length);
    await db.collection("clubs").insertMany(generatedClubs);
    console.log(`Inserted ${generatedClubs.length} clubs`);

    const additionalLogs = 1000 - generatedClubs.length;
    const logs = generateLogs(
      generatedClubs.length + additionalLogs,
      generatedClubs
    );
    await db.collection("membership_logs").insertMany(logs);
    console.log(`Inserted ${logs.length} membership logs`);

    const users = generateUsers(300);
    await db.collection("users").insertMany(users);
    console.log(`Inserted ${users.length} users`);

    const total = generatedClubs.length + logs.length + users.length;
    console.log(`Seeding complete — ${total} total records inserted`);
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
