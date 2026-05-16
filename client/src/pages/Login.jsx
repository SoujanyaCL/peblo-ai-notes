import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post(
        "/auth/login",
        { email, password }
);

      console.log("LOGIN RESPONSE:", res.data);

      // IMPORTANT: check token exists
      if (!res.data.token) {
        alert("Token not received from backend!");
        return;
      }

      // store token
      localStorage.setItem("token", res.data.token);

      console.log("TOKEN SAVED:", localStorage.getItem("token"));

      alert("Login successful!");

      navigate("/history"); // better than "/"
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;