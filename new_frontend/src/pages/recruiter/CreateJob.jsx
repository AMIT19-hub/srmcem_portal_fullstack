import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import JobForm from "../../components/JobForm";
import { useToast } from "../../components/ToastContext";
import { createJob } from "../../services/jobService";
import { errorText } from "../../utils/data";
export default function CreateJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await createJob(data);
      showToast(response?.message || "Job created successfully.");
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(errorText(err, "Unable to create this job."));
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <p className="text-sm font-bold tracking-[0.14em] text-emerald-700">
        RECRUITER JOBS
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">Create Job</h1>
      <p className="mt-2 text-sm text-slate-600">
        All fields are required before the job can be published.
      </p>
      <div className="mt-6">
        <ErrorMessage message={error} />
      </div>
      <div className="mt-6 border border-slate-200 bg-white p-6 shadow-sm">
        <JobForm onSubmit={submit} loading={loading} submitLabel="Create job" />
      </div>
    </section>
  );
}
