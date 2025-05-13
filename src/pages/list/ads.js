import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredDept, setFilteredDept] = useState('All');
  const departments = ['All','ADS', 'HQ', 'Storage', 'DMSP', 'DCS'];
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:27017/user')  // matches your Express route
    .then(response => setUsers(response.data))
    .catch(error => console.error('Error fetching users:', error));

    axios.get('http://localhost:27017/attendance/present-today')
      .then(response => { setAttendanceList(response.data); })
      .catch(error => console.error('Error fetching attendance:', error));
  }, []);

  const getDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', weekday: 'long' });
  };
  const getAmOrPm = () => {
    const singaporeTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" });
    const date = new Date(singaporeTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // If time is before 12:30 PM, it's AM; otherwise, PM
    return (hours < 12 || (hours === 12 && minutes < 30)) ? 'AM' : 'PM';
  };
  
  const isNSF = (rank) => {
    const regRanks = ['ME1', 'ME2', 'ME3', 'ME4', 'ME5', 'ME6', 'ME7'];
    return !regRanks.includes(rank?.toUpperCase());
  };

  const formatDeptAttendance = (deptList,dept) => {
    const department = deptList[0]?.userID?.department;
    const regPersonnel = deptList.filter(e => !isNSF(e.userID.rank));
    const nsfPersonnel = deptList.filter(e => isNSF(e.userID.rank));
    const OrderlyNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'Orderly');
    const TrainingNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'Training');
    const CockpitNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'Cockpit');
    const StocktakeNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'Stocktake');
    const InfraNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'Infra');
    const FMNsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'FM');
    const C1C2NsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'C1 + C2');
    const C3C4NsfPersonnel = nsfPersonnel.filter(e => e.userID.subdepartment === 'C3 + C4');
    const C1C2RegPersonnel = regPersonnel.filter(e => e.userID.subdepartment === 'C1 + C2');
    const C3C4RegPersonnel = regPersonnel.filter(e => e.userID.subdepartment === 'C3 + C4');
    const StgOfficer = nsfPersonnel.filter(e => 
      (e.userID.rank === '2lt' || e.userID.rank === 'lta') && e.userID.department === "Storage"
    );    
    const amCount = deptList.filter(e => e.status === 'Present').length + deptList.filter(e => e.amAbsenceType === 'Present').length;
    const pmCount = deptList.filter(e => e.status === 'Present').length + deptList.filter(e => e.pmAbsenceType === 'Present').length;
    const deptUsers = users.filter(u => u.department === department);
    const totalStrength = deptUsers.length;
    console.log(filteredDept);
    console.log(regPersonnel);

    return (
      <div>
      {filteredDept !== "ADS" && (
        <>
          <p><strong>Total Strength</strong></p>
          <p>AM: {amCount}/{totalStrength}</p>
          <p>PM: {pmCount}/{totalStrength}</p>
        </>
      )}

     
    
      <p><strong>Total NSF:</strong> {nsfPersonnel.length}</p>
      {dept==="HQ" && (<div>
      <div>
        <p><strong>Orderly</strong></p>
        {OrderlyNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}
      </div>
      <div>
        <p><strong>Training</strong></p>
        {TrainingNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}

      </div>
      </div>)}
      
      {dept==="DMSP" && (<div>
      <div>
        <p><strong>Infra NSFs</strong></p>
        {InfraNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}
      </div>
      <div>
        <p><strong>FM NSFs</strong></p>
        {FMNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}

      </div>
      </div>)}
      {dept==="DCS" && (<div>
      <div>
        <p><strong>Cockpit</strong></p>
        {CockpitNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}
      </div>
      <div>
        <p><strong>Stocktake</strong></p>
        {StocktakeNsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}

      </div>
      </div>)}
      {dept==="Storage" && (<div>
      {StgOfficer.map((e,i) => {
                let absenceDetails;

                if (e.status === 'Present') {
                  absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
                } else if (e.fullDay === 'Full Day') {
                  // Handle full day absences
                  if (e.amAbsenceType === 'AO') {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
                  } else if (e.amAbsenceType === 'OL') {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
                  } else if (e.amAbsenceType === 'LL') {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
                  } else if (e.amAbsenceType === 'RSO') {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
                  }else {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
                  }
                } else {
                  // Handle AM and PM absences
                  let amDetails = '';
                  if (e.amAbsenceType === 'AO') {
                    amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
                  } else if (e.amAbsenceType === 'OL') {
                    amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
                  } else if (e.amAbsenceType === 'RSO') {
                    absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
                  }else {
                    amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
                  }
        
                  let pmDetails = '';
                  if (e.pmAbsenceType === 'AO') {
                    pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
                  } else if (e.pmAbsenceType === 'OL') {
                    pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
                  } else if (e.amAbsenceType === 'RSO') {
                    pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
                  }else {
                    pmDetails = `, PM ${e.pmAbsenceType}`;
                  }
        
                  absenceDetails = amDetails + pmDetails;
                }
        
                return (
                  <p key={i}>{i + 1}. {absenceDetails}</p>
                );
      })}
      <div>
        <p><strong>C1 + C2 Regular</strong></p>
        {C1C2RegPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}
      </div>
      <div>
        <p><strong>C3 + C4 Regular</strong></p>
        {C3C4RegPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}

      </div>
      <div>
        <p><strong>C1 + C2 NSF</strong></p>
        {C1C2NsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}
      </div>
      <div>
        <p><strong>C3 + C4 NSF</strong></p>
        {C3C4NsfPersonnel.map((e, i) => {
        let absenceDetails;

        if (e.status === 'Present') {
          absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
        } else if (e.fullDay === 'Full Day') {
          // Handle full day absences
          if (e.amAbsenceType === 'AO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          } else if (e.amAbsenceType === 'OL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'LL') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${new Date(e.absenceDuration).toLocaleDateString('en-GB')}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
          }
        } else {
          // Handle AM and PM absences
          let amDetails = '';
          if (e.amAbsenceType === 'AO') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
          } else if (e.amAbsenceType === 'OL') {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
          }else {
            amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
          }

          let pmDetails = '';
          if (e.pmAbsenceType === 'AO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          } else if (e.pmAbsenceType === 'OL') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
          } else if (e.amAbsenceType === 'RSO') {
            pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
          }else {
            pmDetails = `, PM ${e.pmAbsenceType}`;
          }

          absenceDetails = amDetails + pmDetails;
        }

        return (
          <p key={i}>{i + 1}. {absenceDetails}</p>
        );
      })}

      </div>
      </div>)}
      {dept != "Storage" && <div>
        <p><strong>Total Reg:</strong> {regPersonnel.length}</p>
        {regPersonnel.map((e, i) => {
          let absenceDetails;

          if (e.status === 'Present') {
            absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - Present`;
          } 
          else{
            if (e.fullDay === 'Full Day') {
              // Handle full day absences for regular personnel
              if (e.amAbsenceType === 'AO') {
                absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.location}`;
              } else if (e.amAbsenceType === 'OL' || e.amAbsenceType === "LL") {
                absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
              } else if (e.amAbsenceType === 'RSO') {
                absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
              } else {
                absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType}`;
              }
            } else {
              // Handle AM and PM absences for regular personnel
              let amDetails = '';
              if (e.amAbsenceType === 'AO') {
                amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.location}`;
              } else if (e.amAbsenceType === 'OL' || e.amAbsenceType === "LL") {
                amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType} ${e.country} til ${e.absenceDuration}`;
              } else if (e.amAbsenceType === 'RSO') {
                absenceDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - ${e.amAbsenceType} ${e.reason}`;
              } else {
                amDetails = `${e.userID.rank?.toUpperCase()} ${e.userID.name} - AM ${e.amAbsenceType}`;
              }

              let pmDetails = '';
              if (e.pmAbsenceType === 'AO') {
                pmDetails = `, PM ${e.pmAbsenceType} ${e.location}`;
              } else if (e.pmAbsenceType === 'OL' || e.pmAbsenceType === "LL") {
                pmDetails = `, PM ${e.pmAbsenceType} ${e.country} til ${e.absenceDuration}`;
              } else if (e.pmAbsenceType === 'RSO') {
                pmDetails = `, PM ${e.pmAbsenceType} ${e.reason}`;
              } else {
                pmDetails = `, PM ${e.pmAbsenceType}`;
              }

              absenceDetails = amDetails + pmDetails;
            }
          }
          return (
            <p key={i}>{i + 1}. {absenceDetails}</p>
          );
        })}
      </div>}
      {filteredDept==="ADS" && (
        <div>
          <div>STG</div>
          <div>C1 + C2 NSF: {C1C2NsfPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{C1C2NsfPersonnel.length}</div>
          <div>C1 + C2 Regular: {C1C2RegPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{C1C2RegPersonnel.length}</div>
          <br/>
          <div>C3 + C4 NSF: {C3C4NsfPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{C3C4NsfPersonnel.length}</div>
          <div>C3 + c4 Regular: {C3C4RegPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{C3C4RegPersonnel.length}</div>
          <br/>
          <div>DMSP</div>
          <div>NSF: {InfraNsfPersonnel.filter(e => e.userID.amAbsenceType === "").length + FMNsfPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{InfraNsfPersonnel.length + FMNsfPersonnel.length}</div>
          <div>Regular: {regPersonnel.filter(e => e.userID.department === "DMSP" && e.userID.amAbsenceType ==="").length}/{regPersonnel.filter(e => e.userID.department === "DMSP").length}</div>
          <br />
          <div>DCS</div>
          <div>NSF: {CockpitNsfPersonnel.filter(e => e.userID.amAbsenceType === "").length + StocktakeNsfPersonnel.filter(e => e.userID.amAbsenceType === "").length}/{CockpitNsfPersonnel.length + StocktakeNsfPersonnel.length}</div>
          <div>Regular: {regPersonnel.filter(e => e.userID.department === "DCS" && e.userID.amAbsenceType ==="").length}/{regPersonnel.filter(e => e.userID.department === "DCS").length}</div>
          <br/>
          <div>DHQ</div>
          <div>NSF: {OrderlyNsfPersonnel.filter(e => e.amAbsenceType === "").length + TrainingNsfPersonnel.filter(e => e.amAbsenceType === "").length}/{OrderlyNsfPersonnel.length + TrainingNsfPersonnel.length}</div>
          <div>Regular: {regPersonnel.filter(e => e.userID.department === "HQ" && e.userID.amAbsenceType ==="").length}/{regPersonnel.filter(e => e.userID.department === "HQ").length}</div>
        </div>
      )}
    </div>
    
    );
  };

  const groupByDepartment = () => {
    return departments
    .filter(d => d !== 'All' && d !== 'ADS') // Exclude 'All' and 'ADS'
    .map(dept => {
      const deptList = attendanceList.filter(entry => entry.userID.department === dept);
      return (
        <div key={dept} className="department-block">
          <h3>{dept} Attendance for {getDateString()}</h3>
          {formatDeptAttendance(deptList, dept)}
        </div>
      );
    });
  
  };

  const filteredList = filteredDept === 'All' || filteredDept === "ADS"
    ? attendanceList
    : attendanceList.filter(entry => entry.userID.department === filteredDept);

  return (
    <div>
      <div className="filter">
        <label>Filter by Department: </label>
        <select value={filteredDept} onChange={e => setFilteredDept(e.target.value)}>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="content">
        {filteredDept === 'All' ? (
          groupByDepartment()
        ) : (
          <div>
            <h3>
              {filteredDept === 'ADS'
                ? `${getAmOrPm()} Attendance for ${getDateString()}`
                : `${filteredDept} Attendance for ${getDateString()}`}
            </h3>
            {formatDeptAttendance(filteredList)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
