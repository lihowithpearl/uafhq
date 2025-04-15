import axios from 'axios';
import "./attendance.css";
import React, { useState, useEffect } from 'react';
import "../login/login";
import Cookies from 'js-cookie'; 

const Attendance = () => {
  const [yesno, setYesNo] = useState('yes')
    // const [items, setItems] = useState([]);
    // let [addItem, setAddItem] = useState(false);
    // let [editItem, setEditItem] = useState(false);
    // let [searchItem, setSearchItem] = useState("");
    // let [noItem, setNoItem] = useState(false);
    // let [hideSearchBar, setHideSearchBar] = useState(true);
    // const [newItem, setNewItem] = useState({ link: "", name: "" });
    // const [editItemData, setEditItemData] = useState({ id: "", link: "", name: "" });

    // useEffect(() => {
    //     axios.get('http://localhost:27017/items')
    //         .then((response) => {
    //             setItems(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('There was an error fetching the items', error);
    //         });
    // }, []);

    // const handleInputChange = (e) => {
    //     setNewItem({ ...newItem, [e.target.name]: e.target.value });
    // };
    
    // const handleEditChange = (e) => {
    //     setEditItemData({ ...editItemData, [e.target.name]: e.target.value });
    // };

    // const handleSubmit = () => {
    //     axios.post('http://localhost:27017/item', newItem)
    //         .then((response) => {
    //             setItems([...items, response.data]);
    //             setNewItem({ link: "", name: "" });
    //             setAddItem(false);
    //         })
    //         .catch((error) => console.log("Error adding item", error));
    // };

    // const handleEdit = () => {
    //     axios.put(`http://localhost:27017/item/${editItemData.id}`, {
    //         link: editItemData.link,
    //         name: editItemData.name
    //     })
    //         .then(response => {
    //             alert(response.data.message);
    //             window.location.reload();
    //         })
    //         .catch(error => console.log(error.message));
    // };

    // const findItem = (query) => {
    //     setSearchItem(query);
    //     axios.get(`http://localhost:27017/item/${query}`)
    //         .then((response) => {
    //             if (!response.data) {
    //                 setSearchItem("");
    //                 setNoItem(false);
    //                 setHideSearchBar(true);
    //             } else {
    //                 setNoItem(false);
    //                 setItems(response.data);
    //             }
    //         })
    //         .catch(() => {
    //             setNoItem(true);
    //             if (query === "") setHideSearchBar(true);
    //         });
    // };

    // const deleteItem = (id) => {
    //     axios.delete(`http://localhost:27017/item/${id}`)
    //         .then(() => {
    //             alert("Deleted item");
    //             window.location.reload();
    //         })
    //         .catch((error) => console.log(error.message));
    // };
    const [formData, setFormData] = useState({
        userID: Cookies.get('userID'),
        date: new Date(),
        status: "",
        department: Cookies.get('department'),
        absenceType: '',
        country: '',
        location:'',
        dutyOff: '',
        courseName: '',
        absenceDuration: '',
      });
        useEffect(() => {
        if (formData.status === 'Present') {
          handleSubmit();
        }
      }, [formData.status]); 
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
        setYesNo("no");
      };
    
      const handleSubmit = () => {
        // e.preventDefault();
        console.log(formData);
        axios.post("http://localhost:27017/attendance", {
          userID: formData.userID,
          status: formData.status,
          department: formData.department,
          absenceType: formData.absenceType,
          country: formData.country,
          location: formData.location,
          dutyOff: formData.dutyOff,
          courseName: formData.courseName,
          absenceDuration: formData.absenceDuration,
          date: formData.date
        })
        alert('Form submitted!');
      };
    return (
            <div className="content">
                {yesno == "yes" && <div>
                  Are you going to be present
                <button className='item' 
                  name="status" 
                  value="Present"
                  onClick={handleInputChange}>
                    Yes
                </button>
                <button className='item' 
                  name="status" 
                  value="Absent"
                  onClick={handleInputChange}>
                    No
                </button>
                </div>
                }
                <div className="absence-form">
                  {formData.status == "Absent" &&    (<div><h2>Absence Request Form</h2>
                  <form onSubmit={handleSubmit}>
                    <label>
                      What is the reason for your absence? (Select one)
                      <select
                        name="absenceType"
                        value={formData.absenceType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">--Please choose an option--</option>
                        <option value="RSO">RSO</option>
                        <option value="attachedOut">Attached Out</option>
                        <option value="LL">LL (Leave)</option>
                        <option value="OL">OL (Off Leave)</option>
                        <option value="medicalAppt">Medical Appointment</option>
                        <option value="dutyOff">Duty Off</option>
                        <option value="course">Course</option>
                        <option value="other">Other</option>
                      </select>
                    </label>

                    {formData.absenceType === 'RSO' && (
                      <div>
                        <label>
                          Reason for RSO:
                          <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            placeholder="Enter reason ?HRS @location"
                            required
                          />
                        </label>
                      
                      </div>
                    )}


                    {formData.absenceType === 'attachedOut' && (
                      <div>
                        <label>
                          To Where (for Attachment):
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter location"
                            required
                          />
                        </label>
                      </div>
                    )}

                    {formData.absenceType === 'OL' && (
                      <div>
                        <label>
                          Which country are you going to? (if applicable):
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Enter country"
                          />
                        </label>
                      </div>
                    )}

                    {formData.absenceType === 'LL' && (
                      <div>
                        <label>
                          Is it a Half Day or Full Day LL?
                          <select
                            name="dutyOff"
                            value={formData.dutyOff}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">--Please choose an option--</option>
                            <option value="halfDay">Half Day</option>
                            <option value="fullDay">Full Day</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {!(formData.absenceType === 'LL' && formData.dutyOff === 'fullday') && (
                      <div>
                        <label>
                          How many days will you be absent for?
                          <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="Enter number of days"
                            min="1"
                            required
                          />
                        </label>
                      </div>
                    )}




                    {formData.absenceType === 'medicalAppt' && (
                      <div>
                        <label>
                          Medical Appointment (please specify):
                          <input
                            type="text"
                            name="medicalAppt"
                            value={formData.medicalAppt}
                            onChange={handleInputChange}
                            placeholder="Enter details"
                            required
                          />
                        </label>
                      </div>
                    )}

                    {formData.absenceType === 'dutyOff' && (
                      <div>
                        <label>
                          Is it a Half Day or Full Day Duty Off?
                          <select
                            name="dutyOff"
                            value={formData.dutyOff}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">--Please choose an option--</option>
                            <option value="halfDay">Half Day</option>
                            <option value="fullDay">Full Day</option>
                          </select>
                        </label>
                      </div>
                    )}

                    {formData.absenceType === 'course' && (
                      <div>
                        <label>
                          Course Name:
                          <input
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleInputChange}
                            placeholder="Enter course name"
                            required
                          />
                        </label>
                      </div>
                    )}


                    {formData.absenceType === 'other' && (
                      <div>
                        <label>
                          Please specify the reason:
                          <input
                            type="text"
                            name="otherReason"
                            value={formData.otherReason}
                            onChange={handleInputChange}
                            placeholder="Enter reason"
                            required
                          />
                        </label>
                      </div>
                    )}

                    <button type="submit">Submit Request</button>
                  </form></div>)}
                </div> 
        </div>
    );
};

export default Attendance;
