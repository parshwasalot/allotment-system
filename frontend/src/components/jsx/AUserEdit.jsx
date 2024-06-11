import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register.css";

const EditUser = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobileNum] = useState("");
  const [cat, setCat] = useState("");

  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  let { id } = useParams();
  
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`https://allotment-system-backend.vercel.app/user/edit/${id}`)
      .then((response) => {
        const user = response.data;
        setName(user.mydata.name);
        setUsername(user.mydata.username);
        setMobileNum(user.mydata.mobile);
        setCat(user.mydata.cat);
      })
      .catch((error) => {
        console.error("There was an error fetching the user details!", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch(name) {
      case "username":
        setUsername(value);
        break;
      case "name":
        setName(value);
        break;
      case "mobile":
        setMobileNum(value);
        break;
      case "cat":
        setCat(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (name.length < 6 || name.length > 15) {
      alert("Name must be between 6 and 15 characters long");
      return;
    }

    try {
      await axios.put(`https://allotment-system-backend.vercel.app/user/update/${id}`, {
        username,
        name,
        mobile,
        cat,
      });
  
      alert("User details updated successfully");
  
      // Log API call
      try {
        const username = localStorage.getItem('username');
        await axios.post('https://allotment-system-backend.vercel.app/logging/uedit',{username});
        console.log('Log entry created for user details update');
      } catch (logError) {
        console.error('Error logging user details update:', logError);
      }
  
      navigate("/ADash");
    } catch (error) {
      console.error("There was an error updating the user!", error);
      alert("Update failed");
    }
  };

  return (
    <div className="register-body">
      <div className="edit-register-container">
        <div className="event-form-container">
          <h3>Edit User</h3>
          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />

            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={handleChange}
              required
            />

            <label>Category:</label>
            <div>
              <input
                type="radio"
                id="S"
                name="cat"
                value="S"
                checked={cat === "S"}
                onChange={handleChange}
              />
              <label htmlFor="S">Student</label>
              <input
                type="radio"
                id="F"
                name="cat"
                value="F"
                checked={cat === "F"}
                onChange={handleChange}
              />
              <label htmlFor="F">Faculty</label>
              <input
                type="radio"
                id="A"
                name="cat"
                value="A"
                checked={cat === "A"}
                onChange={handleChange}
              />
              <label htmlFor="A">Admin</label>
            </div>

            <div className="book-button-container">
              <button className="book-button" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
