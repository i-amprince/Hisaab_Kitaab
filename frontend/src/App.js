import { useState } from 'react';
import './App.css';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";

function App() {
  const [user, ChangeUser] = useState({ Name: "", Email: "", Password: "" });

  const Navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    ChangeUser(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e){
    e.preventDefault();

    try{
      let response = await axios.post("/", user);
      let Data = await response.data;

      console.log(Data);

      ChangeUser({Name: "", Email: "", Password: ""});
      alert("Data recieved Successfully");
      Navigate('/Login');

    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div className="outer">
      <div className="title">
        <span>Hisaaab Kitaab</span>
        <FaPen />
      </div>

      <div className="formm">
        <div className="signuptitle">Sign Up</div>

        <div className="line">
          <label>Name</label>
          <input
            type="text"
            name="Name"
            value={user.Name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="line">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            value={user.Email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="line">
          <label>Password</label>
          <input
            type="password"
            name="Password"
            value={user.Password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Register</button>

        <div>
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default App;
