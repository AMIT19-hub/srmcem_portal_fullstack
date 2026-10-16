import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { applyForJob } from '../services/applicationService';
import { getJobById } from '../services/jobService';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      const data = await getJobById(id);
      setJob(data);
    };

    loadJob();
  }, [id]);

  const handleApply = async () => {
    const result = await applyForJob(id);
    setMessage(result.message || 'Application submitted successfully.');
  };

  if (!job) {
    return <div className="page-shell"><h2>Loading job details...</h2></div>;
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <h1>{job.title}</h1>
        <nav className="nav">
          <Link to="/jobs">Back to Jobs</Link>
          <button className="link-button" onClick={() => navigate('/student')}>Student Home</button>
        </nav>
      </div>

      <div className="job-detail-panel panel">
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary (LPA):</strong> {job.salary}</p>
        <p><strong>Skills:</strong> {job.skills}</p>
        <p><strong>Eligibility:</strong> {job.eligibility}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <p><strong>Application Deadline:</strong> {job.applicationDeadline}</p>
        <p><strong>Description:</strong> {job.description}</p>

        {message && <div className="alert success">{message}</div>}

        <button type="button" className="primary-button" onClick={handleApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
