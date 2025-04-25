import "./nav.css";
import defaultpfp from "./defaultpfp.png";
// import Youtube from "../../pages/youtube/youtube";
import Home from "../../pages/home/home";
import {Routes,Route, useNavigate} from 'react-router-dom';

const Nav = () =>{
    const navigate = useNavigate();
    const navigateHome = () =>{
        navigate("/");
    }
    const navigateAttendance = () =>{
        navigate("/attendance");
    }
    const navigateADS = () =>{
        navigate("/ads");
    }
    return (
        <div id = "navbar">
            <div class="navitem">
                <div id = "logo" >Logo</div>
            </div>
            <ul class="navitem navigationbar">
                <li>
                    <span onClick={navigateHome}>Home</span>
                </li>
                <li>
                    {/* <span onClick={navigateYoutube}>Youtube</span> */}
                </li>
                <li>
                    <span onClick={navigateAttendance}>Attendance</span>
                </li>
                <li>
                    <span onClick = {navigateADS}>List</span>
                </li>
            </ul>
            <div class="navitem">
                <div class ="pfp"><img src={defaultpfp}></img></div>
                <div class="profile">
                    <div class="pname">
                    Your Name
                    </div>
                    <div class="pfpmenu">
                        <button class="pfpbtn">˅</button>
                        
                        <ul class="dropdown">
                            <li>
                                Profile
                            </li>
                            <li>
                                Notification
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>
    );
    
}

export default Nav;