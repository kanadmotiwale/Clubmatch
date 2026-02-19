import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

const categories = ["Academic", "Cultural", "Sports", "Professional", "Arts", "Service"];
const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const majors = [
  "Computer Science", "Business Administration", "Communications",
  "Mechanical Engineering", "Psychology", "Biology", "Mathematics",
  "Political Science", "Economics", "Design", "Nursing", "History",
];
const interests = ["Academic", "Cultural", "Sports", "Professional", "Arts", "Service"];

const clubNames = [
  "Robotics Club", "Debate Team", "South Asian Cultural Society", "Chess Club",
  "Photography Club", "Hiking Club", "Pre-Law Society", "Finance Club",
  "AI & Machine Learning Club", "Theater Club", "Volleyball Club",
  "Entrepreneurship Club", "Environmental Club", "Coding Club",
  "Music Club", "Dance Club", "Book Club", "Gaming Club",
  "Astronomy Club", "Swimming Club",
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
  "Alex", "Priya", "Marcus", "Aisha", "Jordan", "Taylor", "Morgan",
  "Casey", "Jamie", "Riley", "Avery", "Quinn", "Skyler", "Drew",
  "Sam", "Dana", "Parker", "Reese", "Logan", "Cameron",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson",
  "White", "Harris", "Martin", "Thompson", "Lee", "Patel",
];
