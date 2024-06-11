import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdash.css';
import axios from 'axios';

function FDash() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const name = localStorage.getItem('name');
  const id = localStorage.getItem('userid');
  const cat = localStorage.getItem('cat');

  useEffect(() => {
    document.body.classList.add('fdash-body');
    
    return () => {
        document.body.classList.remove('fdash-body');
    };
}, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      if (cat === 'F'){
        setToken(storedToken);
        window.history.replaceState("", "", '/FDash');
      } else if (cat === 'A'){
        navigate('/ADash');
      } else {
        navigate('/SDash');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const username = localStorage.getItem('username');
      await axios.post('https://allotment-system-backend.vercel.app/logging/logout', { username });

      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Faculty Dashboard</h1>
      <h3>Welcome, {name}</h3>
      <nav className = "fdash-nav">
        <ul>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/EventReg')}>Register Event</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/Ahall')}>Check Available Halls</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/FDisp')}>Display Events</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/WDisp')}>Waitlist</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/FUCP/${id}')}>Change Password</button>
          </li>
        </ul>
      </nav>
      <button id="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default FDash;
