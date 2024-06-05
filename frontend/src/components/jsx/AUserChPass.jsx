import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register.css";
import bcrypt from "bcryptjs";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

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
  
    try {
      const hashedPassword = await bcrypt.hash(formData.newPassword, 10); // 10 is the salt rounds
  
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
          await axios.post('https://allotment-system-backend.vercel.app/logging/auschpass', {
            message: `Password for user ID ${id} changed successfully`,
          });
          console.log('Log entry created for password change');
        } catch (logError) {
          console.error('Error logging password change:', logError);
        }
  
        navigate("/ADash");
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

export default ChangePassword;
