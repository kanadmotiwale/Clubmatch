# ClubMatch

A platform for students to discover campus clubs and read about real participation experiences before committing.

## Authors

- [Kanad Motiwale](https://github.com/YOUR_GITHUB)
- [Aarya Patil](https://github.com/AARYA_GITHUB)


## Project Objective

Most students find out about clubs through club fairs or Instagram pages, and honestly that doesn't tell you much about what it's actually like to be in one. You don't get a sense of the time commitment, the workload, or what the experience really looks like week to week.

ClubMatch tries to fix that. It has two main parts. The first is a club directory where you can browse, filter, and sort student organizations by things like category and weekly time commitment. The second is a membership log system where students can submit their own structured experiences, including how many hours they put in per week, what they got out of it, and what was challenging. Both parts run on their own Mongo collections and are completely independent of each other.

We also built in some aggregation features. You can see things like the average time commitment across all clubs in a category, or the average rating for a specific club based on submitted logs.


## Tech Stack

- Node.js
- Express.js
- MongoDB (native driver, no Mongoose)
- HTML5
- Vanilla JavaScript (client side rendering)
- CSS (modular)

## Features

- Full CRUD on two independent Mongo collections (clubs and membership_logs)
- Filter clubs by category or weekly time commitment
- Sort clubs by name or time commitment
- Filter membership logs by category, semester, or rating
- Average weekly time commitment grouped by club category
- Average weekly hours and rating grouped by club name or category
- Admin moderation to remove inaccurate club entries
- Form based creation for both clubs and logs
- Deployed on a public server

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance

## How to Run It

1. Clone the repo

```
git clone https://github.com/YOUR_GITHUB/clubmatch.git
cd clubmatch
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file in the root directory with your Mongo connection string

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/clubmatch
PORT=3000
```

4. Start the server

```
npm start
```

5. Open `http://localhost:3000` in your browser and you should be good to go

## Project Structure

```
clubmatch/
├── public/
│   ├── css/
│   │   ├── clubs.css
│   │   ├── membership_logs.css
│   │   └── main.css
│   ├── js/
│   │   ├── clubs.js
│   │   └── membershipLogs.js
│   └── index.html
├── routes/
│   ├── clubs.js
│   └── membershipLogs.js
├── db/
│   └── connection.js
├── .env
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
├── LICENSE
├── README.md
└── server.js
```

## A Note on Credentials

The `.env` file holds the MongoDB connection string and is listed in `.gitignore`, so it never gets pushed to the repo. You'll need to create your own with your credentials.

## License

MIT