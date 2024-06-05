import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/register.css";
import bcryptjs from "bcryptjs";

const ChangePasswordWithOldPassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();
  const id = localStorage.getItem("userid");
  const storedOldPassword = localStorage.getItem("pass");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }
  
    if (formData.oldPassword !== storedOldPassword) {
      alert("Old password is incorrect");
      return;
    }
  
    try {
      const hashedPassword = await bcryptjs.hash(formData.newPassword, 10);
      console.log(id);
      const payload = {
        newPassword: hashedPassword,
      };
  
      const passwordResponse = await axios.post(
        `https://allotment-system-backend.vercel.app/user/changePassword/${id}`,
        payload
      );
  
      if (passwordResponse.data.success) {
        alert("Password changed successfully");
  
        // Log API call
        try {
          await axios.post('https://allotment-system-backend.vercel.app/logging/fuschpass', {
            message: `Password for user ID ${id} changed successfully`,
          });
          console.log('Log entry created for password change');
        } catch (logError) {
          console.error('Error logging password change:', logError);
        }
  
        navigate("/FDash");
      } else {
        alert(passwordResponse.data.msg || "Password change failed");
      }
    } catch (error) {
      console.error("There was an error changing the password!", error);
      alert("Password change failed");
    }
  };
  

  return (
    <div className="register-body">
      <div className="pass-register-container">
        <div className="event-form-container">
          <h3>Change Password</h3>
          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />

            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />

            <div className="book-button-container">
              <button className="book-button" type="submit">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordWithOldPassword;
