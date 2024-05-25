import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register.css";

const EditUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    cat: "",
  });
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const username = localStorage.getItem("username");

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
      .get(`http://127.0.0.1:4000/user/edit/${id}`)
      .then((response) => {
        const user = response.data;
        setFormData({
          username: user.username,
          name: user.name,
          mobile: user.mobile,
          cat: user.cat,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the user details!", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:4000/user/update/${id}`, {
        username: formData.username,
        name: formData.name,
        mobile: formData.mobile,
        cat: formData.cat,
      });

      alert("User details updated successfully");
      navigate("/ADash"); 
    } catch (error) {
      console.error("There was an error updating the user!", error);
      alert("Update failed");
    }
  };

  return (
    <div className="register-body">
      <div className="event-register-container">
        <div className="event-form-container">
          <h3>Edit User</h3>
          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
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
                checked={formData.cat === "S"}
                onChange={handleChange}
              />
              <label htmlFor="S">S</label>
              <input
                type="radio"
                id="F"
                name="cat"
                value="F"
                checked={formData.cat === "F"}
                onChange={handleChange}
              />
              <label htmlFor="F">F</label>
              <input
                type="radio"
                id="A"
                name="cat"
                value="A"
                checked={formData.cat === "A"}
                onChange={handleChange}
              />
              <label htmlFor="A">A</label>
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
