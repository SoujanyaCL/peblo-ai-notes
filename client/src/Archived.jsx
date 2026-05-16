import { useEffect, useState } from "react";
import API from "./api";

function Archived() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ARCHIVED NOTES
  const fetchArchivedNotes = async () => {
    try {
      const res = await API.get("/notes");

      const data = (res.data?.data || []).filter(
        (note) => note.archived === true
      );

      setNotes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // RESTORE NOTE
  const restoreNote = async (id) => {
    try {
      await API.put(`/notes/${id}`, {
        archived: false,
      });

      const updated = notes.filter(
        (note) => note._id !== id
      );

      setNotes(updated);

      alert("Note restored successfully");
    } catch (err) {
      console.log(err);
      alert("Error restoring note");
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

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
          maxWidth: 900,
          margin: "0 auto",
          background: "white",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          📦 Archived Notes
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#777",
            }}
          >
            <h2>No Archived Notes</h2>

            <p>
              Archived notes will appear here.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              style={{
                border: "1px solid #e5e7eb",
                padding: 24,
                marginBottom: 24,
                borderRadius: 14,
                background: "#fafafa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <h2>{note.title}</h2>

              <p
                style={{
                  color: "#555",
                  lineHeight: 1.8,
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                {note.summary || note.content}
              </p>

              <button
                onClick={() => restoreNote(note._id)}
                style={{
                  padding: "10px 18px",
                  background: "#52c41a",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Archived;