import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdisp.css';

function UserDisp() {
    const navigate = useNavigate();
    const [token, setToken] = React.useState('');
    const [usernameSearch, setUsernameSearch] = React.useState('');
    const [nameSearch, setNameSearch] = React.useState('');
    const [categorySearch, setCategorySearch] = React.useState('');

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    React.useEffect(() => {
        document.body.classList.add('fdisp-body');
        
        return () => {
            document.body.classList.remove('fdisp-body');
        };
    }, []);
    
    const [mydata, setData] = React.useState([]);
    React.useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get("https://allotment-system-backend.vercel.app/user/display")
            .then(res => {
                console.log(res.data); 
                setData(res.data.mydata);
            }).catch((error) => {
                alert("Error Occurred: " + error);
                console.log(error);
            });
    }

    const deleteData = (id) => {
        axios.delete(`https://allotment-system-backend.vercel.app/user/delete/${id}`)
          .then((res) => {
            console.log('Successfully deleted!');
            alert(res.data.msg);
            getData();
      
            // Log API call
            const username = localStorage.getItem('username');
            axios.post('https://allotment-system-backend.vercel.app/logging/userdel', { username })
            .then(logRes => {
              console.log('Log entry created:', logRes);
            })
            .catch(logErr => {
              console.error('Error logging user deletion:', logErr);
            });
          }).catch((error) => {
            alert("Error Occurred: " + error);
            console.log(error);
          });
      }
      

    const handleEdit = (id) => {
        navigate(`/UserEdit/${id}`);
    };

    const handlePassword = (id) => {
        navigate(`/UserChPass/${id}`);
    };

    const handleUsernameSearchChange = (e) => {
        const value = e.target.value;
        setUsernameSearch(value);
    };

    const handleNameSearchChange = (e) => {
        const value = e.target.value;
        if (value.length <= 15) {
            setNameSearch(value);
        } else {
            alert("Name search input must be 15 characters or less.");
        }
    };

    const handleCategorySearchChange = (e) => {
        setCategorySearch(e.target.value);
    };

    const filteredData = mydata.filter((user) => 
        (user.username && user.username.toLowerCase().includes(usernameSearch.toLowerCase())) &&
        (user.name && user.name.toLowerCase().includes(nameSearch.toLowerCase())) && 
        (user.cat && user.cat.toLowerCase().includes(categorySearch.toLowerCase()))
    );

    return (
        <div className="display-container">
            <h2>Display Users</h2>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search by username" 
                    value={usernameSearch}
                    onChange={handleUsernameSearchChange}
                />
                <input 
                    type="text" 
                    placeholder="Search by name" 
                    value={nameSearch}
                    onChange={handleNameSearchChange}
                />
                <select 
                    value={categorySearch}
                    onChange={handleCategorySearchChange}
                >
                    <option value="">Select Category</option>
                    <option value="S">Student</option>
                    <option value="F">Faculty</option>
                    <option value="A">Admin</option>
                </select>
            </div>
            <table border='1'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Category</th>
                        <th>Edit</th>
                        <th>Delete</th> 
                        <th>Change Password</th>           
                    </tr>
                </thead>
                <tbody>
                    {filteredData && filteredData.length ? (
                        filteredData.map((values, i) => (
                            <tr key={i+1}>
                                <td>{values.username}</td>
                                <td>{values.name}</td>
                                <td>{values.mobile}</td>
                                <td>{values.cat}</td>
                                <td>
                                <button onClick={() => handleEdit(values._id)}>Edit</button>
                                </td>
                                <td>
                                <button onClick={() => deleteData(values._id)}>Delete</button>
                                </td>
                                <td>
                                <button onClick={() => handlePassword(values._id)}>Change Password</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No Record Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserDisp;
