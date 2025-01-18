import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/about';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MenuAdmin from './pages/menu/MenuAdmi';
import MenuUser from './pages/menu/MenuUser';

function App() {
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/MenuUser" element={<MenuUser />} />
          <Route path="/MenuAdmin" element={<MenuAdmin/>} />
        </Routes>
      </Router> 
      <Footer /> 
     
    </>
  )
}

export default App
