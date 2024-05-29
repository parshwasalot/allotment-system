import React, { useState, useEffect } from "react";
import axios from "axios";
import bcryptjs from "bcryptjs";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "../css/register.css";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    cat: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "username" && value.length > 8) {
      newErrors.username = "Username must be no more than 8 characters";
    } else {
      delete newErrors.username;
    }

    if (name === "password" && value.length > 6) {
      newErrors.password = "Password must be no more than 6 characters";
    } else {
      delete newErrors.password;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length > 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be no more than 6 characters",
      }));
      return;
    }

    if (formData.username.length > 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username must be no more than 8 characters",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const hashedPassword = await bcryptjs.hash(formData.password, 10);
      const hashedUName = CryptoJS.SHA256(formData.username).toString();

      const response = await axios.post("http://127.0.0.1:4000/user/register", {
        username: hashedUName,
        name: formData.name,
        mobile: formData.mobile,
        cat: formData.cat,
        password: hashedPassword,
      });
      alert("User registered successfully");
      navigate('/ADash');
      console.log(response.data);
    } catch (error) {
      console.error("There was an error registering the user!", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-body">
      <div className="user-register-container">
        <div className="user-form-container">
          <h3>Register User</h3>
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
            {errors.username && <p className="error">{errors.username}</p>}

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
              <label htmlFor="S">Student</label>
              <input
                type="radio"
                id="F"
                name="cat"
                value="F"
                checked={formData.cat === "F"}
                onChange={handleChange}
              />
              <label htmlFor="F">Faculty</label>
              <input
                type="radio"
                id="A"
                name="cat"
                value="A"
                checked={formData.cat === "A"}
                onChange={handleChange}
              />
              <label htmlFor="A">Admin</label>
            </div>

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="book-button-container">
              <button className="book-button" type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;