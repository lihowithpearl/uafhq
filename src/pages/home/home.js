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
            setProcessedData(reportData);
            setError('');
        } catch (err) {
            setError('Failed to process the text');
        }
    };

    // Function to process the raw text input and return structured data
    const processText = (text) => {
        const lines = text.split('\n');
        let data = [];
        let currentCategory = null;
        let currentMembers = [];

        lines.forEach(line => {
            // Check for category headings (e.g., "C1 + C2 NSF Strength")
            if (line.match(/^C\d/)) {
                if (currentCategory) {
                    data.push({ category: currentCategory, members: currentMembers });
                }
                currentCategory = line.trim();
                currentMembers = [];
            }
            // Process member lines (e.g., "LCP Rohan - CS @ MMRC")
            else if (line.includes('-')) {
                currentMembers.push({ name: line.split('-')[0].trim(), status: line.split('-')[1]?.trim() });
            }
        });

        if (currentCategory) {
            data.push({ category: currentCategory, members: currentMembers });
        }

        return data;
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
                        <ul>
                            {section.members.map((member, idx) => (
                                <li key={idx}>{member.name}: {member.status}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;