import { Navigate, Routes, Route } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Users from './pages/Users'
import Events from './pages/Events'
import Applications from './pages/Applications'
import StaffEvents from './pages/StaffEvents'
import ProtectedRoutes from './routes/ProtectedRoutes'
import RoleRoute from './routes/RoleRoute'
import MyApplications from './pages/MyApplications'

const DefaultRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const roleId = Number(user?.role_id)

  if ([1, 3].includes(roleId)) {
    return <Navigate to="/events" replace />
  }

  if (roleId === 2) {
    return <Navigate to="/staffevents" replace />
  }

  return <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>}>

        <Route index element={<DefaultRoute />} />
        <Route path="/events" element={
          <RoleRoute allowedRoles={[1, 3]}>
            <Events />
          </RoleRoute>
        } />

        <Route path="/users" element={
          <RoleRoute allowedRoles={[1, 3]}>
            <Users />
          </RoleRoute>
        } />
        <Route path="/applications" element={
          <RoleRoute allowedRoles={[1, 3]}>
            <Applications />
          </RoleRoute>
        } />
        <Route path='/staffevents' element={
          <RoleRoute allowedRoles={[2, 3]}>
            <StaffEvents />
          </RoleRoute>
        }></Route>
        <Route
          path="/myapplications"
          element={
            <RoleRoute allowedRoles={[2, 3]}>
              <MyApplications />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>

  )
}

export default App
