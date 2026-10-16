import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../services/applicationService';

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      const data = await getMyApplications();
      setApplications(data);
    };

    loadApplications();
  }, []);

  return (
    <div className="page-shell">
      <div className="topbar">
        <h1>My Applications</h1>
        <nav className="nav">
          <Link to="/student">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/student/applications">My Applications</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>

      <div className="panel">
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <div className="application-list">
            {applications.map((application) => (
              <div key={application.id} className="application-item">
                <h3>{application.jobTitle || application.title}</h3>
                <p>{application.company}</p>
                <p>Applied Date: {application.appliedDate}</p>
                <p>Status: {application.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
