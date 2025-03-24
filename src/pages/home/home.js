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

import { useState } from 'react';
import './home.css';

const Home = () => {
    const [inputText, setInputText] = useState('');
    const [processedData, setProcessedData] = useState([]);
    const [error, setError] = useState('');
    const [absentRegulars, setAbsentRegulars] = useState([]);

    const handleBackClick = () => {
        console.log("Back clicked");
        // Add navigation if required, e.g., navigate(-1);
    };

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = () => {
        try {
            // Call the processText function when the form is submitted
            const reportData = processText(inputText);
            setProcessedData(reportData.categoryData);
            setAbsentRegulars(reportData.absentRegulars);
            setError('');
        } catch (err) {
            setError('Failed to process the text');
        }
    };

    // Function to process the raw text input and return structured data
    const processText = (text) => {
        const lines = text.split('\n');
        let categoryData = [];
        let absentRegulars = [];
        let currentCategory = null;
        let totalStrength = { present: 0, total: 0 };
        let currentMembers = [];

        lines.forEach(line => {
            // Identify categories like "C1 + C2 NSF Strength"
            if (line.match(/^C\d/)) {
                if (currentCategory) {
                    categoryData.push({ 
                        category: currentCategory,
                        totalStrength: totalStrength,
                        members: currentMembers 
                    });
                }
                currentCategory = line.trim();
                currentMembers = [];
                totalStrength = { present: 0, total: 0 };
            }
            // Process individual member status
            else if (line.includes('-')) {
                const parts = line.split('-');
                const name = parts[0].trim();
                const status = parts[1]?.trim();
                const isRegular = status?.includes('Reg') || false;

                // Update present and total counts
                totalStrength.total += 1;
                if (status && !status.includes('MC') && !status.includes('OFF') && !status.includes('LL')) {
                    totalStrength.present += 1;
                }

                // Check if the person is regular and not present
                if (isRegular && (status.includes('MC') || status.includes('OFF') || status.includes('LL'))) {
                    absentRegulars.push(name);
                }

                currentMembers.push({ name, status });
            }
        });

        // Push the last category data
        if (currentCategory) {
            categoryData.push({ 
                category: currentCategory,
                totalStrength: totalStrength,
                members: currentMembers 
            });
        }

        return { categoryData, absentRegulars };
    };

    return (
        <div className="home">
            <h1>Attendance Report Processor</h1>
            <textarea 
                value={inputText} 
                onChange={handleTextChange} 
                placeholder="Paste the raw attendance report here..."
                rows="20" 
                cols="100"
            />
            <br />
            <button onClick={handleSubmit}>Process Report</button>

            {error && <div className="error">{error}</div>}

            <h2>Processed Report:</h2>
            <div>
                {processedData.length > 0 && processedData.map((section, index) => (
                    <div key={index}>
                        <h3>{section.category}</h3>
                        <p><strong>Total Strength: </strong>{section.totalStrength.present}/{section.totalStrength.total}</p>
                        <ul>
                            {section.members.map((member, idx) => (
                                <li key={idx}>{member.name}: {member.status}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <h2>Absent Regulars:</h2>
            <ul>
                {absentRegulars.length > 0 ? (
                    absentRegulars.map((name, idx) => <li key={idx}>{name}</li>)
                ) : (
                    <li>No absent regulars.</li>
                )}
            </ul>
        </div>
    );
};

export default Home;
