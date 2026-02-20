# ClubMatch — Discover Student Organizations

**Author:** Kanad Motiwale & Aarya Patil
**Class:** [CS5610 Web Development — Northeastern University](https://johnguerra.co/classes/webDevelopment_spring_2025/)

---

## Project Objective

Finding the right club at Northeastern isn't as easy as it should be. Between club fairs, Instagram pages, and random GroupMe messages, there's no single place where students can browse organizations, understand what they actually involve, and connect with other members.

ClubMatch is a full-stack web platform that brings all of that into one place. Students can browse and filter clubs by category and weekly time commitment, read honest membership logs from real members, create a personal profile, and register for clubs — all without needing an account. Students who do create an account get a more personalized experience with auto-filled forms and the ability to manage their profile from anywhere on the site.

---

## Screenshot

![ClubMatch Home Page](screenshot.png)

---

## Tech Stack

- **Backend:** Node.js + Express (ES Modules only, no CommonJS)
- **Database:** MongoDB Atlas (native driver, no Mongoose)
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Authentication:** bcrypt password hashing
- **Code Quality:** ESLint + Prettier
- **Deployment:** Render.com

---

## Features

- Browse and filter clubs by category, max weekly hours, and search keyword
- Click any club to see full details and a list of students who have joined
- Join a club with a simple registration form — auto-fills if you're logged in
- Submit honest membership logs with your name, weekly hours, benefits, and challenges
- View club experience and member experience tabs on the reviews page
- Average weekly hours calculated per club from real member submissions
- Create a student profile with major, year, bio, interests, and joined clubs
- Filter members by All, Members (joined a club), and Students (not yet joined)
- Register and log in to your account — edit your details from any page via the navbar
- Admin mode protected by password — add, edit, and delete clubs and logs
- Fully responsive — works on mobile, tablet, and desktop
- 1100+ seeded records across all collections

---

## Project Structure

```
clubmatch/
├── server/
│   ├── server.js
│   ├── db.js
│   └── routes/
│       ├── auth.js
│       ├── clubs.js
│       ├── membership-logs.js
│       └── users.js
├── public/
│   ├── index.html
│   ├── clubs.html
│   ├── membership-logs.html
│   ├── members.html
│   ├── login.html
│   ├── register.html
│   ├── css/
│   │   ├── main.css
│   │   ├── clubs.css
│   │   ├── logs.css
│   │   ├── members.css
│   │   └── auth.css
│   └── js/
│       ├── api.js
│       ├── auth-state.js
│       ├── index.js
│       ├── clubs.js
│       ├── logs.js
│       ├── members.js
│       ├── login.js
│       └── register.js
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
- A MongoDB Atlas account (free tier works fine)

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

This inserts 1100+ records across the clubs, membership logs, and users collections.

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

## Live Demo

[clubmatch.onrender.com](https://clubmatch.onrender.com)

> Note: The app is hosted on Render's free tier. If it hasn't been visited recently it may take 30-50 seconds to wake up on the first load.

---

## Video Demo

[Watch the demo here](<video-link>)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.