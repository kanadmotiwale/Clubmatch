ClubMatch — Design Document

Course: CS5610 Web Development — Northeastern University
Authors: Kanad Motiwale and Aarya Patil
Date: February 2026

────────────────────────────────────────────────────────────────
PROJECT DESCRIPTION
────────────────────────────────────────────────────────────────

Every semester at Northeastern, students go through the same cycle. They show up to the involvement fair, grab a bunch of flyers, follow a few Instagram pages, and still have no real idea what joining a club actually looks like day to day. How many hours does it really take? Is it worth it for someone with a packed schedule? There is no good answer to these questions anywhere, and that is the problem we wanted to solve.

ClubMatch is a web platform where students can browse clubs, read honest participation logs from people who have actually been in those clubs, and set up a personal profile to represent themselves in the community. The idea is simple — put all the information in one place and let students make better decisions.

The app has three independent parts:

- Club Directory : A browsable and filterable list of student organizations with key information like category and weekly time commitment.
- Membership Logs : Structured entries from real members sharing how many hours they actually spent and what they got out of it.
- Student Profiles : Students create personal profiles listing their major, year, interests, and clubs they have joined.

────────────────────────────────────────────────────────────────
USER PERSONAS
────────────────────────────────────────────────────────────────

Persona 1 — Aman, First-Year Student
Age: 18  |  Major: Mechatronics  |  Year: First Year

Aman showed up to the involvement fair in his first week and was honestly overwhelmed. There were dozens of tables, everyone was pitching their club, and he had maybe 5 hours a week to spare. He followed a few Instagram accounts but never really got useful information back.

Goals:
- Build a profile that reflects who he is and what he is looking for.
- Filter clubs by interest and know what the club provides.

---

Persona 2 — Karina, Junior Computer Science Student
Age: 21  |  Major: Computer Science  |  Year: Junior

Karina has been in a few clubs, dropped a couple because they took way more time than advertised, and is now pretty selective. She wants to update her profile each semester and likes having data to back up her decisions.

Goals:
- Share her experience so that other people could know how the club is.
- Quickly filter clubs by time commitment before even reading the description.
- Use membership log data to compare clubs rather than just their marketing.

---

Persona 3 — Tayne , Graduate Student and Club Administrator
Age: 23  |  Major: Graduate Student  |  Role: Club Admin

Tayne manages the Robotics Club. He want to tell the students about the club activities and how the events are hosted

Goals:
- Add the club to the platform himself and keep it updated without waiting on anyone.
- Make sure the time commitment listed is honest so they attract the right members.
- Remove old or wrong information quickly when things change.

---

## User Stories

### Clubs Collection

1. Create a Club Entry
As club administrator , I want to add a new club with its name, category, description, and weekly time commitment so students can find us on the platform.

2. View All Clubs
As a new student , I want to see all the clubs listed on the platform so I can get a sense of what is out there.

3. Filter and Search Clubs
As a sports enthusiast, I want to filter clubs by category and search by name or keyword so I can quickly cut down the list to what actually works for my schedule.

4. Edit a Club Entry
As Club administrator, I want to update my club's information when things change so the listing stays accurate.

5. Delete a Club Entry
As Aisha, I want to remove a club that is no longer active so the directory does not get cluttered with dead listings.

6. Join a Club
As a new student, I want to register for a club by entering my personal details so I can become a member of that club.

### Membership Logs Collection

1. Log a Club Experience
As member of robotics club, I want to write up my experience in the club including how many hours it took, what I got out of it, and what was tough, so other students have something real to go off of.

2. View Club Experience Tab
As fresher, I want to scroll through membership logs grouped by club so I can see all the reviews for a specific club in one place.

3. View Member Experience Tab
As any visitor, I want to see individual reviews with the member's name so I know who wrote each review and can trust it is from a real student.

### Users Collection and Authentication

1. Register an Account
As a fresher, I want to create an account with my email and password so I can have a personal profile that persists across sessions.

2. Log In
As Priya, I want to log in to my existing account so I can access my profile and get a personalized experience.
Acceptance criteria: Login form validates email and password. On success the user object is stored in localStorage and the navbar updates to show the user's name.

3. Edit My Details from Anywhere
As a sophomore, I want to edit my details as i want to change my interest to a different category.

4. Log Out
As Alex, I want to log out of my account from anywhere on the site so my session is cleared.
Acceptance criteria: Clicking Log Out in the user menu clears localStorage and redirects to the home page.

5.  View a Full Profile
As any visitor, I want to click on a member card and see their full profile including bio, interests, and clubs.

6. Delete a Profile
As a graduate, I want to delete my profile if I decide I do not want to be on the platform anymore.

---

## Design Mockups

## Design Mockups

### Home Page
![Home Page](Frame 22.png)

### Clubs Page
![Clubs Page](Frame 24.png)

### Membership Log
![Membership Log Page](Frame 26.png)

