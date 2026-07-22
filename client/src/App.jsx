import { Routes, Route } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Events from './pages/Events'
import Applications from './pages/Applications'
import Assignments from './pages/Assignments'
import StaffEvents from './pages/StaffEvents'
import ProtectedRoutes from './routes/ProtectedRoutes'
import RoleRoute from './routes/RoleRoute'
import MyApplications from './pages/MyApplications'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>}>

        <Route index element={<Dashboard />} />
        {/* MASTER ACCOUNT ID 3. REMOVE LATER SAME AT SIDEBAR COMPONENT */}
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
        <Route path="/applications" element={<Applications />} />
        <Route path='/assignments' element={<Assignments />} />
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

    //INCASE OFF ACCIDENT UNCOMMENT BOTTOM
    // <Routes>
    //   <Route path="/login" element={<Login />} />

    //   <Route path="/" element={<MainLayout />}>
    //     <Route index element={<Dashboard />} />

    //     <Route path="events" element={<Events />} />
    //     <Route path="users" element={<Users />} />
    //     <Route path="applications" element={<Applications />} />
    //     <Route path="assignments" element={<Assignments />} />
    //     <Route path="staffevents" element={<StaffEvents />} />
    //     <Route path="myapplications" element={<MyApplications />} />
    //   </Route>
    // </Routes>
  )
}

export default App
