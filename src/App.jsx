import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireAdmin from './auth/RequireAdmin.jsx'
import DashboardLayout from './layout/DashboardLayout.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import UserDetail from './pages/UserDetail.jsx'
import AdminTemplates from './pages/AdminTemplates.jsx'
import TemplateDetail from './pages/TemplateDetail.jsx'
import AdminLists from './pages/AdminLists.jsx'
import ListRecipients from './pages/ListRecipients.jsx'
import AdminCampaigns from './pages/AdminCampaigns.jsx'
import CampaignSends from './pages/CampaignSends.jsx'
import AdminAllSends from './pages/AdminAllSends.jsx'
import AdminLogs from './pages/AdminLogs.jsx'
import AdminSettings from './pages/AdminSettings.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route element={<RequireAuth />}>
            <Route element={<RequireAdmin />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/templates" element={<AdminTemplates />} />
                <Route path="/templates/:id" element={<TemplateDetail />} />
                <Route path="/campaigns" element={<AdminCampaigns />} />
                <Route path="/campaigns/:id" element={<CampaignSends />} />
                <Route path="/lists" element={<AdminLists />} />
                <Route path="/lists/:id" element={<ListRecipients />} />
                <Route path="/sends" element={<AdminAllSends />} />
                <Route path="/logs" element={<AdminLogs />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
