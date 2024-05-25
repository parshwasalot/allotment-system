import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/fdisp.css';

function Display(){
    const navigate = useNavigate();

    const [mydata,setData] = React.useState([]);
    React.useEffect(() =>{
       getData();
    },[])

    React.useEffect(() => {
        document.body.classList.add('sdisp-body');
        
        return () => {
            document.body.classList.remove('sdisp-body');
        };
    }, []);

    const getData = () => {
    axios.get("http://localhost:4000/event/display")
        .then(res => {
            console.log(res.data); 
            // Sort the data by date in ascending order
            const sortedData = res.data.mydata.sort((a, b) => new Date(a.date) - new Date(b.date));
            setData(sortedData);
        }).catch((error) => {
            alert("Error Ocurred: " + error);
            console.log(error)
        })
    }

    const [token, setToken] = React.useState('');

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
        setToken(storedToken);
        } else {
        navigate('/');
        }
    }, [navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Adding 1 because month index starts from 0
        const year = date.getFullYear();
        // Pad day and month with leading zeros if necessary
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        // Format the date as dd-mm-yyyy
        return `${formattedDay}-${formattedMonth}-${year}`;
    };

    return (
        <div className="display-container">
            <h2>Display Events</h2>
            <table border='1'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Club</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Seminar Hall</th>
                        <th>Faculty Coordinator</th>             
                    </tr>
                </thead>
                <tbody>
                    {mydata && mydata.length ? (
                        mydata.map((values, i) => (
                            <tr key={i+1}>
                                <td>{i+1}</td>
                                <td>{values.name}</td>
                                <td>{values.desp}</td>
                                <td>{values.club}</td>
                                <td>{formatDate(values.date)}</td>
                                <td>{values.stime}</td>
                                <td>{values.etime}</td>
                                <td>{values.s_name}</td>
                                <td>{values.faclname}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No Record Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}
export default Display;     