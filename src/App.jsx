
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom" 
import Dashboard from "./Pages/Dashboard"
import Login from "./Pages/Login"
import Footer from './Components/Footer'
import Navbar from "./Components/Navbar"
import Register from "./Pages/Register"
import RegisterProfessor from "./Pages/Professor/RegisterProfessor"
import DashboardProfessor from "./Pages/Professor/DashboardProfessor"
import CourseCreation from "./Pages/Professor/CourseCreation"
import GetCourseUpdateCourse from "./Pages/Professor/GetCourseUpdateCourse"
import ProfessorCourses from "./Pages/Professor/ProfessorCourses"
import StudentProfile from "./Pages/StudentProfile"
import Card from "./Components/Contianer/Card"
// import CourseDetails from "./Pages/CourseDetails"
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard"
import PrivateRoute from "./Components/ProtectedRoute/PrivateRoute"
import ProfessorProfile from "./Pages/Professor/ProfessorProfile"
import Rotation from "./Components/DashBoardComponents/Rotation"
import CourseCompletionStats from "./Pages/Professor/CourseCompletionStats"
import AdminLayout from "./Components/Layouts/AdminLayout"
import CourseDetails from "./Components/Course/CourseDetails"
import UserManagement from "./Pages/AdminDashboard/UserManagement"
import CourseManagement from "./Pages/AdminDashboard/CourseManagement"

function App() {
  return (
   <>
    <Router>
      <Routes>
        {/* Admin routes with custom layout (no navbar) */}
        <Route path="/admin/*" element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/courses" element={<CourseManagement />} />
                {/* Add more admin routes here as needed */}
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />
        
        {/* Regular routes with navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/Login" element={<Login/>} />
              <Route path="/Cards" element={<Card/>} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              {/* <Route path="/course/:courseId" element={<CourseDetails/>} /> */}
              
              {/* for User */}
              <Route path="/Register" element={<Register/>} />
              {/* <Route path="/Card" element={<CardForCourse />} /> */}

              {/* Protected Route */}
              <Route path="/ProfessorDashboard" element={<DashboardProfessor/>} />
              <Route path="/CourseCreation" element={<CourseCreation/>} />
              <Route path="/RegisterProfessor" element={<RegisterProfessor/>} />
              <Route path="/professorcourses" element={<ProfessorCourses />} />
              <Route path="/update-course/:courseId" element={<GetCourseUpdateCourse />} />
              <Route path="/Studentprofile" element={<StudentProfile />} />
              <Route path="/Professorprofile" element={<ProfessorProfile />} />
              <Route path="/Rotation" element={<Rotation />} />
              <Route path="/course-completion/:courseId" element={<CourseCompletionStats />} />
            </Routes>
            <Footer/>
          </>
        } />
      </Routes>
    </Router>
   </>
  )
}

export default App
