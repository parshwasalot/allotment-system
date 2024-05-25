import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register.css";

function Edit() {
  const [name, setName] = React.useState("");
  const [desp, setDescription] = React.useState("");
  const [club, setClub] = React.useState("");
  const [date, setDate] = React.useState("");
  const [stime, setstime] = React.useState("");
  const [etime, setetime] = React.useState("");
  const [token, setToken] = React.useState("");
  const [s_name, setSName] = React.useState("");
  const [availableHalls, setAvailableHalls] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [selectedSName, setSelectedSName] = React.useState("");
  const [showAvailableHalls, setShowAvailableHalls] = React.useState(false);
  const [today, setToday] = React.useState(new Date());
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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
    const currentDate = new Date();
    const selectedDate = new Date(date + "T" + stime);
    if (selectedDate < currentDate && date === formatDate(currentDate)) {
      alert("Please select a future date and time.");
      return;
    }
    if (etime <= stime) {
      alert("End time must be greater than start time.");
      return;
    }
    fetchAvailableHalls();
  };

  const fetchAvailableHalls = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:4000/halls/available-halls", {
        date,
        stime,
        etime,
      });
      setAvailableHalls(res.data);
      setShowAvailableHalls(true);
    } catch (error) {
      console.log("Error fetching available halls: ", error);
    }
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const submitValue = (selectedHallName) => {
    axios
      .put(`http://localhost:4000/event/update/${id}`, {
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
          navigate("/FDisp");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.log(err));
  };

  const waitlist = () => {
    axios
      .post("http://127.0.0.1:4000/waitlist", {
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

  let { id } = useParams();
  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log(id);
    axios
      .get(`http://localhost:4000/event/edit/${id}`)
      .then((res) => {
        console.log(res.data);
        setName(res.data.mydata.name);
        setDescription(res.data.mydata.desp);
        setClub(res.data.mydata.club);
        setDate(res.data.mydata.date);
        setstime(res.data.mydata.stime);
        setetime(res.data.mydata.etime);
      })
      .catch((error) => {
        alert("Error Ocurred :" + error);
        console.log(error);
      });
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
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
                    type="time"
                    value={etime}
                    onChange={(e) => setetime(e.target.value)}
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
      <div className="event-halls-container">
        {showAvailableHalls && (
          <ul>
            {availableHalls.length > 0 ? (
              availableHalls.map((data, index) => (
                <li key={data.s_name} className="dt">
                  <span>
                    {data.s_name} - {data.capacity}
                  </span>
                  <button
                    onClick={() => submitValue(data.s_name)}
                    className="book-button"
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
