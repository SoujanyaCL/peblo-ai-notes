import { useState } from "react";
import API from "./api";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  // GENERATE AI
  const generateAI = async () => {
    if (!content.trim()) {
      alert("Please write something first");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/ai/generate-summary",
        { content }
      );

      setResult(res.data.data);
    } catch (err) {
      console.log(err);
      alert("Error generating AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: 30,
      }}
    >
      <div
        style={{
          maxWidth: 850,
          margin: "0 auto",
          background: "white",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: 25,
            fontSize: 42,
          }}
        >
          🧠 AI Notes App
        </h1>

        {/* NAVBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            padding: "14px 20px",
            background: "#f8f9fc",
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {/* LEFT LINKS */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#1677ff",
                fontWeight: 600,
              }}
            >
              Login
            </Link>

            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "#1677ff",
                fontWeight: 600,
              }}
            >
              Signup
            </Link>

            <Link
              to="/history"
              style={{
                textDecoration: "none",
                color: "#1677ff",
                fontWeight: 600,
              }}
            >
              History
            </Link>

            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: "#1677ff",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>

            <Link
              to="/archived"
              style={{
                textDecoration: "none",
                color: "#1677ff",
                fontWeight: 600,
              }}
            >
              Archived
            </Link>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              background: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>

        {/* TEXTAREA */}
        <textarea
          rows="8"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 12,
            border: "1px solid #ccc",
            fontSize: 16,
            resize: "none",
            outline: "none",
            lineHeight: 1.6,
          }}
        />

        <br />
        <br />

        {/* GENERATE BUTTON */}
        <button
          onClick={generateAI}
          disabled={loading}
          style={{
            padding: "14px 26px",
            background: "#1677ff",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {loading ? "Generating..." : "Generate AI"}
        </button>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: 35,
              padding: 25,
              background: "#fafafa",
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          >
            <h2>{result.title}</h2>

            <h3>Summary</h3>

            <p
              style={{
                whiteSpace: "pre-wrap",
                color: "#444",
                lineHeight: 1.8,
              }}
            >
              {result.summary}
            </p>

            <h3>Action Items</h3>

            <ul>
              {result.actionItems?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;