import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register.css";

function Edit() {
  const [name, setName] = React.useState("");
  const [desp, setDescription] = React.useState("");
  const [club, setClub] = React.useState("");
  const [date, setDate] = React.useState("");
  const [stime, setStime] = React.useState("");
  const [etime, setEtime] = React.useState("");
  const [originalDate, setOriginalDate] = React.useState("");
  const [originalStime, setOriginalStime] = React.useState("");
  const [originalEtime, setOriginalEtime] = React.useState("");
  const [token, setToken] = React.useState("");
  const [availableHalls, setAvailableHalls] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [showAvailableHalls, setShowAvailableHalls] = React.useState(false);
  const [inputsDisabled, setInputsDisabled] = React.useState(false);
  const [bookButtonsDisabled, setBookButtonsDisabled] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  let { id } = useParams();

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

  const handleCheckAvailability = (event) => {
    event.preventDefault();
    if (isFormValid()) {
      setInputsDisabled(true);
      setBookButtonsDisabled(false);
      setShowAvailableHalls(true);
      fetchAvailableHalls();
    } else {
      setShowAvailableHalls(false);
    }
  };

  const fetchAvailableHalls = async () => {
    try {
      const res = await axios.post("https://allotment-system-backend.vercel.app/halls/available-halls", {
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

  const handleInputClick = () => {
    setInputsDisabled(false);
    setBookButtonsDisabled(true);
    setShowAvailableHalls(false);
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

  const submitValue = (selectedHallName) => {
    axios
      .put(`https://allotment-system-backend.vercel.app/event/update/${id}`, {
        name,
        desp,
        club,
        date,
        stime,
        etime,
        s_name: selectedHallName,
        username,
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag === 1) {
          alert("Record Updated Successfully");
  
          // Log API call
          const username = localStorage.getItem('username');
          axios.post('https://allotment-system-backend.vercel.app/logging/eveedit',{username})
          .then(logRes => {
            console.log('Log entry created:', logRes);
          })
          .catch(logErr => {
            console.error('Error logging update:', logErr);
          });
  
          navigate("/FDisp");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.log(err));
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
          const username = localStorage.getItem('username');
          axios.post('https://allotment-system-backend.vercel.app/logging/wreg',{username})
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
  

  const handleUpdate = () => {
    axios
      .put(`https://allotment-system-backend.vercel.app/event/update/${id}`, {
        name,
        desp,
        club,
        date: originalDate,
        stime: originalStime,
        etime: originalEtime,
        username,
      })
      .then((res) => {
        console.log(res);
        if (res.data.flag === 1) {
          alert("Record Updated Successfully");
  
          // Log API call
          const username = localStorage.getItem('username');
          axios.post('https://allotment-system-backend.vercel.app/logging/peveedit',{username})
          .then(logRes => {
            console.log('Log entry created:', logRes);
          })
          .catch(logErr => {
            console.error('Error logging update:', logErr);
          });
  
          navigate("/FDisp");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.log(err));
  };
  

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log(id);
    axios
      .get(`https://allotment-system-backend.vercel.app/event/edit/${id}`)
      .then((res) => {
        console.log(res.data);
        setName(res.data.mydata.name);
        setDescription(res.data.mydata.desp);
        setClub(res.data.mydata.club);
        setDate(formatDate(res.data.mydata.date));
        setStime(res.data.mydata.stime);
        setEtime(res.data.mydata.etime);
        setOriginalDate(formatDate(res.data.mydata.date));
        setOriginalStime(res.data.mydata.stime);
        setOriginalEtime(res.data.mydata.etime);
      })
      .catch((error) => {
        alert("Error Occurred :" + error);
        console.log(error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="event-register-container">
      <div className="event-form-container">
        <h3>Edit</h3>
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
                    type="time"
                    name="stime"
                    value={stime}
                    onChange={(e) => setStime(e.target.value)}
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
                    type="time"
                    value={etime}
                    onChange={(e) => setEtime(e.target.value)}
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
          {(date === originalDate && stime === originalStime && etime === originalEtime) && (
            <button className="book-button" onClick={handleUpdate}>
              Update
            </button>
          )}
        </form>
      </div>
      <div className="event-halls-container">
        {showAvailableHalls && (
          <ul>
            {availableHalls.length > 0 ? (
              availableHalls.map((data) => (
                <li key={data.s_name}>
                  <span>
                    {data.s_name} - {data.capacity}
                  </span>
                  <button
                    onClick={() => submitValue(data.s_name)}
                    className="book-button"
                    disabled={bookButtonsDisabled}
                  >
                    Book
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>No halls available</li>
                <button onClick={waitlist} className="book-button">
                  Join the Waitlist
                </button>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Edit;
