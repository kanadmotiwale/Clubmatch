# ClubMatch - Discover Student Organizations

**Authors:** Kanad Motiwale & Aarya Patil  
**Class:** CS5610 Web Development  
**Course Link:** [Northeastern University - CS5610](https://johnguerra.co/classes/webDevelopment_fall_2024/)

## Project Objective

ClubMatch is a centralized discovery and participation analytics platform designed for students to explore academic, cultural, professional, and sports organizations based on interest and weekly time commitment. The platform addresses the challenge of limited club information by separating directory data from structured participation logs, enabling students to make informed involvement decisions with realistic workload expectations.

## Screenshot

![ClubMatch Homepage](screenshot.png)

## Features

- **Club Discovery**: Browse and filter student organizations by category and time commitment
- **Membership Experiences**: Read and share detailed participation logs with benefits and challenges
- **Time Analytics**: View average weekly hours for specific clubs based on real member data
- **Full CRUD Operations**: Create, read, update, and delete both clubs and membership logs
- **Client-Side Rendering**: Dynamic content loading using vanilla JavaScript modules
- **Responsive Design**: Mobile-friendly interface with modern CSS

## Technology Stack

- **Backend**: Node.js + Express (ES6 modules)
- **Database**: MongoDB (native driver, no Mongoose)
- **Frontend**: Vanilla JavaScript (client-side rendering), HTML5, CSS3
- **Code Quality**: ESLint, Prettier

## Project Structure

```
clubmatch/
├── server/
│   ├── server.js              # Express server
│   ├── db.js                  # MongoDB connection module
│   └── routes/
│       ├── clubs.js           # Club CRUD operations (Kanad)
│       └── membership-logs.js # Membership log CRUD (Aarya)
├── public/
│   ├── index.html
│   ├── clubs.html
│   ├── membership-logs.html
│   ├── css/
│   │   ├── main.css
│   │   ├── clubs.css
│   │   └── logs.css
│   └── js/
│       ├── api.js             # API helper module
│       ├── clubs.js           # Clubs page logic
│       └── logs.js            # Logs page logic
├── .env
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md
└── LICENSE
```

## Instructions to Build

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clubmatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clubmatch?retryWrites=true&w=majority
   PORT=3000
   ```

   Replace with your actual MongoDB connection string.

4. **Run the application**

   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## MongoDB Collections

### clubs
```javascript
{
  _id: ObjectId,
  name; String,
  category; String, // Academic, Cultural, Professional, Sports, Arts, Service
  description; String,
  weeklyTimeCommitment; Number, // hours per week
  createdAt; Date,
  updatedAt; Date (optional)
}
```

### membership_logs
```javascript
{
  _id: ObjectId,
  clubName; String,
  weeklyHours; Number,
  benefits; String,
  challenges; String,
  createdAt;Date,
  updatedAt; Date (optional)
}
```

## API Endpoints

### Clubs (Kanad)
- `POST /api/clubs` - Create a new club
- `GET /api/clubs` - Get all clubs (with optional filters: category, maxTime)
- `GET /api/clubs/:id` - Get single club by ID
- `PUT /api/clubs/:id` - Update a club
- `DELETE /api/clubs/:id` - Delete a club

### Membership Logs (Aarya)
- `POST /api/membership-logs` - Create a new log
- `GET /api/membership-logs` - Get all logs (with optional filter: clubName)
- `GET /api/membership-logs/:id` - Get single log by ID
- `GET /api/membership-logs/stats/:clubName` - Get average hours for a club
- `PUT /api/membership-logs/:id` - Update a log
- `DELETE /api/membership-logs/:id` - Delete a log

## Deployment

The application can be deployed to:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)

Make sure to set environment variables in your hosting platform's dashboard.

## Video Demo

[Link to narrated video demonstration]

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Course Instructor: John Guerra
- Northeastern University - Khoury College of Computer Sciences