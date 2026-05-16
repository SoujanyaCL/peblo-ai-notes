import { useEffect, useState } from "react";
import API from "./api";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");

      const data = res.data?.data || [];

      setNotes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // TOTAL NOTES
  const totalNotes = notes.length;

  // NOTES WITH AI SUMMARY
  const aiGeneratedNotes = notes.filter(
    (note) => note.summary && note.summary.length > 0
  ).length;

  // RECENT NOTES
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // MOST USED CATEGORY
  const categoryCount = {};

  notes.forEach((note) => {
    const category = note.category || "General";

    categoryCount[category] =
      (categoryCount[category] || 0) + 1;
  });

  let mostUsedCategory = "None";

  if (Object.keys(categoryCount).length > 0) {
    mostUsedCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );
  }

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading Dashboard...</h2>;
  }

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
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <h1>📊 Productivity Dashboard</h1>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 30,
          }}
        >
          {/* TOTAL NOTES */}
          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{totalNotes}</h2>
            <p>Total Notes</p>
          </div>

          {/* AI GENERATED NOTES */}
          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
           >
              <h2>{aiGeneratedNotes}</h2>
              <p>AI Generated Notes</p>
           </div>

          {/* MOST USED CATEGORY */}
          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{mostUsedCategory}</h2>
            <p>Most Used Category</p>
          </div>
        </div>

        {/* RECENT NOTES */}
        <div
          style={{
            background: "white",
            marginTop: 30,
            padding: 25,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🕒 Recently Added Notes</h2>

          {recentNotes.length === 0 ? (
            <p>No recent notes</p>
          ) : (
            recentNotes.map((note) => (
              <div
                key={note._id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                <h3>{note.title}</h3>

                <p style={{ color: "#666" }}>
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;