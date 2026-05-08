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
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>}>

        <Route index element={<Dashboard />} />

        <Route path="/events" element={
          <RoleRoute allowedRoles={[1]}>
            <Events />
          </RoleRoute>
        } />

        <Route path="/users" element={
          <RoleRoute allowedRoles={[1]}>
            <Users />
          </RoleRoute>
        } />
        <Route path="/applications" element={<Applications />} />
        <Route path='/assignments' element={<Assignments />} />
        <Route path='/staffevents' element={
          <RoleRoute allowedRoles={[2]}>
            <StaffEvents />
          </RoleRoute>
        }></Route>
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
    //   </Route>
    // </Routes>
  )
}

export default App
