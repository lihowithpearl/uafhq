import axios from 'axios';
import "./attendance.css";
import React, { useState, useEffect } from 'react';
import "../login/login";
import Cookies from 'js-cookie'; 
import { data } from 'react-router-dom';

const Attendance = () => {
  const [yesno, setYesNo] = useState('yes');
  const [formData, setFormData] = useState({
    userID: Cookies.get('userID'),
    date: new Date(),
    status: '',
    department: Cookies.get('department'),
    fullDay: '',
    amAbsenceType: '',
    pmAbsenceType: '',
    reason: '',
    country: '',
    location: '',
    dutyOff: '',
    courseName: '',
    medicalAppt: '',
    otherReason: '',
    absenceDuration: new Date(),
    attendanceId: '' // NEW: Add attendance ID if needed
  });
  const [attendanceToday, setAttendanceToday] = useState(false);
  const fetchUserAttendance = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:27017/attendance/user/${userId}`);
      if (response.data.length > 0) {
          const existingData = response.data[0];
          setAttendanceToday(true);
          setFormData((prev) => ({
            ...prev,
            attendanceId: existingData._id,
            userID: existingData.userID,
            status: existingData.status || '',
            fullDay: existingData.fullDay === 'Full Day' ? 'yes' : 'no',
            amAbsenceType: existingData.amAbsenceType || '',
            pmAbsenceType: existingData.pmAbsenceType || '',
            reason: existingData.reason || '',
            country: existingData.country || '',
            location: existingData.location || '',
            dutyOff: existingData.dutyOff || '',
            courseName: existingData.courseName || '',
            medicalAppt: existingData.medicalAppt || '',
            otherReason: existingData.otherReason || '',
            absenceDuration: existingData.absenceDuration
              ? new Date(existingData.absenceDuration)
              : ''
          }));


      }
      return response.data;
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchUserAttendance(formData.userID);
    if (formData.status === 'Present' && attendanceToday === false) {
      handleSubmit();
    }
    
  }, [formData.status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setYesNo("no");
  };

  const handleSubmit = async () => {
    if (formData.amAbsenceType === formData.pmAbsenceType && formData.amAbsenceType !== "") {
      alert("AM and PM Absence Types cannot be the same!");
      return;
    }

    const submission = {
      userID: formData.userID,
      department: formData.department,
      amAbsenceType: formData.amAbsenceType,
      pmAbsenceType: formData.pmAbsenceType,
      country: formData.country,
      location: formData.location,
      dutyOff: formData.dutyOff,
      courseName: formData.courseName,
      reason: formData.reason,
      date: new Date(),
      status: formData.status,
      absenceDuration: formData.absenceDuration,
      fullDay: formData.fullDay === 'yes' ? 'Full Day' : 'Half Day'
    };

    try {
      if (formData.attendanceId) {
        await axios.put(`http://localhost:27017/attendance/${formData.attendanceId}`, submission);
        alert("Attendance updated!");
      } else {
        await axios.post("http://localhost:27017/attendance", submission);
        alert("Form submitted!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (formData.fullDay === 'yes') {
      handleSubmit();
    } else {
      if (formData.amAbsenceType || formData.pmAbsenceType) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="content">
      {attendanceToday === true && (
        <div>
          <h3>Your existing attendance for today is:</h3>
          {(() => {
            let absenceDetails = '';
            // const { status, fullDay, amAbsenceType, pmAbsenceType, reason, country, location, dutyOff, courseName, medicalAppt, otherReason, absenceDuration, userID } = formData;
            // const rank = userID?.rank?.toUpperCase() || '';
            // const name = userID?.name || '';
            const formattedDate = formData.absenceDuration ? new Date(formData.absenceDuration).toLocaleDateString('en-GB') : '';
            if (formData.status === 'Present') {
              absenceDetails = `${formData.userID.rank} ${formData.userID.name} - Present`;
            } else if (formData.fullDay === 'yes') {
              switch (formData.amAbsenceType) {
                case 'AO':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${formData.amAbsenceType} @ ${formData.location}`;
                  break;
                case 'OL':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${formData.amAbsenceType} to ${formData.country} until ${formattedDate}`;
                  break;
                case 'LL':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${formData.amAbsenceType} to ${formData.country} until ${formattedDate}`;
                  break;
                case 'RSO':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${formData.amAbsenceType} ${formData.reason}`;
                  break;
                case 'medicalAppt':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - Medical Appointment: ${formData.medicalAppt}`;
                  break;
                case 'course':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - Course: ${formData.courseName}`;
                  break;
                case 'other':
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - Other: ${formData.otherReason}`;
                  break;
                default:
                  absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${formData.userID.amAbsenceType}`;
              }
            } else {
              // Half day - AM and PM breakdown
              let amText = '';
              let pmText = '';

              switch (formData.amAbsenceType) {
                case 'AO':
                  amText = `AM ${formData.amAbsenceType} @ ${formData.location}`;
                  break;
                case 'OL':
                  amText = `AM ${formData.amAbsenceType} to ${formData.country} until ${formattedDate}`;
                  break;
                case 'RSO':
                  amText = `AM ${formData.amAbsenceType} ${formData.reason}`;
                  break;
                case 'medicalAppt':
                  amText = `AM Medical Appt: ${formData.medicalAppt}`;
                  break;
                case 'course':
                  amText = `AM Course: ${formData.courseName}`;
                  break;
                case 'other':
                  amText = `AM Other: ${formData.otherReason}`;
                  break;
                default:
                  if (formData.amAbsenceType) amText = `AM ${formData.amAbsenceType}`;
              }

              switch (formData.pmAbsenceType) {
                case 'AO':
                  pmText = `PM ${formData.pmAbsenceType} @ ${formData.location}`;
                  break;
                case 'OL':
                  pmText = `PM ${formData.pmAbsenceType} to ${formData.country} until ${formattedDate}`;
                  break;
                case 'RSO':
                  pmText = `PM ${formData.pmAbsenceType} ${formData.reason}`;
                  break;
                case 'medicalAppt':
                  pmText = `PM Medical Appt: ${formData.medicalAppt}`;
                  break;
                case 'course':
                  pmText = `PM Course: ${formData.courseName}`;
                  break;
                case 'other':
                  pmText = `PM Other: ${formData.otherReason}`;
                  break;
                default:
                  if (formData.pmAbsenceType) pmText = `PM ${formData.pmAbsenceType}`;
              }

              absenceDetails = `${formData.userID.rank} ${formData.userID.name} - ${amText}${pmText ? `, ${pmText}` : ''}`;
            }

            return <p>{absenceDetails}</p>;
          })()}
        </div>
      )}

      {yesno === "yes" && (
        <div>
          Are you going to be present?
          <button className='item' name="status" value="Present" onClick={handleInputChange}>Yes</button>
          <button className='item' name="status" value="Absent" onClick={handleInputChange}>No</button>
        </div>
      )}

      <div className="absence-form">
        {formData.status === "Absent" && (
          <div>
            <h2>Absence Request Form</h2>
            <form onSubmit={handleFinalSubmit}>
              <label>
                Is this a full day?
                <select name="fullDay" value={formData.fullDay} onChange={handleInputChange} required>
                  <option value="">--Please choose--</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>

              {formData.fullDay === 'yes' && (
                <label>
                  What is the reason for your absence?
                  <select name="amAbsenceType" value={formData.amAbsenceType} onChange={handleInputChange} required>
                    <option value="">--Please choose an option--</option>
                    <option value="RSO">RSO</option>
                    <option value="AO">Attached Out</option>
                    <option value="LL">LL (Leave)</option>
                    <option value="OL">OL (Off Leave)</option>
                    <option value="medicalAppt">Medical Appointment</option>
                    <option value="dutyOff">Duty Off</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              )}

              {formData.fullDay === 'no' && (
                <>
                  <label>
                    AM Absence Type:
                    <select name="amAbsenceType" value={formData.amAbsenceType} onChange={handleInputChange} required>
                      <option value="">--Select AM status--</option>
                      <option value="Present">Am Present</option>
                      <option value="RSO">RSO</option>
                      <option value="AO">Attached Out</option>
                      <option value="LL">LL (Leave)</option>
                      <option value="OL">OL (Off Leave)</option>
                      <option value="medicalAppt">Medical Appointment</option>
                      <option value="dutyOff">Duty Off</option>
                      <option value="course">Course</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label>
                    PM Absence Type:
                    <select name="pmAbsenceType" value={formData.pmAbsenceType} onChange={handleInputChange} required>
                      <option value="">--Select PM status--</option>
                      <option value="Present">Pm Present</option>
                      <option value="RSO">RSO</option>
                      <option value="AO">Attached Out</option>
                      <option value="LL">LL (Leave)</option>
                      <option value="OL">OL (Off Leave)</option>
                      <option value="medicalAppt">Medical Appointment</option>
                      <option value="dutyOff">Duty Off</option>
                      <option value="course">Course</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </>
              )}

              {(formData.amAbsenceType === 'RSO' || formData.pmAbsenceType === 'RSO') && (
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
              )}
              {(formData.fullDay === "yes")&& (formData.amAbsenceType === 'OL' || formData.pmAbsenceType === 'OL' || formData.amAbsenceType === 'LL' || formData.pmAbsenceType === 'LL') && (
                <label>
                  Duration of Absence:
                  <input
                    type="date"
                    name="absenceDuration"
                    value={formData.absenceDuration}
                    onChange={handleInputChange}
                    placeholder="Enter how long till u gone for"
                    required
                  />
                </label>
              )}
              {(formData.amAbsenceType === 'AO' || formData.pmAbsenceType === 'AO') && (
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
              )}

              {(formData.amAbsenceType === 'OL' || formData.pmAbsenceType === 'OL') && (
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
              )}

              {(formData.amAbsenceType === 'course' || formData.pmAbsenceType === 'course') && (
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
              )}

              {(formData.amAbsenceType === 'medicalAppt' || formData.pmAbsenceType === 'medicalAppt') && (
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
              )}

              {(formData.amAbsenceType === 'other' || formData.pmAbsenceType === 'other') && (
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
              )}

              <button type="submit">Submit Request</button>
            </form>
          </div>
        )}
      </div> 
    </div>
  );
};

export default Attendance;
