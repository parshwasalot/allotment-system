import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdash.css';

function ADash() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const name = localStorage.getItem('name');

  useEffect(() => {
    document.body.classList.add('fdash-body');
    
    return () => {
        document.body.classList.remove('fdash-body');
    };
}, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      window.history.replaceState("", "", '/ADash');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <h3>Welcome, {name}</h3>
      <nav className = "fdash-nav">
        <ul>
        <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/UserDisp')}>User Display</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/UserReg')}>Register User</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/EventReg')}>Register Event</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/FDisp')}>Display Events</button>
          </li>
          <li>
            <button id = "bt" className="nav-button" onClick={() => navigate('/WDisp')}>Waitlist</button>
          </li>
        </ul>
      </nav>
      <button id="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default ADash;
