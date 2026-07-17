import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import ApplyPage from './pages/ApplyPage';
import PostJobPage from './pages/PostJobPage';
import MyJobsPage from './pages/MyJobsPage';
import MyBidsPage from './pages/MyBidsPage';
import TalentPage from './pages/TalentPage';
import ContractsPage from './pages/ContractsPage';
import ContractRoomPage from './pages/ContractRoomPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/users/:id" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts/:id" element={<ContractRoomPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:id" element={<MessagesPage />} />
      </Route>
      <Route element={<RoleRoute role="CLIENT" />}>
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/my-jobs" element={<MyJobsPage />} />
        <Route path="/talent" element={<TalentPage />} />
      </Route>
      <Route element={<RoleRoute role="FREELANCER" />}>
        <Route path="/my-bids" element={<MyBidsPage />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
