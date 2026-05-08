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
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/users" element={<Users />} />
        <Route path="/applications" element={<Applications />} />
        <Route path='/assignments' element={<Assignments />} />
        <Route path='/staffevents' element={<StaffEvents />}></Route>
      </Route>

    </Routes>
  )
}

export default App
