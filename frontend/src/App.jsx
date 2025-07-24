import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Contact from './pages/Contact';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Appointment from './pages/Appointment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserProvider from '../src/context/AppContext';

const App = () => {
  const location = useLocation();

  // List of paths where Navbar/Footer should be hidden
  const hideLayoutOnPaths = ['/login'];

  const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);

  return (
    <UserProvider>
      <div className='mx-4 sm:mx-[10%]'>
        {!shouldHideLayout && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-appointmets' element={<MyAppointments />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
        </Routes>
        {!shouldHideLayout && <Footer />}
      </div>
    </UserProvider>
  );
};

export default App;
