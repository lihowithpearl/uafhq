import axios from 'axios';
import "./login.css";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const Login = () => {
     const [LUser, setLUser] = useState({name:"",password:""});
     const [user, setUser] = useState({userID:"",name:"", department:''})

    // useEffect(() => {
    //     axios.get('http://localhost:27017/user')
    //         .then((response) => {
    //             setItems(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('There was an error fetching the items', error);
    //         });
    // }, []);
  
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:27017/login', {
          name: LUser.name,
          password: LUser.password
        })
        .then((response) => {
          alert('Login successful');
          console.log(response.data.name);
          // Optionally store user data in state
          setUser({userID:response.userID,  name: response.data.name,department: response.data.department });
          Cookies.set('userID', response.data.userID, { expires: 0.5 });
          Cookies.set('department', response.data.department, { expires: 0.5 });

        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            alert("Invalid username or password");
          } else {
            console.error("Login error:", error);
            alert("Server error. Try again later.");
          }
        });
      };
      const handleLogout = () => {
        // Clear the session cookie
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        alert('You have logged out successfully');
        setUser({ userID:"", name: "", department: "" });
        Cookies.remove('userID');
    };
    const handleLoginChange = (e) => {
        setLUser({ ...LUser, [e.target.name]: e.target.value });
    };


    return (
        <div>
            {user.name == ""  ? (
                <div className="fullpage">
                    <div className="formpage">
                        <form onSubmit={handleLogin}>
                            <label>Name:</label>
                            <input type="text" name="name" value={LUser.name} onChange={(e) => handleLoginChange(e)} required />
                            <label>Password:</label>
                            <input type="text" name="password" value={LUser.password} onChange={(e) => handleLoginChange(e)} required />
                            
                            <input type="submit" value="Login" className="submit" />
                        </form>
                    </div>
                </div>)
                : (
                    <div className="welcome-page">
                        <h2>Welcome, {user.name}!</h2>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )
            }

        </div>
    );
};

export default Login;
