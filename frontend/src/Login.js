import './Login.css';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [User, ChangeUser] = useState({ Email: "", Password: "" });
  const Navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    ChangeUser(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post('/login', User); // assumes proxy is set to backend

      if (response.status === 200 && response.data.message === "Login successful") {
        alert("Login successful");
        Navigate('/mainn', { state: User });
      } else {
        alert("Wrong info");
      }

      ChangeUser({ Email: "", Password: "" });
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Login failed");
        console.error("Error:", error.response.data);
      } else {
        alert("Network/server error");
        console.error("Network Error:", error.message);
      }
    }
  }

  return (
    <div className="outer">
      <div className="title">
        <span>Hisaaab Kitaab</span>
        <FaPen />
      </div>

      <div className="formm">
        <div className="signuptitle">Login Page</div>

        <div className="line">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            name='Email'
            value={User.Email}
            onChange={handleChange}
          />
        </div>

        <div className="line">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            name='Password'
            value={User.Password}
            onChange={handleChange}
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Login</button>

        <div>Go to Signup Page? <a href="/">Signup</a></div>
      </div>
    </div>
  );
}

export default Login;
