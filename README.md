# SRMCEM Placement Portal

The SRMCEM Placement Portal is a web-based project that helps manage college placement activities in one place. It connects students, recruiters, and administrators, making the placement process easier and more organized.

## Features

### Student
- Register and log in.
- View available jobs.
- Check job details and eligibility.
- Apply for jobs and upload a resume.
- Check application status.

### Recruiter
- Log in to the recruiter account.
- Post and manage jobs.
- View student applications.
- Update application status.

### Admin
- View students and recruiters.
- View and manage job postings.
- Check applications.
- Manage user accounts.

## Technologies Used

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Java, Spring Boot
- **Database:** MySQL
- **Authentication:** Spring Security and JWT
- **Tools:** VS Code, Postman, Git, and GitHub

## Project Structure

```text
SRMCEM-Placement-Portal/
├── frontend/
├── backend/
└── README.md
```

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/amanshrinet/Srmcem_Placement_Portal.git
cd Srmcem_Placement_Portal
```

### 2. Start the Backend

Open a terminal and run:

```bash
cd srmcem_portal
mvn spring-boot:run
```

Make sure Java, Maven, and MySQL are installed and the database configuration is correct.

### 3. Start the Frontend

Open another terminal and run:

```bash
cd new_frontend
npm install
npm run dev
```

Open the local URL shown in the terminal to use the application.

## How It Works

1. The recruiter logs in and posts a job.
2. The student logs in and applies for the job.
3. The recruiter views the application and updates its status.
4. The admin logs in and views students, recruiters, jobs, and applications.

## Future Improvements

- Email notifications for application updates.
- Better job search and filtering.
- Placement reports and statistics.
- Interview scheduling.

## GitHub Repository

[SRMCEM Placement Portal](https://github.com/amanshrinet/Srmcem_Placement_Portal)

---

This project was developed to make the college placement process simpler and easier to manage.
