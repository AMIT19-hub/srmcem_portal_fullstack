import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/jobService';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      const data = await getJobs();
      setJobs(data);
    };

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page-shell">
      <div className="topbar">
        <h1>Available Jobs</h1>
        <nav className="nav">
          <Link to="/student">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/student/applications">My Applications</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>

      <div className="panel search-panel">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, company or location"
        />
      </div>

      <div className="list-grid">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
