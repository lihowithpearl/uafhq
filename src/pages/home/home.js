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
  const [reg,setReg] = useState('');

  const processData = () => {
    const departments = {
      HQ: hqData,
      DCS: dcsData,
      Storage: storageData,
      DMSP: dmsPData,
    };

    let output = '';
    let NPreg = "";
    // Loop through each department and process data
    Object.keys(departments).forEach((department) => {
      const data = departments[department];
      if (data) {
        let regNotPresent = "";
        // Extract AM and PM strength
        const amStrength = data.match(/AM:\s*(.+)/)[1] || 'N/A';
        const pmStrength = data.match(/PM:\s*(.+)/)[1] || 'N/A';
        if(department == "Storage")
        {   
          regNotPresent = (data.match('Storage Attendance') && data.split('Storage Attendance')[1].split('\n').slice(1).map((line) => {
            const [name, status] = line.split('-').map(str => str.trim());
            if  (name && name.match(/ME\d*|LT\d*/)  && status && !['Present', 'Incoming', 'present'].includes(status)
          ) {
                alert(line);
              return `${name} - ${status}`;
            }
            return null;
          }).filter(Boolean)) || [];
          let c1c2NsfT = 0; // Count for all valid lines
           let c1c2Nsf = 0;
          if (data.match(/C1 \+ C2 NSF Strength\s*([\d\/]+)/)) {
            c1c2Nsf = data.split('C2 NSF Strength')[1]
            .split('\n')
            .slice(1)
            .reduce((total, line) => {
                if (line.trim() !== "") {
                  c1c2NsfT++; // Increment total lines count

                    const [name, status] = line.split('-').map(str => str.trim());
                    if (name && status && ['Present', 'Incoming', 'present'].includes(status)) {
                       
                        return total + 1; // Count for Present/Incoming
                    }
                }
                return total;
            }, 0); 
            }

          let c1c2Reg = 0;
          let c1c2RegT = 0;
          if (data.match(/C1 \+ C2 Reg Strength\s*([\d\/]+)/)) {
            c1c2Reg = data.split('C2 Reg Strength')[1]
                  .split('\n')
                  .slice(1)
                  .reduce((total, line) => {
                      if (line != "") {
                        c1c2RegT++;
                          const [name, status] = line.split('-').map(str => str.trim());
                          if (name && status && ['Present', 'Incoming', 'present'].includes(status)) {
                            return total + 1;
                          }
                      }
                        return total;
                      
                  },0); // Start the counter from 0
          }
                 
            //C3+C4 NSF strength
            let c3c4Nsf = 0;
            let c3c4NsfT = 0;

            if (data.match(/C3 \+ C4 NSF Strength\s*([\d\/]+)/)) {
              c3c4Nsf = data.split('C4 NSF Strength')[1]
                    .split('\n')
                    .slice(1)
                    .reduce((total, line) => {
                        if (line != "") {
                          c3c4NsfT++;
                            const [name, status] = line.split('-').map(str => str.trim());
                            if (name && status && ['Present', 'Incoming', 'present'].includes(status)) {
                              return total + 1;
                            }
                        }
                          return total;
                        
                    },0); // Start the counter from 0
            }
            // C3+C4 Regular strength
            let c3c4Reg = 0;
            let c3c4RegT = 0;
            if (data.match(/C3 \+ C4 Reg Strength\s*([\d\/]+)/)) {
              c3c4Reg = data.split('C4 Reg Strength')[1]
                    .split('\n')
                    .slice(1)
                    .reduce((total, line) => {
                        if (line != "") {
                          c3c4RegT++;
                            const [name, status] = line.split('-').map(str => str.trim());
                            if (name && status && ['Present', 'Incoming', 'present'].includes(status)) {
                              return total + 1;
                            }
                        }
                          return total;
                        
                    },0); // Start the counter from 0
            }
            // Format the output for Storage with specific strength breakdown
            output += `${department}<br>C1+C2 NSF: ${c1c2Nsf-c1c2Reg+1}/${c1c2NsfT-c1c2RegT+1}<br><br>C1+C2 Regular: ${c1c2Reg-c3c4Nsf+1}/${c1c2RegT-c3c4NsfT-1}<br><br>`;
            output += `C3+C4 NSF: ${c3c4Nsf-c3c4Reg+1}/${c3c4NsfT-c3c4RegT-1}<br><br>C3+C4 Regular: ${c3c4Reg+1}/${c3c4RegT}<br><br>`;
        }
        else{
             regNotPresent = (data.match(/Total Reg\s*/) && data.split('Total Reg')[1].split('\n').slice(1).map((line) => {
          const [name, status] = line.split('-').map(str => str.trim());
          if (name && status && !['Present', 'Incoming', 'present'].includes(status) && !status.match(/Incoming/i) ) {
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
            NPreg += `${item}<br>`;
          });
        }
        // } else {
        //   NPreg += `No Regulars/Officers Not Present.<br><br>`;
        // }
      }
    });

    setResult(output+NPreg);
    setReg(NPreg);
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








