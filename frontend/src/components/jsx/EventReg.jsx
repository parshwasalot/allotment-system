import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

function Register() {
  const [name, setName] = React.useState("");
  const [desp, setDescription] = React.useState("");
  const [club, setClub] = React.useState("");
  const [date, setDate] = React.useState("");
  const [stime, setstime] = React.useState("");
  const [etime, setetime] = React.useState("");
  const [availableHalls, setAvailableHalls] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [availabilityChecked, setAvailabilityChecked] = React.useState(false);
  const navigate = useNavigate();
  const [token, setToken] = React.useState("");
  const username = localStorage.getItem("username");
  const faclname = localStorage.getItem("name");

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
      navigate("/");
    }
  }, [navigate, username]);

  const submitValue = (selectedSName) => {
    axios
      .post("http://127.0.0.1:4000/event/register", {
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
          navigate("/FDash");
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
      .post("http://127.0.0.1:4000/waitlist/register", {
        name,
        desp,
        club,
        date,
        stime,
        etime,
        username,
        faclname,
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag === 1) {
          alert("Joined the Waitlist!");
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

  const handleCheckAvailability = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setAvailabilityChecked(true);
      fetchAvailableHalls();
    }
  };

  const fetchAvailableHalls = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:4000/halls/available-halls",
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

    if (date < todayDate) return false;
    if (date === todayDate && selectedStime < todayTime) return false;
    if (selectedEtime <= selectedStime) return false;

    return true;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };

  const isValid = date && stime && etime && isFormValid();

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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>
                  <textarea
                    type="text"
                    value={desp}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td>Club:</td>
                <td>
                  <input
                    type="text"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>
                  <input
                    className="dt"
                    type="date"
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
                    value={stime}
                    onChange={(e) => setstime(e.target.value)}
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
                    value={etime}
                    onChange={(e) => setetime(e.target.value)}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="book-button"
            onClick={handleCheckAvailability}
            disabled={!isValid}
          >
            Check Availability
          </button>
        </form>
      </div>
      {availabilityChecked && (
        <div className="event-halls-container">
          <ul>
            {availableHalls.length > 0 ? (
              availableHalls.map((data) => (
                <li key={data.s_name}>
                  <span>
                    {data.s_name} - {data.capacity}
                  </span>
                  <button
                    className="book-button"
                    onClick={() => submitValue(data.s_name)}
                  >
                    Book
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>No halls available</li>
                <button className="book-button" onClick={waitlist}>
                  Join the Waitlist
                </button>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Register;
