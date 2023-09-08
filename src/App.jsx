import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Navbar from './components/Navbar.jsx'
import RegisterScreen from './pages/RegisterScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import Footer from './components/Footer.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import EditProfile from './pages/EditProfile.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UserProfile from './pages/UserProfile.jsx'
import {config} from 'dotenv'
function App() {
  

  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/explore' element={<ExplorePage />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/users/:Id' element={<UserProfile />} />
        </Routes>
        <footer className='fixed bottom-0 w-full'>
          <Footer />
        </footer>
      </Router>
    </div>
  )
}

export default App
