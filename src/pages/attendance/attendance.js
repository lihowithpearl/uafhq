import axios from 'axios';
import "./attendance.css";
import React, { useState, useEffect } from 'react';

const Attendance = () => {
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
        absenceType: '',
        country: '',
        dutyOff: '',
        courseName: '',
        absenceDuration: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        alert('Form submitted!');
      };
    return (
        <div>
            {/* {addItem && (
                <div className="fullpage">
                    <div className="formpage">
                        <button className="button" onClick={() => setAddItem(false)}>x</button>
                        <form onSubmit={handleSubmit}>
                            <label>Link:</label>
                            <input type="text" name="link" value={newItem.link} onChange={handleInputChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required />
                            <input type="submit" value="Add" className="submit" />
                        </form>
                    </div>
                </div>
            )}

            {editItem && (
                <div className="fullpage">
                    <div className="formpage">
                        <button className="button" onClick={() => setEditItem(false)}>x</button>
                        <div dangerouslySetInnerHTML={{ __html: editItemData.link }}></div>
                        <form onSubmit={handleEdit}>
                            <label>Link:</label>
                            <input type="text" name="link" value={editItemData.link} onChange={handleEditChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" value={editItemData.name} onChange={handleEditChange} required />
                            <input type="submit" value="Edit" className="submit" />
                        </form>
                    </div>
                </div>
            )}

            <div className="controlbar">
                <button className="searchbtn" onClick={() => setHideSearchBar(false)}>🔍</button>
                {!hideSearchBar && <input className="searchbar" onChange={(e) => findItem(e.target.value)} />}
                <button className="button" onClick={() => setAddItem(true)}>+ Add New Item</button>
            </div>

            {noItem && searchItem && <div className="searchresultmsg">No results for "{searchItem}"</div>}
*/}                
            Are you going to be present
            <div className="content">
                <div className='item'>
                    Yes
                </div>
                <div className='item'>
                    No
                </div>
                <div className="absence-form">
      <h2>Absence Request Form</h2>
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
            <option value="RSO">RSO (Reserve Service Obligation)</option>
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
              Country (for RSO):
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                required
              />
            </label>
          </div>
        )}

        {formData.absenceType === 'attachedOut' && (
          <div>
            <label>
              Country (for Attachment):
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                required
              />
            </label>
          </div>
        )}

        {formData.absenceType === 'LL' || formData.absenceType === 'OL' ? (
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
        ) : null}

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

        {formData.absenceType !== 'other' && (
          <div>
            <label>
              How long will you be absent? (in days):
              <input
                type="number"
                name="absenceDuration"
                value={formData.absenceDuration}
                onChange={handleInputChange}
                min="1"
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
      </form>
    </div>
                {/* {!noItem && searchItem === "" && items.map((item) => (
                    <div className="item" key={item._id}>
                        <div dangerouslySetInnerHTML={{ __html: item.link }}></div>
                        <div className="description">
                            <div className="name">{item.name}</div>
                            <div className="actions">
                                <button onClick={() => deleteItem(item._id)}>Delete</button>
                                <button onClick={() => { setEditItem(true); setEditItemData({ id: item._id, link: item.link, name: item.name }); }}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))} */}
            </div> 
        </div>
    );
};

export default Attendance;
