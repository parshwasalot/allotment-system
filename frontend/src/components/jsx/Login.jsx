import axios from 'axios';
import React from 'react'
import { useNavigate } from  'react-router-dom';
import '../css/login.css'

function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        document.body.classList.add('login-body');
        
        return () => {
            document.body.classList.remove('login-body');
        };
    }, []);

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const category = localStorage.getItem('cat')
        if (storedToken) {
                if (category === 'S') {
                    navigate('/SDash');
                } else if (category === 'F') {
                    navigate('/FDash');
                } else if (category === 'A')  {
                    navigate('/ADash')  
                } else {
                    alert(navigate('/login'));
                }
        }
    }, []);

    const submitValue = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('http://127.0.0.1:4000/login', { username, password });
            
            if (response.data.flag === 1) {
                const { token, mydata } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('is_login', true);
                localStorage.setItem('userid', mydata._id);
                localStorage.setItem('username', mydata.username);
                localStorage.setItem('cat',mydata.cat)
                localStorage.setItem('name',mydata.name);
                localStorage.setItem('pass',mydata.password);

                const category = mydata.cat;

                if (category === 'S') {
                    navigate('/SDash');
                } else if (category === 'F') {
                    navigate('/FDash');
                } else if (category === 'A')  {
                    navigate('/ADash')  
                } else {
                    alert('Unknown category');
                }
            } else {
                alert('Login Failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in');
        }
    }

    return (
        <div className="login-container">
            <h3>Login</h3>
            <form onSubmit={submitValue}>
                <label>
                    <input 
                    id='login-inp'
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        placeholder='Enter your username' 
                        required 
                    />
                </label><br />
                <label>
                    <input 
                    id='login-inp'
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        placeholder='Enter your password'
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
export default Login;