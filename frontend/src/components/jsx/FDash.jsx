import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdash.css';

function FDash() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const name = localStorage.getItem('name');
  const id = localStorage.getItem('userid');
  console.log(id);

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
      window.history.replaceState("", "", '/FDash');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
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
