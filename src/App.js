import './App.css';
import Home from './pages/home/home.js';
import Login from './pages/login/login.js';
import Attendance from './pages/attendance/attendance.js';
import ADS from './pages/list/ads.js'
import Nav from './sematics/navigationbar/nav.js';
import {Routes,Route,BrowserRouter as Router, useNavigate} from 'react-router-dom';

function App() {
  const navigate = useNavigate();

 console.log(window.location.pathname);
  return (
    <div>
     
      <Nav></Nav> 
      <Login></Login>
        <Routes>
          <Route path="/" element={<Attendance/>}/>  
          <Route path="/attendance" element={<Attendance/>}/>  
          <Route path="/ads" element={<ADS/>}/>  

        </Routes>
              
    
    </div>    

    
  );
}

export default App;
