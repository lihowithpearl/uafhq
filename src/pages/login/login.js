import axios from 'axios';
import "./login.css";
import React, { useState, useEffect } from 'react';

const Login = () => {
     const [LUser, setLUser] = useState({name:"",password:""});
     const [user, setUser] = useState({name:"", department:''})

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
        try{
                  axios.get(`http://localhost:27017/user/${LUser.name}/${LUser.password}`)
                .then((response) => {
                if(!response.data){
                     alert("no account found with the name: " + LUser );
                }
                else{
                    setUser(response.data);
                }
        })  
        }catch(error)
        {
            console.log(error);
            alert("server error");
        }

    }

    
    const handleLoginChange = (e) => {
        setLUser({ ...LUser, [e.target.name]: e.target.value });
    };


    return (
        <div>
            {user.name == ""  &&
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
                </div>
            }

        </div>
    );
};

export default Login;
