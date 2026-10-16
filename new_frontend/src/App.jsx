import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminRecruiters from "./pages/admin/AdminRecruiters";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStudentProfile from "./pages/admin/AdminStudentProfile";
import AdminRecruiterProfile from "./pages/admin/AdminRecruiterProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateJob from "./pages/recruiter/CreateJob";
import EditJob from "./pages/recruiter/EditJob";
import MyJobs from "./pages/recruiter/MyJobs";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import JobApplicants from "./pages/recruiter/JobApplicants";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobDetails from "./pages/recruiter/RecruiterJobDetails";
import StudentApplications from "./pages/student/StudentApplications";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentJobDetails from "./pages/student/StudentJobDetails";
import StudentJobs from "./pages/student/StudentJobs";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import RecruiterProfilePage from "./pages/recruiter/RecruiterProfilePage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import Unauthorized from "./pages/Unauthorized";

function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7fb]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/jobs" element={<StudentJobs />} />
            <Route path="/jobs/:id" element={<StudentJobDetails />} />
            <Route
              path="/student/applications"
              element={<StudentApplications />}
            />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["RECRUITER"]}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/jobs/create" element={<CreateJob />} />
            <Route
              path="/recruiter/jobs/:id"
              element={<RecruiterJobDetails />}
            />
            <Route path="/recruiter/jobs/edit/:id" element={<EditJob />} />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={<JobApplicants />}
            />
            <Route
              path="/recruiter/applications"
              element={<RecruiterApplications />}
            />
            <Route
              path="/recruiter/profile"
              element={<RecruiterProfilePage />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route
              path="/admin/students/:userId"
              element={<AdminStudentProfile />}
            />
            <Route
              path="/admin/recruiters/:userId"
              element={<AdminRecruiterProfile />}
            />
            <Route path="/admin/recruiters" element={<AdminRecruiters />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
