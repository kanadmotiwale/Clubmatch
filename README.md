# ClubMatch — Discover Student Organizations

**Author:** Kanad Motiwale & Aarya Patil
**Class:** [CS5610 Web Development — Northeastern University](https://johnguerra.co/classes/webDevelopment_spring_2025/)

---

## Project Objective

Finding the right club at Northeastern isn't as easy as it should be. Between club fairs, Instagram pages, and random GroupMe messages, there's no single place where students can browse organizations, understand what they actually involve, and connect with other members.

ClubMatch is a full-stack web platform that brings all of that into one place. Students can browse and filter clubs by category and weekly time commitment, read and submit honest membership logs from real members, and set up a personal profile to represent themselves in the community. The goal was to build something that a student would actually want to use — not just a CRUD demo.

---

## Screenshot

![ClubMatch Home Page](screenshot.png)

---

## Tech Stack

- **Backend:** Node.js + Express (ES Modules)
- **Database:** MongoDB Atlas (native driver, no Mongoose)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Code Quality:** ESLint + Prettier
- **Deployment:** Render.com

---

## Features

- Browse and filter clubs by category and max weekly hours
- Submit and read membership logs with benefits, challenges, and weekly hours
- Average weekly hours stat per club calculated from real member logs
- Student profile registration with major, year, interests, and joined clubs
- Full CRUD on all three collections — clubs, membership logs, and users
- 1100+ seeded records across all collections
- Client-side rendering using only vanilla JavaScript — no frameworks

---

## Project Structure

```
clubmatch/
├── server/
│   ├── server.js
│   ├── db.js
│   └── routes/
│       ├── clubs.js
│       ├── membership-logs.js
│       └── users.js
├── public/
│   ├── index.html
│   ├── clubs.html
│   ├── membership-logs.html
│   ├── members.html
│   ├── css/
│   │   ├── main.css
│   │   ├── clubs.css
│   │   ├── logs.css
│   │   └── members.css
│   └── js/
│       ├── api.js
│       ├── index.js
│       ├── clubs.js
│       ├── logs.js
│       └── members.js
├── scripts/
│   └── seed.js
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md
└── LICENSE
```

---

## Instructions to Build

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas account (free tier is fine)

### Setup

1. Clone the repository

```bash
git clone <repository-url>
cd clubmatch
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory using `.env.example` as a reference:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clubmatch?retryWrites=true&w=majority
PORT=3000
```

Replace the URI with your actual MongoDB Atlas connection string.

4. Seed the database

```bash
npm run seed
```

This inserts 1100 records across the clubs, membership logs, and users collections.

5. Start the app

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Other Commands

```bash
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

---

## Video Demo

[Watch the demo here](<video-link>)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.