import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/fdisp.css';

function FDisp(){
    const navigate = useNavigate();
    const [token, setToken] = React.useState('');
    const username = localStorage.getItem('username');
    const cat = localStorage.getItem('cat');

    React.useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    React.useEffect(() => {
        document.body.classList.add('fdisp-body');
        
        return () => {
            document.body.classList.remove('fdisp-body');
        };
    }, []);

    React.useEffect(() => {
        const checkAndDeleteEvents = async () => {
          try {
            await axios.get('https://allotment-system-backend.vercel.app/event/check-events');
            console.log('Checked and deleted past events');
          } catch (error) {
            console.error('Error checking and deleting past events', error);
          }
        };
    
        checkAndDeleteEvents();
      }, []);
    
    const [mydata, setData] = React.useState([]);
    const [searchName, setSearchName] = React.useState('');
    const [searchClub, setSearchClub] = React.useState('');
    const [searchDate, setSearchDate] = React.useState('');
    const [searchHall, setSearchHall] = React.useState('');

    React.useEffect(() =>{
       getData();
    },[])

    const getData = () => {
        axios.get("https://allotment-system-backend.vercel.app/event/display")
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

    const deleteData = (id) => {
        axios.delete(`https://allotment-system-backend.vercel.app/event/delete/${id}`)
          .then((res) => {
            console.log('successfully deleted!');
            alert(res.data.msg);
            getData();
      
            // Log API call
            const username = localStorage.getItem('username');
            axios.post('https://allotment-system-backend.vercel.app/logging/evedel',{username})
            .then(logRes => {
              console.log('Log entry created:', logRes);
            })
            .catch(logErr => {
              console.error('Error logging event deletion:', logErr);
            });
          }).catch((error) => {
            alert("Error Occurred: " + error);
            console.log(error);
          });
      }
      

    const handleEdit = (id) => {
        navigate(`/EventEdit/${id}`);
    };

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

    // Filter function based on search criteria
    const filteredData = mydata.filter(item => {
        return (
            item.name.toLowerCase().includes(searchName.toLowerCase()) &&
            item.club.toLowerCase().includes(searchClub.toLowerCase()) &&
            item.date.includes(searchDate) &&
            item.s_name.toLowerCase().includes(searchHall.toLowerCase())
        );
    });

    return (
        <div className="display-container">
            <h2>Display Events</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by club"
                    value={searchClub}
                    onChange={(e) => setSearchClub(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by date (YYYY-MM-DD)"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by hall name"
                    value={searchHall}
                    onChange={(e) => setSearchHall(e.target.value)}
                />
            </div>
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
                        <th>Seminar Hall Name</th>
                        <th>Faculty Coordinator</th> 
                        <th>Edit</th>
                        <th>Delete</th>            
                    </tr>
                </thead>
                <tbody>
                    {filteredData && filteredData.length ? (
                        filteredData.map((values, i) => (
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
                                <td>
                                    {(values.username === username || cat === 'A') && (
                                        <button onClick={() => handleEdit(values._id)}>Edit</button>
                                    )}
                                </td>
                                <td>
                                    {(values.username === username || cat === 'A') && (
                                        <button onClick={() => deleteData(values._id)}>Delete</button>
                                    )}
                                </td>
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
export default FDisp;  
