import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import '../css/fdash.css';

function SDash(){
  const navigate = useNavigate();
  const [token, setToken] = React.useState('');
  const name = localStorage.getItem('name');

  useEffect(() => {
    document.body.classList.add('fdash-body');
    
    return () => {
        document.body.classList.remove('fdash-body');
    };
}, []);

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
        setToken(storedToken);
        } else {
        navigate('/login');
        }
    }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      window.history.replaceState("", "", '/SDash');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="fdash-body">
        <div className="dashboard-container">
            <h1>Student Dashboard</h1>
            <h3>Welcome, {name}</h3>
            <nav className="fdash-nav">
                <ul>
                    <li><button id="bt" onClick={() => navigate('/SDisp')}>Display Events</button></li>
                </ul>
            </nav>
            <button id="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    </div>
);
}
export default SDash;