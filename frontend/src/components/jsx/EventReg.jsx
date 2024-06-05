import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

function Register() {
  const [name, setName] = React.useState("");
  const [desp, setDescription] = React.useState("");
  const [club, setClub] = React.useState("");
  const [date, setDate] = React.useState("");
  const [stime, setStime] = React.useState("");
  const [etime, setEtime] = React.useState("");
  const [availableHalls, setAvailableHalls] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [availabilityChecked, setAvailabilityChecked] = React.useState(false);
  const [inputsDisabled, setInputsDisabled] = React.useState(false);
  const [bookButtonsDisabled, setBookButtonsDisabled] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();
  const [token, setToken] = React.useState("");
  const username = localStorage.getItem("username");
  const faclname = localStorage.getItem("name");
  const cat = localStorage.getItem("cat");

  React.useEffect(() => {
    document.body.classList.add("register-body");

    return () => {
      document.body.classList.remove("register-body");
    };
  }, []);

  React.useEffect(() => {
    console.log(username);
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/login");
    }
  }, [navigate, username]);

  const submitValue = (selectedSName) => {
    axios
      .post("https://allotment-system-backend.vercel.app/event/register", {
        name,
        desp,
        club,
        date,
        stime,
        etime,
        s_name: selectedSName,
        username,
        faclname,
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag === 1) {
          alert("Record Successful");
          console.log(navigate);
  
          // Log API call
          axios.post('https://allotment-system-backend.vercel.app/logging/evereg', {
            message: `Event registered successfully with name ${name}`,
          })
          .then(logRes => {
            console.log('Log entry created:', logRes);
          })
          .catch(logErr => {
            console.error('Error logging event registration:', logErr);
          });
  
          // Navigate based on the value of cat
          if (cat === 'A') {
            navigate("/ADash");
          } else if (cat === 'F') {
            navigate("/FDash");
          }
  
        } else {
          alert("Something went wrong");
        }
        setMessage(res.data.message);
        fetchAvailableHalls();
      })
      .catch((error) => {
        alert("Error Occurred: " + error);
        console.log(error);
      });
  };
  

  const waitlist = () => {
    axios
      .post("https://allotment-system-backend.vercel.app/waitlist/register", {
        name,
        desp,
        club,
        date,
        stime,
        etime,
        username,
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag === 1) {
          alert("Joined the Waitlist!");
  
          // Log API call
          axios.post('https://allotment-system-backend.vercel.app/logging/wreg', {
            message: `User ${username} joined the waitlist successfully`,
          })
          .then(logRes => {
            console.log('Log entry created:', logRes);
          })
          .catch(logErr => {
            console.error('Error logging waitlist entry:', logErr);
          });
  
          navigate("/WDisp");
        } else {
          alert("Something went wrong");
        }
        setMessage(res.data.message);
      })
      .catch((error) => {
        alert("Error Occurred: " + error);
        console.log(error);
      });
  };

  const handleCheckAvailability = async (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setInputsDisabled(true);
      setBookButtonsDisabled(false);
      setAvailabilityChecked(true);
      await fetchAvailableHalls();
    } else {
      setAvailabilityChecked(false);
    }
  };

  const fetchAvailableHalls = async () => {
    try {
      const res = await axios.post(
        "https://allotment-system-backend.vercel.app/halls/available-halls",
        {
          date,
          stime,
          etime,
        }
      );
      setAvailableHalls(res.data);
    } catch (error) {
      console.log("Error fetching available halls: ", error);
    }
  };

  const isFormValid = () => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const todayTime =
      today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();

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

  const handleInputClick = () => {
    setInputsDisabled(false);
    setBookButtonsDisabled(true);
    setAvailabilityChecked(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "name" && value.length > 50) {
      newErrors.name = "Name must be no more than 50 characters";
    } else {
      delete newErrors.name;
    }

    if (name === "club" && value.length > 50) {
      newErrors.club = "Club must be no more than 50 characters";
    } else {
      delete newErrors.club;
    }

    if (name === "desp" && value.length > 150) {
      newErrors.desp = "Description must be no more than 150 characters";
    } else {
      delete newErrors.desp;
    }

    setErrors(newErrors);

    if (name === "name") {
      setName(value);
    } else if (name === "club") {
      setClub(value);
    } else if (name === "desp") {
      setDescription(value);
    } else if (name === "date") {
      setDate(value);
    } else if (name === "stime") {
      setStime(value);
    } else if (name === "etime") {
      setEtime(value);
    }
  };

  return (
    <div className="event-register-container">
      <div className="event-form-container">
        <h2>Register</h2>
        <form className="register-form">
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
                    placeholder="Max. 50 characters"
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>
                  <textarea
                    type="text"
                    name="desp"
                    value={desp}
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
                    placeholder="Max. 150 characters"
                  ></textarea>
                  {errors.desp && <p className="error">{errors.desp}</p>}
                </td>
              </tr>
              <tr>
                <td>Club:</td>
                <td>
                  <input
                    type="text"
                    name="club"
                    value={club}
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
                  />
                  {errors.club && <p className="error">{errors.club}</p>}
                </td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>
                  <input
                    className="dt"
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
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
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
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
                    onChange={handleChange}
                    required
                    disabled={inputsDisabled}
                    onClick={handleInputClick}
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
      {availabilityChecked && availableHalls.length > 0 && (
        <div className="event-halls-container">
          <ul>
            {availableHalls.map((data) => (
              <li key={data.s_name}>
                <span>
                  {data.s_name} - {data.capacity}
                </span>
                <button
                  className="book-button"
                  onClick={() => submitValue(data.s_name)}
                  disabled={bookButtonsDisabled}
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {availabilityChecked && availableHalls.length === 0 && (
        <div className="event-halls-container">
          <ul>
            <li>No halls available</li>
            <button className="book-button" onClick={waitlist}>
              Join the Waitlist
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Register;
