// import {Routes,Route, useNavigate} from 'react-router-dom';
// import './home.css';

// const Home = () => {
//     const navigate = useNavigate();
//     const handleBackClick = () => {
//         console.log("back clicked");
//         navigate(-1);
//     }
//     return (
//     <div class="home">
//         <h1>Home</h1>
//         <div>there is supposed to be content here but ok</div>
//     </div>

//     );
// }

// export default Home;
import React, { useState } from 'react';

const AttendanceApp = () => {
  const [hqData, setHqData] = useState('');
  const [dcsData, setDcsData] = useState('');
  const [storageData, setStorageData] = useState('');
  const [dmsPData, setDmsPData] = useState('');
  const [result, setResult] = useState('');

  const processData = () => {
    const departments = {
      HQ: hqData,
      DCS: dcsData,
      Storage: storageData,
      DMSP: dmsPData,
    };

    let output = '';

    // Loop through each department and process data
    Object.keys(departments).forEach((department) => {
      const data = departments[department];
      if (data) {
        let regNotPresent = "";
        // Extract AM and PM strength
        const amStrength = (data.match(/AM:\s*(\d+\/\d+)/) || [])[1] || 'N/A';
        const pmStrength = (data.match(/PM:\s*(\d+\/\d+)/) || [])[1] || 'N/A';
        if(department == "Storage")
        {
            const c1c2Nsf = (data.match(/C1 \+ C2 NSF Strength\s*([\d\/]+)/) && data.split('C2 NSF Strength')[1].split('\n').slice(1).map((line) => {
                const [name, status] = line.split('-').map(str => str.trim());          
                if (name && status && !['Present', 'Incoming', 'present'].includes(status)) {
                    return `${name} - ${status}`;
                  }
                  return null;
                }).filter(Boolean)) || []; // Default to 0 if no match found, or an empty array if no match
          //try to use if (name != "")
            // C1+C2 Regular strength
            const c1c2Reg = (data.match(/C1 \+ C2 Reg Strength\s*([\d\/]+)/) && data.split('C2 Reg Strength')[1].split('\n').slice(1).map((line) => {
                const [name, status] = line.split('-').map(str => str.trim());          
                if (name && status && !['Present', 'Incoming', 'present'].includes(status)) {
                    return `${name} - ${status}`;
                  }
                  return null;
                }).filter(Boolean)) || [];
             // const c1c2Reg = (data.match(/C1 \+ C2 Reg Strength\s*([\d\/]+)/) || [])[1] || 'N/A';
            // C3+C4 NSF strength
            const c3c4Nsf = (data.match(/C3 \+ C4 NSF Strength\s*([\d\/]+)/) || [])[1] || 'N/A';
            // C3+C4 Regular strength
            const c3c4Reg = (data.match(/C3 \+ C4 Reg Strength\s*([\d\/]+)/) || [])[1] || 'N/A';
            alert(c1c2Nsf);
            // Format the output for Storage with specific strength breakdown
            output += `${department}<br>C1+C2 NSF: ${c1c2Nsf}<br><br>C1+C2 Regular: ${c1c2Reg}<br><br>`;
            output += `C3+C4 NSF: ${c3c4Nsf}<br><br>C3+C4 Regular: ${c3c4Reg}<br><br>`;
            alert(output);
        }
        else{
             regNotPresent = (data.match(/Total Reg\s*/) && data.split('Total Reg')[1].split('\n').slice(1).map((line) => {
          const [name, status] = line.split('-').map(str => str.trim());
          if (name && status && !['Present', 'Incoming', 'present'].includes(status)) {
            return `${name} - ${status}`;
          }
          return null;
        }).filter(Boolean)) || [];

        // Format the output for each department
        output += `${department}<br>AM Strength: ${amStrength}<br>PM Strength: ${pmStrength}<br><br>`;
        }
        // Extract Regulars/Officers Not Present
       

        // List Regulars/Officers Not Present
        if (regNotPresent.length > 0) {
          output += `Regulars/Officers Not Present:<br>`;
          regNotPresent.forEach((item, idx) => {
            output += `${item}<br>`;
          });
        } else {
          output += `No Regulars/Officers Not Present.<br><br>`;
        }
      }
    });

    setResult(output);
  };

  return (
    <div>
      <h2>Enter Department Attendance Data</h2>
      <div>
        <label>HQ Attendance:</label>
        <textarea
          rows="10"
          cols="50"
          value={hqData}
          onChange={(e) => setHqData(e.target.value)}
          placeholder="Enter HQ Attendance data here"
        />
      </div>
      <div>
        <label>DCS Attendance:</label>
        <textarea
          rows="10"
          cols="50"
          value={dcsData}
          onChange={(e) => setDcsData(e.target.value)}
          placeholder="Enter DCS Attendance data here"
        />
      </div>
      <div>
        <label>Storage Attendance:</label>
        <textarea
          rows="10"
          cols="50"
          value={storageData}
          onChange={(e) => setStorageData(e.target.value)}
          placeholder="Enter Storage Attendance data here"
        />
      </div>
      <div>
        <label>DMSP Attendance:</label>
        <textarea
          rows="10"
          cols="50"
          value={dmsPData}
          onChange={(e) => setDmsPData(e.target.value)}
          placeholder="Enter DMSP Attendance data here"
        />
      </div>

      <button onClick={processData}>Process Data</button>

      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
};

export default AttendanceApp;








