import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Signup</h1>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <br />

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;