import axios from 'axios';
import "./login.css";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const Login = () => {
     const [LUser, setLUser] = useState({name:"",password:""});
     const [user, setUser] = useState({userID:"",name:"", department:''})
     const [NUser, setNUser] = useState(false);
     const nsfranks = ['pte', 'lcp', 'cpl', '3sg', '2sg', '1sg', '2lt', 'lta'];
     const regranks = ['cpt','me1', 'me2', 'me3', 'me4', 'me5', 'me6', 'me7']
     const departments = ['HQ', 'Storage', 'DMSP', 'DCS'];
     
     const [userData, setUserData] = useState({
      name: '',
      password: '',
      regular: false,
      rank: '',
      batch: '',
      phonenumber: '',
      department: '',
      subdepartment:'',
    });
    const handleNewUser = (e) => {
      const { name, value, type, checked } = e.target;
      setUserData({
        ...userData,
        [name]: type === 'checkbox' ? checked : value
      });
    };
    const handleCreateUser = (e) => {
      alert(userData);
      axios.post('http://localhost:27017/user', userData)
        .then((res) => {          
          setNUser('false');
          alert('User created successfully!');
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to create user');
        });
    };



    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:27017/login', {
          name: LUser.name,
          password: LUser.password
        })
        .then((response) => {
          alert('Login successful');
          setUser({userID:response.userID,  name: response.data.name,department: response.data.department,subdepartment:response.data.subdepartment });
          Cookies.set('userID', response.data.userID, { expires: 0.5 });
          Cookies.set('department', response.data.department, { expires: 0.5 });
          Cookies.set('subdepartment', response.data.subdepartment, { expires: 0.5 });


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
        setUser({ userID:"", name: "", department: "" });
          alert('You have logged out successfully');
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
                      {NUser == false ? 
                      (<form onSubmit={handleLogin}>
                            <label>Name:</label>
                            <input type="text" name="name" value={LUser.name} onChange={(e) => handleLoginChange(e)} required />
                            <label>Password:</label>
                            <input type="text" name="password" value={LUser.password} onChange={(e) => handleLoginChange(e)} required />
                            
                            <input type="submit" value="Login" className="submit" />
                            <div class="noaccntbtn" onClick={() => setNUser(true)} >No account?</div>
                        </form>):
                        (    <form onSubmit={handleCreateUser}>
                          <label>Name:
                            <input type="text" name="name" value={userData.name} onChange={handleNewUser} required />
                          </label>
                          <br />
                    
                          <label>Password:
                            <input type="password" name="password" value={userData.password} onChange={handleNewUser} required />
                          </label>
                          <br />
                    
                          <label>Regular:
                            <input type="checkbox" name="regular" checked={userData.regular} onChange={handleNewUser} />
                          </label>
                          <br />
                    
                          <label>Rank:
                            <select name="rank" value={userData.rank} onChange={handleNewUser} required>
                              <option value="">--Select Rank--</option>
                              {userData.regular?
                              (regranks.map(rank => <option key={rank} value={rank}>{rank.toUpperCase()}</option>))
                              :
                                (nsfranks.map(rank => <option key={rank} value={rank}>{rank.toUpperCase()}</option>))
                              }
                            </select>
                          </label>
                          <br />
                    
                          <label>Batch:
                            <input type="text" name="batch" value={userData.batch} onChange={handleNewUser} required />
                          </label>
                          <br />
                    
                          <label>Phone Number:
                            <input type="number" name="phonenumber" value={userData.phonenumber} onChange={handleNewUser} required />
                          </label>
                          <br />
                    
                          <label>Department:
                            <select name="department" value={userData.department} onChange={handleNewUser} required>
                              <option value="">--Select Department--</option>
                              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                          </label>
                          <br />
                          {userData.department === "HQ" && userData.regular === false && (
                            <label>Sub-Department:
                              <select name="subdepartment" value={userData.subdepartment} onChange={handleNewUser} required>
                                <option value="">--Select Subdepartment--</option>
                                <option value="Orderly">Orderly</option>
                                <option value="Training">Training</option>
                              </select>
                            </label>
                          )}
                          {userData.department === "DCS" && userData.regular === false && (
                            <label>Sub-Department:
                              <select name="subdepartment" value={userData.subdepartment} onChange={handleNewUser} required>
                                <option value="">--Select Subdepartment--</option>
                                <option value="Cockpit">Cockpit</option>
                                <option value="Stocktake">Stocktake</option>
                              </select>
                            </label>
                          )}
                          {userData.department === "DMSP " && userData.regular === false && (
                            <label>Sub-Department:
                              <select name="subdepartment" value={userData.subdepartment} onChange={handleNewUser} required>
                                <option value="">--Select Subdepartment--</option>
                                <option value="Infra">Infra</option>
                                <option value="FM">FM</option>
                              </select>
                            </label>
                          )}
                          {userData.department === "Storage" && userData.rank !== "2lt" && userData.rank !== "lta" && (
                            <label>Sub-Department:
                              <select name="subdepartment" value={userData.subdepartment} onChange={handleNewUser} required>
                                <option value="">--Select Subdepartment--</option>
                                <option value="C1 + C2">C1 + C2</option>
                                <option value="C3 + C4">C3 + C4</option>
                              </select>
                            </label>
                          )}
                          <button type="submit">Submit</button>
                        </form>)}
                        
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
