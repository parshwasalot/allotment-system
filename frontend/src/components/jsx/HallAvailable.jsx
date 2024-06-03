import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

function Ahall() {
  const [date, setDate] = React.useState("");
  const [stime, setStime] = React.useState("");
  const [etime, setEtime] = React.useState("");
  const [availableHalls, setAvailableHalls] = React.useState([]);
  const [availabilityChecked, setAvailabilityChecked] = React.useState(false);
  const navigate = useNavigate();
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    document.body.classList.add("register-body");

    return () => {
      document.body.classList.remove("register-body");
    };
  }, []);

  React.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleCheckAvailability = async (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setAvailabilityChecked(true);
      await fetchAvailableHalls();
    } else {
      setAvailabilityChecked(false);
    }
  };

  const fetchAvailableHalls = async () => {
    try {
      const res = await axios.post("https://allotment-system.onrender.com/halls/available-halls", {
        date,
        stime,
        etime,
      });
      setAvailableHalls(res.data);
    } catch (error) {
      console.log("Error fetching available halls: ", error);
    }
  };

  const isFormValid = () => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const todayTime = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();

    const selectedDate = new Date(date);
    const selectedStime = parseTime(stime);
    const selectedEtime = parseTime(etime);

    if (date < todayDate) {
      alert("The selected date is older than the current date. Please update the date.");
      return false;
    }
    if (date === todayDate && selectedStime < todayTime) {
      alert("The selected start time is earlier than the current time. Please update the start time.");
      return false;
    }
    if (selectedEtime <= selectedStime) {
      alert("The end time is earlier than or equal to the start time. Please update the end time.");
      return false;
    }

    return true;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };

  return (
    <div className="event-register-container">
      <div className="event-form-container">
        <h2>Check Available Hall</h2>
        <form className="register-form">
          <table>
            <tbody>
              <tr>
                <td>Date:</td>
                <td>
                  <input
                    className="dt"
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Start Time:</td>
                <td>
                  <input
                    className="dt"
                    type="time"
                    name="stime"
                    value={stime}
                    onChange={(e) => setStime(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>End Time:</td>
                <td>
                  <input
                    className="dt"
                    type="time"
                    name="etime"
                    value={etime}
                    onChange={(e) => setEtime(e.target.value)}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="book-button" onClick={handleCheckAvailability}>
            Check Availability
          </button>
        </form>
      </div>
      {availabilityChecked && (
        <div className="event-halls-container">
          {availableHalls.length > 0 ? (
            <ul>
              {availableHalls.map((data) => (
                <li key={data.s_name}>
                  <span>
                    {data.s_name} - {data.capacity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li>No halls available</li>
            </ul>
          )}
          {availableHalls.length > 0 && (
            <button className="book-button" onClick={() => navigate("/EventReg")}>
              Register
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Ahall;
