import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdisp.css';

function UserDisp() {
    const navigate = useNavigate();
    const [token, setToken] = React.useState('');

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
        axios.get("http://localhost:4000/user/display")
            .then(res => {
                console.log(res.data); 
                setData(res.data.mydata);
            }).catch((error) => {
                alert("Error Occurred: " + error);
                console.log(error);
            });
    }

    const deleteData = (id) => {
        axios.delete(`http://localhost:4000/user/delete/${id}`)
            .then((res) => {
                console.log('Successfully deleted!');
                alert(res.data.msg);
                getData();
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

    return (
        <div className="display-container">
            <h2>Display Users</h2>
            <table border='1'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Category</th>
                        <th>Edit</th>
                        <th>Delete</th> 
                        <th>Change Password</th>           
                    </tr>
                </thead>
                <tbody>
                    {mydata && mydata.length ? (
                        mydata.map((values, i) => (
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
                            <td colSpan="6">No Record Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserDisp;
