import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdisp.css';

function WaitlistDisplay() {
    const navigate = useNavigate();
    const [token, setToken] = React.useState('');
    const username = localStorage.getItem('username');
    const cat = localStorage.getItem('cat');

    const [available, setAvailableHallsbool] = React.useState({});
    const [popupVisible, setPopupVisible] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [availableHalls, setAvailableHalls] = React.useState([]);

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const [mydata, setData] = React.useState([]);
    React.useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get("http://localhost:4000/waitlist/display")
            .then(res => {
                if (res.data.flag === 1) {
                    const sortedData = res.data.mydata.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setData(sortedData);
                    sortedData.forEach(event => fetchAvailableHallsbool(event));
                } else {
                    alert(res.data.msg);
                    setData([]); 
                }
            }).catch(error => {
                alert("Error Occurred: " + error);
                console.log(error);
            });
    }

    const fetchAvailableHallsbool = (event) => {
        axios.post("http://localhost:4000/halls/hallsyn", {
            date: event.date,
            stime: event.stime,
            etime: event.etime
        })
            .then(res => {
                setAvailableHallsbool(prevState => ({
                    ...prevState,
                    [event._id]: res.data.available
                }));
            })
            .catch(error => {
                console.log("Error fetching available halls: ", error);
            });
    }

    React.useEffect(() => {
        if (mydata.length > 0) {
            mydata.forEach(event => fetchAvailableHallsbool(event));
        }
    }, [mydata]);

    const deleteData = (id) => {
        axios.delete(`http://localhost:4000/waitlist/delete/${id}`)
            .then((res) => {
                alert(res.data.msg);
                getData();
            }).catch(error => {
                alert("Error Occurred: " + error);
                console.log(error);
            });
    }

    const handleEdit = (id) => {
        navigate(`/Edit/${id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}-${formattedMonth}-${year}`;
    };

    const handleAvailableClick = async (event) => {
        setSelectedEvent(event);
        setPopupVisible(true);

        try {
            const res = await axios.post('http://127.0.0.1:4000/halls/available-halls', {
                date: event.date,
                stime: event.stime,
                etime: event.etime
            });
            setAvailableHalls(res.data);
        } catch (error) {
            console.log("Error fetching available halls: ", error);
        }
    };

    const handleBooking = (selectedSName) => {
        const eventData = {
            ...selectedEvent,
            s_name: selectedSName
        };

        axios.post("http://localhost:4000/event/register", eventData)
            .then(res => {
                alert('Event booked successfully');
                deleteData(selectedEvent._id);
                setPopupVisible(false);
            })
            .catch(error => {
                alert("Error Occurred: " + error);
                console.log(error);
            });
    };

    return (
        <div className="display-container">
            <h2>Waitlist Events</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Club</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Faculty Coordinator</th>
                        <th>Actions</th>
                        <th>Availability</th>
                    </tr>
                </thead>
                <tbody>
                    {mydata && mydata.length ? (
                        mydata.map((values, i) => (
                            <tr key={i + 1}>
                                <td>{i + 1}</td>
                                <td>{values.name}</td>
                                <td>{values.desp}</td>
                                <td>{values.club}</td>
                                <td>{formatDate(values.date)}</td>
                                <td>{values.stime}</td>
                                <td>{values.etime}</td>
                                <td>{values.faclname}</td>
                                <td>
                                    {(values.username === username || cat === 'A') && (
                                        <>
                                            <button onClick={() => handleEdit(values._id)}>Edit</button>
                                            <button onClick={() => deleteData(values._id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                                <td>
                                    {available[values._id] && available[values._id] === true ? (
                                        <button className="available-btn" onClick={() => handleAvailableClick(values)}>Available</button>
                                    ) : (
                                        <span className="not-available">Not Available</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No Record Found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {popupVisible && (
                <div className="popup">
                    <div className="popup-inner">
                        <h4 className='h4-popup'>Available Halls for {selectedEvent.name}</h4>
                        <ul>
                            {availableHalls?.map((data, index) => (
                            <li className='wl-li' key={data.s_name}>
                                <span>{data.s_name} - {data.capacity}</span>
                                <button className='popup-button' onClick={() => handleBooking(data.s_name)}>Book</button>
                                </li>
                            ))}
                        </ul>
                        <button className='popup-close' onClick={() => setPopupVisible(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WaitlistDisplay;
